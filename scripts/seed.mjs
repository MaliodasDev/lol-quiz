import { MongoClient } from "mongodb";
import { config } from "dotenv";
import { readFileSync } from "fs";

config({ path: ".env.local" });

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("✗ Defina MONGODB_URI no .env.local antes de rodar o seed.");
  process.exit(1);
}

const PERGUNTAS = JSON.parse(readFileSync("./lib/perguntas.json", "utf-8"));

const client = new MongoClient(uri);
try {
  await client.connect();
  const db = client.db("lol-quest");

  await db.collection("perguntas").deleteMany({});
  await db.collection("perguntas").insertMany(PERGUNTAS);

  await db.collection("usuarios").createIndex({ usuario: 1 }, { unique: true });
  await db.collection("ranking").createIndex({ data: -1 });
  await db.collection("ranking").createIndex({ usuario: 1 });

  console.log(`✓ ${PERGUNTAS.length} perguntas inseridas na coleção "perguntas".`);
  console.log("\nSeed concluído! O MongoDB Atlas está pronto. 🎮");
} catch (e) {
  console.error("✗ Erro ao rodar o seed:", e.message);
  process.exit(1);
} finally {
  await client.close();
}
