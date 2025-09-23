import ChamadoCard from "./ChamadoCard";

export default function ChamadosGrid({ chamados }) {
  return (
    <div className="flex flex-col h-full ">
      {/* Título fixo */}
      <h2 className="text-2xl pt-4 font-bold text-center text-orange-400 mb-4">
        Chamados
      </h2>

      {/* Área rolável com scrollbar encostado na borda */}
      <div className="flex-1 overflow-y-auto">
        {/* Wrapper sem padding, para o scrollbar ficar na borda */}
        <div className="w-full">
          {/* Cards com padding interno */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
            {chamados.map((chamado) => (
              <ChamadoCard key={chamado.id} chamado={chamado} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
