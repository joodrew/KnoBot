import { MongoClient } from 'mongodb';

const uri = process.env.MONGODBDUMP_URI;
const dbName = 'dify';
const collectionName = 'resolucao';

export async function saveResolucao(text) {
  if (!uri) {
    throw new Error('MONGODBDUMP_URI não está definido nas variáveis de ambiente');
  }

  // Extrai o JSON de dentro do bloco ```json ... ```
  const match = text.match(/```json\s*([\s\S]*?)\s*```/);
  if (!match || !match[1]) {
    return { error: 'Formato de JSON não encontrado dentro do campo "text".' };
  }

  const rawJson = match[1];

  // Decodifica entidades HTML
  const decodeHtml = (str) =>
    str.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"');

  let parsed;
  try {
    parsed = JSON.parse(rawJson);
  } catch (err) {
    return { error: 'Erro ao fazer parse do JSON.' };
  }

  parsed.resolução = decodeHtml(parsed.resolução);

  const client = new MongoClient(uri);
  await client.connect();

  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  await collection.insertOne(parsed);

  await client.close();
  return { status: 'success', inserted: true };
}
