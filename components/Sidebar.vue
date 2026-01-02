<template>
  <!-- Overlay para mobile -->
  <div 
    v-if="open" 
    class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" 
    @click="$emit('close')"
  ></div>
  
  <!-- Sidebar -->
  <aside :class="[
      'bg-white border-r border-gray-200 w-64 shrink-0 fixed inset-y-0 z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0',
      open ? 'translate-x-0' : '-translate-x-full'
    ]">
    <!-- Header do sidebar -->
    <div class="h-14 flex items-center justify-between px-4 border-b border-gray-200">
      <span class="text-base font-semibold text-gray-800">Sagrada Esperança</span>
      <!-- Botão fechar (mobile) -->
      <button 
        class="md:hidden p-1 rounded hover:bg-gray-100" 
        @click="$emit('close')"
        aria-label="Fechar menu"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    
    <!-- Navegação -->
    <nav class="p-3 space-y-1 overflow-y-auto h-full pb-20">
      <NuxtLink to="/" class="nav-item" active-class="active" exact @click="handleNavClick">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v.01a2 2 0 01-2 2H10a2 2 0 01-2-2V5z" />
        </svg>
        Dashboard
      </NuxtLink>
      
      <NuxtLink to="/contatos" class="nav-item" active-class="active" @click="handleNavClick">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
        </svg>
        Contatos
      </NuxtLink>
      
      <NuxtLink to="/noticias" class="nav-item" active-class="active" @click="handleNavClick">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
        Notícias
      </NuxtLink>
      
      <NuxtLink to="/jogos" class="nav-item" active-class="active" @click="handleNavClick">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Jogos
      </NuxtLink>
      
      <NuxtLink to="/jogadores" class="nav-item" active-class="active" @click="handleNavClick">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        Jogadores
      </NuxtLink>
      
      <NuxtLink to="/galeria" class="nav-item" active-class="active" @click="handleNavClick">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Galeria
      </NuxtLink>
      
      <NuxtLink to="/direcao/membros" class="nav-item" active-class="active" @click="handleNavClick">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        Membros da Direção
      </NuxtLink>
      
      <NuxtLink to="/configuracoes" class="nav-item" active-class="active" @click="handleNavClick">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Configurações
      </NuxtLink>
    </nav>
  </aside>
</template>

<script setup lang="ts">
defineProps<{ open: boolean }>()
const emit = defineEmits<{ (e: 'close'): void }>()

// Fechar sidebar no mobile quando navegar
const handleNavClick = () => {
  // No mobile, fechar o sidebar após navegação
  if (window.innerWidth < 768) {
    emit('close')
  }
}
</script>

<style scoped>
.nav-item {
  @apply flex items-center gap-3 px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200 font-medium;
}

.nav-item svg {
  @apply shrink-0;
}

.active {
  @apply bg-[var(--brand-mint)] text-gray-900 font-semibold border-l-4 border-[var(--brand-green)] shadow-sm;
}

/* Melhorar scroll no mobile */
@media (max-width: 768px) {
  nav {
    @apply pb-6;
  }
}

/* Animações suaves */
aside {
  @apply transition-all duration-300 ease-in-out;
}

/* Estado loading/hydration */
.nav-item:hover {
  @apply transform scale-[1.02];
}
</style>