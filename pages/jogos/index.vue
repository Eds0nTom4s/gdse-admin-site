<template>
  <div class="space-y-4">
    <h2 class="text-xl font-semibold text-gray-800">Jogos</h2>

    <Tabs v-model="activeTab" :tabs="['Próximos Jogos', 'Resultados', 'Classificação']">
      <template #default="{ active }">
        <div v-show="active === 0" class="space-y-3">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <div v-for="j in proximos || []" :key="j.id" class="rounded bg-white border p-4">
              <div class="text-sm text-gray-500">{{ j.competicao?.nome }}</div>
              <div class="mt-1 text-base font-semibold">{{ j.adversario }}</div>
              <div class="text-sm text-gray-600">{{ formatDate(j.data || j.dataHora) }} • {{ j.local }}</div>
            </div>
          </div>
        </div>
        <div v-show="active === 1" class="space-y-3">
          <DataTable
            :headers="['Data', 'Competição', 'Adversário', 'Local', 'Resultado']"
            :keys="['dataHora', 'competicao', 'adversario', 'local', 'resultado']"
            :rows="resultados"
          >
            <template #cell:dataHora="{ row }">{{ formatDate(row.dataHora) }}</template>
            <template #cell:competicao="{ row }">{{ row.competicao?.nome }}</template>
          </DataTable>
        </div>
        <div v-show="active === 2" class="space-y-3">
          <DataTable
            :headers="['Competição', 'Detalhe']"
            :keys="['competicaoNome', 'info']"
            :rows="classificacoesRows"
          />
        </div>
      </template>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Tabs from '@/components/Tabs.vue'
import DataTable from '@/components/DataTable.vue'

const api = useApi()

const activeTab = ref(0)
const { data: proximos } = await useAsyncData('jogos:proximos', () => api.listProximosJogos())
const { data: jogos } = await useAsyncData('jogos:todos', () => api.listJogos())
const { data: classificacoes } = await useAsyncData('jogos:classificacoes', () => api.listClassificacoes())

const resultados = computed(() => (jogos.value || []).filter((j: any) => !!j.resultado))

const classificacoesRows = computed(() => (classificacoes.value || []).map((c: any) => ({
  competicaoNome: c?.competicao?.nome || c?.competicaoNome || 'Competição',
  info: JSON.stringify(c)
})))

function formatDate(iso?: string) {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleString()
}
</script>