'use client';

import TextInput from "@/components/chat/TextInput";

export default function ChatArea() {
  return (
    <div className="relative h-full w-full bg-[#182338]/80 flex flex-col">
      {/* Cabeçalho fixo */}
      <div className="sticky top-0 z-20 bg-[#121a26] px-4 sm:px-10 py-4 border-b border-orange-400">
        <h2 className="text-xl font-semibold text-white">Conversa atual</h2>
        <p className="text-sm text-gray-400">Você está conversando com o assistente inteligente.</p>
      </div>

      {/* Área de mensagens com padding extra apenas no mobile */}
<div className="flex-1 overflow-y-auto px-4 sm:px-10 py-6 space-y-4 pb-20 sm:pb-6">

        {[
          { from: "bot", text: "Olá, Joelson! Como posso te ajudar com seus chamados técnicos hoje?" },
          { from: "user", text: "Preciso de uma sugestão de tratativa para um erro de conexão no Freshdesk." },
          { from: "bot", text: "Verifique se o token da API está ativo e se o domínio está correto. Deseja um exemplo de requisição?" },
          { from: "user", text: "Sim, por favor. Pode incluir cabeçalhos e corpo da requisição?" },
          { from: "bot", text: "Claro! Aqui está um exemplo usando fetch com headers e body em JSON." },
          { from: "user", text: "Obrigado! Isso deve ajudar bastante." },
          { from: "bot", text: "Se precisar validar o token, posso te mostrar como fazer isso também." },
          { from: "user", text: "Pode mostrar, sim." },
          { from: "bot", text: "Use o endpoint `/api/v2/me` com o token no header Authorization. Se retornar 200, está válido." },
          { from: "user", text: "Perfeito. Vou testar agora." },
        ].map((msg, index) => (
          <div key={index} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`p-4 rounded-lg text-white max-w-[80%] ${msg.from === "user" ? "bg-gray-800" : "bg-orange-400"}`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input fixo acima do footer no mobile, colado no desktop */}
      <div className="sticky bottom-16 sm:bottom-0 left-0 w-full bg-[#121a26] px-4 sm:px-10 py-4 border-t border-orange-400 z-30">
        <TextInput />
      </div>
    </div>
  );
}
