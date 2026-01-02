# 🚨 CONFIGURAÇÃO URGENTE - CORS Backend

## ❌ **Problema Atual:**
```
Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at https://34.229.89.26/api/auth/status. (Reason: CORS request did not succeed).
```

## 🔧 **Solução - Configurar CORS no Backend**

### **Domínios que precisam ser adicionados ao CORS:**

1. **Produção Vercel**: `https://gdse-admin-site-d34luc9w7-centraltecs-projects.vercel.app`
2. **Vercel Preview**: `https://*.vercel.app` (wildcard para previews)
3. **Desenvolvimento local**: `http://localhost:3000` (manter existente)

---

## 🛠️ **Configuração Spring Boot**

### **1. Arquivo `application.yml` ou `application.properties`**

#### Para `application.yml`:
```yaml
web:
  cors:
    allowed-origins:
      - "http://localhost:3000"
      - "https://localhost:3000"
      - "https://gdse-admin-site-d34luc9w7-centraltecs-projects.vercel.app"
      - "https://*.vercel.app"
    allowed-methods: "*"
    allowed-headers: "*"
    allow-credentials: true
    max-age: 3600
```

#### Para `application.properties`:
```properties
web.cors.allowed-origins=http://localhost:3000,https://localhost:3000,https://gdse-admin-site-d34luc9w7-centraltecs-projects.vercel.app,https://*.vercel.app
web.cors.allowed-methods=*
web.cors.allowed-headers=*
web.cors.allow-credentials=true
web.cors.max-age=3600
```

### **2. Configuração Java (se usar classe Config)**

```java
@Configuration
@EnableWebSecurity
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOriginPatterns(
                "http://localhost:3000",
                "https://localhost:3000", 
                "https://gdse-admin-site-d34luc9w7-centraltecs-projects.vercel.app",
                "https://*.vercel.app"
            )
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true)
            .maxAge(3600);
    }
}
```

### **3. Se usar Spring Security (SecurityConfig)**

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        configuration.setAllowedOriginPatterns(Arrays.asList(
            "http://localhost:3000",
            "https://localhost:3000",
            "https://gdse-admin-site-d34luc9w7-centraltecs-projects.vercel.app",
            "https://*.vercel.app"
        ));
        
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors(cors -> cors.configurationSource(corsConfigurationSource()))
            // ... resto da configuração
            ;
        return http.build();
    }
}
```

---

## 🐳 **Se usar Docker Compose**

### **Adicionar variáveis de ambiente:**

```yaml
# docker-compose.yml
services:
  app:
    environment:
      - CORS_ALLOWED_ORIGINS=http://localhost:3000,https://localhost:3000,https://gdse-admin-site-d34luc9w7-centraltecs-projects.vercel.app,https://*.vercel.app
```

### **No código Spring:**

```java
@Value("${CORS_ALLOWED_ORIGINS:http://localhost:3000}")
private String[] allowedOrigins;

@Override
public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**")
        .allowedOriginPatterns(allowedOrigins)
        .allowedMethods("*")
        .allowedHeaders("*")
        .allowCredentials(true);
}
```

---

## 🚀 **Passos para Aplicar:**

### **1. Atualizar configuração CORS**
- Editar arquivo de configuração do Spring Boot
- Adicionar os novos domínios Vercel

### **2. Reiniciar o backend**
```bash
# Se usar Docker
docker-compose restart app

# Se usar JAR
sudo systemctl restart spring-app
```

### **3. Verificar se aplicou**
```bash
# Testar CORS
curl -H "Origin: https://gdse-admin-site-d34luc9w7-centraltecs-projects.vercel.app" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     https://34.229.89.26/api/auth/login
```

**Resposta esperada:**
```
Access-Control-Allow-Origin: https://gdse-admin-site-d34luc9w7-centraltecs-projects.vercel.app
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: *
Access-Control-Allow-Credentials: true
```

---

## ⚡ **Solução Temporária Urgente**

### **Se precisar de acesso imediato, configure wildcard:**

```yaml
web:
  cors:
    allowed-origins: "*"  # ⚠️ APENAS TEMPORÁRIO - não recomendado em produção
    allowed-methods: "*"
    allowed-headers: "*"
```

⚠️ **ATENÇÃO**: Wildcard (`*`) com `allow-credentials: true` não funciona. Use padrões específicos.

---

## 📞 **Verificação Após Configuração**

### **1. Teste manual:**
- Acesse: https://gdse-admin-site-d34luc9w7-centraltecs-projects.vercel.app
- Tente fazer login
- Verifique console do navegador

### **2. Teste via curl:**
```bash
curl -v -H "Origin: https://gdse-admin-site-d34luc9w7-centraltecs-projects.vercel.app" https://34.229.89.26/api/auth/status
```

### **3. Headers esperados na resposta:**
```
Access-Control-Allow-Origin: https://gdse-admin-site-d34luc9w7-centraltecs-projects.vercel.app
Access-Control-Allow-Credentials: true
```

---

## 🎯 **Resumo das Mudanças Necessárias:**

✅ **Frontend**: Já configurado (HTTPS)  
❌ **Backend**: Precisa configurar CORS para Vercel  
📋 **Ação**: Adicionar domínio Vercel ao CORS do backend  

**Após a configuração CORS, a aplicação deve funcionar perfeitamente!** 🚀