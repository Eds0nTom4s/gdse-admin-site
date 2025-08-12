<template>
  <div>
    <div class="flex gap-2 border-b">
      <button
        v-for="(tab, idx) in tabs"
        :key="idx"
        :class="[
          'px-3 py-2 -mb-px border-b-2',
          idx === modelValue ? 'border-[var(--brand-green)] text-gray-900' : 'border-transparent text-gray-600 hover:text-gray-800'
        ]"
        @click="$emit('update:modelValue', idx)"
      >
        {{ tab }}
      </button>
    </div>
    <div class="mt-4">
      <slot :active="modelValue" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ tabs: string[]; modelValue: number }>()
defineEmits<{ (e: 'update:modelValue', value: number): void }>()
</script>