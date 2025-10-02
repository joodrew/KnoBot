export function normalizeChamado(raw = {}) {
  const empresaNome = raw['Nome da empresa'] || raw.empresa || 'Sem empresa';
  const logoUrl = raw.logo || raw['logo'] || null;

  // Função para gerar cor baseada no nome
  function stringToColor(str = '') {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 50%)`; // cor vibrante e legível
  }

  // Fallback visual para logo
  const fallbackLogo = {
    letra: empresaNome.charAt(0).toUpperCase(),
    cor: stringToColor(empresaNome),
  };

  return {
    id: raw?._id?.toString?.() || raw?._id,
    empresaNome,
    empresaLogo: logoUrl || fallbackLogo, // ✅ pode ser string ou objeto
    dominios: raw['Domínios para esta empresa']
      ? raw['Domínios para esta empresa'].split(',').map((d) => d.trim())
      : [],
    subject: raw.subject || null,
    desc: raw.desc || raw['Descrição'] || null,
    tags: raw.tags || [],
    processo: raw.processo || null,
    problema: raw.problema || null,
    resolucaoHtml: raw['resolução'] || raw.resolucaoHtml || null,
    resolucaoRaw: raw.resolucao || raw.resolucaoRaw || null,
  };
}