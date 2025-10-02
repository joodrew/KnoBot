'use client';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { useMemo } from "react";
import DOMPurify from "isomorphic-dompurify";
import LogoEmpresa from "@/components/LogoEmpresa"; // ✅ componente reutilizável

export default function ChamadoModal({ chamado, children }) {
  const titulo = chamado?.subject || chamado?.processo || "Detalhes do chamado";
const subtitulo = chamado?.desc || chamado?.problema || "";

  const logo = chamado?.empresaLogo || null;
  const nomeEmpresa = chamado?.empresaNome || "—";
  const dominios = Array.isArray(chamado?.dominios) ? chamado.dominios : [];
  const tags = Array.isArray(chamado?.tags) ? chamado.tags : [];

  function looksLikeHtml(s = "") {
    return typeof s === "string" && /<\/?[a-z][\s\S]*>/i.test(s);
  }

  const safeHtmlPrimary = useMemo(() => {
    const raw = chamado?.resolucaoHtml || "";
    if (!raw) return "";
    try {
      return DOMPurify.sanitize(raw, { USE_PROFILES: { html: true } });
    } catch {
      return "";
    }
  }, [chamado?.resolucaoHtml]);

  const safeHtmlFromRaw = useMemo(() => {
    const raw = chamado?.resolucaoRaw || "";
    if (!raw || !looksLikeHtml(raw)) return "";
    try {
      return DOMPurify.sanitize(raw, { USE_PROFILES: { html: true } });
    } catch {
      return "";
    }
  }, [chamado?.resolucaoRaw]);

  const contentHtml = safeHtmlPrimary || safeHtmlFromRaw;

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="w-full max-w-screen-xl bg-[var(--footer-bg)] text-white rounded-lg shadow-lg border-[2px] border-orange-400 overflow-y-auto max-h-[90vh] px-6 py-4">
        {/* Topo: logo + nome da empresa à esquerda */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <LogoEmpresa nome={nomeEmpresa} logo={logo} />
            <span className="text-orange-400 font-semibold">
              {nomeEmpresa}
            </span>
          </div>
        </div>

        {/* Título e subtítulo */}
        <DialogHeader className="text-center">
          <DialogTitle className="text-orange-400">{titulo}</DialogTitle>
          {!!subtitulo && (
            <DialogDescription className="text-white opacity-90">
              {subtitulo}
            </DialogDescription>
          )}
        </DialogHeader>

        {/* Domínios */}
        {dominios.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2 justify-center">
            {dominios.map((dom, i) => (
              <a
                key={`${dom}-${i}`}
                href={/^https?:\/\//i.test(dom) ? dom : `https://${dom}`}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] px-2 py-0.5 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                title={dom}
                onClick={(e) => e.stopPropagation()}
              >
                {dom}
              </a>
            ))}
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1 justify-center">
            {tags.map((t, i) => (
              <span
                key={`${t}-${i}`}
                className="text-[11px] px-2 py-0.5 rounded-full bg-orange-100 text-orange-700"
                title={t}
              >
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Resumo da solução */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-orange-400 mb-1 text-center">
            Resumo da solução
          </label>

          {contentHtml ? (
            <div
              className="bg-gray-200 rounded-md p-3 text-sm text-black border border-orange-400 prose max-w-none"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          ) : chamado?.resolucaoRaw ? (
            <div className="bg-gray-200 rounded-md p-3 text-sm text-black border border-orange-400 whitespace-pre-wrap">
              {chamado.resolucaoRaw}
            </div>
          ) : (
            <div className="bg-gray-200 rounded-md p-3 text-sm text-black border border-orange-400 text-center">
              {subtitulo || "Sem informações adicionais."}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}