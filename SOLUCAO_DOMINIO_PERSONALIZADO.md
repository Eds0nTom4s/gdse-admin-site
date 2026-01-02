# 🚀 SOLUÇÃO COMPLETA - Domínio Personalizado gdse.ao

## ✅ **Solução Definitiva com Domínio Personalizado**

Com o domínio `gdse.ao`, podemos resolver **todos** os problemas:
- ✅ **SSL válido** (Let's Encrypt gratuito)
- ✅ **CORS estável** (domínio fixo)
- ✅ **URLs profissionais**

---

## 🌐 **1. CONFIGURAÇÃO DNS (URGENTE)**

### **A. Frontend (Vercel) - gdse.ao**
No seu provedor DNS (`registar.ao`), configure:

```dns
# Opção A: Usar DNS da Vercel (Recomendado)
Nameservers:
  ns1.vercel-dns.com
  ns2.vercel-dns.com

# Opção B: Manter DNS atual e adicionar registro A
A Record:
  Nome: @
  Valor: 76.76.21.21
  TTL: 300
```

### **B. Backend (AWS) - api.gdse.ao**
```dns
# Adicionar subdomínio para API
A Record:
  Nome: api
  Valor: 34.229.89.26
  TTL: 300
```

---

## 🔧 **2. CONFIGURAÇÃO BACKEND AWS**

### **A. SSL com Let's Encrypt (Gratuito)**
```bash
# SSH no servidor AWS
ssh -i sagrada-key.pem ubuntu@34.229.89.26

# Instalar Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Obter certificado SSL gratuito
sudo certbot --nginx -d api.gdse.ao

# Verificar renovação automática
sudo certbot renew --dry-run
```

### **B. Configurar Nginx**
```nginx
# /etc/nginx/sites-available/default
server {
    listen 80;
    server_name api.gdse.ao;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name api.gdse.ao;
    
    ssl_certificate /etc/letsencrypt/live/api.gdse.ao/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.gdse.ao/privkey.pem;
    
    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### **C. CORS Backend**
```java
.allowedOriginPatterns(
    "https://gdse.ao",                // ✅ Domínio principal
    "https://*.gdse.ao",              // ✅ Subdomínios
    "https://*.vercel.app",           // ✅ Previews Vercel
    "http://localhost:3000",          // ✅ Dev local
    "https://34.229.89.26"            // ✅ IP direto
)
.allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
.allowedHeaders("*")
.allowCredentials(true)
.maxAge(3600);
```

---

## 🖥️ **3. CONFIGURAÇÃO FRONTEND**

### **A. Variáveis de Ambiente**
```env
# .env.production
NUXT_PUBLIC_API_BASE_URL=https://api.gdse.ao
NUXT_PUBLIC_MEDIA_URL=https://sagradaesperanca-media.s3.amazonaws.com
```

### **B. Vercel Config**
```json
{
  "env": {
    "NUXT_PUBLIC_API_BASE_URL": "https://api.gdse.ao"
  }
}
```

### **C. Nuxt Config**
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE_URL || 'https://api.gdse.ao',
      environment: process.env.NODE_ENV || 'development'
    }
  }
})
```

---

## 📋 **4. CRONOGRAMA DE IMPLEMENTAÇÃO**

### **Fase 1: DNS (Agora)**
1. ✅ **Vercel**: Domínio `gdse.ao` adicionado
2. 🔄 **DNS**: Configurar A record ou nameservers
3. ⏱️ **Aguardar**: Propagação DNS (até 24h)

### **Fase 2: Backend SSL (Após DNS)**
1. 🔧 **Nginx**: Configurar proxy reverso
2. 🔒 **Let's Encrypt**: Obter certificado SSL gratuito
3. 🧪 **Teste**: `https://api.gdse.ao/actuator/health`

### **Fase 3: Frontend (Final)**
1. 🌐 **URL**: Atualizar para `https://api.gdse.ao`
2. 🚀 **Deploy**: Nova versão
3. ✅ **Teste**: Aplicação completa

---

## 🎯 **URLS FINAIS**

### **Produção:**
- **Frontend**: `https://gdse.ao`
- **Backend**: `https://api.gdse.ao`
- **Swagger**: `https://api.gdse.ao/swagger-ui.html`
- **Health**: `https://api.gdse.ao/actuator/health`

### **Benefícios:**
- ✅ **SSL Válido**: Sem warnings de certificado
- ✅ **CORS Estável**: Domínio fixo
- ✅ **URLs Profissionais**: Marca própria
- ✅ **SEO**: Melhor para buscadores

---

## 🔍 **TESTE APÓS CONFIGURAÇÃO**

```javascript
// Console do navegador em https://gdse.ao
fetch('https://api.gdse.ao/api/jogadores')
  .then(r => r.json())
  .then(data => console.log('✅ Funcionando!', data));
```

---

## 📞 **PRÓXIMOS PASSOS IMEDIATOS**

1. **🌐 Configure DNS**: A record `76.76.21.21` para `gdse.ao`
2. **📋 Informe**: Quando DNS estiver propagado
3. **🔧 Configuro**: SSL no backend
4. **🚀 Deploy**: Versão final

**Esta é a solução definitiva e profissional! 🎉**