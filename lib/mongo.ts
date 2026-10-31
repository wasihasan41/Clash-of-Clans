import { MongoClient, type Db } from "mongodb";

// Dev mein hot-reload par baar-baar naya connection na bane, isliye globalThis mein rakhte hain
const globalForMongo = globalThis as unknown as {
  _mongoClient?: Promise<MongoClient>;
};

function getClient(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set. Add it to .env.local");
  }
  if (!globalForMongo._mongoClient) {
    globalForMongo._mongoClient = new MongoClient(uri).connect();
  }
  return globalForMongo._mongoClient;
}

export async function getDb(): Promise<Db> {
  const client = await getClient();
  return client.db(process.env.MONGODB_DB ?? "coc_lookup");
}