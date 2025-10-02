'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import LogoEmpresa from "@/components/LogoEmpresa"; // ✅ componente separado

export default function EmpresaCarousel({ empresas = [], q = '', selectedEmpresa = '' }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const itens = Array.isArray(empresas) ? empresas : [];

  const handleClick = (nome) => {
    const params = new URLSearchParams(searchParams.toString());
    if (selectedEmpresa && selectedEmpresa.toLowerCase() === nome.toLowerCase()) {
      params.delete('empresa');
    } else {
      params.set('empresa', nome);
    }
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const titulo = useMemo(() => {
    if (q && !selectedEmpresa) return `Empresas com resultados para “${q}”`;
    if (q && selectedEmpresa) return `Empresas (filtro: “${selectedEmpresa}”) para “${q}”`;
    if (!q && selectedEmpresa) return `Empresas (filtro: “${selectedEmpresa}”)`;
    return 'Empresas';
  }, [q, selectedEmpresa]);

  return (
    <div className="py-8 px-4 rounded">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-orange-400">{titulo}</h2>
        {selectedEmpresa ? (
          <button
            onClick={() => handleClick(selectedEmpresa)}
            className="text-xs px-3 py-1 rounded border border-orange-400 text-orange-400 hover:bg-orange-500/10 transition"
          >
            Limpar filtro
          </button>
        ) : null}
      </div>

      {itens.length === 0 ? (
        <p className="text-center text-gray-300">Nenhuma empresa encontrada.</p>
      ) : (
        <Carousel opts={{ align: "start", loop: true }} className="w-full relative">
          <CarouselContent className="-ml-4">
            {itens.map((empresa, index) => {
              const isActive =
                selectedEmpresa &&
                selectedEmpresa.toLowerCase() === (empresa.nome || '').toLowerCase();

              return (
                <CarouselItem
                  key={`${empresa.nome}-${index}`}
                  className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                >
                  <button
                    onClick={() => handleClick(empresa.nome)}
                    className={[
                      "w-full bg-white rounded shadow h-40 flex flex-col overflow-hidden text-left transition",
                      isActive ? "ring-2 ring-orange-400" : "hover:shadow-md",
                    ].join(' ')}
                  >
                    <div className="h-20 flex items-center justify-center">
                      <LogoEmpresa nome={empresa.nome} logo={empresa.logo} />
                    </div>

                    <div className="border-t-[1.5px] border-orange-400" />
                    <div className="flex-[0.8] bg-gray-500 bg-opacity-80 p-2 text-center">
                      <h3 className="text-lg text-orange-400 font-semibold truncate">
                        {empresa.nome}
                      </h3>
                      <p className="text-sm text-white">
                        {empresa.count} resultado{empresa.count === 1 ? '' : 's'}
                        {q ? ` para “${q}”` : ''}
                      </p>
                    </div>
                  </button>
                </CarouselItem>
              );
            })}
          </CarouselContent>

          <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-orange-400 text-white rounded-full p-2 shadow hover:bg-orange-500 transition" />
          <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-orange-400 text-white rounded-full p-2 shadow hover:bg-orange-500 transition" />
        </Carousel>
      )}
    </div>
  );
}