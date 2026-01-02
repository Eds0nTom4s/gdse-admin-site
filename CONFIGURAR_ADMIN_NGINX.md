# 🚀 CONFIGURAÇÃO NGINX - admin.gdse.ao

## 📋 **INSTRUÇÕES PARA EQUIPE BACKEND**

### **1. 📦 Download do Build do Frontend**

```bash
# SSH no servidor AWS
ssh -i sagrada-key.pem ubuntu@34.229.89.26

# Criar diretório para o admin
sudo mkdir -p /var/www/admin.gdse.ao

# Dar permissões adequadas
sudo chown -R ubuntu:ubuntu /var/www/admin.gdse.ao
```

### **2. 📂 Transferir Build do Frontend**

**Do computador local (onde está o projeto):**

```bash
# Build do projeto
npm run build

# Compactar arquivos do build
cd .output/public
tar -czf admin-build.tar.gz *

# Transferir para servidor
scp -i sagrada-key.pem admin-build.tar.gz ubuntu@34.229.89.26:/home/ubuntu/

# SSH no servidor e extrair
ssh -i sagrada-key.pem ubuntu@34.229.89.26
cd /home/ubuntu
sudo tar -xzf admin-build.tar.gz -C /var/www/admin.gdse.ao/
sudo chown -R www-data:www-data /var/www/admin.gdse.ao
```

### **3. 🌐 Configurar NGINX Virtual Host**

```bash
# Criar configuração para admin.gdse.ao
sudo nano /etc/nginx/sites-available/admin.gdse.ao
```

**Conteúdo do arquivo:**

```nginx
server {
    listen 80;
    server_name admin.gdse.ao;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name admin.gdse.ao;
    
    # Diretório do frontend
    root /var/www/admin.gdse.ao;
    index index.html;
    
    # SSL Let's Encrypt (será configurado)
    ssl_certificate /etc/letsencrypt/live/admin.gdse.ao/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/admin.gdse.ao/privkey.pem;
    
    # SSL Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;
    
    # Configuração para SPA (Single Page Application)
    location / {
        try_files $uri $uri/ /index.html;
        
        # Headers de segurança
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
        
        # Cache para arquivos estáticos
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # API Proxy (opcional, caso queira proxy para backend)
    location /api/ {
        proxy_pass http://localhost:8080/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Logs
    access_log /var/log/nginx/admin.gdse.ao.access.log;
    error_log /var/log/nginx/admin.gdse.ao.error.log;
}
```

### **4. 🔐 Configurar SSL para admin.gdse.ao**

```bash
# Ativar site
sudo ln -s /etc/nginx/sites-available/admin.gdse.ao /etc/nginx/sites-enabled/

# Testar configuração
sudo nginx -t

# Gerar certificado SSL
sudo certbot --nginx -d admin.gdse.ao

# Reiniciar nginx
sudo systemctl reload nginx
```

### **5. 🎯 DNS - Configurar admin.gdse.ao**

**No painel DNS (onde configurou gdse.ao):**

```dns
# Adicionar registro A
A    admin    34.229.89.26
```

### **6. 🧪 Testes de Validação**

```bash
# Testar resolução DNS
nslookup admin.gdse.ao

# Testar HTTP
curl -I http://admin.gdse.ao

# Testar HTTPS
curl -I https://admin.gdse.ao

# Testar carregamento da página
curl -s https://admin.gdse.ao | grep -i "painel"
```

### **7. 🔄 Script de Deploy Automático** (Opcional)

```bash
# Criar script de deploy
sudo nano /opt/deploy-admin.sh
```

**Conteúdo:**

```bash
#!/bin/bash
echo "🚀 Deploy do Painel Administrativo"

# Backup atual
sudo cp -r /var/www/admin.gdse.ao /var/www/admin.gdse.ao.backup.$(date +%Y%m%d_%H%M%S)

# Extrair novo build
cd /home/ubuntu
sudo tar -xzf admin-build.tar.gz -C /var/www/admin.gdse.ao/
sudo chown -R www-data:www-data /var/www/admin.gdse.ao

# Reload nginx
sudo systemctl reload nginx

echo "✅ Deploy concluído!"
echo "🌐 Acesse: https://admin.gdse.ao"
```

```bash
# Dar permissão de execução
sudo chmod +x /opt/deploy-admin.sh
```

## 🎯 **RESULTADO FINAL**

Após estas configurações:

- ✅ **Frontend**: `https://admin.gdse.ao` (servido via nginx)
- ✅ **Backend**: `https://api.gdse.ao` (já funcionando)
- ✅ **SSL**: Certificados válidos para ambos
- ✅ **Performance**: Servido diretamente do servidor

## 📞 **CONFIRMAÇÃO NECESSÁRIA**

Favor confirmar quando:
1. ✅ Build transferido para `/var/www/admin.gdse.ao`
2. ✅ Virtual host nginx configurado
3. ✅ SSL configurado para `admin.gdse.ao`
4. ✅ DNS atualizado (A admin 34.229.89.26)

**Depois disso, `https://admin.gdse.ao` funcionará perfeitamente! 🚀**