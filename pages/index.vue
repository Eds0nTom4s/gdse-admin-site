<template>
  <div class="space-y-6">
    <!-- Loading skeleton para stats -->
    <SkeletonLoader v-if="carregando" type="stats" />
    
    <!-- Stats cards -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard label="Mensagens" :value="contatosCount" hint="Total de mensagens" />
      <StatCard label="Próximos Jogos" :value="proximosJogosCount" hint="Próximos 7 dias" />
      <StatCard label="Membros da Direção" :value="membrosCount" />
      <StatCard label="Usuários" :value="usuariosCount" />
    </div>

    <!-- Loading skeleton para charts -->
    <div v-if="carregando" class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <SkeletonLoader type="card" />
      <SkeletonLoader type="card" />
    </div>

    <!-- Charts -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
import { computed, ref } from 'vue'
import StatCard from '@/components/StatCard.vue'
import ChartCard from '@/components/ChartCard.vue'
import { useApi } from '@/services/api'

// Aplicar middleware de autenticação
definePageMeta({
  middleware: 'auth'
})

const api = useApi()
const carregando = ref(true)

// Carregar dados com tratamento de erro adequado
const { data: contatos, error: contatosError } = await useAsyncData('dashboard:contatos', 
  () => api.listContatos().catch(() => [])
)
const { data: proximos, error: proximosError } = await useAsyncData('dashboard:proximos', 
  () => api.listProximosJogos().catch(() => [])
)
const { data: membros, error: membrosError } = await useAsyncData('dashboard:membros', 
  () => api.listMembrosDirecao().catch(() => [])
)
const { data: usuarios, error: usuariosError } = await useAsyncData('dashboard:usuarios', 
  () => api.listUsuarios().catch(() => [])
)
const { data: jogos, error: jogosError } = await useAsyncData('dashboard:jogos', 
  () => api.listJogos().catch(() => [])
)

// Desativar loading após dados carregarem
carregando.value = false
// Garantir que os dados são sempre arrays
const contatosCount = computed(() => Array.isArray(contatos.value) ? contatos.value.length : 0)
const proximosJogosCount = computed(() => Array.isArray(proximos.value) ? proximos.value.length : 0)
const membrosCount = computed(() => Array.isArray(membros.value) ? membros.value.length : 0)
const usuariosCount = computed(() => Array.isArray(usuarios.value) ? usuarios.value.length : 0)

// Build simple 7-day series for contacts
const contatosChartData = computed(() => {
  const now = new Date()
  const labels: string[] = []
  const counts: number[] = []
  
  // Garantir que contatos.value é um array
  const contatosArray = Array.isArray(contatos.value) ? contatos.value : []
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(now.getDate() - i)
    const label = d.toLocaleDateString()
    labels.push(label)
    
    const count = contatosArray.filter((c: any) => {
      try {
        const dt = new Date(c.dataEnvio || c.publicadoEm || c.criadoEm || 0)
        return dt.toDateString() === d.toDateString()
      } catch {
        return false
      }
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
  
  // Garantir que jogos.value é um array
  const jogosArray = Array.isArray(jogos.value) ? jogos.value : []
  
  for (const j of jogosArray) {
    try {
      const nome = j?.competicao?.nome || 'N/D'
      map.set(nome, (map.get(nome) || 0) + 1)
    } catch {
      // Ignorar jogos com dados inválidos
    }
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

const chartOptions = { 
  responsive: true, 
  maintainAspectRatio: false, 
  scales: { 
    y: { 
      beginAtZero: true 
    } 
  } 
}
</script>