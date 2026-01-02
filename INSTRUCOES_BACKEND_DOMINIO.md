# 🚀 INSTRUÇÕES BACKEND - Domínio Personalizado gdse.ao

## ✅ **STATUS FRONTEND**
- ✅ Domínio `gdse.ao` configurado na Vercel
- ✅ DNS configurado e propagado
- 🔄 **Aguardando**: Configuração SSL backend

## 📋 **AÇÕES NECESSÁRIAS NO BACKEND**

### **1. 🔒 SSL Let's Encrypt - api.gdse.ao**

```bash
# SSH no servidor AWS
ssh -i sagrada-key.pem ubuntu@34.229.89.26

# Atualizar sistema
sudo apt update

# Instalar Certbot se não tiver
sudo apt install certbot python3-certbot-nginx -y

# Gerar certificado SSL para api.gdse.ao
sudo certbot --nginx -d api.gdse.ao

# Configurar renovação automática
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

### **2. 🌐 NGINX - Configuração HTTPS**

```nginx
# Editar: /etc/nginx/sites-available/default
# Ou criar novo arquivo: /etc/nginx/sites-available/api.gdse.ao

server {
    listen 80;
    server_name api.gdse.ao;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.gdse.ao;
    
    # SSL Let's Encrypt
    ssl_certificate /etc/letsencrypt/live/api.gdse.ao/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.gdse.ao/privkey.pem;
    
    # SSL Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;
    
    # Proxy para Spring Boot
    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port $server_port;
    }
}
```

### **3. 🔄 CORS - Atualizar Configuração**

```java
// CorsConfig.java ou SecurityConfig.java
@Override
public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**")
        .allowedOriginPatterns(
            "https://admin.gdse.ao",          // ✅ Frontend produção
            "https://gdse.ao",                // ✅ Domínio principal
            "https://*.vercel.app",           // ✅ Previews Vercel (manter)
            "http://localhost:3000",          // ✅ Dev local
            "http://localhost:5173",          // ✅ Vite dev
            "https://api.gdse.ao"             // ✅ Próprio domínio
        )
        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
        .allowedHeaders("*")
        .allowCredentials(true)
        .maxAge(3600);
}
```

### **4. 🔧 Comandos de Execução**

```bash
# Após configurar NGINX
sudo nginx -t                    # Testar configuração
sudo systemctl reload nginx      # Recarregar NGINX

# Após atualizar CORS
sudo systemctl restart spring-app
# OU se usando Docker:
docker-compose restart app
```

## 🧪 **TESTES DE VALIDAÇÃO**

### **1. Testar SSL:**
```bash
curl -I https://api.gdse.ao/actuator/health
# Deve retornar 200 OK com SSL válido
```

### **2. Testar CORS:**
```bash
curl -H "Origin: https://admin.gdse.ao" \
     -H "Access-Control-Request-Method: POST" \
     -X OPTIONS \
     https://api.gdse.ao/api/auth/login

# Deve retornar:
# Access-Control-Allow-Origin: https://admin.gdse.ao
# Access-Control-Allow-Credentials: true
```

### **3. Testar API:**
```bash
curl https://api.gdse.ao/api/jogadores
# Deve retornar dados JSON
```

## 🎯 **URLS FINAIS ESPERADAS**

- **🔗 Backend**: `https://api.gdse.ao`
- **📋 API**: `https://api.gdse.ao/api/*`
- **📖 Swagger**: `https://api.gdse.ao/swagger-ui.html`
- **❤️ Health**: `https://api.gdse.ao/actuator/health`

## ⚡ **PRIORIDADE: ALTA**

Após estas configurações:
1. **SSL válido** = Sem problemas de certificado
2. **CORS específico** = Sem erros de origem
3. **Domínio profissional** = `https://admin.gdse.ao` + `https://api.gdse.ao`

## 📞 **CONFIRMAÇÃO**

Favor confirmar quando:
- ✅ SSL configurado para `api.gdse.ao`
- ✅ CORS atualizado com novos domínios
- ✅ Serviços reiniciados

**Obrigado! 🙏**

---

**Frontend estará pronto para deploy final assim que o backend estiver configurado! 🚀**