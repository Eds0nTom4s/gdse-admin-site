# Instruções para Configurar Frontend - Backend AWS
=====================================================

## 🌐 **Informações do Backend AWS**

### URLs do Backend:
- **API Base URL**: `http://34.229.89.26:8080`
- **API via Nginx**: `http://34.229.89.26`
- **Health Check**: `http://34.229.89.26:8080/actuator/health`
- **Swagger UI**: `http://34.229.89.26:8080/swagger-ui.html`
- **Mídia S3**: `https://sagradaesperanca-media.s3.amazonaws.com/`

---

## 🚀 **Configuração para Diferentes Frameworks**

### 1. **React / Next.js**

#### `.env.local` ou `.env.production`:
```env
# Backend AWS
NEXT_PUBLIC_API_BASE_URL=http://34.229.89.26:8080
NEXT_PUBLIC_API_URL=http://34.229.89.26:8080/api
NEXT_PUBLIC_MEDIA_URL=https://sagradaesperanca-media.s3.amazonaws.com

# Se usando autenticação
NEXTAUTH_URL=http://34.229.89.26
NEXTAUTH_SECRET=seu_secret_aqui
```

#### Exemplo de configuração de API:
```javascript
// utils/api.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://34.229.89.26:8080';
const MEDIA_BASE_URL = process.env.NEXT_PUBLIC_MEDIA_URL || 'https://sagradaesperanca-media.s3.amazonaws.com';

export const api = {
  baseURL: API_BASE_URL,
  mediaURL: MEDIA_BASE_URL,
  
  // Métodos de API
  async get(endpoint) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}` // se usando auth
      }
    });
    return response.json();
  },
  
  async post(endpoint, data) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(data)
    });
    return response.json();
  }
};

// Helper para URLs de mídia
export const getMediaUrl = (filename) => {
  return `${MEDIA_BASE_URL}/${filename}`;
};
```

---

### 2. **Vue.js / Nuxt.js**

#### `.env`:
```env
# Backend AWS
VUE_APP_API_BASE_URL=http://34.229.89.26:8080
VUE_APP_MEDIA_URL=https://sagradaesperanca-media.s3.amazonaws.com
```

#### Configuração Axios:
```javascript
// plugins/axios.js
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL || 'http://34.229.89.26:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
```

---

### 3. **Angular**

#### `environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://34.229.89.26:8080',
  mediaUrl: 'https://sagradaesperanca-media.s3.amazonaws.com'
};
```

#### `environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  apiUrl: 'http://34.229.89.26:8080',
  mediaUrl: 'https://sagradaesperanca-media.s3.amazonaws.com'
};
```

#### Service exemplo:
```typescript
// services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;
  private mediaUrl = environment.mediaUrl;

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  get(endpoint: string) {
    return this.http.get(`${this.apiUrl}${endpoint}`, { 
      headers: this.getHeaders() 
    });
  }

  getMediaUrl(filename: string): string {
    return `${this.mediaUrl}/${filename}`;
  }
}
```

---

### 4. **Vanilla JavaScript / HTML**

#### `config.js`:
```javascript
// config/config.js
const CONFIG = {
  API_BASE_URL: 'http://34.229.89.26:8080',
  MEDIA_BASE_URL: 'https://sagradaesperanca-media.s3.amazonaws.com',
  
  // Headers padrão
  getHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  },
  
  // Helper para URLs de mídia
  getMediaUrl(filename) {
    return `${this.MEDIA_BASE_URL}/${filename}`;
  }
};

// Função para fazer requests
async function apiRequest(endpoint, options = {}) {
  const url = `${CONFIG.API_BASE_URL}${endpoint}`;
  const defaultOptions = {
    headers: CONFIG.getHeaders()
  };
  
  const response = await fetch(url, { ...defaultOptions, ...options });
  return response.json();
}
```

---

## 🔐 **Configuração de CORS**

O backend já está configurado para aceitar requisições de qualquer origem em desenvolvimento. Para produção, você pode configurar domínios específicos.

### Se precisar ajustar CORS no backend:
```yaml
# application-prod.yml
web:
  cors:
    allowed-origins: 
      - "http://seu-frontend.com"
      - "https://seu-frontend.com"
    allowed-methods: "*"
    allowed-headers: "*"
```

---

## 📁 **Estrutura de Endpoints da API**

### Endpoints principais disponíveis:

```
GET  /api/clube                    # Informações do clube
GET  /api/direcao                  # Diretoria
GET  /api/jogadores                # Lista de jogadores
GET  /api/noticias                 # Notícias
GET  /api/galeria                  # Galeria de fotos
POST /api/auth/login               # Login
POST /api/auth/register            # Registro

# Endpoints de mídia
GET  /api/media/upload             # Upload de arquivos
GET  /api/media/{filename}         # Buscar arquivo específico
```

### Estrutura de resposta padrão:
```json
{
  "success": true,
  "data": {...},
  "message": "Operação realizada com sucesso"
}
```

### Estrutura de erro:
```json
{
  "error": "Descrição do erro",
  "status": 400,
  "timestamp": "2025-10-03T00:00:00.000Z"
}
```

---

## 🖼️ **Trabalhando com Mídia (Imagens/Vídeos)**

### URLs de mídia no S3:
```javascript
// Exemplo para exibir imagens
const imageSrc = `https://sagradaesperanca-media.s3.amazonaws.com/galeria/${nomeArquivo}`;

// Estrutura de pastas no S3:
// - /clube/          # Logos e imagens do clube
// - /direcao/        # Fotos da diretoria
// - /jogadores/      # Fotos dos jogadores
// - /galeria/        # Galeria de fotos
// - /noticias/       # Imagens das notícias
```

### Exemplo de componente de imagem:
```jsx
// React component
const MediaImage = ({ folder, filename, alt, className }) => {
  const imageUrl = `https://sagradaesperanca-media.s3.amazonaws.com/${folder}/${filename}`;
  
  return (
    <img 
      src={imageUrl} 
      alt={alt}
      className={className}
      onError={(e) => {
        e.target.src = '/images/placeholder.png'; // Fallback
      }}
    />
  );
};
```

---

## 🔄 **Exemplo de Integração Completa**

### React Hook para API:
```jsx
// hooks/useApi.js
import { useState, useEffect } from 'react';

const API_BASE = 'http://34.229.89.26:8080';

export const useApi = (endpoint) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}${endpoint}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  return { data, loading, error };
};

// Uso do hook
const JogadoresComponent = () => {
  const { data, loading, error } = useApi('/api/jogadores');

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      {data?.data?.map(jogador => (
        <div key={jogador.id}>
          <h3>{jogador.nome}</h3>
          <img 
            src={`https://sagradaesperanca-media.s3.amazonaws.com/jogadores/${jogador.foto}`}
            alt={jogador.nome}
          />
        </div>
      ))}
    </div>
  );
};
```

---

## ⚙️ **Configurações de Produção**

### 1. **HTTPS (Recomendado)**
Para produção, configure SSL/TLS:
- Use CloudFront + ACM para HTTPS gratuito
- Configure Route 53 para domínio personalizado
- Atualize URLs para `https://`

### 2. **Variáveis de Ambiente por Ambiente**
```javascript
// config/environments.js
const environments = {
  development: {
    API_URL: 'http://localhost:8080',
    MEDIA_URL: 'http://localhost:8080'
  },
  staging: {
    API_URL: 'http://34.229.89.26:8080',
    MEDIA_URL: 'https://sagradaesperanca-media.s3.amazonaws.com'
  },
  production: {
    API_URL: 'https://api.sagradaesperanca.com',
    MEDIA_URL: 'https://media.sagradaesperanca.com'
  }
};

export const config = environments[process.env.NODE_ENV || 'development'];
```

---

## 🧪 **Testando a Integração**

### 1. **Teste básico de conectividade**:
```bash
# Testar se API está respondendo
curl http://34.229.89.26:8080/actuator/health

# Testar endpoint específico
curl http://34.229.89.26:8080/api/clube
```

### 2. **Teste no navegador**:
```javascript
// Abra o console do navegador e teste:
fetch('http://34.229.89.26:8080/api/clube')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Erro:', error));
```

---

## 🚨 **Troubleshooting**

### Problemas comuns:

1. **CORS Error**:
   - Verifique se o backend está configurado para aceitar seu domínio
   - Use proxy no desenvolvimento se necessário

2. **Network Error**:
   - Verifique se o IP/URL está correto
   - Teste conectividade com ping/curl

3. **401 Unauthorized**:
   - Verifique se o token está sendo enviado corretamente
   - Confirme se o usuário está autenticado

4. **404 Not Found**:
   - Confirme os endpoints disponíveis no Swagger UI
   - Verifique a estrutura da URL

---

## 📞 **Suporte**

Para dúvidas ou problemas:
1. Consulte o Swagger UI: `http://34.229.89.26:8080/swagger-ui.html`
2. Verifique logs do backend: `docker compose logs -f app`
3. Teste endpoints com Postman ou curl

**Frontend configurado com sucesso! 🎉**