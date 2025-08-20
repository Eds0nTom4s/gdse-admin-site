# Contratos de Integração da API - Sagrada Esperança

Este documento detalha os contratos para todos os endpoints da API do backend.

---

## Módulo: Notícias

**Endpoint Base:** `/api/noticias`

### 1. Listar todas as notícias

- **Método:** `GET`
- **URL:** `/api/noticias`
- **Resposta (200 OK):** `application/json` - Array de `NoticiaResponseDTO`
  ```json
  [
    {
      "id": 1,
      "titulo": "Título da Notícia",
      "conteudo": "Conteúdo completo da notícia.",
      "imagemUrl": "https://example.com/imagem.jpg",
      "publicadoEm": "2025-07-06T01:55:47.123Z",
      "autorId": 10
    }
  ]
  ```

### 2. Obter notícia por ID

- **Método:** `GET`
- **URL:** `/api/noticias/{id}`
- **Resposta (200 OK):** `application/json` - `NoticiaResponseDTO`

### 3. Criar nova notícia

- **Método:** `POST`
- **URL:** `/api/noticias`
- **Corpo da Requisição:** `multipart/form-data`
  - **part:** `noticia` (`application/json` - `NoticiaRequestDTO`)
    ```json
    {
      "titulo": "Novo Título da Notícia (mínimo 10 caracteres)",
      "conteudo": "Conteúdo da nova notícia.",
      "autorId": 10
    }
    ```
  - **part:** `imagem` (arquivo de imagem)
- **Resposta (201 Created):** `application/json` - `NoticiaResponseDTO`

### 4. Atualizar notícia existente

- **Método:** `PUT`
- **URL:** `/api/noticias/{id}`
- **Corpo da Requisição:** `multipart/form-data`
  - **part:** `noticia` (`application/json` - `NoticiaRequestDTO`)
  - **part:** `imagem` (arquivo de imagem, opcional)
- **Resposta (200 OK):** `application/json` - `NoticiaResponseDTO`

### 5. Apagar notícia

- **Método:** `DELETE`
- **URL:** `/api/noticias/{id}`
- **Resposta (204 No Content):** Sem corpo.

---

## Módulo: Direção / Membros

**Endpoint Base:** `/api/direcao/membros`

### 1. Listar todos os membros ativos da direção

- **Método:** `GET`
- **URL:** `/api/direcao/membros`
- **Resposta (200 OK):** `application/json` - Array de `MembroDirecaoResponseDTO`
  ```json
  [
    {
      "id": 1,
      "nome": "Nome do Membro",
      "fotoUrl": "https://example.com/foto.jpg",
      "biografia": "Biografia do membro.",
      "cargo": {
        "id": 1,
        "nome": "Presidente",
        "ordem": 1
      },
      "inicioMandato": "2024-01-01",
      "fimMandato": "2028-01-01",
      "ativo": true
    }
  ]
  ```

### 2. Obter membro da direção por ID

- **Método:** `GET`
- **URL:** `/api/direcao/membros/{id}`
- **Resposta (200 OK):** `application/json` - `MembroDirecaoResponseDTO`

### 3. Criar novo membro da direção

- **Método:** `POST`
- **URL:** `/api/direcao/membros`
- **Corpo da Requisição:** `multipart/form-data`
  - **part:** `membro` (`application/json` - `MembroDirecaoRequestDTO`)
    ```json
    {
      "nome": "Novo Membro da Direção",
      "biografia": "Biografia do novo membro.",
      "cargoId": 2,
      "inicioMandato": "2025-01-01",
      "fimMandato": "2029-01-01",
      "ativo": true
    }
    ```
  - **part:** `foto` (arquivo de imagem)
- **Resposta (201 Created):** `application/json` - `MembroDirecaoResponseDTO`

### 4. Atualizar membro da direção

- **Método:** `PUT`
- **URL:** `/api/direcao/membros/{id}`
- **Corpo da Requisição:** `multipart/form-data`
  - **part:** `membro` (`application/json` - `MembroDirecaoRequestDTO`)
  - **part:** `foto` (arquivo de imagem, opcional)
- **Resposta (200 OK):** `application/json` - `MembroDirecaoResponseDTO`

### 5. Desativar membro da direção

- **Método:** `DELETE`
- **URL:** `/api/direcao/membros/{id}`
- **Resposta (204 No Content):** Sem corpo.

---

## Módulo: Direção / Cargos

**Endpoint Base:** `/api/direcao/cargos`

### 1. Listar todos os cargos da direção

- **Método:** `GET`
- **URL:** `/api/direcao/cargos`
- **Resposta (200 OK):** `application/json` - Array de `CargoDirecaoResponseDTO`
  ```json
  [
    {
      "id": 1,
      "nome": "Presidente",
      "ordem": 1
    }
  ]
  ```

### 2. Criar novo cargo

- **Método:** `POST`
- **URL:** `/api/direcao/cargos`
- **Corpo da Requisição:** `application/json` - `CargoDirecaoRequestDTO`
  ```json
  {
    "nome": "Secretário-Geral",
    "ordem": 3
  }
  ```
- **Resposta (201 Created):** `application/json` - `CargoDirecaoResponseDTO`

### 3. Atualizar cargo

- **Método:** `PUT`
- **URL:** `/api/direcao/cargos/{id}`
- **Corpo da Requisição:** `application/json` - `CargoDirecaoRequestDTO`
- **Resposta (200 OK):** `application/json` - `CargoDirecaoResponseDTO`

### 4. Apagar cargo

- **Método:** `DELETE`
- **URL:** `/api/direcao/cargos/{id}`
- **Resposta (204 No Content):** Sem corpo.

---

## Módulo: Jogador / Jogadores

**Endpoint Base:** `/api/jogadores`

### 1. Listar todos os jogadores

- **Método:** `GET`
- **URL:** `/api/jogadores`
- **Resposta (200 OK):** `application/json` - Array de `JogadorResponseDTO`
  ```json
  [
    {
      "id": 1,
      "nome": "Nome do Jogador",
      "numero": 10,
      "posicao": "Avançado",
      "fotoUrl": "https://example.com/jogador.jpg",
      "grupo": {
        "id": 1,
        "nome": "Séniores Masculino",
        "modalidade": {
          "id": 1,
          "nome": "Futebol"
        }
      },
      "ativo": true,
      "criadoEm": "2025-07-06T01:57:22.123Z"
    }
  ]
  ```

### 2. Obter jogador por ID

- **Método:** `GET`
- **URL:** `/api/jogadores/{id}`
- **Resposta (200 OK):** `application/json` - `JogadorResponseDTO`

### 3. Criar novo jogador

- **Método:** `POST`
- **URL:** `/api/jogadores`
- **Corpo da Requisição:** `multipart/form-data`
  - **part:** `jogador` (`application/json` - `JogadorRequestDTO`)
    ```json
    {
      "nome": "Novo Jogador",
      "numero": 99,
      "posicao": "Defesa",
      "grupoId": 1,
      "ativo": true
    }
    ```
  - **part:** `foto` (arquivo de imagem)
- **Resposta (201 Created):** `application/json` - `JogadorResponseDTO`

### 4. Atualizar jogador

- **Método:** `PUT`
- **URL:** `/api/jogadores/{id}`
- **Corpo da Requisição:** `multipart/form-data`
  - **part:** `jogador` (`application/json` - `JogadorRequestDTO`)
  - **part:** `foto` (arquivo de imagem, opcional)
- **Resposta (200 OK):** `application/json` - `JogadorResponseDTO`

### 5. Apagar jogador

- **Método:** `DELETE`
- **URL:** `/api/jogadores/{id}`
- **Resposta (204 No Content):** Sem corpo.

---

## Módulo: Jogador / Grupos

**Endpoint Base:** `/api/grupos`

### 1. Listar todos os grupos

- **Método:** `GET`
- **URL:** `/api/grupos`
- **Resposta (200 OK):** `application/json` - Array de `GrupoResponseDTO`
  ```json
[
    {
      "id": 1,
      "titulo": "Título da Notícia",
      "conteudo": "Conteúdo completo da notícia.",
      "imagemUrl": "https://example.com/imagem.jpg",
      "publicadoEm": "2025-07-06T01:55:47.123Z",
      "nomeAutor": "Nome do Autor"
    }
  ]
  ```

### 2. Obter grupo por ID

- **Método:** `GET`
- **URL:** `/api/grupos/{id}`
- **Resposta (200 OK):** `application/json` - `GrupoResponseDTO`

### 3. Criar novo grupo

- **Método:** `POST`
- **URL:** `/api/grupos`
- **Corpo da Requisição:** `application/json` - `GrupoRequestDTO`
  ```json
  {
    "nome": "Juniores",
    "modalidadeId": 1
  }
  ```
- **Resposta (201 Created):** `application/json` - `GrupoResponseDTO`

### 4. Atualizar grupo

- **Método:** `PUT`
- **URL:** `/api/grupos/{id}`
- **Corpo da Requisição:** `application/json` - `GrupoRequestDTO`
- **Resposta (200 OK):** `application/json` - `GrupoResponseDTO`

### 5. Apagar grupo

- **Método:** `DELETE`
- **URL:** `/api/grupos/{id}`
- **Resposta (204 No Content):** Sem corpo.

---

## Módulo: Jogador / Modalidades

**Endpoint Base:** `/api/modalidades`

### 1. Listar todas as modalidades

- **Método:** `GET`
- **URL:** `/api/modalidades`
- **Resposta (200 OK):** `application/json` - Array de `ModalidadeResponseDTO`
  ```json
  [
    {
      "id": 1,
      "nome": "Futebol"
    }
  ]
  ```

### 2. Obter modalidade por ID

- **Método:** `GET`
- **URL:** `/api/modalidades/{id}`
- **Resposta (200 OK):** `application/json` - `ModalidadeResponseDTO`

### 3. Criar nova modalidade

- **Método:** `POST`
- **URL:** `/api/modalidades`
- **Corpo da Requisição:** `application/json` - `ModalidadeRequestDTO`
  ```json
  {
    "nome": "Basquetebol"
  }
  ```
- **Resposta (201 Created):** `application/json` - `ModalidadeResponseDTO`

### 4. Atualizar modalidade

- **Método:** `PUT`
- **URL:** `/api/modalidades/{id}`
- **Corpo da Requisição:** `application/json` - `ModalidadeRequestDTO`
- **Resposta (200 OK):** `application/json` - `ModalidadeResponseDTO`

### 5. Apagar modalidade

- **Método:** `DELETE`
- **URL:** `/api/modalidades/{id}`
- **Resposta (204 No Content):** Sem corpo.

---

## Módulo: Usuário

**Endpoint Base:** `/api/usuarios`

### 1. Listar todos os usuários

- **Método:** `GET`
- **URL:** `/api/usuarios`
- **Resposta (200 OK):** `application/json` - Array de `UsuarioResponseDTO`
  ```json
  [
    {
      "id": 1,
      "nome": "Administrador do Sistema",
      "username": "admin",
      "email": "admin@example.com",
      "papel": "ADMIN",
      "ativo": true,
      "criadoEm": "2025-07-06T01:59:14.123Z"
    }
  ]
  ```

### 2. Obter usuário por ID

- **Método:** `GET`
- **URL:** `/api/usuarios/{id}`
- **Resposta (200 OK):** `application/json` - `UsuarioResponseDTO`

### 3. Criar novo usuário

- **Método:** `POST`
- **URL:** `/api/usuarios`
- **Corpo da Requisição:** `application/json` - `UsuarioRequestDTO`
  ```json
  {
    "nome": "Editor de Conteúdo",
    "username": "editor",
    "email": "editor@example.com",
    "senha": "password123",
    "papel": "EDITOR",
    "ativo": true
  }
  ```
  - **Valores possíveis para `papel`:** `ADMIN`, `EDITOR`
- **Resposta (201 Created):** `application/json` - `UsuarioResponseDTO`

### 4. Atualizar usuário

- **Método:** `PUT`
- **URL:** `/api/usuarios/{id}`
- **Corpo da Requisição:** `application/json` - `UsuarioRequestDTO`
- **Resposta (200 OK):** `application/json` - `UsuarioResponseDTO`

### 5. Apagar usuário

- **Método:** `DELETE`
- **URL:** `/api/usuarios/{id}`
- **Resposta (204 No Content):** Sem corpo.

---

## Módulo: Galeria

**Endpoint Base:** `/api/galeria/albuns`

### 1. Listar todos os álbuns

- **Método:** `GET`
- **URL:** `/api/galeria/albuns`
- **Resposta (200 OK):** `application/json` - Array de `AlbumResponseDTO`
  ```json
  [
    {
      "id": 1,
      "titulo": "Jogo contra o Petro",
      "descricao": "Melhores momentos do jogo.",
      "tipo": "JOGO",
      "publicadoEm": "2025-07-06",
      "midias": [
        {
          "id": 1,
          "tipo": "IMAGEM",
          "url": "https://example.com/imagem1.jpg",
          "legenda": "Golo da vitória"
        }
      ]
    }
  ]
  ```
  - **Valores possíveis para `tipo`:** `JOGO`, `TREINO`, `EVENTO`, `OUTRO`
  - **Valores possíveis para `midias.tipo`:** `IMAGEM`, `VIDEO`
  - **Ordenação:** mais recentes primeiro (campo `publicadoEm` em ordem decrescente).

### 2. Obter álbum por ID

- **Método:** `GET`
- **URL:** `/api/galeria/albuns/{id}`
- **Resposta (200 OK):** `application/json` - `AlbumResponseDTO`

### 3. Criar novo álbum

- **Método:** `POST`
- **URL:** `/api/galeria/albuns`
- **Corpo da Requisição:** `application/json` - `AlbumRequestDTO`
  ```json
  {
    "titulo": "Festa de Aniversário do Clube",
    "descricao": "Celebração dos 50 anos.",
    "tipo": "EVENTO",
    "midias": [
      {
        "tipo": "IMAGEM",
        "url": "https://example.com/festa1.jpg",
        "legenda": "Corte do bolo"
      }
    ]
  }
  ```
- **Resposta (201 Created):** `application/json` - `AlbumResponseDTO`
  - **Observação:** o campo `midias` é opcional; se ausente ou vazio, o álbum é criado sem mídias.

### 4. Atualizar álbum

- **Método:** `PUT`
- **URL:** `/api/galeria/albuns/{id}`
- **Corpo da Requisição:** `application/json` - `AlbumRequestDTO`
- **Resposta (200 OK):** `application/json` - `AlbumResponseDTO`
  - **Observação:** este endpoint atualiza apenas metadados (`titulo`, `descricao`, `tipo`). A gestão de mídias (adicionar/remover) é feita pelos endpoints dedicados abaixo.

### 5. Apagar álbum

- **Método:** `DELETE`
- **URL:** `/api/galeria/albuns/{id}`
- **Resposta (204 No Content):** Sem corpo.

### 6. Adicionar mídia a um álbum

- **Método:** `POST`
- **URL:** `/api/galeria/albuns/{albumId}/midias`
- **Corpo da Requisição:** `application/json` - `MidiaRequestDTO`
  ```json
  {
    "tipo": "IMAGEM",
    "url": "https://example.com/nova-midia.jpg",
    "legenda": "Nova foto adicionada"
  }
  ```
- **Resposta (201 Created):** `application/json` - Objeto `Midia` criado
  ```json
  {
    "id": 10,
    "tipo": "IMAGEM",
    "url": "https://example.com/nova-midia.jpg",
    "legenda": "Nova foto adicionada"
  }
  ```

### 7. Apagar mídia

- **Método:** `DELETE`
- **URL:** `/api/galeria/midias/{midiaId}`
- **Resposta (204 No Content):** Sem corpo.

---

## Módulo: Classificação

**Endpoint Base:** `/api/classificacoes`

### 1. Listar todas as classificações (geral)

- **Método:** `GET`
- **URL:** `/api/classificacoes`
- **Resposta (200 OK):** `application/json` - Array de `ClassificacaoResponseDTO`

### 2. Obter classificação por ID

- **Método:** `GET`
- **URL:** `/api/classificacoes/{id}`
- **Resposta (200 OK):** `application/json` - `ClassificacaoResponseDTO`

### 3. Listar classificações por competição

- **Método:** `GET`
- **URL:** `/api/classificacoes/competicao/{competicaoId}`
- **Resposta (200 OK):** `application/json` - Array de `ClassificacaoResponseDTO`

### 4. Criar nova entrada de classificação

- **Método:** `POST`
- **URL:** `/api/classificacoes`
- **Corpo da Requisição:** `application/json` - `ClassificacaoRequestDTO`
- **Resposta (201 Created):** `application/json` - `ClassificacaoResponseDTO`

### 5. Atualizar entrada de classificação

- **Método:** `PUT`
- **URL:** `/api/classificacoes/{id}`
- **Corpo da Requisição:** `application/json` - `ClassificacaoRequestDTO`
- **Resposta (200 OK):** `application/json` - `ClassificacaoResponseDTO`

### 6. Apagar entrada de classificação

- **Método:** `DELETE`
- **URL:** `/api/classificacoes/{id}`
- **Resposta (204 No Content):** Sem corpo.

---

## Módulo: Jogo / Competições

**Endpoint Base:** `/api/competicoes`

### 1. Listar todas as competições

- **Método:** `GET`
- **URL:** `/api/competicoes`
- **Resposta (200 OK):** `application/json` - Array de `CompeticaoResponseDTO`

### 2. Obter competição por ID

- **Método:** `GET`
- **URL:** `/api/competicoes/{id}`
- **Resposta (200 OK):** `application/json` - `CompeticaoResponseDTO`

### 3. Criar nova competição

- **Método:** `POST`
- **URL:** `/api/competicoes`
- **Corpo da Requisição:** `application/json` - `CompeticaoRequestDTO`
- **Resposta (201 Created):** `application/json` - `CompeticaoResponseDTO`

### 4. Atualizar competição

- **Método:** `PUT`
- **URL:** `/api/competicoes/{id}`
- **Corpo da Requisição:** `application/json` - `CompeticaoRequestDTO`
- **Resposta (200 OK):** `application/json` - `CompeticaoResponseDTO`

### 5. Apagar competição

- **Método:** `DELETE`
- **URL:** `/api/competicoes/{id}`
- **Resposta (204 No Content):** Sem corpo.

---

## Módulo: Jogo / Jogos

**Endpoint Base:** `/api/jogos`

### 1. Listar todos os jogos

- **Método:** `GET`
- **URL:** `/api/jogos`
- **Resposta (200 OK):** `application/json` - Array de `JogoResponseDTO`

### 2. Obter jogo por ID

- **Método:** `GET`
- **URL:** `/api/jogos/{id}`
- **Resposta (200 OK):** `application/json` - `JogoResponseDTO`

### 3. Listar jogos por grupo

- **Método:** `GET`
- **URL:** `/api/jogos/por-grupo/{grupoId}`
- **Resposta (200 OK):** `application/json` - Array de `JogoResponseDTO`

### 4. Listar jogos por competição

- **Método:** `GET`
- **URL:** `/api/jogos/por-competicao/{competicaoId}`
- **Resposta (200 OK):** `application/json` - Array de `JogoResponseDTO`

### 5. Criar novo jogo

- **Método:** `POST`
- **URL:** `/api/jogos`
- **Corpo da Requisição:** `application/json` - `JogoRequestDTO`
  ```json
  {
    "dataHora": "2025-08-01T19:00:00",
    "local": "Estádio Nacional",
    "adversario": "FC Exemplo",
    "logotipoAdversario": "https://example.com/logo.png",
    "emCasa": true,
    "competicaoId": 1,
    "grupoId": 1
  }
  ```
- **Resposta (201 Created):** `application/json` - `JogoResponseDTO`

### 6. Atualizar jogo

- **Método:** `PUT`
- **URL:** `/api/jogos/{id}`
- **Corpo da Requisição:** `application/json` - `JogoRequestDTO`
- **Resposta (200 OK):** `application/json` - `JogoResponseDTO`

### 7. Apagar jogo

- **Método:** `DELETE`
- **URL:** `/api/jogos/{id}`
- **Resposta (204 No Content):** Sem corpo.

### 8. Listar próximos jogos

- **Método:** `GET`
- **URL:** `/api/jogos/proximos`
- **Resposta (200 OK):** `application/json` - Array de `ProximoJogoDTO`
  ```json
  [
    {
      "id": 2,
      "adversario": "1º de Agosto",
      "data": "2025-07-13T16:00:00",
      "local": "Estádio 11 de Novembro"
    },
    {
      "id": 3,
      "adversario": "Interclube",
      "data": "2025-07-20T15:30:00",
      "local": "Estádio da Cidadela"
    },
    {
      "id": 4,
      "adversario": "Progresso do Sambizanga",
      "data": "2025-07-27T17:00:00",
      "local": "Estádio do Santos"
    }
  ]
  ```
  - Inclui apenas jogos com `estadoJogo` em `AGENDADO` ou `EM_ANDAMENTO` e com `data` futura.

### 9. Convocados do jogo

- **Definir convocados**
  - **Método:** `POST`
  - **URL:** `/api/jogos/{id}/convocados`
  - **Corpo da Requisição:** `application/json` - Array de `ConvocacaoDTO`
  - **Resposta (204 No Content):** Sem corpo.

- **Listar convocados**
  - **Método:** `GET`
  - **URL:** `/api/jogos/{id}/convocados`
  - **Resposta (200 OK):** `application/json` - Array de `ConvocacaoResponseDTO`

### 10. Eventos do jogo

- **Registar evento**
  - **Método:** `POST`
  - **URL:** `/api/jogos/{id}/eventos`
  - **Corpo da Requisição:** `application/json` - `EventoJogoDTO`
  - **Resposta (201 Created):** `application/json` - `EventoJogoResponseDTO`

- **Listar eventos**
  - **Método:** `GET`
  - **URL:** `/api/jogos/{id}/eventos`
  - **Resposta (200 OK):** `application/json` - Array de `EventoJogoResponseDTO` (ordenado por minuto)

### 11. Estado do jogo

- **Alterar estado**
  - **Método:** `PATCH`
  - **URL:** `/api/jogos/{id}/estado`
  - **Corpo da Requisição:** `application/json` - `AlterarEstadoDTO`
  - **Resposta (200 OK):** `application/json` - `JogoResponseDTO`

- **Finalizar jogo**
  - **Método:** `POST`
  - **URL:** `/api/jogos/{id}/finalizar`
  - **Resposta (200 OK):** `application/json` - `JogoResponseDTO` (placar derivado contabilizando eventos `GOL` por `lado`)

#### Regras de estado

- `EstadoJogo`: `AGENDADO`, `EM_ANDAMENTO`, `FINALIZADO`, `CANCELADO`.
- Transições válidas:
  - `AGENDADO` → `EM_ANDAMENTO` | `CANCELADO`
  - `EM_ANDAMENTO` → `FINALIZADO` | `CANCELADO`
- Eventos não são aceites quando `estadoJogo ∈ {FINALIZADO, CANCELADO}`.

#### Modelos (Jogos)

- `JogoRequestDTO`: `dataHora` (ISO), `local`, `adversario`, `logotipoAdversario` (opcional), `emCasa` (bool), `competicaoId` (long), `grupoId` (long)
- `JogoResponseDTO`: `id`, `dataHora`, `local`, `adversario`, `logotipoAdversario`, `emCasa`, `estadoJogo`, `golsCasa` (int, opcional), `golsFora` (int, opcional), `competicao` {`id`,`nome`}, `grupo` {`id`,`nome`,`modalidade` {`id`,`nome`}}, `criadoEm`
- `ProximoJogoDTO`: `id`, `adversario`, `data`, `local`
- `ConvocacaoDTO`: `jogadorId` (long), `status` (`TITULAR`|`RESERVA`), `posicaoProvavel` (opcional)
- `ConvocacaoResponseDTO`: `jogadorId`, `jogadorNome`, `status`, `posicaoProvavel`
- `EventoJogoDTO`: `tipo` (`GOL`, `ASSISTENCIA`, `CARTAO_AMARELO`, `CARTAO_VERMELHO`, `SUBSTITUICAO`, `LESAO`, `INTERVALO`, `INICIO_JOGO`, `FIM_JOGO`), `minuto` (0–130), `lado` (`CASA`|`FORA`), `jogadorId` (opcional), `observacao` (opcional)
- `EventoJogoResponseDTO`: `id`, `tipo`, `minuto`, `lado`, `jogadorId` (opcional), `jogadorNome` (opcional), `observacao`

Notas:

- "Lado" em eventos: `CASA` corresponde ao GDSE quando `emCasa = true`; caso `emCasa = false`, GDSE corresponde ao `FORA`.
- "Próximos jogos" não inclui jogos finalizados/cancelados e considera sempre `data > agora`.

---

## Módulo: Sobre

**Endpoint Base:** `/api/sobre`

### 1. Obter informações da página "Sobre"

- **Método:** `GET`
- **URL:** `/api/sobre`
- **Resposta (200 OK):** `application/json` - `SobreDTO`
  ```json
  {
    "historia": "O Grupo Desportivo Sagrada Esperança foi fundado em ...",
    "missao": "Promover o desporto em Angola com excelência e inclusão.",
    "visao": "Ser um clube de referência nacional e internacional.",
    "valores": [
      "Disciplina",
      "Respeito",
      "Trabalho em Equipe",
      "Excelência",
      "Compromisso Social"
    ]
  }
  ```

### 2. Atualizar informações da página "Sobre"

- **Método:** `PUT`
- **URL:** `/api/sobre`
- **Corpo da Requisição:** `application/json` - `SobreDTO`
- **Resposta (200 OK):** `application/json` - `SobreDTO` (com os dados atualizados)

---

## Módulo: Clube (Singleton)

**Endpoint Base:** `/api/clube`

### 1. Obter dados institucionais do clube

- **Método:** `GET`
- **URL:** `/api/clube`
- **Resposta (200 OK):** `application/json` - `ClubeResponseDTO`
  ```json
  {
    "id": 1,
    "nomeCompleto": "Grupo Desportivo Sagrada Esperança",
    "sigla": "GDSE",
    "slogan": "TIme de sucesso!",
    "descricao": "Descrição de exemplo",
    "fundacao": "1976-12-22",
    "estadio": "Estádio Sagrada Esperança",
    "sede": {
      "logradouro": "Estádio Sagrada Esperança",
      "numero": null,
      "complemento": null,
      "bairro": null,
      "cidade": "Dundo",
      "estado": "Lunda Norte",
      "pais": "Angola",
      "cep": "0000"
    }
  }
  ```

### 2. Atualizar dados institucionais do clube (upsert)

- **Método:** `PUT`
- **URL:** `/api/clube`
- **Corpo da Requisição:** `application/json` - `ClubeRequestDTO`
  ```json
  {
    "nomeCompleto": "Grupo Desportivo Sagrada Esperança",
    "sigla": "GDSE",
    "slogan": "TIme de sucesso!",
    "descricao": "Descrição de exemplo",
    "fundacao": "1976-12-22",
    "estadio": "Estádio Sagrada Esperança",
    "sede": {
      "logradouro": "Estádio Sagrada Esperança",
      "numero": null,
      "complemento": null,
      "bairro": null,
      "cidade": "Dundo",
      "estado": "Lunda Norte",
      "pais": "Angola",
      "cep": "0000"
    }
  }
  ```
- **Resposta (200 OK):** `application/json` - `ClubeResponseDTO` (dados atualizados)

## Módulo: Contatos

**Endpoint Base:** `/api/contatos`

### 1. Listar todas as mensagens de contato

- **Método:** `GET`
- **URL:** `/api/contatos`
- **Resposta (200 OK):** `application/json` - Array de `ContatoResponseDTO`
  ```json
  [
    {
      "id": 1,
      "nomeCompleto": "João Silva",
      "email": "joao.silva@example.com",
      "assunto": "Dúvida sobre Inscrições",
      "mensagem": "Gostaria de saber mais informações sobre como inscrever o meu filho nas camadas jovens.",
      "dataEnvio": "2025-07-07T10:30:00Z",
      "estado": "NAO_LIDO"
    }
  ]
  ```
  - **Valores possíveis para `estado`:** `LIDO`, `NAO_LIDO`

### 2. Obter mensagem de contato por ID

- **Método:** `GET`
- **URL:** `/api/contatos/{id}`
- **Resposta (200 OK):** `application/json` - `ContatoResponseDTO`

### 3. Marcar mensagem como lida

- **Método:** `PATCH`
- **URL:** `/api/contatos/{id}`
- **Corpo da Requisição:** `application/json`
  ```json
  {
    "estado": "LIDO"
  }
  ```
- **Resposta (200 OK):** `application/json` - `ContatoResponseDTO` (com o estado atualizado)

### 4. Apagar mensagem de contato

- **Método:** `DELETE`
- **URL:** `/api/contatos/{id}`
- **Resposta (204 No Content):** Sem corpo.
