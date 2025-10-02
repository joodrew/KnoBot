'use client';

import ChamadoCard from './ChamadoCard';

export default function ChamadoList({ chamados = [] }) {
  if (!chamados.length) {
    return <p className="text-gray-300">Nenhum chamado encontrado.</p>;
  }

  return (
    <div className="flex flex-col h-screen p-4">
      {/* Título fixo no topo */}
      <h2 className="text-2xl font-bold text-orange-400 mb-4">Chamados</h2>

      {/* Área com scroll vertical */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {chamados.map((ch) => (
            <ChamadoCard key={ch.id || `${ch.processo}-${ch.subject}`} chamado={ch} />
          ))}
        </div>
      </div>
    </div>
  );
}