import { saveResolucao } from '@/services/saveResolucao';

export async function POST(request) {
  try {
    const body = await request.json();

    // Se o body for uma string JSON (como a nova LLM retorna), faz o parse
    let parsed;
    if (typeof body === 'string') {
      try {
        parsed = JSON.parse(body);
      } catch (err) {
        return new Response(JSON.stringify({ error: '❌ Erro ao fazer parse do JSON.' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    } else {
      parsed = body;
    }

    // Verifica se é um objeto válido
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      !parsed.resolução ||
      !Array.isArray(parsed.tags) ||
      !parsed.subject ||
      !parsed.id
    ) {
      return new Response(JSON.stringify({ error: '❌ Campos obrigatórios ausentes ou inválidos.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const result = await saveResolucao(parsed);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Erro na rota /api/resolucao:', error);
    return new Response(JSON.stringify({ error: '❌ Erro interno ao salvar resolução.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}