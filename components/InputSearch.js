'use client';

export default function InputSearch() {
  return (
    <div className="w-full max-w-xl px-2 sm:px-0">
      <div className="flex items-center w-full bg-gray-600 border border-orange-400 rounded-full px-4 py-4 sm:px-6 sm:py-3 shadow-sm hover:shadow-md transition">
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

        {/* Campo de texto */}
        <input
          type="text"
          placeholder="Pesquisar..."
          className="flex-grow bg-transparent text-white placeholder-gray-300 outline-none text-sm sm:text-base"
        />

        {/* Ícone de microfone com X à direita */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-white ml-2 sm:ml-3 cursor-not-allowed"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 1a3 3 0 013 3v8a3 3 0 01-6 0V4a3 3 0 013-3zm0 14v4m0 0h-3m3 0h3M15 9l6 6M21 9l-6 6"
          />
        </svg>
      </div>
    </div>
  );
}
