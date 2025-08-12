// Nuxt 3 configuration
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  css: [
    '@/assets/css/tailwind.css'
  ],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'
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
  // Configuração temporária para debugging
  ssr: true,
  nitro: {
    experimental: {
      wasm: false
    }
  }
});