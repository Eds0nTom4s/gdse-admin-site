#!/bin/bash

# Script de deploy do frontend
echo "🚀 Iniciando deploy do frontend..."

# Configurações
APP_NAME="gdse-frontend"
PORT=3000

echo "📦 Fazendo build da aplicação..."
npm run build

echo "🐳 Parando container anterior (se existir)..."
docker stop $APP_NAME 2>/dev/null || true
docker rm $APP_NAME 2>/dev/null || true

echo "🔨 Construindo nova imagem Docker..."
docker build -t $APP_NAME .

echo "🚀 Iniciando novo container..."
docker run -d \
  --name $APP_NAME \
  -p $PORT:3000 \
  --env-file .env \
  --restart unless-stopped \
  $APP_NAME

echo "✅ Deploy concluído!"
echo "🌐 Frontend disponível em: http://localhost:$PORT"

# Verificar se o container está rodando
sleep 3
if docker ps | grep -q $APP_NAME; then
    echo "✅ Container está rodando corretamente"
    docker logs $APP_NAME --tail 10
else
    echo "❌ Erro: Container não está rodando"
    docker logs $APP_NAME
    exit 1
fi