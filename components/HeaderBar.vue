<template>
  <header class="sticky top-0 z-40 bg-white border-b border-gray-200">
    <div class="mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <button class="md:hidden p-2 rounded hover:bg-gray-100" @click="$emit('toggle-sidebar')" aria-label="Alternar menu">
          <span class="i">☰</span>
        </button>
        <div class="flex items-center gap-2">
          <div class="w-2 h-6 bg-[var(--brand-green)] rounded"></div>
          <h1 class="text-lg font-semibold text-gray-800">Painel Administrativo</h1>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <div class="text-sm text-gray-600">Admin</div>
      </div>
    </div>
  </header>
</template>