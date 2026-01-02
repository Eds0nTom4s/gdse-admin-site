import { createApp } from 'vue'
import { Toaster } from 'vue-sonner'

export default defineNuxtPlugin(nuxtApp => {
  // Registrar componente Toaster globalmente
  nuxtApp.vueApp.component('Toaster', Toaster)
})
