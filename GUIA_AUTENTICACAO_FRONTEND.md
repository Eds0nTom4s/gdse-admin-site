# 🔐 Guia de Implementação - Autenticação e Autorização Frontend

## 📋 Visão Geral

Este documento fornece orientações para implementar a autenticação e autorização no frontend do painel administrativo, integrando com o sistema de segurança já implementado no backend.

## 🎯 Objetivos

- Implementar login/logout seguro no painel administrativo
- Controlar acesso às funcionalidades baseado nos papéis dos usuários
- Manter sessões autenticadas durante a navegação
- Fornecer feedback adequado sobre permissões

## 🏗️ Arquitetura de Segurança Backend (Já Implementada)

### Endpoints de Autenticação
- **Login:** `POST /api/auth/login`
- **Logout:** `POST /api/auth/logout`
- **Verificação:** `GET /api/auth/status`

### Sistema de Papéis (RBAC)
- `SUPER_ADMIN`: Acesso total ao sistema
- `ADMIN`: Gestão geral (exceto configurações críticas)
- `EDITOR`: Gestão de conteúdo (notícias, jogadores, jogos)
- `FOTOGRAFO`: Gestão de galeria e mídia
- `MODERADOR`: Moderação de conteúdo e contactos

## 🚀 Implementação Frontend

### 1. **Gestão de Estado de Autenticação**

#### Informações a Armazenar:
- Status de autenticação (logado/não logado)
- Dados do usuário (nome, email, papel)
- Permissões específicas
- Token/sessão (se aplicável)

#### Persistência:
- **SessionStorage**: Para dados da sessão atual
- **LocalStorage**: Para preferências (opcional)
- **Cookies**: Para sessões persistentes (se necessário)

### 2. **Fluxo de Login**

#### Formulário de Login:
```
Campos necessários:
- Username/Email
- Password
- (Opcional) Lembrar-me
```

#### Processo:
1. Validar campos obrigatórios
2. Enviar credenciais para `/api/auth/login`
3. Tratar resposta do servidor
4. Armazenar dados do usuário autenticado
5. Redirecionar para dashboard apropriado

#### Tratamento de Respostas:
- **Sucesso (200)**: Armazenar dados e redirecionar
- **Erro (401)**: Exibir "Credenciais inválidas"
- **Erro (500)**: Exibir "Erro no servidor"

### 3. **Proteção de Rotas**

#### Implementar Guardas de Rota:
- **AuthGuard**: Verificar se usuário está autenticado
- **RoleGuard**: Verificar se usuário tem permissão específica

#### Estratégias de Proteção:
- Redirecionar para login se não autenticado
- Exibir página "Acesso Negado" se sem permissão
- Verificar permissões antes de carregar componentes

### 4. **Controle de Acesso por Funcionalidade**

#### Mapeamento de Permissões:

**SUPER_ADMIN:**
- Acesso total a todas as funcionalidades
- Gestão de usuários e configurações do sistema

**ADMIN:**
- Gestão de conteúdo, jogadores, jogos
- Visualização de relatórios
- Gestão de contactos

**EDITOR:**
- Criação/edição de notícias
- Gestão de jogadores e jogos
- Edição de informações do clube

**FOTOGRAFO:**
- Gestão completa da galeria
- Upload e organização de mídia
- Criação de álbuns

**MODERADOR:**
- Moderação de contactos
- Aprovação de conteúdo
- Gestão básica de utilizadores

### 5. **Interface Adaptável**

#### Elementos Condicionais:
- Mostrar/ocultar botões baseado em permissões
- Desabilitar funcionalidades sem acesso
- Exibir menus contextuais apropriados

#### Feedback Visual:
- Indicadores de papel do usuário
- Tooltips explicando restrições
- Estados de loading durante verificações

### 6. **Interceptação de Requisições**

#### Configurar Interceptors para:
- Incluir credenciais de sessão automaticamente
- Tratar respostas 401 (não autorizado)
- Redirecionar para login em caso de sessão expirada
- Exibir mensagens de erro adequadas

### 7. **Gestão de Sessões**

#### Verificações Periódicas:
- Implementar heartbeat para verificar status da sessão
- Renovar tokens/sessões automaticamente
- Alertar sobre expiração iminente

#### Logout Seguro:
- Limpar todos os dados armazenados
- Invalidar sessão no servidor
- Redirecionar para página de login

### 8. **Segurança Adicional**

#### Boas Práticas:
- Não armazenar senhas no frontend
- Validar dados sempre no servidor
- Implementar timeout de inatividade
- Log de ações importantes

#### Proteção CSRF:
- Incluir tokens CSRF se necessário
- Validar origem das requisições
- Usar cabeçalhos de segurança apropriados

## 🔧 Implementação Técnica

### Estrutura Sugerida:

```
src/
├── auth/
│   ├── auth-service.js      # Serviço de autenticação
│   ├── auth-guards.js       # Guardas de rota
│   ├── permissions.js       # Definições de permissões
│   └── auth-context.js      # Contexto global de auth
├── components/
│   ├── LoginForm.js         # Formulário de login
│   ├── UserProfile.js       # Perfil do usuário
│   └── PermissionWrapper.js # Wrapper condicional
└── utils/
    ├── api-client.js        # Cliente HTTP configurado
    └── constants.js         # Constantes de permissões
```

### APIs de Integração:

#### Login:
```
POST /api/auth/login
Content-Type: application/x-www-form-urlencoded

username=admin&password=admin123
```

#### Verificação de Status:
```
GET /api/auth/status
(Incluir cookies de sessão)
```

#### Logout:
```
POST /api/auth/logout
(Incluir cookies de sessão)
```

## 🧪 Usuários de Teste

Para desenvolvimento e testes, utilize:

| Username   | Password   | Papel        |
|------------|------------|--------------|
| superadmin | admin123   | SUPER_ADMIN  |
| admin      | admin123   | ADMIN        |
| editor     | editor123  | EDITOR       |
| fotografo  | foto123    | FOTOGRAFO    |
| moderador  | mod123     | MODERADOR    |

## 📝 Checklist de Implementação

### Fase 1 - Autenticação Básica:
- [ ] Criar formulário de login
- [ ] Implementar serviço de autenticação
- [ ] Configurar armazenamento de estado
- [ ] Implementar logout

### Fase 2 - Proteção de Rotas:
- [ ] Criar guardas de autenticação
- [ ] Implementar redirecionamentos
- [ ] Configurar interceptadores HTTP

### Fase 3 - Controle de Acesso:
- [ ] Mapear permissões por papel
- [ ] Implementar componentes condicionais
- [ ] Criar guardas de autorização

### Fase 4 - UX/UI:
- [ ] Adicionar indicadores visuais
- [ ] Implementar feedback de erros
- [ ] Criar páginas de erro personalizadas

### Fase 5 - Segurança:
- [ ] Implementar verificações de sessão
- [ ] Configurar timeout de inatividade
- [ ] Adicionar logs de segurança

## 🔍 Testes Recomendados

### Cenários de Teste:
1. **Login com credenciais válidas**
2. **Login com credenciais inválidas**
3. **Acesso a rotas protegidas sem autenticação**
4. **Acesso a funcionalidades sem permissão**
5. **Logout e limpeza de sessão**
6. **Expiração de sessão**
7. **Navegação entre diferentes níveis de acesso**

## 📞 Suporte

Para dúvidas sobre implementação:
- Consultar documentação da API no Swagger: `http://localhost:8080/swagger-ui.html`
- Verificar logs do backend para depuração
- Testar endpoints diretamente via H2 Console: `http://localhost:8080/h2-console`

---

**Nota:** Este sistema foi projetado para ser seguro e flexível. Mantenha sempre as boas práticas de segurança e teste todos os cenários antes de colocar em produção.