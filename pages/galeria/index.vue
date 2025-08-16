<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useApi } from '@/services/api'
import type { AlbumResponseDTO, AlbumRequestDTO, MidiaRequestDTO, AlbumTipo, MidiaTipo } from '@/types/galeria'
import { toastManager } from '@/utils/toast'
import Toast from '@/components/Toast.vue'
import Modal from '@/components/Modal.vue'

const api = useApi()

// Estado
const albumModalOpen = ref(false)
const midiaModalOpen = ref(false)
const loadingAlbum = ref(false)
const loadingMidia = ref(false)
const selectedAlbumId = ref<number | null>(null)

// Dados
const { data: albuns, refresh: refreshAlbuns } = await useAsyncData('albuns', () => api.listAlbuns())

// Forms
const albumForm = reactive<AlbumRequestDTO>({
  titulo: '',
  descricao: '',
  tipo: 'EVENTO',
  midias: []
})

const midiaForm = reactive<MidiaRequestDTO>({
  tipo: 'IMAGEM',
  url: '',
  legenda: ''
})

// Constantes
const tiposAlbum: AlbumTipo[] = ['JOGO', 'TREINO', 'EVENTO', 'OUTRO']
const tiposMidia: MidiaTipo[] = ['IMAGEM', 'VIDEO']

// Funções
function openCriarAlbum() {
  selectedAlbumId.value = null
  Object.assign(albumForm, {
    titulo: '',
    descricao: '',
    tipo: 'EVENTO',
    midias: []
  })
  albumModalOpen.value = true
}

function openEditarAlbum(album: AlbumResponseDTO) {
  selectedAlbumId.value = album.id
  Object.assign(albumForm, {
    titulo: album.titulo,
    descricao: album.descricao,
    tipo: album.tipo
  })
  albumModalOpen.value = true
}

function closeAlbumModal() {
  albumModalOpen.value = false
}

function openAdicionarMidia(albumId: number) {
  selectedAlbumId.value = albumId
  Object.assign(midiaForm, {
    tipo: 'IMAGEM',
    url: '',
    legenda: ''
  })
  midiaModalOpen.value = true
}

function closeMidiaModal() {
  midiaModalOpen.value = false
}

async function salvarAlbum() {
  if (!albumForm.titulo || !albumForm.descricao) {
    toastManager.error('Preencha todos os campos obrigatórios')
    return
  }

  loadingAlbum.value = true
  try {
    if (selectedAlbumId.value) {
      await api.atualizarAlbum(selectedAlbumId.value, albumForm)
      toastManager.success('Álbum atualizado com sucesso!')
    } else {
      await api.criarAlbum(albumForm)
      toastManager.success('Álbum criado com sucesso!')
    }
    await refreshAlbuns()
    closeAlbumModal()
  } catch (error) {
    console.error('Erro ao salvar álbum:', error)
    toastManager.error('Erro ao salvar álbum. Tente novamente.')
  } finally {
    loadingAlbum.value = false
  }
}

async function salvarMidia() {
  if (!selectedAlbumId.value || !midiaForm.url || !midiaForm.legenda) {
    toastManager.error('Preencha todos os campos obrigatórios')
    return
  }

  loadingMidia.value = true
  try {
    await api.adicionarMidia(selectedAlbumId.value, midiaForm)
    toastManager.success('Mídia adicionada com sucesso!')
    await refreshAlbuns()
    closeMidiaModal()
  } catch (error) {
    console.error('Erro ao adicionar mídia:', error)
    toastManager.error('Erro ao adicionar mídia. Tente novamente.')
  } finally {
    loadingMidia.value = false
  }
}

async function apagarAlbum(id: number) {
  if (!confirm('Tem certeza que deseja apagar este álbum?')) return

  try {
    await api.apagarAlbum(id)
    toastManager.success('Álbum removido com sucesso!')
    await refreshAlbuns()
  } catch (error) {
    console.error('Erro ao apagar álbum:', error)
    toastManager.error('Erro ao remover álbum. Tente novamente.')
  }
}

async function apagarMidia(midiaId: number) {
  if (!confirm('Tem certeza que deseja remover esta mídia?')) return

  try {
    await api.apagarMidia(midiaId)
    toastManager.success('Mídia removida com sucesso!')
    await refreshAlbuns()
  } catch (error) {
    console.error('Erro ao remover mídia:', error)
    toastManager.error('Erro ao remover mídia. Tente novamente.')
  }
}

function formatarData(data: string) {
  return new Date(data).toLocaleDateString('pt-BR')
}
</script>

<template>
  <div class="space-y-6">
    <Toast />
    
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-semibold text-gray-800">Galeria</h1>
      <button 
        class="px-4 py-2 bg-[var(--brand-green)] text-white rounded hover:bg-opacity-90"
        @click="openCriarAlbum"
      >
        Novo Álbum
      </button>
    </div>

    <!-- Lista de Álbuns -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="album in albuns" 
        :key="album.id"
        class="bg-white rounded-lg border border-gray-200 overflow-hidden"
      >
        <!-- Cabeçalho do Álbum -->
        <div class="p-4 border-b">
          <div class="flex justify-between items-start mb-2">
            <h3 class="font-medium text-gray-900">{{ album.titulo }}</h3>
            <div class="flex gap-2">
              <button
                class="p-1 text-blue-600 hover:text-blue-800"
                @click="openEditarAlbum(album)"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                class="p-1 text-red-600 hover:text-red-800"
                @click="apagarAlbum(album.id)"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
          <p class="text-sm text-gray-600 mb-2">{{ album.descricao }}</p>
          <div class="flex justify-between items-center text-sm text-gray-500">
            <span>{{ formatarData(album.publicadoEm) }}</span>
            <span class="px-2 py-1 bg-gray-100 rounded text-xs">{{ album.tipo }}</span>
          </div>
        </div>

        <!-- Lista de Mídias -->
        <div class="p-4">
          <div class="flex justify-between items-center mb-3">
            <h4 class="text-sm font-medium text-gray-700">Mídias</h4>
            <button
              class="text-sm text-[var(--brand-green)] hover:text-opacity-80"
              @click="openAdicionarMidia(album.id)"
            >
              Adicionar Mídia
            </button>
          </div>
          
          <div class="space-y-3">
            <div 
              v-for="midia in album.midias" 
              :key="midia.id"
              class="flex items-start gap-3 p-2 bg-gray-50 rounded"
            >
              <!-- Preview -->
              <div class="w-16 h-16 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                <template v-if="midia.tipo === 'IMAGEM'">
                  <img :src="midia.url" :alt="midia.legenda" class="w-full h-full object-cover" />
                </template>
                <svg v-else class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              <!-- Info -->
              <div class="flex-1 min-w-0">
                <p class="text-sm text-gray-900 truncate">{{ midia.legenda }}</p>
                <p class="text-xs text-gray-500">{{ midia.tipo }}</p>
              </div>

              <!-- Ações -->
              <button
                class="p-1 text-red-600 hover:text-red-800"
                @click="apagarMidia(midia.id)"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Álbum -->
    <Modal 
      :open="albumModalOpen"
      :title="selectedAlbumId ? 'Editar Álbum' : 'Novo Álbum'"
      @close="closeAlbumModal"
    >
      <form class="space-y-4" @submit.prevent="salvarAlbum">
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Título
          </label>
          <input
            v-model="albumForm.titulo"
            type="text"
            required
            class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]"
          />
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Descrição
          </label>
          <textarea
            v-model="albumForm.descricao"
            rows="3"
            required
            class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]"
          ></textarea>
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Tipo
          </label>
          <select
            v-model="albumForm.tipo"
            required
            class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]"
          >
            <option v-for="tipo in tiposAlbum" :key="tipo" :value="tipo">
              {{ tipo }}
            </option>
          </select>
        </div>
      </form>

      <template #footer>
        <div class="flex justify-end gap-3">
          <button
            type="button"
            class="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
            @click="closeAlbumModal"
          >
            Cancelar
          </button>
          <button
            type="button"
            class="px-4 py-2 text-white bg-[var(--brand-green)] rounded hover:bg-opacity-90"
            :disabled="loadingAlbum"
            @click="salvarAlbum"
          >
            {{ loadingAlbum ? 'Salvando...' : 'Salvar' }}
          </button>
        </div>
      </template>
    </Modal>

    <!-- Modal de Mídia -->
    <Modal 
      :open="midiaModalOpen"
      title="Adicionar Mídia"
      @close="closeMidiaModal"
    >
      <form class="space-y-4" @submit.prevent="salvarMidia">
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Tipo
          </label>
          <select
            v-model="midiaForm.tipo"
            required
            class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]"
          >
            <option v-for="tipo in tiposMidia" :key="tipo" :value="tipo">
              {{ tipo }}
            </option>
          </select>
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            URL
          </label>
          <input
            v-model="midiaForm.url"
            type="url"
            required
            class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]"
          />
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Legenda
          </label>
          <input
            v-model="midiaForm.legenda"
            type="text"
            required
            class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]"
          />
        </div>
      </form>

      <template #footer>
        <div class="flex justify-end gap-3">
          <button
            type="button"
            class="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
            @click="closeMidiaModal"
          >
            Cancelar
          </button>
          <button
            type="button"
            class="px-4 py-2 text-white bg-[var(--brand-green)] rounded hover:bg-opacity-90"
            :disabled="loadingMidia"
            @click="salvarMidia"
          >
            {{ loadingMidia ? 'Salvando...' : 'Salvar' }}
          </button>
        </div>
      </template>
    </Modal>
  </div>
</template>
