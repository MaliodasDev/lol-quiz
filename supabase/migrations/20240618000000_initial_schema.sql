-- Schema inicial do Quiz do Invocador (LoL)

create table if not exists public.usuarios (
  id serial primary key,
  usuario varchar(16) unique not null,
  senha text not null,
  criado_em timestamptz default now(),
  deletar_em timestamptz
);

create table if not exists public.perguntas (
  id serial primary key,
  q text not null,
  opcoes jsonb not null,
  correta integer not null
);

create table if not exists public.ranking (
  id serial primary key,
  usuario varchar(16) not null,
  acertos integer not null,
  total integer not null,
  data timestamptz default now()
);

create index if not exists idx_ranking_data on public.ranking (data desc);
create index if not exists idx_ranking_usuario on public.ranking (usuario);
