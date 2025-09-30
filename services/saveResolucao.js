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
  // Verifica se já existe um documento com o mesmo id
  const existing = await collection.findOne({ id: data.id });
  if (existing) {
    console.log(`⚠️ Documento com id ${data.id} já existe. Ignorando inserção.`);
    await client.close();
    return { status: 'skipped', inserted: false, reason: 'ID já existente' };
  }

  await collection.insertOne(data);
  console.log(`✅ Documento com id ${data.id} inserido com sucesso.`);

  await client.close();
  return { status: 'success', inserted: true };
}
