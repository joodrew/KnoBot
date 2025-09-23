import EmpresaCarousel from "@/components/tickets/EmpresaCarousel";
import ChamadosGrid from "@/components/tickets/ChamadosGrid";

export default function Tickets() {
  const chamados = [
    {
      id: 1,
      processo: "SHS_PagamentoDeDespesasSinistro",
      problema: "Falha ao acessar planilha",
    },
    {
      id: 2,
      processo: "SHS_EnvioDeDocumentos",
      problema: "Erro de autenticação",
    },
    {
      id: 3,
      processo: "SHS_ConsultaDeSinistro",
      problema: "Dados não carregam",
    },
    {
      id: 4,
      processo: "SHS_AtualizaçãoDeCadastro",
      problema: "Campo obrigatório não aparece",
    },
    {
      id: 5,
      processo: "SHS_AtualizaçãoDeCadastro",
      problema: "Campo obrigatório não aparece",
    },
    {
      id: 6,
      processo: "SHS_AtualizaçãoDeCadastro",
      problema: "Campo obrigatório não aparece",
    },
    {
      id: 7,
      processo: "SHS_AtualizaçãoDeCadastro",
      problema: "Campo obrigatório não aparece",
    },
    {
      id: 9,
      processo: "SHS_AtualizaçãoDeCadastro",
      problema: "Campo obrigatório não aparece",
    },
    {
      id: 10,
      processo: "SHS_AtualizaçãoDeCadastro",
      problema: "Campo obrigatório não aparece",
    },
    {
      id: 11,
      processo: "SHS_AtualizaçãoDeCadastro",
      problema: "Campo obrigatório não aparece",
    },
    {
      id: 12,
      processo: "SHS_AtualizaçãoDeCadastro",
      problema: "Campo obrigatório não aparece",
    },
  ];

 

  return (
    <div className="flex flex-col h-full w-full py-8">
      <EmpresaCarousel />
      <div className="flex-1 min-h-0 overflow-hidden">
        <ChamadosGrid chamados={chamados} />
      </div>
    </div>
  );
}
