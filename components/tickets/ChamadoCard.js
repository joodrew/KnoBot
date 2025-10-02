'use client';

import ChamadoModal from "../tickets/ChamadoModal";
import LogoEmpresa from "@/components/LogoEmpresa"; // ✅ componente reutilizável

export default function ChamadoCard({ chamado }) {
 const titulo = chamado.subject || chamado.processo || 'Sem título';
const subtitulo = chamado.desc || chamado.problema || '';


  const tags = Array.isArray(chamado.tags) ? chamado.tags.slice(0, 3) : [];
  const dominio = Array.isArray(chamado.dominios) && chamado.dominios.length > 0
    ? chamado.dominios[0]
    : null;

  return (
    <div className="rounded bg-[var(--ticketCard-bg)] shadow text-black cursor-pointer hover:brightness-110 transition">
      <ChamadoModal chamado={chamado}>
        <div className="min-h-[100px] px-4 py-2 flex items-center gap-3 justify-between">
          {/* Esquerda: textos */}
          <div className="flex flex-col justify-center flex-1 min-w-0">
            <p className="text-sm font-semibold text-orange-400 truncate">
              {titulo}
            </p>
            <p className="text-sm text-black line-clamp-2 break-words">
              {subtitulo}
            </p>

            {/* Chips: domínio + tags */}
            <div className="mt-2 flex flex-wrap gap-1">
              {dominio && (
                <a
                  href={/^https?:\/\//i.test(dominio) ? dominio : `https://${dominio}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] px-2 py-0.5 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                  onClick={(e) => e.stopPropagation()}
                  title={dominio}
                >
                  {dominio}
                </a>
              )}
              {tags.map((t, i) => (
                <span
                  key={i}
                  className="text-[11px] px-2 py-0.5 rounded-full bg-orange-100 text-orange-700"
                  title={t}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Direita: logo ou fallback visual */}
          <div className="shrink-0">
            <LogoEmpresa nome={chamado.empresaNome} logo={chamado.empresaLogo} />
          </div>
        </div>
      </ChamadoModal>
    </div>
  );
}