import EmpresaCarousel from '@/components/tickets/EmpresaCarousel';
import ChamadoList from '@/components/tickets/ChamadoList';
import LoadingFallback from '@/components/LoadingFallback';
import { headers } from 'next/headers';
import { normalizeChamado } from '@/services/normalizeChamado';

export const revalidate = 0;

export default async function TicketsPage({ searchParams }) {
  const q = (searchParams?.q || '').trim();
  const empresa = (searchParams?.empresa || '').trim();

  const hdrs = headers();
  const host = hdrs.get('host');
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';

  const params = new URLSearchParams({
    db: 'dify',
    collection: 'resolucao',
    includeId: 'true',
    dump: 'true',
    limit: '100',
    keys: [
      '_id',
      'processo',
      'problema',
      'subject',
      'empresa',
      'Nome da empresa',
      'desc',
      'resolucao',
      'resolução',
      'logo',
    ].join(','),
  });

  if (q) {
    params.set('regex', 'true');
    params.set('regexOptions', 'i');
    params.set('search', q);
    params.set('searchFields', [
      'problema',
      'processo',
      'subject',
      'desc',
      'resolucao',
    ].join(','));
  }

  if (empresa) {
    params.set('filterField', 'Nome da empresa');
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

  if (!chamadosRaw.length) {
    return <LoadingFallback />; // ✅ mostra enquanto carrega ou se estiver vazio
  }

  const chamados = chamadosRaw.map(normalizeChamado);

  const matchesQ = (item, query) => {
    if (!query) return true;
    const hay = [
      item.processo,
      item.problema,
      item.subject,
      item.desc,
      item.resolucaoRaw,
    ].filter(Boolean).join(' ').toLowerCase();
    return hay.includes(query.toLowerCase());
  };

  const matchesEmpresa = (item, emp) => {
    if (!emp) return true;
    return (item.empresaNome || '').toLowerCase() === emp.toLowerCase();
  };

  const chamadosFiltrados = chamados.filter(
    (ch) => matchesEmpresa(ch, empresa) && matchesQ(ch, q)
  );

  const chamadosParaCarousel = chamados.filter((ch) => matchesQ(ch, q));

  const empresasMap = new Map();
  for (const d of chamadosParaCarousel) {
    const nome = d.empresaNome || 'Sem empresa';
    const logo = d.empresaLogo || '';

    if (!empresasMap.has(nome)) {
      empresasMap.set(nome, {
        nome,
        logo,
        count: 0,
      });
    }

    const e = empresasMap.get(nome);
    e.count += 1;
    if (!e.logo && logo) e.logo = logo;
  }
  const empresas = [...empresasMap.values()];

  return (
    <div className="p-4 space-y-6">
      <EmpresaCarousel empresas={empresas} q={q} selectedEmpresa={empresa} />
      <ChamadoList chamados={chamadosFiltrados} />
    </div>
  );
}