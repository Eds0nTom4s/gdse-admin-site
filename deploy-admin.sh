#!/bin/bash

# Script de deploy para admin.gdse.ao
# Execute este script no servidor AWS

echo "🚀 Iniciando deploy do painel administrativo em admin.gdse.ao..."

# Criar diretório para o site
sudo mkdir -p /var/www/admin.gdse.ao

# Extrair arquivos estáticos
echo "📦 Extraindo arquivos..."
sudo tar -xzf admin-panel.tar.gz -C /var/www/admin.gdse.ao --strip-components=1

# Definir permissões corretas
sudo chown -R www-data:www-data /var/www/admin.gdse.ao
sudo chmod -R 755 /var/www/admin.gdse.ao

# Configurar SSL para admin.gdse.ao
echo "🔒 Configurando SSL..."
sudo certbot --nginx -d admin.gdse.ao --non-interactive --agree-tos --email admin@gdse.ao

# Copiar configuração nginx
sudo cp nginx-admin.conf /etc/nginx/sites-available/admin.gdse.ao

# Habilitar site
sudo ln -sf /etc/nginx/sites-available/admin.gdse.ao /etc/nginx/sites-enabled/

# Testar configuração nginx
echo "🔧 Testando configuração nginx..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Configuração nginx válida!"
    # Recarregar nginx
    sudo systemctl reload nginx
    echo "🎉 Deploy concluído com sucesso!"
    echo ""
    echo "URLs disponíveis:"
    echo "🏠 Frontend: https://admin.gdse.ao"
    echo "⚙️ Backend: https://api.gdse.ao"
    echo ""
    echo "🧪 Teste de acesso:"
    echo "curl -I https://admin.gdse.ao"
else
    echo "❌ Erro na configuração nginx!"
    echo "Verifique os logs: sudo nginx -t"
fi