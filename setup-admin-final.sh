#!/bin/bash

# Script para configurar admin.gdse.ao APÓS propagação DNS
# Execute SOMENTE depois que o DNS estiver funcionando: nslookup admin.gdse.ao

echo "🔍 Verificando se DNS está propagado..."

# Verificar se admin.gdse.ao resolve para o IP correto
DNS_RESULT=$(nslookup admin.gdse.ao | grep "Address:" | tail -1 | awk '{print $2}')
EXPECTED_IP="34.229.89.26"

if [ "$DNS_RESULT" != "$EXPECTED_IP" ]; then
    echo "❌ DNS ainda não propagado!"
    echo "   Encontrado: $DNS_RESULT"
    echo "   Esperado: $EXPECTED_IP"
    echo ""
    echo "⏳ Aguarde a propagação DNS e tente novamente:"
    echo "   nslookup admin.gdse.ao"
    exit 1
fi

echo "✅ DNS propagado corretamente!"
echo "🚀 Iniciando configuração completa..."

# Extrair arquivos se ainda não foram extraídos
if [ ! -d "/var/www/admin.gdse.ao" ]; then
    echo "📦 Extraindo arquivos do painel..."
    sudo mkdir -p /var/www/admin.gdse.ao
    sudo tar -xzf admin-panel.tar.gz -C /var/www/admin.gdse.ao --strip-components=1
    sudo chown -R www-data:www-data /var/www/admin.gdse.ao
    sudo chmod -R 755 /var/www/admin.gdse.ao
fi

# Configurar SSL com Let's Encrypt
echo "🔒 Configurando SSL para admin.gdse.ao..."
sudo certbot --nginx -d admin.gdse.ao --non-interactive --agree-tos --email admin@gdse.ao

# Verificar se SSL foi criado com sucesso
if [ -f "/etc/letsencrypt/live/admin.gdse.ao/fullchain.pem" ]; then
    echo "✅ SSL configurado com sucesso!"
    
    # Aplicar configuração nginx com SSL
    echo "🔧 Aplicando configuração nginx final..."
    sudo cp nginx-admin.conf /etc/nginx/sites-available/admin.gdse.ao
    sudo ln -sf /etc/nginx/sites-available/admin.gdse.ao /etc/nginx/sites-enabled/
    
    # Testar configuração
    sudo nginx -t
    if [ $? -eq 0 ]; then
        sudo systemctl reload nginx
        echo "🎉 Deploy concluído com sucesso!"
        echo ""
        echo "✅ URLs disponíveis:"
        echo "   🏠 Painel Admin: https://admin.gdse.ao"
        echo "   ⚙️  Backend API: https://api.gdse.ao"
        echo ""
        echo "🧪 Teste final:"
        echo "   curl -I https://admin.gdse.ao"
    else
        echo "❌ Erro na configuração nginx!"
    fi
else
    echo "❌ Falha na configuração SSL!"
    echo "   Verifique se o DNS está acessível pela internet"
    echo "   Teste: curl -I http://admin.gdse.ao"
fi