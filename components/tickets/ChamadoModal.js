import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Pencil, Save, X } from "lucide-react";

export default function ChamadoModal({ chamado, children }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent  
        className="max-w-md bg-[var(--footer-bg)] text-white rounded-lg shadow-lg border-[2px] border-orange-400 [&>button]:hidden"
      >
        {/* Topo: logo à esquerda e ícones à direita */}
        <div className="flex justify-between items-center mb-4">
          {/* Ícone temporário */}
          <div className="h-6 w-6 bg-orange-400 rounded-md" />

          {/* Botões como ícones */}
          <div className="flex gap-2">
            <button className="p-1 rounded hover:bg-orange-500 transition">
              <Pencil size={18} className="text-orange-400" />
            </button>
            <button className="p-1 rounded hover:bg-orange-500 transition">
              <Save size={18} className="text-orange-400" />
            </button>
            <button className="p-1 rounded hover:bg-orange-500 transition">
              <X size={18} className="text-orange-400" />
            </button>
          </div>
        </div>

        {/* Título e descrição centralizados */}
        <DialogHeader className="text-center">
          <DialogTitle className="text-orange-400">
            {chamado.processo}
          </DialogTitle>
          <DialogDescription className="text-white">
            {chamado.problema}
          </DialogDescription>
        </DialogHeader>

        {/* Resumo da solução */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-orange-400 mb-1 text-center">
            Resumo da solução
          </label>
          <div className="bg-gray-200 rounded-md p-3 text-sm text-black border border-orange-400 text-center">
            A planilha foi atualizada e o acesso foi liberado via VPN. Usuário orientado a utilizar o novo link.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
