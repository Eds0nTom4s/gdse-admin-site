<template>
  <div class="animate-pulse">
    <!-- Skeleton para cabeçalho de tabela -->
    <div v-if="type === 'table'" class="space-y-4">
      <div class="flex justify-between items-center mb-4">
        <div class="h-8 bg-gray-200 rounded w-1/4"></div>
        <div class="h-10 bg-gray-200 rounded w-32"></div>
      </div>
      <div class="border border-gray-200 rounded-lg overflow-hidden">
        <div class="bg-gray-50 p-4 border-b">
          <div class="grid grid-cols-4 gap-4">
            <div v-for="i in 4" :key="i" class="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div v-for="row in rows" :key="row" class="p-4 border-b border-gray-100">
          <div class="grid grid-cols-4 gap-4">
            <div v-for="i in 4" :key="i" class="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Skeleton para cards -->
    <div v-else-if="type === 'card'" class="bg-white rounded-lg shadow p-6 space-y-4">
      <div class="h-6 bg-gray-200 rounded w-3/4"></div>
      <div class="h-4 bg-gray-200 rounded w-full"></div>
      <div class="h-4 bg-gray-200 rounded w-5/6"></div>
      <div class="h-4 bg-gray-200 rounded w-4/6"></div>
    </div>

    <!-- Skeleton para formulário -->
    <div v-else-if="type === 'form'" class="space-y-6">
      <div v-for="i in fields" :key="i" class="space-y-2">
        <div class="h-4 bg-gray-200 rounded w-24"></div>
        <div class="h-10 bg-gray-200 rounded w-full"></div>
      </div>
      <div class="flex gap-4">
        <div class="h-10 bg-gray-200 rounded w-32"></div>
        <div class="h-10 bg-gray-200 rounded w-32"></div>
      </div>
    </div>

    <!-- Skeleton para stat cards -->
    <div v-else-if="type === 'stats'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="i in 4" :key="i" class="bg-white rounded-lg shadow p-6">
        <div class="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div class="h-8 bg-gray-200 rounded w-3/4"></div>
      </div>
    </div>

    <!-- Skeleton genérico (linhas) -->
    <div v-else class="space-y-3">
      <div v-for="i in lines" :key="i" class="h-4 bg-gray-200 rounded" :class="widthClass(i)"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  type?: 'table' | 'card' | 'form' | 'stats' | 'lines'
  rows?: number
  lines?: number
  fields?: number
}

const props = withDefaults(defineProps<Props>(), {
  type: 'lines',
  rows: 5,
  lines: 3,
  fields: 4
})

const widthClass = (index: number) => {
  const classes = ['w-full', 'w-5/6', 'w-4/6']
  return classes[index % classes.length]
}
</script>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
