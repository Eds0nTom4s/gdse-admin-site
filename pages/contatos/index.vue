<template>
  <div class="space-y-4">
    <h2 class="text-xl font-semibold text-gray-800">Contatos</h2>

    <DataTable
      :headers="['Nome', 'Email', 'Assunto', 'Data', 'Estado']"
      :keys="['nomeCompleto', 'email', 'assunto', 'dataEnvio', 'estado']"
      :rows="contatos || []"
      @row:click="openDetalhe"
    >
      <template #cell:estado="{ row }">
        <span :class="row.estado === 'NAO_LIDO' ? 'inline-flex items-center px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-xs' : 'inline-flex items-center px-2 py-1 rounded bg-green-100 text-green-800 text-xs'">
          {{ row.estado === 'NAO_LIDO' ? 'Não lida' : 'Lida' }}
        </span>
      </template>
    </DataTable>

    <Modal :open="detalheOpen" title="Detalhe da Mensagem" @close="detalheOpen = false">
      <div v-if="contatoAtual">
        <div class="space-y-1 text-sm">
          <div><span class="font-medium">Nome:</span> {{ contatoAtual.nomeCompleto }}</div>
          <div><span class="font-medium">Email:</span> {{ contatoAtual.email }}</div>
          <div><span class="font-medium">Assunto:</span> {{ contatoAtual.assunto }}</div>
          <div><span class="font-medium">Enviado em:</span> {{ formatDate(contatoAtual.dataEnvio) }}</div>
        </div>
        <div class="mt-4 whitespace-pre-wrap text-gray-800">{{ contatoAtual.mensagem }}</div>
      </div>
      <template #footer>
        <div class="flex justify-between">
          <div class="space-x-2">
            <button class="px-3 py-2 rounded bg-[var(--brand-green)] text-white" @click="marcarComoLida" :disabled="loadingAcao">Marcar como lida</button>
            <button class="px-3 py-2 rounded bg-red-600 text-white" @click="apagar" :disabled="loadingAcao">Apagar</button>
          </div>
          <button class="px-3 py-2 rounded bg-gray-200" @click="detalheOpen = false">Fechar</button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DataTable from '@/components/DataTable.vue'
import Modal from '@/components/Modal.vue'

const api = useApi()

const { data: contatos, refresh } = await useAsyncData('contatos:list', () => api.listContatos())

const detalheOpen = ref(false)
const contatoAtual = ref<any | null>(null)
const loadingAcao = ref(false)

function formatDate(iso?: string) {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleString()
}

async function openDetalhe(row: any) {
  const { id } = row
  contatoAtual.value = await api.getContato(id)
  detalheOpen.value = true
}

async function marcarComoLida() {
  if (!contatoAtual.value) return
  loadingAcao.value = true
  try {
    await api.marcarContatoComoLido(contatoAtual.value.id)
    await refresh()
    detalheOpen.value = false
  } finally {
    loadingAcao.value = false
  }
}

async function apagar() {
  if (!contatoAtual.value) return
  loadingAcao.value = true
  try {
    await api.apagarContato(contatoAtual.value.id)
    await refresh()
    detalheOpen.value = false
  } finally {
    loadingAcao.value = false
  }
}
</script>