<script setup lang="ts">
import { reactive, ref, computed, watchEffect } from 'vue'
import DataTable from '@/components/DataTable.vue'
import Modal from '@/components/Modal.vue'
import { useApi } from '@/services/api'
import type { ClubeRequestDTO } from '@/types'
import { toastManager } from '@/utils/toast'
import Toast from '@/components/Toast.vue'

// Aplicar middleware de autenticação e autorização
definePageMeta({
  middleware: ['auth', 'role']
})

const api = useApi()
const config = useRuntimeConfig()

// Clube - Estado
const logoFile = ref<File | null>(null)
const logoPreview = ref<string | null>(null)
const savingClube = ref(false)
const uploadingLogo = ref(false)
const logoUrl = ref<string | null>(null)

// Carregar dados do clube
const { data: clubeData, refresh: refreshClube } = await useAsyncData('config:clube', () => api.getClube())

// Carregar metadados da logo
const { data: logoMetadata, refresh: refreshLogoMetadata } = await useAsyncData('config:logo', () => 
  api.getLogoMetadata().catch(error => {
    if (error.response?.status !== 404) {
      console.error('Erro ao carregar metadados da logo:', error)
      toastManager.error('Erro ao carregar a logo do clube')
    }
    return null
  })
)

// Atualizar URL da logo quando os metadados mudarem
watchEffect(() => {
  if (logoMetadata.value?.url) {
    logoUrl.value = logoMetadata.value.url
  } else {
    logoUrl.value = null
  }
})

const clube = reactive<ClubeRequestDTO>({
  nomeCompleto: '',
  sigla: '',
  slogan: '',
  logoUrl: '',
  fundacao: '',
  estadio: '',
  sede: {
    cidade: '',
    provincia: '',
    pais: '',
    bairro: null
  }
})

watchEffect(() => {
  if (clubeData.value) {
    clube.nomeCompleto = clubeData.value.nomeCompleto
    clube.sigla = clubeData.value.sigla
    clube.slogan = clubeData.value.slogan
    clube.fundacao = clubeData.value.fundacao
    clube.estadio = clubeData.value.estadio
    clube.sede = { ...clubeData.value.sede }
  }
})

async function salvarClube() {
  if (logoFile.value) {
    uploadingLogo.value = true
  }
  savingClube.value = true
  
  try {
    if (logoFile.value) {
      await api.atualizarLogoClube(clube.nomeCompleto, clube.estadio, logoFile.value)
      await refreshLogoMetadata()
      toastManager.success('Logo do clube atualizada com sucesso!')
    } else {
      await api.atualizarClube(clube)
      toastManager.success('Dados do clube atualizados com sucesso!')
    }
    await refreshClube()
    
    // Limpar preview e arquivo após salvar com sucesso
    logoPreview.value = null
    logoFile.value = null
  } catch (error) {
    toastManager.error('Erro ao salvar os dados do clube. Tente novamente.')
    console.error('Erro ao salvar clube:', error)
  } finally {
    savingClube.value = false
    uploadingLogo.value = false
  }
}

function onLogoChange(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files?.length) {
    const file = input.files[0]
    
    // Validar tamanho do arquivo (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toastManager.error('A imagem deve ter no máximo 5MB')
      input.value = '' // Limpar input
      return
    }
    
    // Validar tipo do arquivo
    if (!file.type.startsWith('image/')) {
      toastManager.error('O arquivo selecionado não é uma imagem válida')
      input.value = '' // Limpar input
      return
    }
    
    logoFile.value = file
    
    // Criar preview da imagem
    const reader = new FileReader()
    reader.onload = (e) => {
      logoPreview.value = e.target?.result as string
    }
    reader.onerror = () => {
      toastManager.error('Erro ao carregar a prévia da imagem')
      logoFile.value = null
      logoPreview.value = null
    }
    reader.readAsDataURL(file)
  }
}

function removerLogoSelecionado() {
  logoFile.value = null
  logoPreview.value = null
}

// Sobre
const { data: sobreData, refresh: refreshSobre } = await useAsyncData('config:sobre', () => api.getSobre())
const sobre = reactive<any>({ historia: '', missao: '', visao: '', valores: [] as string[] })
const valoresStr = ref('')

watchEffect(() => {
  if (sobreData.value) {
    sobre.historia = sobreData.value.historia || ''
    sobre.missao = sobreData.value.missao || ''
    sobre.visao = sobreData.value.visao || ''
    sobre.valores = Array.isArray(sobreData.value.valores) ? sobreData.value.valores : []
    valoresStr.value = sobre.valores.join('\n')
  }
})

const savingSobre = ref(false)
async function salvarSobre() {
  savingSobre.value = true
  try {
    await api.updateSobre({
      historia: sobre.historia,
      missao: sobre.missao,
      visao: sobre.visao,
      valores: valoresStr.value.split('\n').map(v => v.trim()).filter(Boolean)
    })
    await refreshSobre()
  } finally {
    savingSobre.value = false
  }
}

// Usuários
const { data: usuarios, refresh: refreshUsuarios } = await useAsyncData('config:usuarios', () => api.listUsuarios())
const usuarioModalOpen = ref(false)
const loadingUsuario = ref(false)
const usuarioForm = reactive<any>({ id: undefined, nome: '', username: '', email: '', senha: '', papel: 'EDITOR', ativo: true })

function openCriarUsuario() {
  Object.assign(usuarioForm, { id: undefined, nome: '', username: '', email: '', senha: '', papel: 'EDITOR', ativo: true })
  usuarioModalOpen.value = true
}

function openEditarUsuario(row: any) {
  Object.assign(usuarioForm, { id: row.id, nome: row.nome, username: row.username, email: row.email, senha: '', papel: row.papel, ativo: row.ativo })
  usuarioModalOpen.value = true
}

function closeUsuarioModal() {
  usuarioModalOpen.value = false
}

async function salvarUsuario() {
  loadingUsuario.value = true
  try {
    const payload: any = {
      nome: usuarioForm.nome,
      username: usuarioForm.username,
      email: usuarioForm.email,
      papel: usuarioForm.papel,
      ativo: usuarioForm.ativo
    }
    if (!usuarioForm.id || usuarioForm.senha) payload.senha = usuarioForm.senha
    if (usuarioForm.id) {
      await api.atualizarUsuario(usuarioForm.id, payload)
    } else {
      await api.criarUsuario(payload)
    }
    await refreshUsuarios()
    usuarioModalOpen.value = false
  } finally {
    loadingUsuario.value = false
  }
}

async function removerUsuario() {
  if (!usuarioForm.id) return
  loadingUsuario.value = true
  try {
    await api.apagarUsuario(usuarioForm.id)
    await refreshUsuarios()
    usuarioModalOpen.value = false
  } finally {
    loadingUsuario.value = false
  }
}
</script>

<template>
  <div class="space-y-8">
    <Toast />
    <section class="space-y-3">
      <h2 class="text-xl font-semibold text-gray-800">Clube</h2>
      <div class="bg-white border border-gray-200 rounded-lg p-4">
        <form class="grid grid-cols-1 gap-3" @submit.prevent="salvarClube">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label class="block text-sm text-gray-700">Nome Completo</label>
              <input v-model="clube.nomeCompleto" type="text" class="mt-1 w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label class="block text-sm text-gray-700">Sigla</label>
              <input v-model="clube.sigla" type="text" class="mt-1 w-full px-3 py-2 border rounded" />
            </div>
          </div>
          <div>
            <label class="block text-sm text-gray-700">Slogan</label>
            <input v-model="clube.slogan" type="text" class="mt-1 w-full px-3 py-2 border rounded" />
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label class="block text-sm text-gray-700">Data de Fundação</label>
              <input v-model="clube.fundacao" type="date" class="mt-1 w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label class="block text-sm text-gray-700">Estádio</label>
              <input v-model="clube.estadio" type="text" class="mt-1 w-full px-3 py-2 border rounded" />
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label class="block text-sm text-gray-700">Logo</label>
              <div class="mt-1 space-y-3">
                <!-- Logo atual ou prévia da nova imagem -->
                <div class="flex items-center gap-3">
                  <template v-if="logoPreview || logoUrl">
                    <img :src="logoPreview || (logoUrl || '')" alt="Logo do clube" class="w-16 h-16 object-contain border rounded bg-gray-50" />
                    <button 
                      v-if="logoFile" 
                      type="button" 
                      class="text-sm text-red-600 hover:text-red-800"
                      @click="removerLogoSelecionado"
                    >
                      Remover seleção
                    </button>
                  </template>
                  <div v-else class="w-16 h-16 border rounded bg-gray-50 flex items-center justify-center">
                    <svg class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                
                <!-- Input de arquivo -->
                <div class="flex items-center gap-3">
                  <label class="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 cursor-pointer">
                    <span class="text-sm text-gray-700">{{ logoFile ? 'Trocar logo' : 'Selecionar logo' }}</span>
                    <input type="file" accept="image/*" @change="onLogoChange" class="hidden" />
                  </label>
                  <span v-if="logoFile" class="text-sm text-gray-600">
                    {{ logoFile.name }}
                  </span>
                </div>

                <!-- Status do upload -->
                <div v-if="uploadingLogo" class="flex items-center gap-2 text-sm text-gray-600">
                  <svg class="animate-spin h-4 w-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Enviando logo...</span>
                </div>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label class="block text-sm text-gray-700">Cidade</label>
              <input v-model="clube.sede.cidade" type="text" class="mt-1 w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label class="block text-sm text-gray-700">Província</label>
              <input v-model="clube.sede.provincia" type="text" class="mt-1 w-full px-3 py-2 border rounded" />
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label class="block text-sm text-gray-700">País</label>
              <input v-model="clube.sede.pais" type="text" class="mt-1 w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label class="block text-sm text-gray-700">Bairro</label>
              <input v-model="clube.sede.bairro" type="text" class="mt-1 w-full px-3 py-2 border rounded" />
            </div>
          </div>
          <div class="flex justify-end gap-2">
            <button class="px-3 py-2 rounded bg-[var(--brand-green)] text-white" :disabled="savingClube" @click="salvarClube">Salvar</button>
          </div>
        </form>
      </div>
    </section>

    <section class="space-y-3">
      <h2 class="text-xl font-semibold text-gray-800">Sobre (Institucional)</h2>
      <div class="bg-white border border-gray-200 rounded-lg p-4">
        <form class="grid grid-cols-1 gap-3" @submit.prevent="salvarSobre">
          <div>
            <label class="block text-sm text-gray-700">História</label>
            <textarea v-model="sobre.historia" rows="3" class="mt-1 w-full px-3 py-2 border rounded"></textarea>
          </div>
          <div>
            <label class="block text-sm text-gray-700">Missão</label>
            <input v-model="sobre.missao" type="text" class="mt-1 w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label class="block text-sm text-gray-700">Visão</label>
            <input v-model="sobre.visao" type="text" class="mt-1 w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label class="block text-sm text-gray-700">Valores (um por linha)</label>
            <textarea v-model="valoresStr" rows="3" class="mt-1 w-full px-3 py-2 border rounded"></textarea>
          </div>
          <div class="flex justify-end gap-2">
            <button class="px-3 py-2 rounded bg-[var(--brand-green)] text-white" :disabled="savingSobre" @click="salvarSobre">Salvar</button>
          </div>
        </form>
      </div>
    </section>

    <section class="space-y-3">
      <h2 class="text-xl font-semibold text-gray-800">Usuários</h2>
      <div class="flex justify-end">
        <button class="px-3 py-2 rounded bg-[var(--brand-green)] text-white" @click="openCriarUsuario">Novo Usuário</button>
      </div>
      <DataTable
        :headers="['Nome', 'Username', 'Email', 'Papel', 'Ativo']"
        :keys="['nome', 'username', 'email', 'papel', 'ativo']"
        :rows="usuarios || []"
        @row:click="openEditarUsuario"
      >
        <template #cell:ativo="{ row }">
          <span :class="row.ativo ? 'inline-flex items-center px-2 py-1 rounded bg-green-100 text-green-800 text-xs' : 'inline-flex items-center px-2 py-1 rounded bg-gray-200 text-gray-700 text-xs'">{{ row.ativo ? 'Ativo' : 'Inativo' }}</span>
        </template>
      </DataTable>

      <Modal :open="usuarioModalOpen" :title="usuarioForm.id ? 'Editar Usuário' : 'Novo Usuário'" @close="closeUsuarioModal">
        <form class="grid grid-cols-1 md:grid-cols-2 gap-3" @submit.prevent="salvarUsuario">
          <div>
            <label class="block text-sm text-gray-700">Nome</label>
            <input v-model="usuarioForm.nome" type="text" required class="mt-1 w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label class="block text-sm text-gray-700">Username</label>
            <input v-model="usuarioForm.username" type="text" required class="mt-1 w-full px-3 py-2 border rounded" />
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm text-gray-700">Email</label>
            <input v-model="usuarioForm.email" type="email" required class="mt-1 w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label class="block text-sm text-gray-700">Senha</label>
            <input v-model="usuarioForm.senha" :type="usuarioForm.id ? 'password' : 'text'" :placeholder="usuarioForm.id ? 'Deixe em branco para não alterar' : ''" class="mt-1 w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label class="block text-sm text-gray-700">Papel</label>
            <select v-model="usuarioForm.papel" required class="mt-1 w-full px-3 py-2 border rounded">
              <option value="ADMIN">ADMIN</option>
              <option value="EDITOR">EDITOR</option>
            </select>
          </div>
          <div>
            <label class="block text-sm text-gray-700">Ativo</label>
            <select v-model="usuarioForm.ativo" class="mt-1 w-full px-3 py-2 border rounded">
              <option :value="true">Sim</option>
              <option :value="false">Não</option>
            </select>
          </div>
        </form>
        <template #footer>
          <div class="flex justify-between">
            <div class="space-x-2" v-if="usuarioForm.id">
              <button class="px-3 py-2 rounded bg-red-600 text-white" @click="removerUsuario" :disabled="loadingUsuario">Remover</button>
            </div>
            <div class="ml-auto space-x-2">
              <button class="px-3 py-2 rounded bg-gray-200" @click="closeUsuarioModal">Cancelar</button>
              <button class="px-3 py-2 rounded bg-[var(--brand-green)] text-white" @click="salvarUsuario" :disabled="loadingUsuario">Salvar</button>
            </div>
          </div>
        </template>
      </Modal>
    </section>
  </div>
</template>