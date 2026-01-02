# 🚀 SOLUÇÃO TEMPORÁRIA - HTTP Backend

## ✅ **Solução Imediata: Use HTTP Backend**

O problema é o **certificado SSL auto-assinado**. Navegadores bloqueiam requisições CORS para certificados inválidos.

**Solução**: Configure frontend para usar HTTP backend (alguns navegadores permitem para desenvolvimento).

---

## 🔧 **Configuração Frontend - IMEDIATA**

### **1. Variável de Ambiente Vercel:**
```bash
# Em vez de HTTPS, use HTTP:
NUXT_PUBLIC_API_BASE_URL=http://34.229.89.26:8080
```

### **2. Código de Requisição:**
```typescript
// composables/useApi.ts
const apiCall = async (endpoint: string, options: any = {}) => {
  return await $fetch(endpoint, {
    baseURL: 'http://34.229.89.26:8080',  // HTTP!
    credentials: 'include',
    ...options
  })
}
```

### **3. Deploy Vercel:**
```bash
# Configure a variável e redeploy:
vercel env add NUXT_PUBLIC_API_BASE_URL
# Valor: http://34.229.89.26:8080
vercel --prod
```

---

## 🧪 **Teste Navegador**

### **JavaScript Console Test:**
```javascript
// Teste direto no console da aplicação Vercel:
fetch('http://34.229.89.26:8080/api/jogadores', {
  method: 'GET',
  credentials: 'include'
}).then(r => r.json()).then(console.log);
```

### **Se der erro Mixed Content:**
1. Navegador pode bloquear HTTPS→HTTP
2. Testar em modo desenvolvimento local
3. Ou implementar certificado SSL válido

---

## 🛠️ **Se HTTP Não Funcionar (Plan B)**

### **Certificado SSL Válido com ngrok:**

1. **Instalar ngrok:**
   ```bash
   ssh -i sagrada-key.pem ubuntu@34.229.89.26 "wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz && tar xvzf ngrok-v3-stable-linux-amd64.tgz"
   ```

2. **Expor backend com SSL:**
   ```bash
   ./ngrok http 8080
   ```

3. **Usar URL ngrok (HTTPS válido):**
   ```
   NUXT_PUBLIC_API_BASE_URL=https://xyz.ngrok.io
   ```

---

## 📋 **URLs de Teste**

### **HTTP (Tente primeiro):**
- **Backend**: `http://34.229.89.26:8080`
- **Teste**: `http://34.229.89.26:8080/api/jogadores`

### **HTTPS Problemático:**
- **Backend**: `https://34.229.89.26` (certificado auto-assinado)
- **Problema**: Navegador bloqueia certificado inválido

---

## 🎯 **Próximos Passos**

1. **✅ PRIMEIRO**: Configurar frontend para HTTP
2. **🧪 TESTE**: Verificar se funciona
3. **🔄 SE FALHAR**: Implementar ngrok ou SSL válido

### **Commands Frontend:**
```bash
# Configurar variável ambiente Vercel:
vercel env add NUXT_PUBLIC_API_BASE_URL
# Valor: http://34.229.89.26:8080

# Redeploy:
vercel --prod
```

**Esta solução deve funcionar imediatamente! 🚀**