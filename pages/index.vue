<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard label="Mensagens" :value="contatosCount" hint="Total de mensagens" />
      <StatCard label="Próximos Jogos" :value="proximosJogosCount" hint="Próximos 7 dias" />
      <StatCard label="Membros da Direção" :value="membrosCount" />
      <StatCard label="Usuários" :value="usuariosCount" />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div class="h-64">
        <ChartCard title="Mensagens por dia (últimos 7)" :chart-data="contatosChartData" :chart-options="chartOptions" />
      </div>
      <div class="h-64">
        <ChartCard title="Jogos por competição" :chart-data="jogosPorCompeticaoChartData" :chart-options="chartOptions" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import StatCard from '@/components/StatCard.vue'
import ChartCard from '@/components/ChartCard.vue'

const api = useApi()

const { data: contatos } = await useAsyncData('dashboard:contatos', () => api.listContatos())
const { data: proximos } = await useAsyncData('dashboard:proximos', () => api.listProximosJogos())
const { data: membros } = await useAsyncData('dashboard:membros', () => api.listMembrosDirecao())
const { data: usuarios } = await useAsyncData('dashboard:usuarios', () => api.listUsuarios())
const { data: jogos } = await useAsyncData('dashboard:jogos', () => api.listJogos())

const contatosCount = computed(() => contatos.value?.length ?? 0)
const proximosJogosCount = computed(() => proximos.value?.length ?? 0)
const membrosCount = computed(() => membros.value?.length ?? 0)
const usuariosCount = computed(() => usuarios.value?.length ?? 0)

// Build simple 7-day series for contacts
const contatosChartData = computed(() => {
  const now = new Date()
  const labels: string[] = []
  const counts: number[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(now.getDate() - i)
    const label = d.toLocaleDateString()
    labels.push(label)
    const count = (contatos.value || []).filter((c: any) => {
      const dt = new Date(c.dataEnvio || c.publicadoEm || c.criadoEm || 0)
      return dt.toDateString() === d.toDateString()
    }).length
    counts.push(count)
  }
  return {
    labels,
    datasets: [
      {
        label: 'Mensagens',
        backgroundColor: '#04aa5d',
        data: counts
      }
    ]
  }
})

const jogosPorCompeticaoChartData = computed(() => {
  const map = new Map<string, number>()
  for (const j of (jogos.value || [])) {
    const nome = j?.competicao?.nome || 'N/D'
    map.set(nome, (map.get(nome) || 0) + 1)
  }
  const labels = Array.from(map.keys())
  const data = Array.from(map.values())
  return {
    labels,
    datasets: [
      {
        label: 'Jogos',
        backgroundColor: '#f9eb07',
        data
      }
    ]
  }
})

const chartOptions = { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }
</script>