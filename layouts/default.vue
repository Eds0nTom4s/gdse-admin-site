<template>
  <div class="min-h-screen bg-gray-50 flex">
    <Sidebar :open="sidebarOpen" @close="closeSidebar" />
    <div class="flex-1 min-w-0 flex flex-col">
      <HeaderBar @toggle-sidebar="toggleSidebar" />
      <main class="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
        <slot />
      </main>
      <Footer />
    </div>
    
    <!-- Toast Container -->
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import HeaderBar from '@/components/HeaderBar.vue'
import Footer from '@/components/Footer.vue'
import Toast from '@/components/Toast.vue'

// Estado reativo do sidebar
const sidebarOpen = ref(false)

// Detectar tamanho da tela e ajustar sidebar
const updateSidebarState = () => {
  if (typeof window !== 'undefined') {
    sidebarOpen.value = window.innerWidth >= 768
  }
}

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const closeSidebar = () => {
  sidebarOpen.value = false
}

// Gerenciar redimensionamento da tela
let resizeListener: (() => void) | null = null

onMounted(() => {
  updateSidebarState()
  
  // Listener para redimensionamento
  resizeListener = () => updateSidebarState()
  window.addEventListener('resize', resizeListener)
})

onUnmounted(() => {
  if (resizeListener) {
    window.removeEventListener('resize', resizeListener)
  }
})
</script>