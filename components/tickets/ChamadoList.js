'use client';
import ChamadoCard from './ChamadoCard';

export default function ChamadoList({ chamados = [] }) {
  if (!chamados.length) return <p className="text-gray-300">Nenhum chamado encontrado.</p>;
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {chamados.map((ch) => (
        <ChamadoCard key={ch._id || `${ch.processo}-${ch.subject}`} chamado={ch} />
      ))}
    </div>
  );
}