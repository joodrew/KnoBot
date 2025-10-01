// app/tickets/page.js
import EmpresaCarousel from '@/components/tickets/EmpresaCarousel';
import ChamadoList from '@/components/tickets/ChamadoList';
import { headers } from 'next/headers';

export const revalidate = 0; // sem cache SSG nesta página

export default async function TicketsPage({ searchParams }) {
  const q = (searchParams?.q || '').trim();
  const empresa = (searchParams?.empresa || '').trim(); // 👈 filtro por empresa

  // Monta URL absoluta da API (server-side)
  const hdrs = headers();
  const host = hdrs.get('host');
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';

  const params = new URLSearchParams({
    db: 'dify',
    collection: 'resolucao',
    includeId: 'true',
    dump: 'true',
    limit: '100', // pode ajustar
    // Campos que precisamos (inclui desc, resoluções e logo)
    keys: [
      '_id',
      'processo',
      'problema',
      'subject',
      'empresa',
      'desc',
      'resolucao',   // RAW (texto/HTML)
      'resolução',   // HTML com acento
      'logo',        // 👈 para o carousel e card/modal
    ].join(','),
  });

  // Busca textual multi-campos
  if (q) {
    params.set('regex', 'true');
    params.set('regexOptions', 'i');
    params.set('search', q);
    params.set('searchFields', [
      'problema',
      'processo',
      'subject',
      'desc',
      'resolucao',   // busca em conteúdo de resumo (raw)
      // 'resolução', // opcional (pode ser pesado por ser HTML)
    ].join(','));
  }

  // Filtro por empresa (igualdade)
  if (empresa) {
    params.set('filterField', 'empresa');
    params.set('filterValue', empresa);
  }

  const url = `${protocol}://${host}/api/data-mongodb?${params.toString()}`;
  const res = await fetch(url, { cache: 'no-store' });

  if (!res.ok) {
    return (
      <div className="p-4">
        <p className="text-red-400">Erro ao buscar dados no MongoDB.</p>
      </div>
    );
  }

  const data = await res.json();
  const chamadosRaw = Array.isArray(data) ? data : [];

  // Normaliza: garante resoluções e _id em string
  const chamados = chamadosRaw.map((d) => ({
    ...d,
    _id: d?._id?.toString?.() || d?._id,
    resolucaoHtml: d['resolução'] ?? d.resolucaoHtml ?? null,
    resolucaoRaw: d.resolucao ?? d.resolucaoRaw ?? null,
  }));

  // -----------------------------
  // Garantia de filtros (fallback local se sua API não combinar empresa + q)
  // -----------------------------
  const matchesQ = (item, query) => {
    if (!query) return true;
    const hay = [
      item.processo, item.problema, item.subject, item.desc, item.resolucaoRaw,
    ].filter(Boolean).join(' ').toLowerCase();
    return hay.includes(query.toLowerCase());
  };

  const matchesEmpresa = (item, emp) => {
    if (!emp) return true;
    return (item.empresa || '').toLowerCase() === emp.toLowerCase();
  };

  // Conjunto para CARDS: aplica ambos filtros (empresa + q)
  const chamadosFiltrados = chamados.filter(ch => matchesEmpresa(ch, empresa) && matchesQ(ch, q));

  // Conjunto para CAROUSEL: aplica SOMENTE o filtro de q (para listar outras empresas que batem com a busca)
  const chamadosParaCarousel = chamados.filter(ch => matchesQ(ch, q));

  // -----------------------------
  // Monta dados de empresas (nome, logo, count) a partir do banco
  // -----------------------------
  const empresasMap = new Map();
  for (const d of chamadosParaCarousel) {
    const nome = d.empresa || 'Sem empresa';
    if (!empresasMap.has(nome)) {
      empresasMap.set(nome, {
        nome,
        logo: d.logo || '', // pega a primeira logo encontrada
        count: 0,
      });
    }
    const e = empresasMap.get(nome);
    e.count += 1;
    if (!e.logo && d.logo) e.logo = d.logo; // preenche se vier depois
  }
  const empresas = [...empresasMap.values()];

  return (
    <div className="p-4 space-y-6">
      <EmpresaCarousel
        empresas={empresas} // 👈 vindo do banco, nada estático
        q={q}
        selectedEmpresa={empresa}
      />
      <ChamadoList chamados={chamadosFiltrados} />
    </div>
  );
}