# ❓ Dúvidas sobre Discrepâncias - Backend GDSE

**Data:** 01/10/2025  
**Status:** 🔄 AGUARDANDO ESCLARECIMENTOS

---

## 📋 Resumo

A documentação fornecida em `RESPOSTAS_EQUIPE_FRONTEND.md` respondeu a maioria das questões, mas identificamos **4 discrepâncias importantes** que precisam ser esclarecidas antes de finalizar a implementação do frontend.

---

## ❓ **Discrepância #1: Formato da Resposta do Login**

### **Conflito Identificado:**

**📄 Documentação Original (`resposta_frontend.md`):**
```json
{
  "id": 1,
  "nome": "Administrator", 
  "email": "admin@sagradaesperanca.com",
  "username": "admin",
  "papel": "ADMIN",
  "ativo": true,
  "criadoEm": "2024-01-01T10:00:00"
}
```

**📄 Nova Documentação (`RESPOSTAS_EQUIPE_FRONTEND.md`):**
```json
{
  "success": true,
  "message": "Login realizado com sucesso"
}
```

### **❓ PERGUNTA:**
1. **Qual é o formato correto da resposta do `/api/auth/login`?**
2. **O login realmente retorna apenas `success/message` e os dados do usuário vêm exclusivamente do `/api/auth/status`?**
3. **Isso significa que precisamos fazer 2 chamadas (login + status) para obter os dados do usuário?**

### **💡 Impacto no Frontend:**
- Se o login retorna apenas success, precisamos ajustar o fluxo para fazer 2 calls
- Isso muda a lógica do composable `useAuth`

---

## ❓ **Discrepância #2: Múltiplos Endpoints de Status**

### **Nova Informação:**
A documentação menciona **3 endpoints** para verificar status:

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/auth/status` | GET | Principal |
| `/api/auth/me` | GET | Alias para status |
| `/api/auth/check` | POST | Alias para status |

### **❓ PERGUNTAS:**
1. **Qual endpoint devemos usar como padrão no frontend?**
2. **Todos os 3 retornam exatamente o mesmo formato de resposta?**
3. **Por que `/api/auth/check` é POST e os outros GET? Há diferença funcional?**
4. **Qual é mais performático/recomendado?**

### **💡 Impacto no Frontend:**
- Precisamos escolher um endpoint consistente
- Padronizar em todo o código

---

## ❓ **Discrepância #3: Problema do Campo "papel"**

### **Problema Identificado:**
A documentação menciona:

> "📝 NOTA: O campo `papel` estava retornando "UNKNOWN" temporariamente - isso já foi identificado e será corrigido na próxima versão."

### **❓ PERGUNTAS:**
1. **Este problema já foi corrigido ou ainda existe?**
2. **Se ainda não foi corrigido, quando será?**
3. **Como o frontend deve tratar usuários com papel "UNKNOWN"?**
4. **Existe algum workaround temporário?**
5. **Existe um endpoint alternativo que retorna o papel correto?**

### **💡 Impacto no Frontend:**
- Sistema de permissões pode não funcionar
- Páginas podem ser inacessíveis se o papel estiver incorreto
- Precisamos de tratamento de fallback

---

## ❓ **Discrepância #4: Teste de Conectividade**

### **Conflito entre Teste e Documentação:**

**🧪 Nosso Teste (PowerShell):**
```powershell
# Login - SUCESSO ✅
POST http://localhost:8080/api/auth/login
Body: username=admin&password=admin123
Response: {"success": true, "message": "Login realizado com sucesso"}

# Status - ERRO ❌
GET http://localhost:8080/api/auth/status
Response: Error 500 - Internal Server Error
```

**📄 Documentação Afirma:**
```
✅ RESPOSTA (200):
{
  "ativo": true,
  "criadoEm": "01/10/2025 13:20:43",
  "nome": "Administrador Teste",
  "id": 2,
  "email": "admin@gdse.com",
  "papel": "ADMIN",
  "username": "admin"
}
```

### **❓ PERGUNTAS:**
1. **Vocês podem confirmar executando exatamente estes comandos?**
```bash
curl -c cookies.txt -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin&password=admin123"

curl -b cookies.txt -X GET http://localhost:8080/api/auth/status
```

2. **O erro 500 ainda existe ou foi resolvido?**
3. **Há logs no backend mostrando o erro específico?**
4. **Outros endpoints de status (`/api/auth/me`) funcionam?**

### **💡 Impacto no Frontend:**
- Não conseguimos implementar o sistema de autenticação se o endpoint principal falha
- Bloqueio total do desenvolvimento

---

## 🧪 **Testes Sugeridos para Validação**

### **Teste Completo com cURL:**
```bash
# 1. Login e salvar cookies
curl -c cookies.txt -v -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin&password=admin123"

# 2. Testar todos os endpoints de status
curl -b cookies.txt -v http://localhost:8080/api/auth/status
curl -b cookies.txt -v http://localhost:8080/api/auth/me
curl -b cookies.txt -v -X POST http://localhost:8080/api/auth/check

# 3. Testar endpoint protegido
curl -b cookies.txt -v http://localhost:8080/api/usuarios

# 4. Logout
curl -b cookies.txt -v -X POST http://localhost:8080/api/auth/logout

# 5. Verificar se sessão foi invalidada
curl -b cookies.txt -v http://localhost:8080/api/auth/status
```

### **Teste com Postman/JavaScript:**
```javascript
// Frontend pode usar este código para testar
const testAuth = async () => {
  try {
    // 1. Login
    const loginRes = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'username=admin&password=admin123',
      credentials: 'include'
    });
    console.log('Login:', await loginRes.json());
    
    // 2. Status
    const statusRes = await fetch('http://localhost:8080/api/auth/status', {
      credentials: 'include'
    });
    console.log('Status:', await statusRes.json());
    
  } catch (error) {
    console.error('Erro:', error);
  }
};
```

---

## 📊 **Impacto por Prioridade**

| Discrepância | Prioridade | Impacto | Bloqueante |
|--------------|------------|---------|------------|
| #4 - Conectividade | 🔴 CRÍTICA | Login não funciona | ✅ SIM |
| #1 - Formato Login | 🟡 ALTA | Mudança na implementação | ❌ NÃO |
| #3 - Campo "papel" | 🟡 ALTA | Sistema de permissões | ❌ NÃO |
| #2 - Múltiplos Endpoints | 🟢 MÉDIA | Escolha de implementação | ❌ NÃO |

---

## 🚦 **Próximos Passos**

### **Após Esclarecimentos:**
1. ✅ Ajustar serviço de autenticação conforme formato correto
2. ✅ Implementar tratamento de erros/fallbacks
3. ✅ Atualizar credenciais de teste
4. ✅ Testar integração completa
5. ✅ Finalizar sistema de autenticação

### **Se Não Recebermos Respostas:**
- Implementar com base na documentação atual
- Adicionar tratamentos de erro robustos
- Criar fallbacks para problemas conhecidos

---

## 📞 **Contato**

**Equipe Frontend aguarda esclarecimentos para:**
- ✅ Finalizar implementação de autenticação
- ✅ Garantir compatibilidade 100%
- ✅ Evitar retrabalho

**Tempo estimado após esclarecimentos:** 30-60 minutos para ajustes finais

---

**🎯 Objetivo:** Sistema de autenticação robusto e compatível com o backend GDSE** 🚀