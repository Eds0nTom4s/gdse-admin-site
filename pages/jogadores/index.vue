<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useApi } from '@/services/api'
import type { JogadorResponseDTO, JogadorRequestDTO, Grupo } from '@/types/jogador'
import { toastManager } from '@/utils/toast'
import Toast from '@/components/Toast.vue'
import DataTable from '@/components/DataTable.vue'
import Modal from '@/components/Modal.vue'

const api = useApi()

// Estado
const jogadorModalOpen = ref(false)
const loadingJogador = ref(false)
const fotoFile = ref<File | null>(null)
const fotoPreview = ref<string | null>(null)

// Dados
const { data: jogadores, refresh: refreshJogadores } = await useAsyncData('jogadores', () => api.listJogadores())
const { data: grupos } = await useAsyncData('grupos', () => api.listGrupos())

// Form
interface JogadorFormData extends JogadorRequestDTO {
  fotoUrl?: string;
}

const jogadorForm = reactive<JogadorFormData>({
  nome: '',
  numero: 0,
  posicao: '',
  grupoId: 0,
  ativo: true,
  fotoUrl: ''
})
const jogadorId = ref<number | null>(null)

// Funções
function openCriarJogador() {
  jogadorId.value = null
  Object.assign(jogadorForm, {
    nome: '',
    numero: 0,
    posicao: '',
    grupoId: 0,
    ativo: true
  })
  fotoFile.value = null
  fotoPreview.value = null
  jogadorModalOpen.value = true
}

function openEditarJogador(jogador: JogadorResponseDTO) {
  jogadorId.value = jogador.id
  // Extrair apenas o nome do arquivo da URL
  const fotoUrl = jogador.fotoUrl.split('/').pop() || ''
  Object.assign(jogadorForm, {
    nome: jogador.nome,
    numero: jogador.numero,
    posicao: jogador.posicao,
    grupoId: jogador.grupo.id,
    ativo: jogador.ativo,
    fotoUrl: fotoUrl // Apenas o nome do arquivo
  })
  fotoFile.value = null
  fotoPreview.value = null
  jogadorModalOpen.value = true
}

function closeJogadorModal() {
  jogadorModalOpen.value = false
}

function onFotoChange(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files?.length) {
    const file = input.files[0]
    
    // Validar tamanho do arquivo (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toastManager.error('A foto deve ter no máximo 5MB')
      input.value = '' // Limpar input
      return
    }
    
    // Validar tipo do arquivo
    if (!file.type.startsWith('image/')) {
      toastManager.error('O arquivo selecionado não é uma imagem válida')
      input.value = '' // Limpar input
      return
    }
    
    fotoFile.value = file
    
    // Criar preview da imagem
    const reader = new FileReader()
    reader.onload = (e) => {
      fotoPreview.value = e.target?.result as string
    }
    reader.onerror = () => {
      toastManager.error('Erro ao carregar a prévia da imagem')
      fotoFile.value = null
      fotoPreview.value = null
    }
    reader.readAsDataURL(file)
  }
}

function removerFotoSelecionada() {
  fotoFile.value = null
  if (jogadorId.value) {
    const jogador = jogadores.value?.find(j => j.id === jogadorId.value)
    fotoPreview.value = jogador?.fotoUrl || null
  } else {
    fotoPreview.value = null
  }
}

async function salvarJogador() {
  if (!jogadorForm.nome || !jogadorForm.posicao || !jogadorForm.grupoId) {
    toastManager.error('Preencha todos os campos obrigatórios')
    return
  }

  if (!jogadorId.value && !fotoFile.value) {
    toastManager.error('Selecione uma foto para o jogador')
    return
  }

  loadingJogador.value = true
  try {
    if (jogadorId.value) {
      await api.atualizarJogador(jogadorId.value, jogadorForm, fotoFile.value)
      toastManager.success('Jogador atualizado com sucesso!')
    } else {
      if (!fotoFile.value) throw new Error('Foto é obrigatória')
      await api.criarJogador(jogadorForm, fotoFile.value)
      toastManager.success('Jogador criado com sucesso!')
    }
    await refreshJogadores()
    closeJogadorModal()
  } catch (error) {
    console.error('Erro ao salvar jogador:', error)
    toastManager.error('Erro ao salvar jogador. Tente novamente.')
  } finally {
    loadingJogador.value = false
  }
}

async function apagarJogador(id: number) {
  if (!confirm('Tem certeza que deseja apagar este jogador?')) return

  try {
    await api.apagarJogador(id)
    toastManager.success('Jogador removido com sucesso!')
    await refreshJogadores()
  } catch (error) {
    console.error('Erro ao apagar jogador:', error)
    toastManager.error('Erro ao remover jogador. Tente novamente.')
  }
}

// Posições disponíveis
const posicoes = [
  'Goleiro',
  'Lateral Direito',
  'Lateral Esquerdo',
  'Zagueiro',
  'Volante',
  'Meio-Campo',
  'Atacante'
]
</script>

<template>
  <div class="space-y-6">
    <Toast />
    
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-semibold text-gray-800">Jogadores</h1>
      <button 
        class="px-4 py-2 bg-[var(--brand-green)] text-white rounded hover:bg-opacity-90"
        @click="openCriarJogador"
      >
        Novo Jogador
      </button>
    </div>

    <DataTable
      :headers="['Foto', 'Nome', 'Número', 'Posição', 'Grupo', 'Status', 'Ações']"
      :keys="['fotoUrl', 'nome', 'numero', 'posicao', 'grupo', 'ativo', 'acoes']"
      :rows="jogadores || []"
    >
      <template #cell:fotoUrl="{ row }">
        <img 
          :src="row.fotoUrl" 
          :alt="row.nome"
          class="w-12 h-12 rounded object-cover bg-gray-100"
        />
      </template>

      <template #cell:grupo="{ row }">
        {{ row.grupo.nome }}
        <span class="text-sm text-gray-500 block">
          {{ row.grupo.modalidade.nome }}
        </span>
      </template>

      <template #cell:ativo="{ row }">
        <span 
          :class="[
            'px-2 py-1 text-xs rounded-full',
            row.ativo 
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          ]"
        >
          {{ row.ativo ? 'Ativo' : 'Inativo' }}
        </span>
      </template>

      <template #cell:acoes="{ row }">
        <div class="flex gap-2">
          <button
            class="p-1 text-blue-600 hover:text-blue-800"
            @click="openEditarJogador(row)"
          >
            <span class="sr-only">Editar</span>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            class="p-1 text-red-600 hover:text-red-800"
            @click="apagarJogador(row.id)"
          >
            <span class="sr-only">Apagar</span>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </template>
    </DataTable>

    <!-- Modal de Criar/Editar Jogador -->
    <Modal 
      :open="jogadorModalOpen"
      :title="jogadorId ? 'Editar Jogador' : 'Novo Jogador'"
      @close="closeJogadorModal"
    >
      <form class="space-y-4" @submit.prevent="salvarJogador">
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Foto
          </label>
          <div class="flex items-center gap-4">
            <div class="w-24 h-24 rounded bg-gray-100 flex items-center justify-center overflow-hidden">
              <template v-if="fotoPreview">
                <img :src="fotoPreview" :alt="jogadorForm.nome" class="w-full h-full object-cover" />
              </template>
              <template v-else-if="jogadorId && jogadorForm.fotoUrl">
                <img 
                  :src="jogadorForm.fotoUrl" 
                  :alt="jogadorForm.nome" 
                  class="w-full h-full object-cover" 
                />
              </template>
              <svg v-else class="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="flex-1">
              <label class="block px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 cursor-pointer text-center">
                <span class="text-sm text-gray-700">
                  {{ fotoFile ? 'Trocar foto' : 'Selecionar foto' }}
                </span>
                <input type="file" class="hidden" accept="image/*" @change="onFotoChange" />
              </label>
              <div v-if="fotoFile" class="mt-2 flex items-center gap-2">
                <span class="text-sm text-gray-600">{{ fotoFile.name }}</span>
                <button
                  type="button"
                  class="text-sm text-red-600 hover:text-red-800"
                  @click="removerFotoSelecionada"
                >
                  Remover
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              Nome
            </label>
            <input
              v-model="jogadorForm.nome"
              type="text"
              required
              class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]"
            />
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              Número
            </label>
            <input
              v-model.number="jogadorForm.numero"
              type="number"
              min="1"
              max="99"
              required
              class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]"
            />
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              Posição
            </label>
            <select
              v-model="jogadorForm.posicao"
              required
              class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]"
            >
              <option value="">Selecione uma posição</option>
              <option v-for="posicao in posicoes" :key="posicao" :value="posicao">
                {{ posicao }}
              </option>
            </select>
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              Grupo
            </label>
            <select
              v-model="jogadorForm.grupoId"
              required
              class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]"
            >
              <option value="">Selecione um grupo</option>
              <option v-for="grupo in grupos" :key="grupo.id" :value="grupo.id">
                {{ grupo.nome }} ({{ grupo.modalidade.nome }})
              </option>
            </select>
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              v-model="jogadorForm.ativo"
              class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]"
            >
              <option :value="true">Ativo</option>
              <option :value="false">Inativo</option>
            </select>
          </div>
        </div>
      </form>

      <template #footer>
        <div class="flex justify-end gap-3">
          <button
            type="button"
            class="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
            @click="closeJogadorModal"
          >
            Cancelar
          </button>
          <button
            type="button"
            class="px-4 py-2 text-white bg-[var(--brand-green)] rounded hover:bg-opacity-90"
            :disabled="loadingJogador"
            @click="salvarJogador"
          >
            {{ loadingJogador ? 'Salvando...' : 'Salvar' }}
          </button>
        </div>
      </template>
    </Modal>
  </div>
</template>
