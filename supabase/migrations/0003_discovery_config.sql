-- Discovery operator-tunable config rows (PLAN.md D27).
-- Both rows are GUI-editable from the admin /config page; the Discovery
-- Worker reads them on each scheduled run.

insert into public.config (key, value)
values (
  'discovery_keywords',
  '[
    "한국 중견 제조업",
    "산업용 부품 제조사",
    "자동차 부품 제조사",
    "전자부품 제조사",
    "정밀 가공 업체",
    "산업 소재 제조",
    "B2B 산업재 제조사",
    "ODM OEM 제조사"
  ]'::jsonb
)
on conflict (key) do nothing;

insert into public.config (key, value)
values (
  'discovery_settings',
  '{
    "max_results_per_query": 30,
    "search_engine": "naver"
  }'::jsonb
)
on conflict (key) do nothing;
