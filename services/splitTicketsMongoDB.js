// lib/splitTicketsMongoDB.ts
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
let client;
let clientPromise;

if (!uri) {
  throw new Error('❌ MONGODB_URI não está definida em .env.local');
}

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export async function splitTicketsMongoDB() {
  const client = await clientPromise;
  const db = client.db('freshdesk');

  // Remove a coleção se já existir
  const collections = await db.listCollections({ name: 'filtroPrimeiro' }).toArray();
  if (collections.length > 0) {
    await db.collection('filtroPrimeiro').drop();
  }

  // Pipeline para agrupar por subject e extrair id dos tickets e id das conversas
  const pipeline = [
    {
      $project: {
        subject: {
          $cond: [
            { $ifNull: ['$subject', false] },
            { $toLower: '$subject' },
            'sem_assunto'
          ]
        },
        id: 1,
        conversations: {
          $map: {
            input: '$conversations',
            as: 'conv',
            in: { id: '$$conv.id' }
          }
        }
      }
    },
    {
      $group: {
        _id: '$subject',
        tickets: {
          $push: {
            id: '$id',
            conversations: '$conversations'
          }
        }
      }
    },
    {
      $project: {
        subject: '$_id',
        tickets: 1,
        _id: 0
      }
    }
  ];

  const result = await db.collection('tickets').aggregate(pipeline, { allowDiskUse: true }).toArray();
  await db.collection('filtroPrimeiro').insertMany(result);

  return { success: true, message: '✅ Coleção "filtroPrimeiro" criada com sucesso com tickets agrupados por subject.' };
}
