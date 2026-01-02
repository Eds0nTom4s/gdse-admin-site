# Dockerfile para o frontend Nuxt.js
FROM node:20-alpine

# Definir diretório de trabalho
WORKDIR /app

# Copiar apenas os arquivos necessários para produção
COPY package*.json ./
COPY .output ./.output

# Instalar apenas dependências de produção necessárias para runtime
RUN npm ci --omit=dev --omit=optional

# Expor porta
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["node", ".output/server/index.mjs"]