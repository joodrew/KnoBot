import ChamadoModal from "../tickets/ChamadoModal";

export default function ChamadoCard({ chamado }) {
  return (
    <div className=" rounded bg-[var(--ticketCard-bg)] shadow text-black cursor-pointer hover:brightness-110 transition">
      <ChamadoModal chamado={chamado}>
        <div className="min-h-[100px] px-4 py-2 flex justify-between items-center gap-2">
          {/* Conteúdo do card */}
          <div className="flex flex-col justify-center max-w-[80%] break-words">
            <p className="text-sm font-semibold text-orange-400 break-words">
              {chamado.processo}
            </p>
            <p className="text-sm text-black break-words">
              {chamado.problema}
            </p>
          </div>

          {/* Ícone temporário à direita */}
          <div className="h-6 w-6 bg-orange-400 rounded-md shrink-0" />
        </div>
      </ChamadoModal>
    </div>
  );
}
