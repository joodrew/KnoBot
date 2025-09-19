
export default function NotFound() {
  return (
   
   <div className="flex-grow flex flex-col items-center justify-start pt-60  px-4">
      
      

      {/* Conteúdo principal */}
      <div className="z-10 text-center px-6">
        <h1 className="text-6xl font-bold text-orange-400 mb-4">404</h1>
        <p className="text-2xl text-gray-200 mb-2">Mayday</p>
        <p className="text-gray-400 mb-6">
          O KnoBot se perdeu no espaço. Tente voltar para a base!
        </p>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-orange-400 text-white hover:bg-orange-500 transition-colors font-medium text-sm h-9 px-4 flex items-center justify-center"
        >
          Voltar
        </a>
      </div>
    </div>
  );
}
