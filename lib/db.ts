import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_PUBLIC_URL || process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const PERGUNTAS = [
  { q: "Quantos jogadores formam um time no modo clássico (Summoner's Rift)?", opcoes: ["3","5","7","10"], correta: 1 },
  { q: "Qual estrutura você precisa destruir para vencer a partida?", opcoes: ["Inibidor","Torre","Nexus","Barão"], correta: 2 },
  { q: "Qual empresa desenvolveu o League of Legends?", opcoes: ["Blizzard","Riot Games","Valve","Epic Games"], correta: 1 },
  { q: "Qual recurso a maioria dos campeões gasta para usar habilidades?", opcoes: ["Energia","Mana","Fúria","Ouro"], correta: 1 },
  { q: "Qual tecla normalmente ativa a habilidade suprema (ultimate)?", opcoes: ["Q","W","E","R"], correta: 3 },
  { q: "Qual monstro neutro dá um buff que fortalece os minions e ajuda a empurrar as rotas?", opcoes: ["Dragão","Barão Nashor","Arauto do Vale","Krug"], correta: 1 },
  { q: "Qual é a função do campeão que protege o atirador na rota inferior?", opcoes: ["Caçador","Suporte","Mago","Lutador"], correta: 1 },
  { q: "Como se chama a moeda usada para comprar itens durante a partida?", opcoes: ["Essência Azul","Ouro","Riot Points","Pontos de Honra"], correta: 1 },
  { q: "Quantas rotas (lanes) principais existem no Summoner's Rift?", opcoes: ["1","2","3","4"], correta: 2 },
  { q: "O que acontece quando um campeão acumula experiência suficiente?", opcoes: ["Compra itens de graça","Sobe de nível","Revive na hora","Teleporta para a base"], correta: 1 },
  { q: "Qual é o nível máximo que um campeão pode alcançar durante a partida?", opcoes: ["6","11","18","30"], correta: 2 },
  { q: "Em qual região do mapa os 'junglers' passam a maior parte do tempo?", opcoes: ["Rota do meio","Rota superior","Selva","Rota inferior"], correta: 2 },
];

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
  if (Number(rows[0].count) === 0) {
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
