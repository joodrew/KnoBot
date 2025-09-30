import { MongoClient } from 'mongodb';

const uri = process.env.MONGODBDUMP_URI;
const dbName = 'dify';
const collectionName = 'resolucao';

export async function saveResolucao(data) {
  if (!uri) {
    throw new Error('MONGODBDUMP_URI não está definido nas variáveis de ambiente');
  }

  const client = new MongoClient(uri);
  await client.connect();

  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  // Decodifica HTML no campo resolução
  const decodeHtml = (str) =>
    str.replace(/&lt;/g, '<')
       .replace(/&gt;/g, '>')
       .replace(/&amp;/g, '&')
       .replace(/&quot;/g, '"');

  if (data.resolução && typeof data.resolução === 'string') {
    data.resolução = decodeHtml(data.resolução);
  }

  // Atualiza ou insere com base no id
  const result = await collection.updateOne(
    { id: data.id },
    { $set: data },
    { upsert: true }
  );

  await client.close();

  if (result.upsertedCount > 0) {
    console.log(`✅ Documento com id ${data.id} inserido.`);
    return { status: 'success', inserted: true };
  } else {
    console.log(`🔄 Documento com id ${data.id} atualizado.`);
    return { status: 'updated', inserted: false };
  }
}
