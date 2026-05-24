-- Round 8b — content collection layer.
-- Per PLAN.md D35 (Claude Code direct ops, seed concept deferred to v1),
-- D36 (fetch-failure backoff), D37 (multi-route fetch tracking).

-- D35: documents now hang off candidate, not seed.
-- Keep seed_id nullable so the column can come back for v1 promote workflow.
alter table public.document
  alter column seed_id drop not null;

alter table public.document
  add column if not exists candidate_id uuid references public.candidate(id) on delete cascade;

create index if not exists document_candidate_idx on public.document(candidate_id);

-- D36: per-domain fetch failure counter and backoff timestamp.
alter table public.candidate
  add column if not exists fetch_failed_count int not null default 0,
  add column if not exists next_attempt_after timestamptz;

-- D37: which bypass route actually delivered the bytes.
-- Free-text for now: 'wayback' | 'jina' | 'edge' | 'rss' | 'snippet' | future routes.
alter table public.document
  add column if not exists fetch_source text;
