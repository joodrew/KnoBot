// /lib/normalizeChamado.js
export function normalizeChamado(raw = {}) {
  return {
    id: raw?._id?.toString?.() || raw?._id,
    empresaNome: raw['Nome da empresa'] || raw.empresa || null,
    empresaLogo: raw.logo || raw['logo'] || null, // 👈 pega raw.logo
    dominios: [],
    subject: raw.subject || null,
    desc: raw.desc || raw['Descrição'] || null,
    tags: raw.tags || [],
    resolucaoHtml: raw['resolução'] || null,
    resolucaoRaw: raw.resolucao || null,
  };
}