'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button'; // ajuste o caminho se necessário

export default function TextInput() {
  const [text, setText] = useState('');

  return (
    <div className="w-full px-2 sm:px-0">
      <div className="flex items-center w-full bg-gray-700 border border-orange-400 rounded-full px-4 py-3 sm:px-6 shadow-sm hover:shadow-md transition">

        {/* Ícone de lupa à esquerda */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-orange-400 hover:text-orange-500 mr-2 sm:mr-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1116.65 2a7.5 7.5 0 010 14.65z"
          />
        </svg>

        {/* Campo de texto com expansão e rolagem */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Digite sua mensagem..."
          rows={2}
          className="flex-grow bg-transparent text-white placeholder-gray-300 outline-none text-sm sm:text-base resize-none max-h-[6.5rem] overflow-y-auto scrollbar-thin scrollbar-thumb-orange-400 scrollbar-track-gray-600"
        />

        {/* Botão "+" */}
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:text-orange-400 ml-2 sm:ml-3"
          title="Mais opções"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </Button>

        {/* Botão microfone */}
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:text-orange-400 ml-2 sm:ml-3"
          title="Microfone"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 1a3 3 0 013 3v7a3 3 0 01-6 0V4a3 3 0 013-3zm0 14v4m-4 0h8" />
          </svg>
        </Button>

        {/* Botão enviar */}
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:text-orange-400 ml-2 sm:ml-3"
          title="Enviar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12l14-7-7 14-2-5-5-2z" />
          </svg>
        </Button>
      </div>
    </div>
  );
}
