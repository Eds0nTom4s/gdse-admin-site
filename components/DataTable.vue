<template>
  <div class="overflow-x-auto bg-white border border-gray-200 rounded-lg">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th v-for="(h, i) in headers" :key="i" class="px-4 py-2 text-left text-xs font-semibold text-gray-600">{{ h }}</th>
          <th v-if="$slots.actions" class="px-4 py-2"></th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        <tr v-for="(row, ri) in rows" :key="ri" class="hover:bg-[var(--brand-mint)]/40 cursor-pointer" @click="$emit('row:click', row)">
          <td v-for="(key, ki) in keys" :key="ki" class="px-4 py-2 text-sm text-gray-700">
            <slot :name="`cell:${String(key)}`" :row="row">{{ row[key as keyof typeof row] }}</slot>
          </td>
          <td v-if="$slots.actions" class="px-4 py-2 text-right">
            <slot name="actions" :row="row" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
// Rows are generic records; keys defines which fields to show
// headers are labels aligned with keys

type KeyOfAny = string | number | symbol

defineProps<{ headers: string[]; keys: KeyOfAny[]; rows: any[] }>()

defineEmits<{ (e: 'row:click', row: any): void }>()
</script>