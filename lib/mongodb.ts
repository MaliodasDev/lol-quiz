import { MongoClient, Db } from "mongodb";

// Lê a connection string do .env.local (ou das variáveis da Vercel)
const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("Defina a variável MONGODB_URI no arquivo .env.local");
}

// Na Vercel (serverless) a função roda várias vezes. Para não abrir uma
// conexão nova a cada chamada, guardamos a conexão num cache global.
let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = new MongoClient(uri).connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = new MongoClient(uri).connect();
}

// Atalho para pegar o banco "lolquiz" já conectado.
export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db("lolquiz");
}

export default clientPromise;
