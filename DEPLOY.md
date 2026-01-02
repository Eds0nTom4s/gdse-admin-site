# 🚀 Guia de Deploy do Frontend

## Pré-requisitos
- Docker instalado
- Docker Compose instalado
- Acesso ao servidor de produção

## 🛠️ Deploy Local com Docker

### Opção 1: Script de Deploy Automatizado
```bash
./deploy.sh
```

### Opção 2: Docker Compose
```bash
# Build e iniciar
docker-compose up --build -d

# Parar
docker-compose down

# Ver logs
docker-compose logs -f frontend
```

### Opção 3: Docker Manual
```bash
# Build da imagem
docker build -t gdse-frontend .

# Executar container
docker run -d \
  --name gdse-frontend \
  -p 3000:3000 \
  --env-file .env \
  gdse-frontend
```

## 🌐 Deploy em Servidor de Produção

### 1. Preparar servidor
```bash
# Fazer upload dos arquivos
scp -r . user@servidor:/path/to/app/

# Conectar ao servidor
ssh user@servidor
cd /path/to/app/
```

### 2. Configurar variáveis de ambiente
```bash
# Criar .env para produção
echo "NUXT_PUBLIC_API_BASE_URL=http://34.229.89.26:8080" > .env
echo "NODE_ENV=production" >> .env
```

### 3. Deploy
```bash
# Executar deploy
./deploy.sh

# OU usar docker-compose
docker-compose up --build -d
```

## 🔧 Configurações de Produção

### Nginx (Opcional - Proxy Reverso)
```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### SSL com Let's Encrypt
```bash
# Instalar certbot
sudo apt install certbot python3-certbot-nginx

# Obter certificado
sudo certbot --nginx -d seu-dominio.com
```

## 📊 Monitoramento

### Verificar Status
```bash
# Status do container
docker ps | grep gdse-frontend

# Logs em tempo real
docker logs -f gdse-frontend

# Uso de recursos
docker stats gdse-frontend
```

### Health Check
```bash
# Testar se aplicação está respondendo
curl http://localhost:3000

# Verificar endpoint específico
curl http://localhost:3000/login
```

## 🔄 Atualizações

### Deploy de Nova Versão
```bash
# Pull do código atualizado
git pull origin main

# Rebuild e redeploy
./deploy.sh
```

### Rollback
```bash
# Voltar para versão anterior do git
git checkout HEAD~1

# Redeploy
./deploy.sh
```

## 🛠️ Troubleshooting

### Container não inicia
```bash
# Verificar logs
docker logs gdse-frontend

# Verificar imagem
docker images | grep gdse-frontend
```

### Erro de conectividade com backend
```bash
# Testar conectividade
curl http://34.229.89.26:8080/actuator/health

# Verificar variáveis de ambiente
docker exec gdse-frontend env | grep API
```

### Problemas de performance
```bash
# Verificar recursos
docker stats gdse-frontend

# Analisar logs
docker logs gdse-frontend | tail -100
```

## 📱 URLs Importantes

- **Frontend**: http://localhost:3000
- **Backend API**: http://34.229.89.26:8080
- **Swagger**: http://34.229.89.26:8080/swagger-ui.html
- **Health Check**: http://34.229.89.26:8080/actuator/health

## 🔐 Segurança

### Recomendações
1. Use HTTPS em produção
2. Configure firewall adequadamente
3. Mantenha Docker atualizado
4. Use variáveis de ambiente para secrets
5. Configure backup regular

### Variáveis Sensíveis
```bash
# Não commitar no git
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
echo ".env.production" >> .gitignore
```