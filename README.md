🧠 Knobot
Knobot é um agente inteligente que auxilia na resolução de chamados técnicos, utilizando inteligência artificial para sugerir tratativas com base em casos semelhantes já registrados. Ele é acessível via uma interface web construída com Next.js e utiliza MongoDB como banco de dados, com processamento de IA realizado pelo Defy.

🚀 Funcionalidades
🔍 Análise de chamados em tempo real
Knobot se conecta ao sistema de chamados (Freshdesk) e consulta um banco de dados com registros anteriores.

🧠 Sugestões inteligentes via IA (Defy)
A IA analisa o conteúdo do chamado e retorna sugestões de tratativas com base em casos semelhantes.

🌐 Interface Web com Next.js
A aplicação é acessível por uma página web moderna e responsiva.

🗃️ Banco de dados MongoDB
Armazena os chamados históricos e suas respectivas soluções para consulta da IA.

🛠️ Tecnologias Utilizadas
Next.js – Frontend moderno e performático
MongoDB – Banco de dados NoSQL
Defy – Plataforma de IA para análise e sugestão de tratativas
Freshdesk – Origem dos chamados técnicos

📦 Estrutura do Projeto

```
knobot/
├── pages/              # Páginas da aplicação Next.js
├── components/         # Componentes reutilizáveis da interface
├── services/           # Integrações com Defy e MongoDB
├── utils/              # Funções auxiliares
├── public/             # Arquivos estáticos
└── README.md           # Este arquivo
```

📈 Como Funciona
O usuário acessa a página do Knobot.
Um chamado é enviado ou selecionado.
O Knobot consulta o banco MongoDB por casos semelhantes.
A IA do Defy analisa os dados e retorna sugestões de tratativas.
As sugestões são exibidas na interface para o analista.

🧪 Em Desenvolvimento
Integração direta com Freshdesk via API
Feedback do analista para melhorar sugestões da IA
Histórico de interações com o Knobot
