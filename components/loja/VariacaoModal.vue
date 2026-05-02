<template>
  <Modal :open="open" :title="variacaoParaEditar?.id ? 'Editar Variação' : 'Nova Variação'" @close="$emit('close')">
    <form @submit.prevent="salvar" class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Tamanho</label>
          <input v-model="form.tamanho" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm" placeholder="S, M, L, XL, 40, 42..." />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Cor</label>
          <input v-model="form.cor" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm" placeholder="Azul, Branco..." />
        </div>
      </div>
      
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Tipo de Variação</label>
          <select v-model="form.tipo" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm">
            <option value="TAMANHO">Tamanho</option>
            <option value="COR">Cor</option>
            <option value="OUTRO">Outro (Ex: Edição Especial)</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Valor</label>
          <input v-model="form.valor" type="text" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm" placeholder="M, Azul, etc..." />
          <p class="mt-1 text-xs text-gray-500">Valor principal exibido.</p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">SKU (Código Interno Único)</label>
          <input v-model="form.sku" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Preço Opcional (Se for diferente da capa)</label>
          <input v-model="form.preco" type="number" step="0.01" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm" />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Stock Inicial / Atual</label>
        <input v-model="form.stock" type="number" min="0" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm" />
      </div>

      <div class="flex items-center">
        <input v-model="form.ativo" id="ativoVar" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500" />
        <label for="ativoVar" class="ml-2 block text-sm text-gray-900">Variação ativa no catálogo</label>
      </div>
    </form>

    <template #footer>
      <div class="flex justify-end gap-3">
        <button type="button" @click="$emit('close')" class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
          Cancelar
        </button>
        <button type="button" :disabled="salvando" @click="salvar" class="inline-flex justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
          {{ salvando ? 'A guardar...' : 'Guardar Variação' }}
        </button>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useApi } from '@/services/api'
import { toastManager } from '@/utils/toast'
import Modal from '@/components/Modal.vue'

const props = defineProps<{
  open: boolean
  produtoId: number | string | null
  variacaoParaEditar?: any
}>()

const emit = defineEmits(['close', 'saved'])

const api = useApi()
const salvando = ref(false)

const form = ref({
  tipo: 'TAMANHO',
  valor: '',
  tamanho: '',
  cor: '',
  sku: '',
  preco: null as number | null,
  stock: 0,
  ativo: true
})

watch(() => props.open, (isOpen) => {
  if (isOpen) {
    if (props.variacaoParaEditar) {
      form.value = {
        tipo: props.variacaoParaEditar.tipo || 'TAMANHO',
        valor: props.variacaoParaEditar.valor || props.variacaoParaEditar.tamanho || '',
        tamanho: props.variacaoParaEditar.tamanho || '',
        cor: props.variacaoParaEditar.cor || '',
        sku: props.variacaoParaEditar.sku || '',
        preco: props.variacaoParaEditar.preco || null,
        stock: props.variacaoParaEditar.stock || 0,
        ativo: props.variacaoParaEditar.ativo !== false
      }
    } else {
      form.value = {
        tipo: 'TAMANHO',
        valor: '',
        tamanho: '',
        cor: '',
        sku: '',
        preco: null,
        stock: 0,
        ativo: true
      }
    }
  }
})

const salvar = async () => {
  if (!props.produtoId) return
  if (!form.value.valor || form.value.stock < 0) {
    toastManager.error('Preencha os campos obrigatórios corretamente.')
    return
  }

  salvando.value = true
  try {
    const payload = { ...form.value }
    
    if (props.variacaoParaEditar?.id) {
      await api.atualizarStoreVariacao(props.produtoId, props.variacaoParaEditar.id, payload)
      toastManager.success('Variação atualizada com sucesso!')
    } else {
      await api.criarStoreVariacao(props.produtoId, payload)
      toastManager.success('Variação criada com sucesso!')
    }
    emit('saved')
    emit('close')
  } catch (error) {
    console.error(error)
    toastManager.error('Erro ao guardar variação. Verifique se o SKU já existe.')
  } finally {
    salvando.value = false
  }
}
</script>
