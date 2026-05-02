<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Loja Oficial GDSE</h1>
        <p class="mt-1 text-sm text-gray-600">Gestão operacional do catálogo publicado, stock e separação de ordens.</p>
      </div>
      <div class="flex gap-2">
        <button
          class="inline-flex items-center justify-center rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 disabled:opacity-50"
          :disabled="carregandoCatalogo || carregandoSeparacao"
          @click="recarregarTudo"
        >
          Atualizar dados
        </button>
        <button
          class="inline-flex items-center justify-center rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
          @click="novoProduto"
        >
          + Novo Produto
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Produtos ativos" :value="String(produtos.length)" hint="Catálogo público" />
      <StatCard label="Variações" :value="String(totalVariacoes)" hint="Tamanhos, cores e SKUs" />
      <StatCard label="Stock total" :value="String(stockTotal)" hint="Variações com stock definido" />
      <StatCard label="Separações abertas" :value="String(separacoesAbertas.length)" hint="Ordens não entregues" />
    </div>

    <Tabs v-model="abaAtiva" :tabs="['Produtos', 'Separação']">
      <template #default="{ active }">
        <section v-if="active === 0" class="space-y-4">
          <div v-if="erroCatalogo" class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {{ erroCatalogo }}
          </div>

          <SkeletonLoader v-if="carregandoCatalogo" type="table" :rows="6" />

          <div v-else class="bg-white rounded-lg shadow">
            <DataTable
              :headers="['Produto', 'Categoria', 'Preço base', 'Variações', 'Stock', 'Estado']"
              :keys="['nome', 'categoria', 'preco', 'variacoesCount', 'stockTotal', 'estado']"
              :rows="produtosTabela"
              @row:click="abrirProduto"
            >
              <template #cell:preco="{ row }">{{ formatarPreco(row.preco) }}</template>
              <template #cell:stockTotal="{ row }">
                <span :class="row.stockTotal === 0 ? 'text-red-600 font-semibold' : 'text-gray-700'">
                  {{ row.stockTotal }}
                </span>
              </template>
              <template #cell:estado="{ row }">
                <span
                  class="rounded-full px-2 py-1 text-xs font-semibold"
                  :class="row.disponivel ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'"
                >
                  {{ row.disponivel ? 'Publicado' : 'Indisponível' }}
                </span>
              </template>
            </DataTable>
          </div>

          <div v-if="produtos.length === 0 && !carregandoCatalogo" class="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-600">
            Nenhum produto cadastrado no catálogo. Clique em "Novo Produto" para começar.
          </div>
        </section>

        <section v-else class="space-y-4">
          <div v-if="erroSeparacao" class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {{ erroSeparacao }}
          </div>

          <SkeletonLoader v-if="carregandoSeparacao" type="table" :rows="6" />

          <div v-else class="bg-white rounded-lg shadow">
            <DataTable
              :headers="['Ordem', 'Comprador', 'Telefone', 'Estado', 'Itens']"
              :keys="['numeroOrdem', 'compradorNome', 'compradorTelefone', 'status', 'itensCount']"
              :rows="separacoesAbertas"
              @row:click="abrirSeparacao"
            >
              <template #cell:compradorNome="{ row }">{{ row.compradorNome || 'Não informado' }}</template>
              <template #cell:compradorTelefone="{ row }">{{ row.compradorTelefone || 'Não informado' }}</template>
              <template #cell:status="{ row }">
                <span class="rounded-full px-2 py-1 text-xs font-semibold" :class="classeStatus(row.status)">
                  {{ normalizarStatus(row.status) }}
                </span>
              </template>
              <template #actions="{ row }">
                <div class="flex justify-end gap-2">
                  <button
                    class="rounded-md border border-green-600 px-3 py-1 text-xs font-semibold text-green-700 hover:bg-green-50 disabled:opacity-50"
                    :disabled="acaoEmCurso === row.subOrdemId || row.status === 'EM_SEPARACAO' || row.status === 'ENTREGUE'"
                    @click.stop="processarSeparacao(row)"
                  >
                    Processar
                  </button>
                  <button
                    class="rounded-md bg-green-600 px-3 py-1 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                    :disabled="acaoEmCurso === row.subOrdemId || row.status === 'ENTREGUE'"
                    @click.stop="entregarSeparacao(row)"
                  >
                    Entregar
                  </button>
                </div>
              </template>
            </DataTable>
          </div>
        </section>
      </template>
    </Tabs>

    <Modal :open="produtoModalAberto" title="Detalhe do produto" @close="produtoModalAberto = false">
      <div v-if="produtoSelecionado" class="space-y-4">
        <div class="flex gap-4">
          <img
            v-if="produtoSelecionado.urlImagem"
            :src="produtoSelecionado.urlImagem"
            :alt="produtoSelecionado.nome"
            class="h-24 w-24 rounded-lg bg-gray-50 object-contain p-2"
          />
          <div v-else class="flex h-24 w-24 items-center justify-center rounded-lg bg-gray-50 p-2 text-center text-xs text-gray-500">
            Sem imagem
          </div>
          <div>
            <h2 class="text-lg font-bold text-gray-900">{{ produtoSelecionado.nome }}</h2>
            <p class="text-sm text-gray-600">{{ produtoSelecionado.descricao || 'Sem descrição.' }}</p>
            <p class="mt-2 text-sm font-semibold text-gray-900">{{ formatarPreco(produtoSelecionado.preco) }}</p>
            <button @click="editarProduto(produtoSelecionado)" class="mt-2 inline-flex items-center text-xs font-semibold text-green-600 hover:text-green-700">
              <span class="mr-1">✏️</span> Editar Produto
            </button>
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-sm font-semibold text-gray-700">Variações</h3>
            <button @click="novaVariacao(produtoSelecionado)" class="text-xs font-semibold text-green-600 hover:text-green-700">
              + Adicionar Variação
            </button>
          </div>
          <div v-if="!produtoSelecionado.variacoes?.length" class="rounded-md bg-gray-50 p-3 text-sm text-gray-600">
            Produto sem variações.
          </div>
          <div v-else class="space-y-2">
            <div
              v-for="variacao in produtoSelecionado.variacoes"
              :key="variacao.id"
              class="flex items-center justify-between rounded-md border border-gray-200 p-3 text-sm"
            >
              <div class="grid grid-cols-2 gap-2 md:grid-cols-5 flex-1">
                <span><strong>Tamanho:</strong> {{ variacao.tamanho || variacao.valor || '-' }}</span>
                <span><strong>Cor:</strong> {{ variacao.cor || '-' }}</span>
                <span><strong>SKU:</strong> {{ variacao.sku || '-' }}</span>
                <span><strong>Preço:</strong> {{ variacao.preco ? formatarPreco(variacao.preco) : '-' }}</span>
                <span><strong>Stock:</strong> {{ variacao.stock ?? 'N/D' }}</span>
              </div>
              <button @click="editarVariacao(variacao)" class="ml-4 text-xs font-semibold text-blue-600 hover:text-blue-800">
                Editar
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>

    <Modal :open="separacaoModalAberto" title="Detalhe da separação" @close="separacaoModalAberto = false">
      <div v-if="separacaoSelecionada" class="space-y-4">
        <div class="grid gap-3 text-sm sm:grid-cols-2">
          <p><strong>Ordem:</strong> {{ separacaoSelecionada.numeroOrdem }}</p>
          <p><strong>Estado:</strong> {{ normalizarStatus(separacaoSelecionada.status) }}</p>
          <p><strong>Comprador:</strong> {{ separacaoSelecionada.compradorNome || 'Não informado' }}</p>
          <p><strong>Telefone:</strong> {{ separacaoSelecionada.compradorTelefone || 'Não informado' }}</p>
        </div>

        <div>
          <h3 class="mb-2 text-sm font-semibold text-gray-700">Itens</h3>
          <div class="space-y-2">
            <div
              v-for="(item, index) in separacaoSelecionada.itens || []"
              :key="index"
              class="rounded-md border border-gray-200 p-3 text-sm"
            >
              <p class="font-semibold text-gray-900">{{ item.nomeProduto }}</p>
              <p class="text-gray-600">{{ item.variacaoDescricao || 'Sem variação' }}</p>
              <p class="text-gray-600">Quantidade: {{ item.quantidade }}</p>
              <p v-if="item.observacoes" class="text-gray-600">Obs.: {{ item.observacoes }}</p>
            </div>
          </div>
        </div>
      </div>
    </Modal>

    <!-- Modais de Gestão (Edição/Criação) -->
    <ProdutoModal 
      :open="modalProdutoAberto" 
      :produtoParaEditar="produtoParaEditar"
      @close="fecharModalProduto"
      @saved="onProdutoSaved"
    />

    <VariacaoModal 
      :open="modalVariacaoAberto"
      :produtoId="produtoSelecionado?.id"
      :variacaoParaEditar="variacaoParaEditar"
      @close="fecharModalVariacao"
      @saved="onVariacaoSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import DataTable from '@/components/DataTable.vue'
import Modal from '@/components/Modal.vue'
import SkeletonLoader from '@/components/SkeletonLoader.vue'
import StatCard from '@/components/StatCard.vue'
import Tabs from '@/components/Tabs.vue'
import ProdutoModal from '@/components/loja/ProdutoModal.vue'
import VariacaoModal from '@/components/loja/VariacaoModal.vue'
import { useApi } from '@/services/api'
import { toastManager } from '@/utils/toast'

definePageMeta({
  middleware: ['auth', 'role']
})

const api = useApi()
const abaAtiva = ref(0)
const carregandoCatalogo = ref(false)
const carregandoSeparacao = ref(false)
const erroCatalogo = ref('')
const erroSeparacao = ref('')
const acaoEmCurso = ref<number | null>(null)
const produtoModalAberto = ref(false)
const separacaoModalAberto = ref(false)
const produtoSelecionado = ref<any | null>(null)
const separacaoSelecionada = ref<any | null>(null)

// Gestão de estado dos novos modais
const modalProdutoAberto = ref(false)
const produtoParaEditar = ref<any | null>(null)
const modalVariacaoAberto = ref(false)
const variacaoParaEditar = ref<any | null>(null)

const produtos = ref<any[]>([])
const separacoes = ref<any[]>([])

const extrairDados = (response: any) => {
  if (Array.isArray(response)) return response
  if (Array.isArray(response?.data)) return response.data
  if (Array.isArray(response?.data?.data)) return response.data.data
  return []
}

const carregarCatalogo = async () => {
  carregandoCatalogo.value = true
  erroCatalogo.value = ''
  try {
    const response = await api.listStoreCatalogo()
    produtos.value = extrairDados(response)
  } catch (error) {
    produtos.value = []
    erroCatalogo.value = 'Não foi possível carregar o catálogo da loja. Verifique a ligação com o backend e tente novamente.'
  } finally {
    carregandoCatalogo.value = false
  }
}

const carregarSeparacao = async () => {
  carregandoSeparacao.value = true
  erroSeparacao.value = ''
  try {
    const response = await api.listStoreSeparacao()
    separacoes.value = extrairDados(response)
  } catch (error) {
    separacoes.value = []
    erroSeparacao.value = 'Não foi possível carregar as ordens em separação. Verifique a ligação com o backend e tente novamente.'
  } finally {
    carregandoSeparacao.value = false
  }
}

const recarregarTudo = async () => {
  await Promise.all([carregarCatalogo(), carregarSeparacao()])
}

const produtosTabela = computed(() => produtos.value.map((produto) => {
  const variacoes = Array.isArray(produto.variacoes) ? produto.variacoes : []
  const stock = variacoes.reduce((total: number, variacao: any) => total + Number(variacao.stock || 0), 0)
  return {
    ...produto,
    variacoesCount: variacoes.length,
    stockTotal: stock,
    estado: produto.disponivel ? 'Publicado' : 'Indisponível'
  }
}))

const totalVariacoes = computed(() =>
  produtos.value.reduce((total, produto) => total + (produto.variacoes?.length || 0), 0)
)

const stockTotal = computed(() =>
  produtos.value.reduce((total, produto) => {
    const variacoes = Array.isArray(produto.variacoes) ? produto.variacoes : []
    return total + variacoes.reduce((subtotal: number, variacao: any) => subtotal + Number(variacao.stock || 0), 0)
  }, 0)
)

const separacoesAbertas = computed(() =>
  separacoes.value
    .filter((item) => item.status !== 'ENTREGUE' && item.status !== 'CANCELADO')
    .map((item) => ({ ...item, itensCount: item.itens?.length || 0 }))
)

const abrirProduto = (produto: any) => {
  produtoSelecionado.value = produto
  produtoModalAberto.value = true
}

const novoProduto = () => {
  produtoParaEditar.value = null
  modalProdutoAberto.value = true
}

const editarProduto = (produto: any) => {
  produtoParaEditar.value = produto
  modalProdutoAberto.value = true
  produtoModalAberto.value = false // Fechar modal de detalhes
}

const fecharModalProduto = () => {
  modalProdutoAberto.value = false
  produtoParaEditar.value = null
}

const onProdutoSaved = async () => {
  await carregarCatalogo()
}

const novaVariacao = (produto: any) => {
  variacaoParaEditar.value = null
  modalVariacaoAberto.value = true
}

const editarVariacao = (variacao: any) => {
  variacaoParaEditar.value = variacao
  modalVariacaoAberto.value = true
}

const fecharModalVariacao = () => {
  modalVariacaoAberto.value = false
  variacaoParaEditar.value = null
}

const onVariacaoSaved = async () => {
  await carregarCatalogo()
  // Atualiza o produtoSelecionado com a nova lista de variações recarregada do catálogo
  if (produtoSelecionado.value?.id) {
    const updatedProd = produtos.value.find(p => p.id === produtoSelecionado.value.id)
    if (updatedProd) produtoSelecionado.value = updatedProd
  }
}

const abrirSeparacao = (separacao: any) => {
  separacaoSelecionada.value = separacao
  separacaoModalAberto.value = true
}

const processarSeparacao = async (separacao: any) => {
  acaoEmCurso.value = separacao.subOrdemId
  try {
    await api.processarStoreSeparacao(separacao.subOrdemId)
    toastManager.success('Separação iniciada com sucesso.')
    await carregarSeparacao()
  } catch (error) {
    toastManager.error('Não foi possível iniciar a separação.')
  } finally {
    acaoEmCurso.value = null
  }
}

const entregarSeparacao = async (separacao: any) => {
  acaoEmCurso.value = separacao.subOrdemId
  try {
    await api.entregarStoreSeparacao(separacao.subOrdemId)
    toastManager.success('Ordem marcada como entregue.')
    await carregarSeparacao()
  } catch (error) {
    toastManager.error('Não foi possível marcar a ordem como entregue.')
  } finally {
    acaoEmCurso.value = null
  }
}

const formatarPreco = (valor: number | string | null | undefined) =>
  new Intl.NumberFormat('pt-AO', {
    style: 'currency',
    currency: 'AOA',
    maximumFractionDigits: 0
  }).format(Number(valor || 0))

const normalizarStatus = (status: string) => ({
  PENDENTE: 'Pendente',
  EM_SEPARACAO: 'Em separação',
  PRONTO: 'Pronto',
  PRONTO_PARA_ENTREGA: 'Pronto para entrega',
  ENTREGUE: 'Entregue',
  CANCELADO: 'Cancelado'
}[status] || status)

const classeStatus = (status: string) => ({
  PENDENTE: 'bg-amber-50 text-amber-700',
  EM_SEPARACAO: 'bg-blue-50 text-blue-700',
  PRONTO: 'bg-green-50 text-green-700',
  PRONTO_PARA_ENTREGA: 'bg-green-50 text-green-700',
  ENTREGUE: 'bg-gray-100 text-gray-700',
  CANCELADO: 'bg-red-50 text-red-700'
}[status] || 'bg-gray-100 text-gray-700')

await recarregarTudo()
</script>
