<template>
  <div class="rounded-lg bg-white border border-gray-200 p-4 shadow-sm">
    <div class="flex items-center justify-between">
      <div class="text-sm text-gray-600">{{ title }}</div>
    </div>
    <div class="mt-2">
      <Bar :data="chartData" :options="chartOptions" class="!h-56" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

defineProps<{ title: string; chartData: any; chartOptions?: any }>()
</script>