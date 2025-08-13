<template>
  <div class="space-y-4">
    <h2 class="text-xl font-semibold text-gray-800">Contatos</h2>

    <DataTable
      :headers="['Nome', 'Email', 'Assunto', 'Data', 'Estado']"
      :keys="['nomeCompleto', 'email', 'assunto', 'dataEnvio', 'estado']"
      :rows="contatos || []"
      @row:click="openDetalhe"
    >
      <template #cell:dataEnvio="{ row }">{{ formatRelative(row.dataEnvio) }}</template>
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
          <div><span class="font-medium">Enviado:</span> {{ formatRelative(contatoAtual.dataEnvio) }}</div>
        </div>
        <div class="mt-4 whitespace-pre-wrap text-gray-800">{{ contatoAtual.mensagem }}</div>
      </div>
      <template #footer>
        <div class="flex justify-between">
          <div class="space-x-2">
            <button class="px-3 py-2 rounded bg-[var(--brand-green)] text-white" @click="marcarComoNaoLida" :disabled="loadingAcao">Marcar como não lida</button>
            <button class="px-3 py-2 rounded bg-red-600 text-white" @click="apagar" :disabled="loadingAcao">Apagar</button>
          </div>
          <button class="px-3 py-2 rounded bg-gray-200" @click="detalheOpen = false">Fechar</button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import DataTable from '@/components/DataTable.vue'
import Modal from '@/components/Modal.vue'
import { useApi } from '@/services/api'
import { toastManager } from '@/utils/toast'

const api = useApi()
const toast = toastManager

const { data: contatos, refresh } = await useAsyncData('contatos:list', () => api.listContatos())
let pollingTimer: any = null

const detalheOpen = ref(false)
const contatoAtual = ref<any | null>(null)
const loadingAcao = ref(false)

function formatRelative(iso?: string) {
  if (!iso) return '—'
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const seconds = Math.floor(diffMs / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (seconds < 60) return 'agora mesmo'
  if (minutes < 60) return `${minutes} min atrás`
  if (hours < 24) return `${hours} h atrás`
  if (days === 1) return 'ontem'
  if (days < 7) return `${days} dias atrás`
  return d.toLocaleDateString()
}

async function openDetalhe(row: any) {
  try {
    const { id } = row
    const detalhe = await api.getContato(id)
    contatoAtual.value = detalhe
    detalheOpen.value = true
    // marcar como lida automaticamente ao abrir
    if (detalhe?.estado === 'NAO_LIDO') {
      try {
        await api.marcarContatoComoLido(id)
        await refresh()
        contatoAtual.value = { ...detalhe, estado: 'LIDO' }
      } catch (e) {
        console.warn('Falha ao marcar como lida após abrir', e)
      }
    }
  } catch (error) {
    console.error('Erro ao carregar contato:', error)
    toast.error('Erro ao carregar os detalhes do contato')
  }
}

async function marcarComoNaoLida() {
  if (!contatoAtual.value) return
  loadingAcao.value = true
  try {
    await api.marcarContatoComoNaoLido(contatoAtual.value.id)
    await refresh()
    detalheOpen.value = false
    toast.success('Mensagem marcada como não lida.')
  } catch (error) {
    console.error('Erro ao marcar como não lida:', error)
    toast.error('Não foi possível alterar o estado da mensagem.')
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
    toast.success('Mensagem apagada com sucesso!')
  } catch (error) {
    console.error('Erro ao apagar mensagem:', error)
    toast.error('Não foi possível apagar a mensagem.')
  } finally {
    loadingAcao.value = false
  }
}

onMounted(() => {
  // polling leve para receber novas mensagens sem refresh manual
  pollingTimer = setInterval(() => {
    refresh()
  }, 5000)
})

onBeforeUnmount(() => {
  if (pollingTimer) clearInterval(pollingTimer)
})
</script>