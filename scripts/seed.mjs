// Prepara o banco Supabase/PostgreSQL: cria tabelas e insere as perguntas.
//
// Uso:  npm run seed
import pg from "pg";
import { config } from "dotenv";

config({ path: ".env.local" });

const connectionString =
  process.env.DATABASE_PUBLIC_URL || process.env.DATABASE_URL;

if (!connectionString) {
  console.error(
    "✗ Defina DATABASE_URL (ou DATABASE_PUBLIC_URL) no .env.local antes de rodar o seed."
  );
  process.exit(1);
}

import PERGUNTAS from "../lib/perguntas.json" with { type: "json" };

const pool = new pg.Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

try {
  await pool.query(`
    create table if not exists usuarios (
      id serial primary key,
      usuario varchar(16) unique not null,
      senha text not null,
      criado_em timestamptz default now(),
      deletar_em timestamptz
    );
    create table if not exists perguntas (
      id serial primary key,
      q text not null,
      opcoes jsonb not null,
      correta integer not null
    );
    create table if not exists ranking (
      id serial primary key,
      usuario varchar(16) not null,
      acertos integer not null,
      total integer not null,
      data timestamptz default now()
    );
    create index if not exists idx_ranking_data on ranking (data desc);
    create index if not exists idx_ranking_usuario on ranking (usuario);
  `);

  await pool.query("truncate table perguntas restart identity");
  for (const p of PERGUNTAS) {
    await pool.query(
      "insert into perguntas (q, opcoes, correta) values ($1, $2, $3)",
      [p.q, JSON.stringify(p.opcoes), p.correta]
    );
  }

  console.log(`✓ ${PERGUNTAS.length} perguntas inseridas na tabela "perguntas".`);
  console.log("\nSeed concluído! O banco Supabase está pronto. 🎮");
} catch (e) {
  console.error("✗ Erro ao rodar o seed:", e.message);
  process.exit(1);
} finally {
  await pool.end();
}
