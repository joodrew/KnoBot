import { saveResolucao } from '@/services/saveResolucao';

export async function POST(request) {
  try {
    const body = await request.json();

    const { text } = body;

    if (!text || typeof text !== 'string') {
      return new Response(JSON.stringify({ error: 'Campo "text" ausente ou inválido.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const result = await saveResolucao(text);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Erro na rota /api/resolucao:', error);
    return new Response(JSON.stringify({ error: 'Erro interno ao salvar resolução.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}