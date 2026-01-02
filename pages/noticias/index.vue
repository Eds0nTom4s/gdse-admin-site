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

    <!-- Loading skeleton -->
    <SkeletonLoader v-if="carregando" type="table" :rows="5" />

    <!-- Tabela de notícias -->
    <div v-else class="bg-white rounded-lg shadow">
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

        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">Capa da Notícia</label>
          <div class="flex items-center gap-3">
            <div class="w-24 h-24 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
              <template v-if="capaPreviewUrl">
                <img :src="capaPreviewUrl" alt="capa" class="w-full h-full object-cover" />
              </template>
              <svg v-else class="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="flex-1">
              <div class="flex gap-2">
                <button type="button" class="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200" @click="abrirModalGaleria">Selecionar da Galeria</button>
                <button v-if="capaPreviewUrl" type="button" class="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200" @click="removerCapa">Remover</button>
              </div>
              <p class="text-xs text-gray-500 mt-1">A capa deve ser uma imagem. Vídeos não são aceites.</p>
            </div>
          </div>
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

    <!-- Modal Selecionar Capa da Galeria -->
    <Modal :open="modalGaleriaAberto" @close="fecharModalGaleria" title="Selecionar imagem da Galeria" size="large">
      <div class="space-y-4">
        <div v-if="carregandoGaleria" class="text-sm text-gray-600">Carregando álbuns...</div>
        <div v-if="erroGaleria" class="text-sm text-red-600">{{ erroGaleria }}</div>

        <div v-if="albunsGaleria && albunsGaleria.length === 0" class="text-sm text-gray-600">Nenhum álbum disponível.</div>

        <div v-if="albunsGaleria" class="space-y-6 max-h-[60vh] overflow-auto pr-2">
          <div v-for="album in albunsGaleria" :key="album.id" class="border rounded p-3">
            <div class="flex items-center justify-between mb-2">
              <h4 class="font-medium text-gray-800">{{ album.titulo }}</h4>
              <span class="text-xs text-gray-500">{{ album.tipo }}</span>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              <button
                v-for="midia in album.midias"
                :key="midia.id"
                type="button"
                class="border rounded overflow-hidden hover:ring-2 hover:ring-[var(--brand-green)]"
                @click="selecionarCapa(midia)"
                title="Selecionar"
              >
                <img :src="midia.url" :alt="midia.legenda" class="w-full h-28 object-cover" />
                <div class="px-2 py-1 text-xs text-gray-600 truncate text-left">{{ midia.legenda }}</div>
              </button>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end">
          <button type="button" class="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200" @click="fecharModalGaleria">Fechar</button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import DataTable from '@/components/DataTable.vue'
import Modal from '@/components/Modal.vue'
import { useApi } from '@/services/api'
import { toastManager } from '@/utils/toast'
import type { NoticiaResponseDTO, UsuarioResponseDTO } from '@/types'

const api = useApi()
const toast = toastManager

// Estados principais
const noticias = ref<NoticiaResponseDTO[]>([])
const usuarios = ref<UsuarioResponseDTO[]>([])

// Função para carregar notícias
async function carregarNoticias() {
  try {
    noticias.value = await api.listNoticias()
  } catch (error) {
    console.error('Erro ao carregar notícias:', error)
    toast.error('Erro ao carregar notícias')
  }
}

// Função para carregar usuários
async function carregarUsuarios() {
  try {
    usuarios.value = await api.listUsuarios()
  } catch (error) {
    console.error('Erro ao carregar usuários:', error)
    toast.error('Erro ao carregar usuários')
  }
}

// Carregar dados na inicialização
onMounted(async () => {
  await Promise.all([carregarNoticias(), carregarUsuarios()])
})

// Função refresh para recarregar notícias
const refresh = carregarNoticias

// Computed para usar as notícias com autor já incluído
const noticiasComAutor = computed<any[]>(() => {
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
const imagemSelecionada = ref<File | null>(null) // deprecado, não usado
const imagemInput = ref<HTMLInputElement | null>(null) // deprecado, não usado
const capaMidiaId = ref<number | null>(null)
const capaPreviewUrl = ref<string | null>(null)
const modalGaleriaAberto = ref(false)
const albunsGaleria = ref<any[] | null>(null)
const carregandoGaleria = ref(false)
const erroGaleria = ref<string | null>(null)

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
  capaMidiaId.value = null
  capaPreviewUrl.value = null
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
  capaMidiaId.value = null
  capaPreviewUrl.value = noticia.imagemUrl || null
}

// Modal Galeria (simplificado: usa lista de álbuns existente da página de Galeria)
async function abrirModalGaleria() {
  modalGaleriaAberto.value = true
  if (albunsGaleria.value) return
  carregandoGaleria.value = true
  erroGaleria.value = null
  try {
    const albuns = await api.listAlbuns()
    // Filtrar mídias do tipo IMAGEM
    albunsGaleria.value = (albuns || []).map((a: any) => ({
      ...a,
      midias: (a.midias || []).filter((m: any) => m.tipo === 'IMAGEM')
    }))
  } catch (e: any) {
    erroGaleria.value = 'Erro ao carregar álbuns. Tente novamente.'
  } finally {
    carregandoGaleria.value = false
  }
}

function fecharModalGaleria() {
  modalGaleriaAberto.value = false
}

function selecionarCapa(midia: any) {
  if (midia.tipo !== 'IMAGEM') {
    toast.warning('A capa deve ser uma imagem.')
    return
  }
  capaMidiaId.value = midia.id
  capaPreviewUrl.value = midia.url
  modalGaleriaAberto.value = false
}

function removerCapa() {
  capaMidiaId.value = null
  capaPreviewUrl.value = null
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

    // Seleção de capa
    if (capaMidiaId.value) {
      noticiaData.midiaId = capaMidiaId.value
    }

    if (editando.value && noticiaAtual.value) {
      await api.atualizarNoticia(noticiaAtual.value.id, noticiaData)
    } else {
      await api.criarNoticia(noticiaData)
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

<script lang="ts">
// Nota: Modal de galeria reutiliza endpoints já existentes de albuns
</script>
