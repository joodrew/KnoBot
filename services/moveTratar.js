import { MongoClient } from 'mongodb';

const uri = process.env.MONGODBDUMP_URI;
const dbName = 'dify';

export async function moveRetratar() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);

    const groupedSubject = db.collection('groupedSubject');
    const retratarCollection = db.collection('retratar');

    // Busca documentos com group = 'retratar'
    const retratarDocs = await groupedSubject.find({ group: 'retratar' }).toArray();

    const ticketsToInsert = [];

    for (const doc of retratarDocs) {
      if (Array.isArray(doc.tickets)) {
        doc.tickets.forEach(ticket => {
          ticketsToInsert.push(ticket);
        });
      }
    }

    // Insere os tickets individualmente
    if (ticketsToInsert.length > 0) {
      await retratarCollection.insertMany(ticketsToInsert);
    }

    // Remove os documentos originais
    const idsToDelete = retratarDocs.map(doc => doc._id);
    await groupedSubject.deleteMany({ _id: { $in: idsToDelete } });

    return {
      inserted: ticketsToInsert.length,
      deleted: idsToDelete.length,
    };
  } catch (error) {
    throw new Error(`Erro ao mover tickets: ${error.message}`);
  } finally {
    await client.close();
  }
}
