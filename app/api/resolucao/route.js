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

    // Se for um array, processa cada item
    if (Array.isArray(parsed)) {
      console.log('📚 Body é um array. Processando cada item...');
      const resultados = [];

      for (const item of parsed) {
        console.log('🔍 Verificando item:', item);

        if (
          !item ||
          typeof item !== 'object' ||
          !item.resolução ||
          !Array.isArray(item.tags) ||
          !item.subject ||
          !item.id
        ) {
          console.warn('⚠️ Item inválido ou com campos ausentes:', item);
          resultados.push({ id: item?.id, error: '❌ Campos obrigatórios ausentes ou inválidos.' });
          continue;
        }

        try {
          const result = await saveResolucao(item);
          console.log('✅ Resultado da função saveResolucao:', result);
          resultados.push({ id: item.id, result });
        } catch (err) {
          console.error('❌ Erro ao salvar item:', item.id, err);
          resultados.push({ id: item.id, error: '❌ Erro ao salvar resolução.' });
        }
      }

      return new Response(JSON.stringify(resultados), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Se não for array, trata como único objeto
    console.log('📄 Body é um único objeto. Validando...');
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

    const result = await saveResolucao(parsed);
    console.log('✅ Resultado da função saveResolucao:', result);

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
