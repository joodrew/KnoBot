import ChamadoCard from "./ChamadoCard";

export default function ChamadosGrid({ chamados }) {
  return (
    <div>
      <h2 className="text-2xl pt-10 font-bold text-center text-orange-400 mb-6">
        Chamados
      </h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {chamados.map((chamado) => (
            <ChamadoCard key={chamado.id} chamado={chamado} />
          ))}
        </div>
    </div>
  );
}
