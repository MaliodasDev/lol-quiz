import { Pool } from "pg";
import PERGUNTAS from "./perguntas.json";

const pool = new Pool({
  connectionString: process.env.DATABASE_PUBLIC_URL || process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function setup() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id SERIAL PRIMARY KEY,
      usuario VARCHAR(16) UNIQUE NOT NULL,
      senha TEXT NOT NULL,
      criado_em TIMESTAMP DEFAULT NOW(),
      deletar_em TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS perguntas (
      id SERIAL PRIMARY KEY,
      q TEXT NOT NULL,
      opcoes JSONB NOT NULL,
      correta INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS ranking (
      id SERIAL PRIMARY KEY,
      usuario VARCHAR(16) NOT NULL,
      acertos INTEGER NOT NULL,
      total INTEGER NOT NULL,
      data TIMESTAMP DEFAULT NOW()
    );
  `);

  const { rows } = await pool.query("SELECT COUNT(*) FROM perguntas");
  if (Number(rows[0].count) !== PERGUNTAS.length) {
    await pool.query("TRUNCATE TABLE perguntas RESTART IDENTITY");
    for (const p of PERGUNTAS) {
      await pool.query(
        "INSERT INTO perguntas (q, opcoes, correta) VALUES ($1, $2, $3)",
        [p.q, JSON.stringify(p.opcoes), p.correta]
      );
    }
  }
}

setup().catch(console.error);

export default pool;
