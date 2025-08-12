<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">Gestão de Notícias</h1>
      <button
        @click="abrirModalCriacao"
        class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        Nova Notícia
      </button>
    </div>

    <div class="bg-white rounded-lg shadow">
      <DataTable
        :headers="['Título', 'Autor', 'Data de Publicação']"
        :keys="['titulo', 'autorNome', 'publicadoEm']"
        :rows="noticiasComAutor"
        @row:click="visualizarNoticia"
      >
        <template #cell:publicadoEm="{ row }">
          {{ formatarData(row.publicadoEm) }}
        </template>
        <template #actions="{ row }">
          <div class="flex gap-2">
            <button
              @click.stop="visualizarNoticia(row)"
              class="text-blue-600 hover:text-blue-800 text-sm"
              title="Visualizar"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
            </button>
            <button
              @click.stop="editarNoticia(row)"
              class="text-yellow-600 hover:text-yellow-800 text-sm"
              title="Editar"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </button>
            <button
              @click.stop="excluirNoticia(row)"
              class="text-red-600 hover:text-red-800 text-sm"
              title="Excluir"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
        </template>
      </DataTable>
    </div>

    <!-- Modal para Criar/Editar Notícia -->
    <Modal 
      :open="modalAberto" 
      @close="fecharModal"
      :title="editando ? 'Editar Notícia' : 'Nova Notícia'"
      size="large"
    >
      <form @submit.prevent="salvarNoticia" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Título</label>
          <input
            v-model="form.titulo"
            type="text"
            required
            minlength="10"
            class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Digite o título da notícia (mínimo 10 caracteres)"
          />
          <p class="text-xs text-gray-500 mt-1">{{ form.titulo.length }}/10 caracteres mínimos</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Conteúdo</label>
          <textarea
            v-model="form.conteudo"
            rows="8"
            required
            class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Conteúdo completo da notícia"
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Imagem da Notícia</label>
          <input
            ref="imagemInput"
            type="file"
            accept="image/*"
            @change="handleImageChange"
            class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <p class="text-xs text-gray-500 mt-1">Formatos aceitos: JPG, PNG, GIF. Tamanho máximo: 5MB</p>
        </div>

        <!-- Autor: Somente selecionável na criação, readonly na edição -->
        <div v-if="!editando">
          <label class="block text-sm font-medium text-gray-700">Autor</label>
          <select
            v-model="form.autorId"
            required
            :disabled="!usuarios || usuarios.length === 0"
            class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">
              {{ !usuarios ? 'Carregando autores...' : usuarios.length === 0 ? 'Nenhum autor disponível' : 'Selecione um autor' }}
            </option>
            <option v-for="usuario in usuarios || []" :key="usuario.id" :value="usuario.id">
              {{ usuario.nome }}
            </option>
          </select>
          <p v-if="usuarios && usuarios.length === 0" class="text-xs text-red-500 mt-1">
            Nenhum usuário encontrado. Verifique se há usuários cadastrados no sistema.
          </p>
        </div>

        <!-- Autor: Exibição readonly durante edição -->
        <div v-else>
          <label class="block text-sm font-medium text-gray-700">Autor</label>
          <div class="mt-1 w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-700">
            {{ obterNomeAutor(noticiaAtual) }}
          </div>
          <p class="text-xs text-gray-500 mt-1">O autor não pode ser alterado após a criação da notícia.</p>
        </div>
      </form>

      <template #footer>
        <div class="flex justify-end gap-2">
          <button
            @click="fecharModal"
            type="button"
            class="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg"
          >
            Cancelar
          </button>
          <button
            @click="salvarNoticia"
            :disabled="carregandoAcao"
            class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50"
          >
            {{ carregandoAcao ? 'Salvando...' : (editando ? 'Atualizar' : 'Criar') }}
          </button>
        </div>
      </template>
    </Modal>

    <!-- Modal de Visualização -->
    <Modal 
      :open="modalVisualizacao" 
      @close="fecharVisualizacao"
      :title="noticiaAtual?.titulo || 'Visualizar Notícia'"
      size="large"
    >
      <div v-if="noticiaAtual" class="space-y-4">
        <div v-if="noticiaAtual.imagemUrl" class="text-center">
          <img 
            :src="noticiaAtual.imagemUrl" 
            :alt="noticiaAtual.titulo"
            class="max-w-full h-auto rounded-lg mx-auto"
            style="max-height: 300px"
          />
        </div>
        
        <div>
          <p class="text-sm text-gray-600">Por: {{ obterNomeAutor(noticiaAtual) }}</p>
          <p class="text-sm text-gray-600">Publicado em: {{ formatarData(noticiaAtual.publicadoEm) }}</p>
        </div>

        <div>
          <h3 class="font-semibold text-gray-800">Conteúdo:</h3>
          <div class="text-gray-700 whitespace-pre-wrap">{{ noticiaAtual.conteudo }}</div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end">
          <button
            @click="fecharVisualizacao"
            class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg"
          >
            Fechar
          </button>
        </div>
      </template>
    </Modal>

    <!-- Modal de Confirmação de Exclusão -->
    <Modal 
      :open="modalExclusao" 
      @close="fecharExclusao"
      title="Confirmar Exclusão"
      size="small"
    >
      <p class="text-gray-700">
        Tem certeza que deseja excluir a notícia "<strong>{{ noticiaParaExcluir?.titulo }}</strong>"?
      </p>
      <p class="text-sm text-red-600 mt-2">Esta ação não pode ser desfeita.</p>

      <template #footer>
        <div class="flex justify-end gap-2">
          <button
            @click="fecharExclusao"
            class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg"
          >
            Cancelar
          </button>
          <button
            @click="confirmarExclusao"
            :disabled="carregandoAcao"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50"
          >
            {{ carregandoAcao ? 'Excluindo...' : 'Excluir' }}
          </button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import DataTable from '@/components/DataTable.vue'
import Modal from '@/components/Modal.vue'
import { useApi } from '@/services/api'

const api = useApi()
const toast = useToast()

// Estados principais
const { data: noticias, refresh } = await useAsyncData('noticias:list', () => api.listNoticias())

// Buscar usuários do banco de dados
const { data: usuarios } = await useAsyncData('usuarios:list', () => api.listUsuarios())

// Computed para usar as notícias com autor já incluído
const noticiasComAutor = computed(() => {
  if (!noticias.value) return []
  return noticias.value.map(noticia => ({
    ...noticia,
    autorNome: noticia.nomeAutor || 'Autor não informado'
  }))
})

// Estados dos modais
const modalAberto = ref(false)
const modalVisualizacao = ref(false)
const modalExclusao = ref(false)
const editando = ref(false)
const carregandoAcao = ref(false)

// Estados para dados atuais
const noticiaAtual = ref<any | null>(null)
const noticiaParaExcluir = ref<any | null>(null)
const imagemSelecionada = ref<File | null>(null)
const imagemInput = ref<HTMLInputElement | null>(null)

// Formulário
const form = reactive({
  titulo: '',
  conteudo: '',
  autorId: ''
})



// Funções utilitárias
function formatarData(data: string) {
  if (!data) return '—'
  const d = new Date(data)
  return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

// Função para lidar com mudança de imagem
function handleImageChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    
    // Validar tamanho do arquivo (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      toast.warning('A imagem deve ter no máximo 5MB')
      target.value = ''
      imagemSelecionada.value = null
      return
    }
    
    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      toast.warning('Apenas arquivos de imagem são permitidos')
      target.value = ''
      imagemSelecionada.value = null
      return
    }
    
    imagemSelecionada.value = file
  } else {
    imagemSelecionada.value = null
  }
}

function limparForm() {
  form.titulo = ''
  form.conteudo = ''
  form.autorId = ''
  imagemSelecionada.value = null
  if (imagemInput.value) {
    imagemInput.value.value = ''
  }
}

function preencherForm(noticia: any) {
  form.titulo = noticia.titulo || ''
  form.conteudo = noticia.conteudo || ''
  
  // Durante edição, o autorId não é editável, então não preenchemos o form
  // O autor será exibido apenas como readonly
  if (!editando.value) {
    form.autorId = noticia.autorId || ''
  }
  
  // Nota: Não preenchemos a imagem pois seria necessário baixar e converter para File
  imagemSelecionada.value = null
  if (imagemInput.value) {
    imagemInput.value.value = ''
  }
}

// Função para obter nome do autor - agora usa nomeAutor diretamente
function obterNomeAutor(noticia: any) {
  return noticia.nomeAutor || 'Autor não informado'
}

// Funções de modal
function abrirModalCriacao() {
  editando.value = false
  limparForm()
  modalAberto.value = true
}

function fecharModal() {
  modalAberto.value = false
  noticiaAtual.value = null
  editando.value = false
}

function fecharVisualizacao() {
  modalVisualizacao.value = false
  noticiaAtual.value = null
}

function fecharExclusao() {
  modalExclusao.value = false
  noticiaParaExcluir.value = null
}

// Funções de ação

async function visualizarNoticia(noticia: any) {
  try {
    noticiaAtual.value = await api.getNoticia(noticia.id)
    modalVisualizacao.value = true
  } catch (error) {
    console.error('Erro ao carregar notícia:', error)
    toast.error('Erro ao carregar detalhes da notícia')
  }
}

async function editarNoticia(noticia: any) {
  try {
    noticiaAtual.value = await api.getNoticia(noticia.id)
    editando.value = true
    preencherForm(noticiaAtual.value)
    modalAberto.value = true
  } catch (error) {
    console.error('Erro ao carregar notícia para edição:', error)
    toast.error('Erro ao carregar dados da notícia para edição')
  }
}

function excluirNoticia(noticia: any) {
  noticiaParaExcluir.value = noticia
  modalExclusao.value = true
}

async function salvarNoticia() {
  // Validação do título (mínimo 10 caracteres)
  if (form.titulo.length < 10) {
    toast.warning('O título deve ter no mínimo 10 caracteres')
    return
  }
  
  carregandoAcao.value = true
  
  try {
    // Preparar dados da notícia
    const noticiaData: any = {
      titulo: form.titulo,
      conteudo: form.conteudo
    }
    
    // Incluir autorId apenas na criação, não na edição
    if (!editando.value) {
      noticiaData.autorId = parseInt(form.autorId)
    }

    // Debug: verificar dados do frontend
    console.log('=== FRONTEND DEBUG ===')
    console.log('editando:', editando.value)
    console.log('noticiaData:', noticiaData)
    console.log('imagemSelecionada:', imagemSelecionada.value)
    if (imagemSelecionada.value) {
      console.log('Arquivo selecionado:')
      console.log('- Nome:', imagemSelecionada.value.name)
      console.log('- Tipo:', imagemSelecionada.value.type)
      console.log('- Tamanho:', imagemSelecionada.value.size)
    }
    console.log('=== FIM DEBUG ===')

    if (editando.value && noticiaAtual.value) {
      await api.atualizarNoticia(noticiaAtual.value.id, noticiaData, imagemSelecionada.value || undefined)
    } else {
      await api.criarNoticia(noticiaData, imagemSelecionada.value || undefined)
    }

    await refresh()
    fecharModal()
    
    const mensagem = editando.value ? 'Notícia atualizada com sucesso!' : 'Notícia criada com sucesso!'
    toast.success(mensagem)
    
  } catch (error) {
    console.error('Erro ao salvar notícia:', error)
    toast.error('Erro ao salvar notícia. Tente novamente.')
  } finally {
    carregandoAcao.value = false
  }
}

async function confirmarExclusao() {
  if (!noticiaParaExcluir.value) return
  
  carregandoAcao.value = true
  
  try {
    await api.apagarNoticia(noticiaParaExcluir.value.id)
    await refresh()
    fecharExclusao()
    toast.success('Notícia excluída com sucesso!')
  } catch (error) {
    console.error('Erro ao excluir notícia:', error)
    toast.error('Erro ao excluir notícia. Tente novamente.')
  } finally {
    carregandoAcao.value = false
  }
}
</script>
