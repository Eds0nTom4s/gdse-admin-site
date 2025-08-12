<template>
  <div class="rounded-lg bg-white border border-gray-200 p-4 shadow-sm">
    <div class="text-sm text-gray-500">{{ label }}</div>
    <div class="mt-1 text-2xl font-semibold text-gray-800">{{ value }}</div>
    <div v-if="hint" class="mt-2 text-xs text-gray-500">{{ hint }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ label: string; value: string | number; hint?: string }>()
</script>