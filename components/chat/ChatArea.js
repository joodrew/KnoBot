'use client';

import TextInput from "@/components/chat/TextInput"; // ajuste o caminho conforme necessário

export default function ChatArea() {
  return (
    <div className="flex-1 flex flex-col justify-between bg-[#182338]/80 px-4 sm:px-10 py-6">
      {/* Cabeçalho da conversa */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-white">Conversa atual</h2>
        <p className="text-sm text-gray-400">Você está conversando com o assistente inteligente.</p>
      </div>

      {/* Área de mensagens simuladas */}
      <div className="flex-1 overflow-y-auto space-y-4">
        <div className="flex justify-start">
          <div className="bg-orange-400 p-4 rounded-lg text-white max-w-[80%]">
            Olá, Joelson! Como posso te ajudar com seus chamados técnicos hoje?
          </div>
        </div>

        <div className="flex justify-end">
          <div className="bg-gray-800 p-4 rounded-lg text-white max-w-[80%]">
            Preciso de uma sugestão de tratativa para um erro de conexão no Freshdesk.
          </div>
        </div>

        <div className="flex justify-start">
          <div className="bg-orange-400 p-4 rounded-lg text-white max-w-[80%]">
            Entendido! Você pode verificar se o token da API está ativo e se o domínio está correto. Deseja que eu gere um exemplo de requisição para teste?
          </div>
        </div>
      </div>

      {/* Input de mensagem com estilo refinado */}
      <div className="mt-6 flex justify-center pb-30">
        <TextInput />
      </div>
    </div>
  );
}
