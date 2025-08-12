<template>
  <div class="space-y-8">
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

<script setup lang="ts">
import { reactive, ref, computed, watchEffect } from 'vue'
import DataTable from '@/components/DataTable.vue'
import Modal from '@/components/Modal.vue'
import { useApi } from '@/services/api'

const api = useApi()

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