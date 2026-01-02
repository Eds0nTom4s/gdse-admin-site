# 🚨 ATUALIZAÇÃO CORS URGENTE - Nova URL Vercel

## ❌ **Problema Atual**
A nova URL da Vercel mudou e o backend precisa adicionar ao CORS:

```
Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at https://34.229.89.26/api/auth/login. (Reason: CORS request did not succeed).
```

## 🆕 **Nova URL da Vercel**
```
https://gdse-admin-site-c7rm7j6ky-centraltecs-projects.vercel.app
```

## 🔧 **Ação Necessária no Backend**

### **Adicionar ao CORS:**
```java
.allowedOriginPatterns(
    "https://gdse-admin-site-c7rm7j6ky-centraltecs-projects.vercel.app",  // ✅ NOVA URL
    "https://*.vercel.app",        // ✅ Wildcard para futuras URLs
    "http://localhost:3000",       // ✅ Desenvolvimento local
    "http://localhost:5173",
    "http://34.229.89.26:8080",    // ✅ AWS HTTP
    "https://34.229.89.26"         // ✅ AWS HTTPS
)
.allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
.allowedHeaders("*")
.allowCredentials(true)  // ✅ Importante para cookies/sessão
.maxAge(3600);
```

### **Ou em application.yml:**
```yaml
web:
  cors:
    allowed-origins:
      - "https://gdse-admin-site-c7rm7j6ky-centraltecs-projects.vercel.app"  # NOVA URL
      - "https://*.vercel.app"        # Wildcard para futuras URLs
      - "http://localhost:3000"       # Dev local
      - "http://localhost:5173" 
      - "http://34.229.89.26:8080"    # AWS HTTP
      - "https://34.229.89.26"        # AWS HTTPS
    allowed-methods: "*"
    allowed-headers: "*"
    allow-credentials: true
    max-age: 3600
```

## 🧪 **Teste Após Atualização**

### **Comando de teste:**
```bash
curl -H "Origin: https://gdse-admin-site-c7rm7j6ky-centraltecs-projects.vercel.app" \
     -H "Access-Control-Request-Method: POST" \
     -X OPTIONS \
     https://34.229.89.26/api/auth/login
```

### **Resposta esperada:**
```
Access-Control-Allow-Origin: https://gdse-admin-site-c7rm7j6ky-centraltecs-projects.vercel.app
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
```

## 🎯 **URLs de Referência**

### **Frontend Atual:**
- **Produção**: https://gdse-admin-site-c7rm7j6ky-centraltecs-projects.vercel.app
- **Dashboard**: https://vercel.com/centraltecs-projects/gdse-admin-site

### **Backend:**
- **HTTPS**: https://34.229.89.26
- **HTTP**: http://34.229.89.26:8080

## ⚡ **Urgência**
**Alta** - Aplicação não funciona sem esta correção CORS.

## 📞 **Verificação**
Após a atualização, favor testar:
1. Acessar a URL da aplicação
2. Tentar fazer login
3. Verificar se não há erros CORS no console

**Obrigado! 🙏**