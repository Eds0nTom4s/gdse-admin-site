// Nuxt 3 configuration
export default defineNuxtConfig({
  // Data de compatibilidade conforme recomendação
  compatibilityDate: '2025-10-01',
  
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  css: [
    '@/assets/css/tailwind.css'
  ],
  build: {
    transpile: ['@vuepic/vue-datepicker']
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
      environment: process.env.NODE_ENV || 'development'
    }
  },
  app: {
    head: {
      title: 'Painel Administrativo - Sagrada Esperança',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  },
  // Configuração para melhor performance
  ssr: true,
  nitro: {
    experimental: {
      wasm: false
    }
  },
  // Garantir auto-import de composables
  imports: {
    dirs: ['composables/**']
  },
  // Configuração do devtools para melhor performance
  devtools: { 
    enabled: true,
    timeline: {
      enabled: false // Desabilitar timeline para melhor performance
    }
  },
  // Configuração de desenvolvimento
  devServer: {
    port: 3000
  }
});