-- v0 initial schema.
-- Tables follow the discover → score → seed → crawl → normalize → embed pipeline from PLAN.md §3.
-- This migration is intentionally minimal; later migrations refine constraints, indexes, and RLS policies.

create extension if not exists "pgcrypto";
create extension if not exists "vector";

-- ---------------------------------------------------------------------------
-- Operator-tunable configuration. The admin UI reads/writes this table so
-- Robin can change keywords, thresholds, schedules without code changes
-- (PLAN.md D15, CLAUDE.md §4.2).
-- ---------------------------------------------------------------------------
create table if not exists public.config (
  key         text primary key,
  value       jsonb not null,
  updated_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Discovery: one row per search-and-find pass.
-- ---------------------------------------------------------------------------
create table if not exists public.discovery_run (
  id                uuid primary key default gen_random_uuid(),
  started_at        timestamptz not null default now(),
  finished_at       timestamptz,
  status            text not null default 'running',
  query             text not null,
  candidates_found  int not null default 0,
  error             text
);

-- Candidate companies surfaced by Discovery.
create table if not exists public.candidate (
  id              uuid primary key default gen_random_uuid(),
  discovery_run   uuid references public.discovery_run(id) on delete set null,
  url             text not null,
  domain          text not null,
  display_name    text,
  search_query    text,
  discovered_at   timestamptz not null default now(),
  status          text not null default 'pending', -- pending | scored | seeded | rejected
  unique (domain)
);

-- ---------------------------------------------------------------------------
-- Scoring: Claude evaluates "cleanly basic" onboard-media (PLAN.md D13).
-- High score = basic-but-clean; over-active OR over-branded = lower score.
-- ---------------------------------------------------------------------------
create table if not exists public.candidate_score (
  id             uuid primary key default gen_random_uuid(),
  candidate_id   uuid not null references public.candidate(id) on delete cascade,
  score          numeric(5,2) not null,
  reasons        jsonb not null default '{}'::jsonb,
  model_version  text,
  evaluated_at   timestamptz not null default now()
);
create index if not exists candidate_score_candidate_idx on public.candidate_score(candidate_id);

-- ---------------------------------------------------------------------------
-- Seeds: candidates that passed the threshold (auto-promoted, D14).
-- Robin samples a few each week via the admin and may deactivate.
-- ---------------------------------------------------------------------------
create table if not exists public.seed (
  id              uuid primary key default gen_random_uuid(),
  candidate_id    uuid not null unique references public.candidate(id) on delete cascade,
  registered_at   timestamptz not null default now(),
  active          boolean not null default true,
  threshold_used  numeric(5,2)
);

-- ---------------------------------------------------------------------------
-- Crawl runs and the documents they collect (D11: company intro, press,
-- blog posts only in v0; HTML text only).
-- ---------------------------------------------------------------------------
create table if not exists public.crawl_run (
  id           uuid primary key default gen_random_uuid(),
  seed_id      uuid not null references public.seed(id) on delete cascade,
  started_at   timestamptz not null default now(),
  finished_at  timestamptz,
  status       text not null default 'running',
  docs_found   int not null default 0,
  error        text
);

create table if not exists public.document (
  id                uuid primary key default gen_random_uuid(),
  seed_id           uuid not null references public.seed(id) on delete cascade,
  crawl_run         uuid references public.crawl_run(id) on delete set null,
  source_url        text not null,
  doc_type          text not null,           -- 'about' | 'press' | 'blog'
  content_hash      text not null,
  raw_storage_path  text,                    -- Supabase Storage path for original HTML
  normalized_text   text,
  title             text,
  published_at      timestamptz,
  fetched_at        timestamptz not null default now(),
  unique (seed_id, content_hash)
);
create index if not exists document_seed_idx on public.document(seed_id);
create index if not exists document_doc_type_idx on public.document(doc_type);

-- ---------------------------------------------------------------------------
-- RAG chunks + pgvector embeddings.
-- Dimension assumes Anthropic's recommended embedding provider with 1536-dim;
-- adjust in a later migration once the embedder is chosen.
-- ---------------------------------------------------------------------------
create table if not exists public.document_chunk (
  id            uuid primary key default gen_random_uuid(),
  document_id   uuid not null references public.document(id) on delete cascade,
  chunk_index   int not null,
  text          text not null,
  embedding     vector(1536),
  unique (document_id, chunk_index)
);
create index if not exists document_chunk_doc_idx on public.document_chunk(document_id);
-- ivfflat is fine for v0 volumes; HNSW upgrade considered later.
create index if not exists document_chunk_embedding_idx
  on public.document_chunk using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- ---------------------------------------------------------------------------
-- Operator feedback (D14): Robin marks weekly samples as accept/reject and
-- describes patterns to avoid. The discovery/scorer prompts read this table
-- on each run to refine future selections.
-- ---------------------------------------------------------------------------
create table if not exists public.operator_feedback (
  id          uuid primary key default gen_random_uuid(),
  kind        text not null,                 -- 'reject_pattern' | 'accept_pattern' | 'keyword_add' | 'keyword_remove' | 'note'
  payload     jsonb not null,
  candidate_id uuid references public.candidate(id) on delete set null,
  seed_id      uuid references public.seed(id) on delete set null,
  created_at  timestamptz not null default now(),
  applied     boolean not null default false
);
create index if not exists operator_feedback_applied_idx on public.operator_feedback(applied) where applied = false;

-- ---------------------------------------------------------------------------
-- Row-level security: lock everything down by default. Service-role keys used
-- by Workers bypass RLS; admin UI users will use policies added in a later
-- migration once Supabase Auth wiring is in place.
-- ---------------------------------------------------------------------------
alter table public.config             enable row level security;
alter table public.discovery_run      enable row level security;
alter table public.candidate          enable row level security;
alter table public.candidate_score    enable row level security;
alter table public.seed               enable row level security;
alter table public.crawl_run          enable row level security;
alter table public.document           enable row level security;
alter table public.document_chunk     enable row level security;
alter table public.operator_feedback  enable row level security;
