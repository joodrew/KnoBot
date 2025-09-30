import { saveResolucao } from '@/services/saveResolucao';

export async function POST(request) {
  console.log('🔄 Iniciando processamento da requisição POST /api/resolucao');

  try {
    const body = await request.json();
    console.log('📦 Body recebido:', body);

    let parsed;
    if (typeof body === 'string') {
      console.log('🧩 Body é uma string, tentando fazer parse...');
      try {
        parsed = JSON.parse(body);
        console.log('✅ Parse realizado com sucesso:', parsed);
      } catch (err) {
        console.error('❌ Erro ao fazer parse do JSON:', err);
        return new Response(JSON.stringify({ error: '❌ Erro ao fazer parse do JSON.' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    } else {
      console.log('🧩 Body já é um objeto:', body);
      parsed = body;
    }

    // Validação dos campos obrigatórios
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      !parsed.resolução ||
      !Array.isArray(parsed.tags) ||
      !parsed.subject ||
      !parsed.id
    ) {
      console.warn('⚠️ Campos obrigatórios ausentes ou inválidos:', parsed);
      return new Response(JSON.stringify({ error: '❌ Campos obrigatórios ausentes ou inválidos.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('✅ Dados validados com sucesso. Enviando para saveResolucao...');
    const result = await saveResolucao(parsed);
    console.log('📥 Resultado da função saveResolucao:', result);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('❌ Erro na rota /api/resolucao:', error);
    return new Response(JSON.stringify({ error: '❌ Erro interno ao salvar resolução.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}