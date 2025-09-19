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
    },{
      id: 5,
      processo: "SHS_AtualizaçãoDeCadastro",
      problema: "Campo obrigatório não aparece",
    },{
      id: 6,
      processo: "SHS_AtualizaçãoDeCadastro",
      problema: "Campo obrigatório não aparece",
    },{
      id: 8,
      processo: "SHS_AtualizaçãoDeCadastro",
      problema: "Campo obrigatório não aparece",
    },{
      id: 7,
      processo: "SHS_AtualizaçãoDeCadastro",
      problema: "Campo obrigatório não aparece",
    },
    // ...mais chamados
  ];

  return (
    <div className="w-full px-4 py-8">
      <EmpresaCarousel />
      <ChamadosGrid chamados={chamados} />
    </div>
  );
}
