PROMPT PARA AGENTE DE IA – RECONSTRUÇÃO DO PAINEL ADMINISTRATIVO EM VUE.JS/NUXT

Você é responsável por recriar o Painel Administrativo usando Vue.js com Nuxt 3 como framework principal.
O objetivo é entregar um painel moderno, rápido e responsivo, que siga boas práticas de UI/UX, mantenha consistência com o layout já definido no site principal, e utilize exclusivamente os contratos definidos no arquivo API_CONTRATO.md (localizado na raiz do projeto) para todas as integrações com o backend.
1. Requisitos Gerais

    Framework: Nuxt 3 + Tailwind CSS para estilização.

    Integração com API: seguir exatamente o contrato do arquivo API_CONTRATO.md.

    Layout: usar a paleta oficial de cores definida no Tailwind (#04aa5d, #f9eb07, #ebfbf6), mantendo a identidade visual do site principal.

    Responsividade total (desktop, tablet e mobile).

    Componentização completa para facilitar manutenção.

    Não inventar endpoints ou campos — usar apenas os existentes em API_CONTRATO.md.

2. Estrutura de Páginas

    Dashboard

        Cards com estatísticas reais (mensagens recebidas, jogos próximos, resultados, membros ativos etc.).

        Gráficos simples usando Chart.js para evolução de métricas.

    Contatos

        Listagem de mensagens vindas do site (GET /api/contatos).

        Cada linha clicável para abrir modal com conteúdo completo da mensagem (GET /api/contatos/{id}).

        Botão para marcar como lida (PATCH /api/contatos/{id}).

        Botão para apagar mensagem (DELETE /api/contatos/{id}).

        Indicação visual de mensagens não lidas (ex.: badge colorida).

    Jogos

        Estrutura em abas: “Próximos Jogos”, “Resultados” e “Classificação”.

        Cards criativos seguindo identidade visual.

        Dados puxados da API conforme contratos no API_CONTRATO.md.

    Membros da Direção

        Tabela listando todos os membros.

        Botão “Adicionar Membro” abrindo modal com todos os campos do contrato:

        {
          "nome": "string",
          "fotoUrl": "string",
          "biografia": "string",
          "cargoId": number,
          "inicioMandato": "YYYY-MM-DD",
          "fimMandato": "YYYY-MM-DD",
          "ativo": boolean
        }

        Edição e remoção de membros existentes.

    Configurações

        Alteração de dados institucionais (se disponível na API).

        Gestão de credenciais de acesso.

3. Boas Práticas de UI/UX

    Header fixo com logo e menu lateral retrátil.

    Uso de feedback visual em todas as ações (loading states, mensagens de sucesso/erro).

    Uso consistente da paleta de cores e tipografia.

    Modais claros e de fácil uso, com botões bem destacados.

    Animações suaves para transições de páginas e abertura de elementos.

4. Integração com API

    Criar um service layer (/services/api.js) para centralizar chamadas à API.

    Usar useAsyncData e useFetch do Nuxt para SSR/CSR híbrido.

    Respeitar rigorosamente os endpoints e campos definidos no API_CONTRATO.md.

5. Entregáveis

    Projeto Nuxt 3 funcional e conectado à API real.

    Códigos limpos e bem comentados.

    Total responsividade e performance otimizada.

    Layout consistente com o site principal, sem alterar a identidade visual já estabelecida.