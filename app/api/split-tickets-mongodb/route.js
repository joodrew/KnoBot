import { splitTicketsMongoDB } from '@/services/splitTicketsMongoDB';

export async function GET() {
  try {
    const result = await splitTicketsMongoDB();
    return Response.json(result);
  } catch (error) {
    console.error('❌ Erro na API (GET):', error);
    return Response.json({ error: error.message || 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function POST() {
  try {
    const result = await splitTicketsMongoDB();
    return Response.json(result);
  } catch (error) {
    console.error('❌ Erro na API (POST):', error);
    return Response.json({ error: error.message || 'Erro interno do servidor' }, { status: 500 });
  }
}
