<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold text-gray-800">Jogos</h2>
      <button class="px-3 py-2 rounded bg-[var(--brand-green)] text-white" @click="openCriar">Novo Jogo</button>
    </div>

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
            <template #actions="{ row }">
              <div class="space-x-2 text-sm">
                <button class="px-2 py-1 rounded bg-blue-600 text-white" @click="openEditar(row)">Editar</button>
                <button class="px-2 py-1 rounded bg-red-600 text-white" @click="remover(row)">Remover</button>
              </div>
            </template>
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

  <Modal :open="modalOpen" :title="form.id ? 'Editar Jogo' : 'Novo Jogo'" @close="closeModal">
    <form class="grid grid-cols-1 md:grid-cols-2 gap-3" @submit.prevent="salvar">
      <div>
        <label class="block text-sm text-gray-700">Competição</label>
        <select v-model.number="form.competicaoId" required class="mt-1 w-full px-3 py-2 border rounded">
          <option :value="undefined" disabled>Selecione uma competição</option>
          <option v-for="c in competicoes || []" :key="c.id" :value="c.id">{{ c.nome }}</option>
        </select>
      </div>
      <div>
        <label class="block text-sm text-gray-700">Adversário</label>
        <input v-model="form.adversario" type="text" required class="mt-1 w-full px-3 py-2 border rounded" />
      </div>
      <div>
        <label class="block text-sm text-gray-700">Local</label>
        <input v-model="form.local" type="text" required class="mt-1 w-full px-3 py-2 border rounded" />
      </div>
      <div>
        <label class="block text-sm text-gray-700">Data e Hora</label>
        <input v-model="form.dataHora" type="datetime-local" required class="mt-1 w-full px-3 py-2 border rounded" />
      </div>
      <div class="md:col-span-2">
        <label class="block text-sm text-gray-700">Resultado (opcional)</label>
        <input v-model="form.resultado" type="text" placeholder="Ex.: 2-1" class="mt-1 w-full px-3 py-2 border rounded" />
      </div>
    </form>
    <template #footer>
      <div class="flex justify-end space-x-2">
        <button class="px-3 py-2 rounded bg-gray-200" @click="closeModal">Cancelar</button>
        <button class="px-3 py-2 rounded bg-[var(--brand-green)] text-white" @click="salvar" :disabled="loading">Salvar</button>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Tabs from '@/components/Tabs.vue'
import DataTable from '@/components/DataTable.vue'
import { useApi } from '@/services/api'
import { toastManager } from '@/utils/toast'

const api = useApi()
const toast = toastManager

const activeTab = ref(0)
const { data: proximos } = await useAsyncData('jogos:proximos', () => api.listProximosJogos())
const { data: jogos } = await useAsyncData('jogos:todos', () => api.listJogos())
const { data: classificacoes } = await useAsyncData('jogos:classificacoes', () => api.listClassificacoes())
const { data: competicoes } = await useAsyncData('jogos:competicoes', () => api.listCompeticoes())

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

const modalOpen = ref(false)
const loading = ref(false)
const form = ref<any>({
  id: undefined,
  competicaoId: undefined,
  adversario: '',
  local: '',
  dataHora: '',
  resultado: ''
})

function openCriar() {
  form.value = { id: undefined, competicaoId: undefined, adversario: '', local: '', dataHora: '', resultado: '' }
  modalOpen.value = true
}

function openEditar(row: any) {
  form.value = {
    id: row.id,
    competicaoId: row.competicao?.id,
    adversario: row.adversario,
    local: row.local,
    dataHora: (row.dataHora || row.data)?.slice(0, 16),
    resultado: row.resultado || ''
  }
  modalOpen.value = true
}

function closeModal() {
  modalOpen.value = false
}

async function salvar() {
  loading.value = true
  try {
    const payload = {
      competicaoId: form.value.competicaoId,
      adversario: form.value.adversario,
      local: form.value.local,
      dataHora: form.value.dataHora ? new Date(form.value.dataHora).toISOString() : undefined,
      resultado: form.value.resultado || undefined
    }
    if (form.value.id) {
      await api.atualizarJogo(form.value.id, payload)
      toast.success('Jogo atualizado com sucesso!')
    } else {
      await api.criarJogo(payload)
      toast.success('Jogo criado com sucesso!')
    }
    await Promise.all([useAsyncData('jogos:proximos', () => api.listProximosJogos(), { server: false }), useAsyncData('jogos:todos', () => api.listJogos(), { server: false })])
    modalOpen.value = false
  } catch (error) {
    console.error('Erro ao salvar jogo:', error)
    toast.error('Erro ao salvar jogo. Verifique os dados e tente novamente.')
  } finally {
    loading.value = false
  }
}

async function remover(row: any) {
  if (!row?.id) return
  try {
    await api.apagarJogo(row.id)
    toast.success('Jogo removido com sucesso!')
    await Promise.all([useAsyncData('jogos:proximos', () => api.listProximosJogos(), { server: false }), useAsyncData('jogos:todos', () => api.listJogos(), { server: false })])
  } catch (error) {
    console.error('Erro ao remover jogo:', error)
    toast.error('Não foi possível remover o jogo.')
  }
}
</script>