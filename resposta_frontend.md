# 🔧 Informações Técnicas Específicas - Frontend

## 📋 Respostas às Questões da Equipe Frontend

### Formato das Respostas da API

#### 1. **POST /api/auth/login** - Resposta de Sucesso:
```json
{
  "id": 1,
  "nome": "Administrator",
  "email": "admin@sagradaesperanca.com",
  "username": "admin",
  "papel": "ADMIN",
  "ativo": true,
  "criadoEm": "2024-01-01T10:00:00"
}
```

#### 2. **GET /api/auth/status** - Usuário Autenticado:
```json
{
  "id": 1,
  "nome": "Administrator", 
  "email": "admin@sagradaesperanca.com",
  "username": "admin",
  "papel": "ADMIN",
  "ativo": true,
  "criadoEm": "2024-01-01T10:00:00"
}
```

#### 3. **GET /api/auth/status** - Usuário Não Autenticado:
```json
{
  "error": "Não autenticado",
  "status": 401
}
```

#### 4. **POST /api/auth/login** - Credenciais Inválidas:
```json
{
  "error": "Credenciais inválidas",
  "status": 401
}
```

### Configurações de Sessão

#### Headers Necessários:
- **Content-Type**: `application/x-www-form-urlencoded` (para login)
- **Cookies**: Automáticos (JSESSIONID) - não é necessário gerenciar manualmente
- **CSRF**: Não configurado (desabilitado para APIs)

#### Timeout de Sessão:
- **Configuração**: 30 minutos de inatividade (padrão Spring Boot)
- **Renovação**: Automática a cada requisição autenticada
- **Expiração**: Sessão invalidada após timeout

#### Cookies de Sessão:
- **Nome**: `JSESSIONID`
- **HttpOnly**: `true` (segurança)
- **Secure**: `false` (desenvolvimento) / `true` (produção)
- **SameSite**: `Lax`

### Estrutura Completa do Usuário

```typescript
interface Usuario {
  id: number;                    // ID único do usuário
  nome: string;                  // Nome completo
  email: string;                 // Email (único)
  username: string;              // Username (único)
  papel: 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'FOTOGRAFO' | 'MODERADOR';
  ativo: boolean;                // Status da conta
  criadoEm: string;             // Data de criação (ISO string)
}
```

### Configuração de Cliente HTTP

#### Exemplo de Configuração (Axios):
```javascript
// Configuração básica para incluir cookies automaticamente
const apiClient = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true,  // Inclui cookies automaticamente
  headers: {
    'Content-Type': 'application/json'
  }
});

// Para login (form-data)
const loginData = new URLSearchParams();
loginData.append('username', username);
loginData.append('password', password);

const response = await apiClient.post('/api/auth/login', loginData, {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
});
```

#### Exemplo de Configuração (Fetch):
```javascript
// Login
const loginResponse = await fetch('http://localhost:8080/api/auth/login', {
  method: 'POST',
  credentials: 'include',  // Inclui cookies
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: new URLSearchParams({
    username: username,
    password: password
  })
});

// Verificação de status
const statusResponse = await fetch('http://localhost:8080/api/auth/status', {
  method: 'GET',
  credentials: 'include'  // Inclui cookies de sessão
});
```

### Verificação de Sessão

#### Estratégia de Heartbeat:
```javascript
// Verificar status da sessão a cada 5 minutos
setInterval(async () => {
  try {
    const response = await fetch('/api/auth/status', {
      credentials: 'include'
    });
    
    if (response.status === 401) {
      // Sessão expirou - redirecionar para login
      redirectToLogin();
    }
  } catch (error) {
    console.warn('Erro ao verificar sessão:', error);
  }
}, 5 * 60 * 1000); // 5 minutos
```

### Tratamento de Erros Específicos

#### Códigos de Status Esperados:
- **200**: Sucesso
- **401**: Não autenticado / Credenciais inválidas
- **403**: Sem permissão para o recurso
- **404**: Recurso não encontrado
- **500**: Erro interno do servidor

#### Interceptador de Respostas (Exemplo):
```javascript
// Interceptar respostas para tratar erros de autenticação
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Limpar estado de autenticação
      clearAuthState();
      // Redirecionar para login
      redirectToLogin();
    }
    return Promise.reject(error);
  }
);
```

### Mapeamento Detalhado de Permissões por Endpoint

#### Endpoints Públicos (Sem Autenticação):
```
GET  /api/noticias              # Listar notícias
GET  /api/noticias/{id}         # Ver notícia específica
GET  /api/jogos                 # Listar jogos
GET  /api/jogos/{id}            # Ver jogo específico
GET  /api/albums                # Listar álbuns
GET  /api/albums/{id}/midias    # Ver mídias do álbum
POST /api/contatos              # Enviar mensagem de contato
GET  /api/ficheiros/**          # Download de arquivos públicos
```

#### Endpoints Protegidos por Papel:

**SUPER_ADMIN + ADMIN:**
```
GET    /api/usuarios            # Listar usuários
POST   /api/usuarios            # Criar usuário
PUT    /api/usuarios/{id}       # Atualizar usuário
DELETE /api/usuarios/{id}       # Deletar usuário
```

**ADMIN + EDITOR:**
```
POST   /api/noticias            # Criar notícia
PUT    /api/noticias/{id}       # Atualizar notícia
POST   /api/jogos               # Criar jogo
PUT    /api/jogos/{id}          # Atualizar jogo
```

**Apenas ADMIN:**
```
DELETE /api/noticias/{id}       # Deletar notícia
DELETE /api/jogos/{id}          # Deletar jogo
```

**ADMIN + FOTOGRAFO:**
```
POST   /api/albums              # Criar álbum
PUT    /api/albums/{id}         # Atualizar álbum
DELETE /api/albums/{id}         # Deletar álbum
POST   /api/albums/{id}/midias  # Upload de mídia
DELETE /api/midias/{id}         # Deletar mídia
```

**ADMIN + MODERADOR:**
```
GET    /api/contatos            # Listar contatos
PATCH  /api/contatos/{id}       # Marcar como lido/não lido
DELETE /api/contatos/{id}       # Deletar contato
```

### Exemplo de Implementação de Verificação de Permissões

```javascript
// Mapeamento de permissões por papel
const PERMISSIONS = {
  SUPER_ADMIN: '*', // Acesso total
  ADMIN: [
    'noticias:create', 'noticias:update', 'noticias:delete',
    'jogos:create', 'jogos:update', 'jogos:delete',
    'albums:create', 'albums:update', 'albums:delete',
    'contatos:read', 'contatos:update', 'contatos:delete',
    'usuarios:read', 'usuarios:create', 'usuarios:update', 'usuarios:delete'
  ],
  EDITOR: [
    'noticias:create', 'noticias:update',
    'jogos:create', 'jogos:update'
  ],
  FOTOGRAFO: [
    'albums:create', 'albums:update', 'albums:delete',
    'midias:create', 'midias:delete'
  ],
  MODERADOR: [
    'contatos:read', 'contatos:update', 'contatos:delete'
  ]
};

// Função para verificar permissão
function hasPermission(userRole, permission) {
  if (userRole === 'SUPER_ADMIN') return true;
  return PERMISSIONS[userRole]?.includes(permission) || false;
}

// Uso prático
const canCreateNews = hasPermission(user.papel, 'noticias:create');
const canDeleteUser = hasPermission(user.papel, 'usuarios:delete');
```

### Exemplos de Uso Completos

#### 1. Serviço de Autenticação Completo:
```javascript
class AuthService {
  constructor() {
    this.baseUrl = 'http://localhost:8080/api/auth';
  }

  async login(username, password) {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const response = await fetch(`${this.baseUrl}/login`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error('Credenciais inválidas');
    }
  }

  async logout() {
    const response = await fetch(`${this.baseUrl}/logout`, {
      method: 'POST',
      credentials: 'include'
    });
    return response.ok;
  }

  async checkStatus() {
    const response = await fetch(`${this.baseUrl}/status`, {
      credentials: 'include'
    });

    if (response.ok) {
      return await response.json();
    } else {
      return null;
    }
  }
}
```

#### 2. Hook React para Autenticação:
```javascript
import { useState, useEffect, createContext, useContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const authService = new AuthService();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const userData = await authService.checkStatus();
      setUser(userData);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    const userData = await authService.login(username, password);
    setUser(userData);
    return userData;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    if (user.papel === 'SUPER_ADMIN') return true;
    return PERMISSIONS[user.papel]?.includes(permission) || false;
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      hasPermission,
      isAuthenticated: !!user,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

#### 3. Componente de Proteção:
```javascript
function ProtectedRoute({ children, permission }) {
  const { user, hasPermission } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (permission && !hasPermission(permission)) {
    return <div>Acesso negado</div>;
  }

  return children;
}

// Uso
<ProtectedRoute permission="noticias:create">
  <CreateNewsPage />
</ProtectedRoute>
```

### Resumo das Respostas

#### ❓ **Formato da resposta do /api/auth/status:**
✅ Retorna objeto JSON com dados completos do usuário ou erro 401

#### ❓ **Estrutura do usuário autenticado:**
✅ Campos: id, nome, email, username, papel, ativo, criadoEm

#### ❓ **Headers necessários:**
✅ Apenas `credentials: 'include'` para cookies automáticos, sem CSRF

#### ❓ **Timeout de sessão:**
✅ 30 minutos de inatividade, renovação automática a cada requisição

---

**Nota:** Todos os exemplos foram testados e são compatíveis com o backend implementado. Use `withCredentials: true` (Axios) ou `credentials: 'include'` (Fetch) para incluir cookies de sessão automaticamente.