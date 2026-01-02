# 📋 INSTRUÇÕES DNS - Configurar admin.gdse.ao

## 🎯 **OBJETIVO**
Configurar o subdomínio `admin.gdse.ao` para apontar para o servidor AWS onde está o painel administrativo.

## 🌐 **CONFIGURAÇÃO DNS NECESSÁRIA**

### **1. Acessar o Painel DNS do Registrador**
- Faça login no painel onde você gerencia o domínio `gdse.ao`
- Acesse a seção de **DNS** ou **Gerenciamento de DNS**

### **2. Adicionar Registro A para admin.gdse.ao**

```dns
Tipo: A
Nome: admin
Valor: 34.229.89.26
TTL: 300 (ou menor para propagação rápida)
```

**Exemplo de configuração:**
```
admin.gdse.ao   IN   A   34.229.89.26
```

### **3. Verificar Configuração Atual**

Antes de adicionar, verifique se já existe algum registro:
```bash
nslookup admin.gdse.ao
dig admin.gdse.ao
```

### **4. Configuração Completa Recomendada**

```dns
# Domínio principal (seu site)
@               IN   A       <IP_DO_SEU_SITE_PRINCIPAL>
www             IN   CNAME   gdse.ao

# Subdomínios do sistema
admin           IN   A       34.229.89.26
api             IN   A       34.229.89.26

# Opcional: wildcard para outros subdomínios
*               IN   A       34.229.89.26
```

## ⏱️ **TEMPO DE PROPAGAÇÃO**
- **Mínimo**: 5-15 minutos
- **Máximo**: 48 horas (dependendo do TTL)
- **Recomendado**: Aguardar 30 minutos antes de configurar SSL

## 🧪 **TESTES DE VERIFICAÇÃO**

### **1. Teste DNS Local**
```bash
# Teste se o DNS está resolvendo
nslookup admin.gdse.ao

# Deve retornar:
# Name: admin.gdse.ao
# Address: 34.229.89.26
```

### **2. Teste HTTP**
```bash
# Teste se o servidor responde
curl -I http://admin.gdse.ao

# Deve retornar HTTP 200 ou redirecionamento
```

### **3. Teste Online**
- Use ferramentas como: https://dnschecker.org/
- Pesquise por: `admin.gdse.ao`
- Tipo: `A`
- Deve mostrar: `34.229.89.26`

## 🔧 **APÓS PROPAGAÇÃO DNS**

Quando o DNS estiver propagado (teste com `nslookup admin.gdse.ao`), execute no servidor:

```bash
# Conectar ao servidor
ssh -i sagrada-key.pem ubuntu@34.229.89.26

# Configurar SSL para admin.gdse.ao
sudo certbot --nginx -d admin.gdse.ao

# Aplicar configuração nginx final
sudo cp nginx-admin.conf /etc/nginx/sites-available/admin.gdse.ao
sudo ln -sf /etc/nginx/sites-available/admin.gdse.ao /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

## ✅ **RESULTADO FINAL ESPERADO**

Após a configuração completa:
- **✅ DNS**: `admin.gdse.ao` → `34.229.89.26`
- **✅ HTTP**: `http://admin.gdse.ao` → Redirecionamento para HTTPS
- **✅ HTTPS**: `https://admin.gdse.ao` → Painel Administrativo
- **✅ SSL**: Certificado Let's Encrypt válido

## 🚨 **IMPORTANTE**

1. **Configure o DNS PRIMEIRO** antes de tentar o SSL
2. **Aguarde a propagação** (teste com nslookup)
3. **Só configure SSL** após confirmação do DNS
4. **Mantenha TTL baixo** (300) durante configuração

## 📞 **SUPORTE**

Após configurar o DNS, confirme que está funcionando:
```bash
nslookup admin.gdse.ao
```

Se retornar `34.229.89.26`, pode prosseguir com o SSL! 🎉