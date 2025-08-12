<template>
  <div class="min-h-screen bg-gray-50 flex">
    <Sidebar :open="sidebarOpen" @close="sidebarOpen = false" />
    <div class="flex-1 min-w-0 flex flex-col">
      <HeaderBar @toggle-sidebar="sidebarOpen = !sidebarOpen" />
      <main class="p-4 md:p-6 lg:p-8">
        <slot />
      </main>
    </div>
    
    <!-- Toast Container -->
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import HeaderBar from '@/components/HeaderBar.vue'
import Toast from '@/components/Toast.vue'

const sidebarOpen = ref(true)
</script>