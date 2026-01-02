# Instruções para Agentes de IA - Painel Administrativo Sagrada Esperança

## Visão Geral da Arquitetura

Este é um **painel administrativo SPA** construído com **Nuxt 3 + TypeScript + Tailwind CSS** para gestão do site do clube Sagrada Esperança. O frontend comunica com uma API backend Spring Boot via requisições HTTP com autenticação baseada em sessões (cookies).

**Decisões arquiteturais importantes:**
- **SSR desabilitado** (`ssr: false` no `nuxt.config.ts`) - aplicação roda em modo SPA para compatibilidade com nginx estático
- **Autenticação via sessões HTTP** usando cookies (`credentials: 'include'` em todas as chamadas de API)
- **Contratos de API documentados** em `API_CONTRATOS.md` - este é a fonte de verdade para todos os endpoints

## Configuração do Ambiente

### Variáveis de Ambiente Obrigatórias

```bash
NUXT_PUBLIC_API_BASE_URL=https://api.gdse.ao  # URL base da API backend
```

**Arquivo `.env.example` contém o template**. O valor padrão em `nuxt.config.ts` é `https://api.gdse.ao` para produção.

### Comandos de Desenvolvimento

```bash
npm install           # Instalar dependências
npm run dev           # Servidor de desenvolvimento (porta 3000)
npm run build         # Build de produção (gera .output/)
npm run start         # Executar build de produção localmente
```

### Deploy

- **Vercel**: Configurado em `vercel.json` com variáveis de ambiente
- **Docker**: `docker-compose.yml` + `Dockerfile` para containers
- **Scripts de deploy**: `deploy.sh` e `deploy-admin.sh` para automação

## Sistema de Autenticação

### Fluxo de Autenticação (2 passos)

```typescript
// 1. POST /api/auth/login com form-data (username, password)
// 2. GET /api/auth/status para obter dados do usuário
// Backend retorna cookie JSESSIONID que é enviado automaticamente
```

**Serviço**: `services/auth.service.ts`  
**Composable**: `composables/useAuth.ts`  
**Middleware**: `middleware/auth.ts` (protege rotas), `middleware/role.ts` (verifica permissões)

### Sistema de Permissões

O sistema usa **papéis (roles)** e **permissões granulares**:

```typescript
// Papéis: SUPER_ADMIN | ADMIN | EDITOR | FOTOGRAFO | MODERADOR
// Permissões: 'noticias:create', 'jogos:update', 'usuarios:delete', etc.
```

**Uso em componentes**:
```vue
<script setup>
const { can, hasRole, isAdmin } = usePermissions()

// Verificar permissão específica
if (can('noticias:create')) { ... }

// Verificar papel
if (hasRole('SUPER_ADMIN')) { ... }
</script>
```

**Middleware de autorização**: `middleware/role.ts` mapeia rotas para permissões necessárias.

## Padrões de Comunicação com API

### Cliente HTTP Base

**Arquivo**: `services/api.ts`

```typescript
// Usar ofetch com credentials: 'include' para enviar cookies
const client = ofetch.create({ 
  baseURL: config.public.apiBase,
  credentials: 'include',
  onResponseError({ response }) {
    // Tratamento automático de 401 (redireciona para login)
    // Tratamento automático de 403 (mostra toast de erro)
  }
})
```

### Padrão para Formulários com Arquivos

**Importante**: Endpoints que aceitam imagens usam `multipart/form-data` com 2 parts:

```typescript
// Exemplo: criar notícia com imagem
const formData = new FormData()
formData.append('noticia', new Blob([JSON.stringify(dto)], { type: 'application/json' }))
formData.append('imagem', fileInput.files[0])

await client.post('/api/noticias', formData)
```

**Ver `API_CONTRATOS.md`** para detalhes de cada endpoint.

## Estrutura de Páginas e Rotas

### Convenções de Roteamento

- **Páginas públicas**: `pages/login.vue` (usa `middleware: 'guest'`)
- **Páginas protegidas**: Todas as outras (usam `middleware: ['auth', 'role']` automático via `layouts/default.vue`)
- **Rotas dinâmicas**: `pages/jogos/[id]/ao-vivo.vue` - acessa `id` via `useRoute().params.id`

### Layout Padrão

**Arquivo**: `layouts/default.vue`

```vue
<template>
  <div class="flex">
    <Sidebar />
    <div class="flex-1">
      <HeaderBar />
      <main class="p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
```

## Componentes Reutilizáveis

### DataTable

**Arquivo**: `components/DataTable.vue`

```vue
<!-- Uso típico -->
<DataTable 
  :headers="['Nome', 'Email', 'Papel']"
  :keys="['nome', 'email', 'papel']"
  :rows="usuarios"
  @row:click="editarUsuario"
>
  <template #actions="{ row }">
    <button @click="deletar(row.id)">Apagar</button>
  </template>
  <template #cell:papel="{ row }">
    <span class="badge">{{ row.papel }}</span>
  </template>
</DataTable>
```

### Modal, Toast, StatCard, ChartCard

Componentes genéricos em `components/`. Exemplo de uso do Toast:

```typescript
const { showToast } = useToast()
showToast('Operação realizada com sucesso', 'success')
```

## Gerenciamento de Estado

### Estado Global com useState

**Padrão Nuxt 3** para estado compartilhado entre componentes:

```typescript
// Em composable (ex: useAuth.ts)
const user = useState<Usuario | null>('auth.user', () => null)

// Acessível em qualquer componente
const { user } = useAuth()
```

**Não usar Pinia** - projeto usa `useState` nativo do Nuxt.

## Utilitários e Helpers

### Formatação de Datas

**Arquivo**: `utils/date.ts`

```typescript
import { formatDate24, parseBackendDate } from '@/utils/date'

// Backend retorna datas em 'dd/MM/yyyy HH:mm:ss' ou ISO
const dataFormatada = formatDate24(jogo.dataHora)
```

### Tratamento de Erros

**Arquivo**: `utils/error.ts`

```typescript
import { extractErrorMessage } from '@/utils/error'

try {
  await api.criarNoticia(dados)
} catch (err) {
  const mensagem = extractErrorMessage(err)
  showToast(mensagem, 'error')
}
```

## Funcionalidades Específicas do Domínio

### Gestão de Jogos Ao Vivo

**Página**: `pages/jogos/[id]/ao-vivo.vue`

- **Sistema de placar em tempo real** com eventos (golos, cartões, substituições)
- **Composable dedicado**: `composables/useJogoConflicts.ts` para detecção de conflitos em eventos
- **Tipos específicos**: `types/jogo.ts` com `EventoJogoRequest`, `ConvocadoRequest`, etc.

```typescript
// Adicionar evento de golo
const evento: EventoJogoRequest = {
  tipo: 'GOLO',
  minuto: 45,
  lado: 'CASA',
  jogadorId: 10,
  observacao: 'Golo de cabeça'
}
await api.adicionarEventoJogo(jogoId, evento)
```

### Upload de Galeria (Álbuns e Mídias)

**Página**: `pages/galeria/index.vue`  
**Tipos**: `types/galeria.ts`

```typescript
// Criar álbum com múltiplas imagens
const album: AlbumRequestDTO = { titulo: 'Jogo vs Adversário', descricao: '...' }
const midias: File[] = [file1, file2, file3]
await api.criarAlbum(album, midias)
```

## Estilos e Tailwind

### Paleta de Cores do Clube

```css
/* tailwind.config.js - cores personalizadas */
colors: {
  'brand-green': '#04aa5d',
  'brand-mint': '#a8e6cf',
  'brand-dark': '#1a1a1a'
}
```

**Usar classes do Tailwind** em vez de CSS customizado. Componentes seguem padrão de design system interno.

## Testes e Validação

**Não há testes automatizados configurados** (`lint` retorna `'No linter configured'`).

Para validar mudanças:
1. Testar manualmente no navegador (`npm run dev`)
2. Verificar console do browser para erros
3. Testar fluxo de autenticação sempre que mexer em API calls

## Pontos de Atenção

### CORS e Credenciais

**Crítico**: Todas as chamadas de API devem incluir `credentials: 'include'` para enviar cookies de sessão. Caso contrário, backend retorna 401.

### Dados Mock

`services/api.ts` tem flag `useMockData` (atualmente `false`). Se backend estiver indisponível, setar para `true` ativa dados de demonstração.

### Build para Produção

```bash
npm run build  # Gera .output/ com modo static (nitro preset: 'static')
```

**Importante**: Build é SPA estático, não SSR. Servidor não processa Vue no backend.

## Documentação de Referência

- **`API_CONTRATOS.md`**: Contratos completos de todos os endpoints (source of truth)
- **`GUIA_AUTENTICACAO_FRONTEND.md`**: Detalhes do fluxo de autenticação
- **`README.md`**: Setup básico e comandos
- **Arquivos `DEPLOY_*.md`**: Instruções de deployment em diferentes plataformas

## Contribuindo com Novas Features

1. **Consultar `API_CONTRATOS.md`** para contratos de endpoints
2. **Criar tipos TypeScript** em `types/` correspondentes aos DTOs do backend
3. **Adicionar métodos no cliente API** em `services/api.ts`
4. **Criar composables** se houver lógica reutilizável
5. **Adicionar middleware de permissões** em `middleware/role.ts` se necessário
6. **Testar com usuários de diferentes papéis** para validar controle de acesso
