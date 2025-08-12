<template>
  <div v-if="open" class="fixed inset-0 z-50">
    <div class="absolute inset-0 bg-black/30" @click="$emit('close')" />
    <div class="absolute inset-0 flex items-start md:items-center justify-center p-4">
      <div class="w-full md:max-w-2xl bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="px-4 py-3 border-b flex items-center justify-between">
          <h3 class="text-base font-semibold text-gray-800">{{ title }}</h3>
          <button class="p-2 hover:bg-gray-100 rounded" @click="$emit('close')" aria-label="Fechar">✕</button>
        </div>
        <div class="p-4">
          <slot />
        </div>
        <div v-if="$slots.footer" class="px-4 py-3 border-t bg-gray-50">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ open: boolean; title: string }>()
</script>