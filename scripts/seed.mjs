// Roda uma vez para preparar o banco: insere as perguntas e cria o índice
// que faz o MongoDB apagar sozinho as pontuações com mais de 24 horas.
//
// Uso:  npm run seed
import { MongoClient } from "mongodb";
import { config } from "dotenv";

config({ path: ".env.local" });

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("✗ Defina MONGODB_URI no arquivo .env.local antes de rodar o seed.");
  process.exit(1);
}

// ===== Banco de perguntas sobre League of Legends =====
const PERGUNTAS = [
  { q: "Quantos jogadores formam um time no modo clássico (Summoner's Rift)?",
    opcoes: ["3", "5", "7", "10"], correta: 1 },
  { q: "Qual estrutura você precisa destruir para vencer a partida?",
    opcoes: ["Inibidor", "Torre", "Nexus", "Barão"], correta: 2 },
  { q: "Qual empresa desenvolveu o League of Legends?",
    opcoes: ["Blizzard", "Riot Games", "Valve", "Epic Games"], correta: 1 },
  { q: "Qual recurso a maioria dos campeões gasta para usar habilidades?",
    opcoes: ["Energia", "Mana", "Fúria", "Ouro"], correta: 1 },
  { q: "Qual tecla normalmente ativa a habilidade suprema (ultimate)?",
    opcoes: ["Q", "W", "E", "R"], correta: 3 },
  { q: "Qual monstro neutro dá um buff que fortalece os minions e ajuda a empurrar as rotas?",
    opcoes: ["Dragão", "Barão Nashor", "Arauto do Vale", "Krug"], correta: 1 },
  { q: "Qual é a função do campeão que protege o atirador na rota inferior?",
    opcoes: ["Caçador", "Suporte", "Mago", "Lutador"], correta: 1 },
  { q: "Como se chama a moeda usada para comprar itens durante a partida?",
    opcoes: ["Essência Azul", "Ouro", "Riot Points", "Pontos de Honra"], correta: 1 },
  { q: "Quantas rotas (lanes) principais existem no Summoner's Rift?",
    opcoes: ["1", "2", "3", "4"], correta: 2 },
  { q: "O que acontece quando um campeão acumula experiência suficiente?",
    opcoes: ["Compra itens de graça", "Sobe de nível", "Revive na hora", "Teleporta para a base"], correta: 1 },
  { q: "Qual é o nível máximo que um campeão pode alcançar durante a partida?",
    opcoes: ["6", "11", "18", "30"], correta: 2 },
  { q: "Em qual região do mapa os 'junglers' passam a maior parte do tempo?",
    opcoes: ["Rota do meio", "Rota superior", "Selva", "Rota inferior"], correta: 2 },
];

const client = new MongoClient(uri);

try {
  await client.connect();
  const db = client.db("lolquiz");

  // 1) Perguntas — limpa e reinsere
  await db.collection("perguntas").deleteMany({});
  await db.collection("perguntas").insertMany(PERGUNTAS);
  console.log(`✓ ${PERGUNTAS.length} perguntas inseridas na collection "perguntas".`);

  // 2) Índice TTL — o ranking expira 24h depois do campo "data"
  try {
    await db.collection("ranking").createIndex(
      { data: 1 },
      { expireAfterSeconds: 24 * 60 * 60, name: "ttl_24h" }
    );
    console.log('✓ Índice TTL de 24h criado na collection "ranking".');
  } catch (e) {
    // Se o índice já existir com outra config, recria
    await db.collection("ranking").dropIndex("ttl_24h").catch(() => {});
    await db.collection("ranking").createIndex(
      { data: 1 },
      { expireAfterSeconds: 24 * 60 * 60, name: "ttl_24h" }
    );
    console.log('✓ Índice TTL de 24h recriado na collection "ranking".');
  }

  console.log("\nSeed concluído! O banco está pronto. 🎮");
} catch (e) {
  console.error("✗ Erro ao rodar o seed:", e.message);
  process.exit(1);
} finally {
  await client.close();
}
