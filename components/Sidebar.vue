<template>
  <aside :class="[
      'bg-white border-r border-gray-200 w-64 shrink-0 md:translate-x-0 md:static fixed inset-y-0 z-50 transform transition-transform duration-200',
      open ? 'translate-x-0' : '-translate-x-full'
    ]">
    <div class="h-14 flex items-center px-4 border-b">
      <span class="text-base font-semibold text-gray-800">Sagrada Esperança</span>
    </div>
    <nav class="p-3 space-y-1">
      <NuxtLink to="/" class="nav-item" exact-active-class="active">Dashboard</NuxtLink>
      <NuxtLink to="/contatos" class="nav-item" active-class="active">Contatos</NuxtLink>
      <NuxtLink to="/jogos" class="nav-item" active-class="active">Jogos</NuxtLink>
      <NuxtLink to="/direcao/membros" class="nav-item" active-class="active">Membros da Direção</NuxtLink>
      <NuxtLink to="/configuracoes" class="nav-item" active-class="active">Configurações</NuxtLink>
    </nav>
  </aside>
</template>

<script setup lang="ts">
defineProps<{ open: boolean }>()
defineEmits<{ (e: 'close'): void }>()
</script>

<style scoped>
.nav-item {
  @apply block px-3 py-2 rounded text-gray-700 hover:bg-gray-100;
}
.active {
  @apply bg-[var(--brand-mint)] text-gray-900 font-medium border-l-4 border-[var(--brand-green)];
}
</style>