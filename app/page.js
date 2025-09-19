import InputSearch from "@/components/InputSearch";
import KnoBotName from "@/components/KnoBotName";

export default function Home() {
  return (
    <div className="font-sans flex flex-col min-h-screen text-[var(--foreground)]">
      
      {/* Conteúdo principal */}
      <main className="flex-grow flex flex-col items-center justify-start pt-65 px-4">
        
        <KnoBotName size="text-9xl" />

        <div className="w-full max-w-xl flex flex-col items-center gap-4">
          <InputSearch />

          <div className="flex py-4 gap-6">
            <button className="bg-gray-500 text-white px-5 py-2 rounded hover:bg-gray-700 transition text-sm font-medium">
              Pesquisar
            </button>
            <button className="bg-orange-400 text-white px-5 py-2 rounded hover:bg-orange-500 transition text-sm font-medium">
              Chat
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
