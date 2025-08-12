<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold text-gray-800">Membros da Direção</h2>
      <button class="px-3 py-2 rounded bg-[var(--brand-green)] text-white" @click="openCriar">Adicionar Membro</button>
    </div>

    <DataTable
      :headers="['Nome', 'Cargo', 'Início', 'Fim', 'Ativo']"
      :keys="['nome', 'cargoNome', 'inicioMandato', 'fimMandato', 'ativo']"
      :rows="rows"
      @row:click="openEditar"
    >
      <template #cell:cargoNome="{ row }">{{ row.cargo?.nome || row.cargoNome }}</template>
      <template #cell:inicioMandato="{ row }">{{ formatDate(row.inicioMandato) }}</template>
      <template #cell:fimMandato="{ row }">{{ formatDate(row.fimMandato) }}</template>
      <template #cell:ativo="{ row }">
        <span :class="row.ativo ? 'inline-flex items-center px-2 py-1 rounded bg-green-100 text-green-800 text-xs' : 'inline-flex items-center px-2 py-1 rounded bg-gray-200 text-gray-700 text-xs'">{{ row.ativo ? 'Ativo' : 'Inativo' }}</span>
      </template>
    </DataTable>

    <Modal :open="modalOpen" :title="form.id ? 'Editar Membro' : 'Adicionar Membro'" @close="closeModal">
      <form class="grid grid-cols-1 md:grid-cols-2 gap-3" @submit.prevent="salvar">
        <div class="md:col-span-2">
          <label class="block text-sm text-gray-700">Nome</label>
          <input v-model="form.nome" type="text" required class="mt-1 w-full px-3 py-2 border rounded" />
        </div>
        <div class="md:col-span-2">
          <label class="block text-sm text-gray-700">Foto URL</label>
          <input v-model="form.fotoUrl" type="url" class="mt-1 w-full px-3 py-2 border rounded" />
        </div>
        <div class="md:col-span-2">
          <label class="block text-sm text-gray-700">Biografia</label>
          <textarea v-model="form.biografia" rows="3" class="mt-1 w-full px-3 py-2 border rounded"></textarea>
        </div>
        <div>
          <label class="block text-sm text-gray-700">Cargo</label>
          <select v-model.number="form.cargoId" required class="mt-1 w-full px-3 py-2 border rounded">
            <option :value="undefined" disabled>Selecione um cargo</option>
            <option v-for="c in cargos || []" :key="c.id" :value="c.id">{{ c.nome }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm text-gray-700">Ativo</label>
          <select v-model="form.ativo" class="mt-1 w-full px-3 py-2 border rounded">
            <option :value="true">Sim</option>
            <option :value="false">Não</option>
          </select>
        </div>
        <div>
          <label class="block text-sm text-gray-700">Início do Mandato</label>
          <input v-model="form.inicioMandato" type="date" required class="mt-1 w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label class="block text-sm text-gray-700">Fim do Mandato</label>
          <input v-model="form.fimMandato" type="date" required class="mt-1 w-full px-3 py-2 border rounded" />
        </div>
      </form>
      <template #footer>
        <div class="flex justify-between">
          <div class="space-x-2" v-if="form.id">
            <button class="px-3 py-2 rounded bg-red-600 text-white" @click="remover" :disabled="loading">Remover</button>
          </div>
          <div class="ml-auto space-x-2">
            <button class="px-3 py-2 rounded bg-gray-200" @click="closeModal">Cancelar</button>
            <button class="px-3 py-2 rounded bg-[var(--brand-green)] text-white" @click="salvar" :disabled="loading">Salvar</button>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import DataTable from '@/components/DataTable.vue'
import Modal from '@/components/Modal.vue'

const api = useApi()

const { data: membros, refresh } = await useAsyncData('direcao:membros', () => api.listMembrosDirecao())
const { data: cargos } = await useAsyncData('direcao:cargos', () => api.listCargosDirecao())

const rows = computed(() => (membros.value || []).map((m: any) => ({ ...m, cargoNome: m.cargo?.nome })))

const modalOpen = ref(false)
const loading = ref(false)

const form = reactive<any>({
  id: undefined,
  nome: '',
  fotoUrl: '',
  biografia: '',
  cargoId: undefined,
  inicioMandato: '',
  fimMandato: '',
  ativo: true,
})

function openCriar() {
  Object.assign(form, { id: undefined, nome: '', fotoUrl: '', biografia: '', cargoId: undefined, inicioMandato: '', fimMandato: '', ativo: true })
  modalOpen.value = true
}

function openEditar(row: any) {
  Object.assign(form, {
    id: row.id,
    nome: row.nome,
    fotoUrl: row.fotoUrl,
    biografia: row.biografia,
    cargoId: row.cargo?.id,
    inicioMandato: row.inicioMandato,
    fimMandato: row.fimMandato,
    ativo: row.ativo
  })
  modalOpen.value = true
}

function closeModal() {
  modalOpen.value = false
}

async function salvar() {
  loading.value = true
  try {
    const payload = {
      nome: form.nome,
      fotoUrl: form.fotoUrl,
      biografia: form.biografia,
      cargoId: form.cargoId,
      inicioMandato: form.inicioMandato,
      fimMandato: form.fimMandato,
      ativo: form.ativo
    }
    if (form.id) {
      await api.atualizarMembroDirecao(form.id, payload)
    } else {
      await api.criarMembroDirecao(payload)
    }
    await refresh()
    modalOpen.value = false
  } finally {
    loading.value = false
  }
}

async function remover() {
  if (!form.id) return
  loading.value = true
  try {
    await api.apagarMembroDirecao(form.id)
    await refresh()
    modalOpen.value = false
  } finally {
    loading.value = false
  }
}

function formatDate(s?: string) {
  if (!s) return '—'
  try { return new Date(s).toLocaleDateString() } catch { return s }
}
</script>