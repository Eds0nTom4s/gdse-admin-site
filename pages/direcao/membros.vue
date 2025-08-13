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
          <label class="block text-sm text-gray-700">Foto</label>
          <input ref="fotoInput" type="file" accept="image/*" @change="onFotoChange" class="mt-1 w-full px-3 py-2 border rounded" />
          <p v-if="fotoSelecionada" class="text-xs text-gray-500 mt-1">{{ fotoSelecionada?.name }} ({{ (fotoSelecionada.size/1024/1024).toFixed(2) }} MB)</p>
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
import { useApi } from '@/services/api'
import { toastManager } from '@/utils/toast'

const api = useApi()
const toast = toastManager

const { data: membros, refresh } = await useAsyncData('direcao:membros', () => api.listMembrosDirecao())
const { data: cargos } = await useAsyncData('direcao:cargos', () => api.listCargosDirecao())

const rows = computed(() => (membros.value || []).map((m: any) => ({ ...m, cargoNome: m.cargo?.nome })))

const modalOpen = ref(false)
const loading = ref(false)
const fotoSelecionada = ref<File | null>(null)
const fotoInput = ref<HTMLInputElement | null>(null)

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
  fotoSelecionada.value = null
  if (fotoInput.value) fotoInput.value.value = ''
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
  fotoSelecionada.value = null
  if (fotoInput.value) fotoInput.value.value = ''
}

function closeModal() {
  modalOpen.value = false
}

async function salvar() {
  loading.value = true
  try {
    const membroData = {
      nome: form.nome,
      biografia: form.biografia,
      cargoId: form.cargoId,
      inicioMandato: form.inicioMandato,
      fimMandato: form.fimMandato,
      ativo: form.ativo
    }
    if (form.id) {
      await api.atualizarMembroDirecao(form.id, membroData, fotoSelecionada.value || undefined)
      toast.success('Membro atualizado com sucesso!')
    } else {
      await api.criarMembroDirecao(membroData, fotoSelecionada.value || undefined)
      toast.success('Membro criado com sucesso!')
    }
    await refresh()
    modalOpen.value = false
  } catch (error) {
    console.error('Erro ao salvar membro:', error)
    toast.error('Erro ao salvar membro. Tente novamente.')
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
    toast.success('Membro removido com sucesso!')
  } catch (error) {
    console.error('Erro ao remover membro:', error)
    toast.error('Erro ao remover membro. Tente novamente.')
  } finally {
    loading.value = false
  }
}

function onFotoChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) { fotoSelecionada.value = null; return }
  // validações básicas
  if (file.size > 5 * 1024 * 1024) {
    toast.warning('A imagem deve ter no máximo 5MB')
    input.value = ''
    fotoSelecionada.value = null
    return
  }
  if (!file.type.startsWith('image/')) {
    toast.warning('Apenas arquivos de imagem são permitidos')
    input.value = ''
    fotoSelecionada.value = null
    return
  }
  fotoSelecionada.value = file
}

function formatDate(s?: string) {
  if (!s) return '—'
  try { return new Date(s).toLocaleDateString() } catch { return s }
}
</script>