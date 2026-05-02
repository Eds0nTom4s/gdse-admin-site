<template>
  <Modal :open="open" :title="produtoParaEditar?.id ? 'Editar Produto' : 'Novo Produto'" @close="$emit('close')">
    <form @submit.prevent="salvar" class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Código</label>
          <input v-model="form.codigo" type="text" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm" placeholder="SKU-123" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Nome</label>
          <input v-model="form.nome" type="text" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm" />
        </div>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700">Descrição</label>
        <textarea v-model="form.descricao" rows="3" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"></textarea>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Preço Base (AOA)</label>
          <input v-model="form.preco" type="number" step="0.01" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Categoria</label>
          <select v-model="form.categoria" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm">
            <option value="VESTUARIO">Vestuário</option>
            <option value="EQUIPAMENTO_DESPORTIVO">Equipamento Desportivo</option>
            <option value="ACESSORIO">Acessório</option>
            <option value="COLECCIONAVEL">Coleccionável</option>
          </select>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">URL da Imagem de Capa</label>
        <input v-model="form.urlImagem" type="url" placeholder="https://..." class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">URLs da Galeria (uma por linha)</label>
        <textarea v-model="formImagens" rows="3" placeholder="https://..." class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"></textarea>
      </div>

      <div class="flex items-center">
        <input v-model="form.disponivel" id="disponivel" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500" />
        <label for="disponivel" class="ml-2 block text-sm text-gray-900">Visível ao público na loja</label>
      </div>
    </form>

    <template #footer>
      <div class="flex justify-end gap-3">
        <button type="button" @click="$emit('close')" class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
          Cancelar
        </button>
        <button type="button" :disabled="salvando" @click="salvar" class="inline-flex justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
          {{ salvando ? 'A guardar...' : 'Guardar Produto' }}
        </button>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useApi } from '@/services/api'
import { toastManager } from '@/utils/toast'
import Modal from '@/components/Modal.vue'

const props = defineProps<{
  open: boolean
  produtoParaEditar?: any
}>()

const emit = defineEmits(['close', 'saved'])

const api = useApi()
const salvando = ref(false)

const form = ref({
  codigo: '',
  nome: '',
  descricao: '',
  preco: 0,
  categoria: 'VESTUARIO',
  urlImagem: '',
  disponivel: true,
  imagensGaleria: [] as string[]
})

const formImagens = computed({
  get: () => form.value.imagensGaleria.join('\n'),
  set: (val: string) => {
    form.value.imagensGaleria = val.split('\n').filter(url => url.trim().length > 0)
  }
})

watch(() => props.open, (isOpen) => {
  if (isOpen) {
    if (props.produtoParaEditar) {
      form.value = {
        codigo: props.produtoParaEditar.codigo || '',
        nome: props.produtoParaEditar.nome || '',
        descricao: props.produtoParaEditar.descricao || '',
        preco: props.produtoParaEditar.preco || 0,
        categoria: props.produtoParaEditar.categoria || 'VESTUARIO',
        urlImagem: props.produtoParaEditar.urlImagem || '',
        disponivel: props.produtoParaEditar.disponivel !== false,
        imagensGaleria: props.produtoParaEditar.imagensGaleria || []
      }
    } else {
      form.value = {
        codigo: '',
        nome: '',
        descricao: '',
        preco: 0,
        categoria: 'VESTUARIO',
        urlImagem: '',
        disponivel: true,
        imagensGaleria: []
      }
    }
  }
})

const salvar = async () => {
  if (!form.value.codigo || !form.value.nome || form.value.preco <= 0) {
    toastManager.error('Preencha os campos obrigatórios corretamente.')
    return
  }

  salvando.value = true
  try {
    const payload = {
      ...form.value,
      tempoPreparoMinutos: 0
    }

    if (props.produtoParaEditar?.id) {
      await api.atualizarStoreProduto(props.produtoParaEditar.id, payload)
      toastManager.success('Produto atualizado com sucesso!')
    } else {
      await api.criarStoreProduto(payload)
      toastManager.success('Produto criado com sucesso!')
    }
    emit('saved')
    emit('close')
  } catch (error) {
    console.error(error)
    toastManager.error('Erro ao guardar o produto.')
  } finally {
    salvando.value = false
  }
}
</script>
