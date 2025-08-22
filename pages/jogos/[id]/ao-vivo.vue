<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header com placar -->
    <div class="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg">
      <div class="max-w-6xl mx-auto px-4 py-6">
        <div class="flex items-center justify-between mb-4">
          <NuxtLink to="/jogos" class="text-green-100 hover:text-white flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Voltar aos Jogos
          </NuxtLink>
          <div class="flex items-center gap-4">
            <div class="text-sm opacity-90">{{ formatDate24(jogo?.dataHora) }}</div>
            <span class="px-3 py-1 rounded-full text-xs bg-red-500 text-white animate-pulse">
              🔴 AO VIVO
            </span>
          </div>
        </div>

        <!-- Placar Principal -->
        <div v-if="jogo" class="text-center">
          <div class="text-sm opacity-90 mb-2">{{ jogo.competicao?.nome || 'Competição' }}</div>
          
          <div class="flex items-center justify-center gap-8 mb-4">
            <!-- Equipa Casa -->
            <div class="flex items-center gap-4">
              <div class="text-right">
                <div class="text-2xl font-bold">{{ clube?.nomeCompleto || 'Sagrada Esperança' }}</div>
                <div class="text-sm opacity-90">CASA</div>
              </div>
              <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <img v-if="clube?.logoUrl" :src="clube.logoUrl" alt="Logo Casa" class="w-12 h-12 object-contain" />
                <div v-else class="text-green-600 font-bold text-lg">SE</div>
              </div>
            </div>

            <!-- Placar -->
            <div class="text-center">
              <div class="text-6xl font-bold mb-2">
                {{ placar.casa }} - {{ placar.fora }}
              </div>
              <div class="text-lg opacity-90">
                {{ tempoJogo }}'
              </div>
            </div>

            <!-- Equipa Adversária -->
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <img v-if="jogo.logotipoAdversario" :src="jogo.logotipoAdversario" alt="Logo Adversário" class="w-12 h-12 object-contain" />
                <div v-else class="text-gray-600 font-bold text-lg">{{ jogo.adversario?.substring(0, 2).toUpperCase() }}</div>
              </div>
              <div class="text-left">
                <div class="text-2xl font-bold">{{ jogo.adversario }}</div>
                <div class="text-sm opacity-90">FORA</div>
              </div>
            </div>
          </div>

          <div class="text-sm opacity-90">{{ jogo.local }}</div>
        </div>
      </div>
    </div>

    <!-- Conteúdo Principal -->
    <div class="max-w-6xl mx-auto px-4 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Coluna Principal - Eventos -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Adicionar Evento -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4">Registrar Evento</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select v-model="novoEvento.tipo" class="w-full px-3 py-2 border rounded-md">
                  <option v-for="tipo in tiposEvento" :key="tipo.value" :value="tipo.value">
                    {{ tipo.label }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Minuto</label>
                <input v-model.number="novoEvento.minuto" type="number" min="0" max="130" class="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Equipa</label>
                <select v-model="novoEvento.lado" class="w-full px-3 py-2 border rounded-md">
                  <option value="CASA">{{ clube?.nomeCompleto || 'Casa' }}</option>
                  <option value="FORA">{{ jogo?.adversario || 'Fora' }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Jogador</label>
                <select v-model.number="novoEvento.jogadorId" class="w-full px-3 py-2 border rounded-md">
                  <option :value="undefined">Nenhum</option>
                  <option v-for="j in jogadoresDisponiveis" :key="j.id" :value="j.id">
                    #{{ j.numero }} {{ j.nomeCompleto || j.nome }}
                  </option>
                </select>
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Observação</label>
                <input v-model="novoEvento.observacao" type="text" placeholder="Observação opcional" class="w-full px-3 py-2 border rounded-md" />
              </div>
              <div class="md:col-span-2 flex justify-end">
                <button 
                  @click="adicionarEvento" 
                  :disabled="enviandoEvento || !novoEvento.tipo || novoEvento.minuto == null"
                  class="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ enviandoEvento ? 'Registrando...' : 'Registrar Evento' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Timeline de Eventos -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4">Timeline do Jogo</h3>
            <div class="space-y-3 max-h-96 overflow-y-auto">
              <div v-for="evento in eventosOrdenados" :key="evento.id || `${evento.tipo}-${evento.minuto}`" 
                   class="flex items-center gap-4 p-3 border rounded-lg">
                <div class="text-lg font-bold text-gray-500 min-w-[3rem]">{{ evento.minuto }}'</div>
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-lg">{{ getEventoIcon(evento.tipo) }}</span>
                    <span class="font-medium">{{ getEventoLabel(evento.tipo) }}</span>
                    <span class="px-2 py-1 rounded text-xs" 
                          :class="evento.lado === 'CASA' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'">
                      {{ evento.lado === 'CASA' ? (clube?.nomeCompleto || 'Casa') : (jogo?.adversario || 'Fora') }}
                    </span>
                  </div>
                  <div v-if="evento.jogadorNome || evento.jogadorId" class="text-sm text-gray-600">
                    {{ evento.jogadorNome || `Jogador #${evento.jogadorId}` }}
                  </div>
                  <div v-if="evento.observacao" class="text-sm text-gray-500 italic">
                    {{ evento.observacao }}
                  </div>
                </div>
              </div>
              <div v-if="!eventosOrdenados.length" class="text-center text-gray-500 py-8">
                Nenhum evento registrado ainda
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar - Informações -->
        <div class="space-y-6">
          <!-- Estatísticas Rápidas -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4">Estatísticas</h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span>Golos</span>
                <span class="font-bold">{{ placar.casa }} - {{ placar.fora }}</span>
              </div>
              <div class="flex justify-between">
                <span>Cartões Amarelos</span>
                <span class="font-bold">{{ estatisticas.cartoesAmarelos.casa }} - {{ estatisticas.cartoesAmarelos.fora }}</span>
              </div>
              <div class="flex justify-between">
                <span>Cartões Vermelhos</span>
                <span class="font-bold">{{ estatisticas.cartoesVermelhos.casa }} - {{ estatisticas.cartoesVermelhos.fora }}</span>
              </div>
              <div class="flex justify-between">
                <span>Substituições</span>
                <span class="font-bold">{{ estatisticas.substituicoes.casa }} - {{ estatisticas.substituicoes.fora }}</span>
              </div>
            </div>
          </div>

          <!-- Onze Inicial -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4">Onze Inicial</h3>
            <div class="space-y-2 max-h-64 overflow-y-auto">
              <div v-for="jogador in onzeInicial" :key="jogador.jogadorId" 
                   class="flex items-center gap-2 text-sm">
                <span class="text-gray-500">#{{ jogador.numero || '-' }}</span>
                <span class="flex-1">{{ jogador.jogadorNome || `Jogador ${jogador.jogadorId}` }}</span>
                <span class="text-xs px-2 py-1 bg-gray-100 rounded">{{ jogador.posicao || '-' }}</span>
              </div>
            </div>
          </div>

          <!-- Ações Rápidas -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4">Ações</h3>
            <div class="space-y-3">
              <button 
                @click="finalizarJogo" 
                :disabled="finalizandoJogo"
                class="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {{ finalizandoJogo ? 'Finalizando...' : 'Finalizar Jogo' }}
              </button>
              <button 
                @click="atualizarDados" 
                :disabled="atualizandoDados"
                class="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
              >
                {{ atualizandoDados ? 'Atualizando...' : 'Atualizar Dados' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApi } from '@/services/api'
import { toastManager } from '@/utils/toast'
import { getApiErrorMessage } from '@/utils/error'

const api = useApi()
const route = useRoute()
const router = useRouter()
const toast = toastManager

const id = route.params.id as string

// Dados principais
const { data: jogo } = await useAsyncData(`jogo:ao-vivo:${id}`, () => api.getJogo(id))
const { data: clube } = await useAsyncData('jogo:ao-vivo:clube', () => api.getClube())
const { data: jogadores } = await useAsyncData('jogo:ao-vivo:jogadores', () => api.listJogadores())

// Verificar se o jogo está em andamento
if (jogo.value?.estadoJogo !== 'EM_ANDAMENTO') {
  throw createError({
    statusCode: 403,
    statusMessage: 'Este jogo não está em andamento'
  })
}

// Estados reativos
const eventos = ref<any[]>([])
const convocados = ref<any[]>([])
const tempoJogo = ref(0)
const atualizandoDados = ref(false)
const finalizandoJogo = ref(false)

// Novo evento
const novoEvento = ref({
  tipo: 'GOL',
  minuto: 0,
  lado: 'CASA',
  jogadorId: undefined as number | undefined,
  observacao: ''
})
const enviandoEvento = ref(false)

// Tipos de eventos
const tiposEvento = [
  { value: 'GOL', label: '⚽ Gol' },
  { value: 'ASSISTENCIA', label: '🎯 Assistência' },
  { value: 'CARTAO_AMARELO', label: '🟨 Cartão Amarelo' },
  { value: 'CARTAO_VERMELHO', label: '🟥 Cartão Vermelho' },
  { value: 'SUBSTITUICAO', label: '🔄 Substituição' },
  { value: 'LESAO', label: '🏥 Lesão' },
  { value: 'INTERVALO', label: '⏸️ Intervalo' },
  { value: 'INICIO_JOGO', label: '▶️ Início' },
  { value: 'FIM_JOGO', label: '⏹️ Fim' }
]

// Funções utilitárias
function formatDate24(iso?: string) {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleString(undefined, { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit', 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: false 
  })
}

function getEventoIcon(tipo: string) {
  const icons: Record<string, string> = {
    'GOL': '⚽',
    'ASSISTENCIA': '🎯',
    'CARTAO_AMARELO': '🟨',
    'CARTAO_VERMELHO': '🟥',
    'SUBSTITUICAO': '🔄',
    'LESAO': '🏥',
    'INTERVALO': '⏸️',
    'INICIO_JOGO': '▶️',
    'FIM_JOGO': '⏹️'
  }
  return icons[tipo] || '📝'
}

function getEventoLabel(tipo: string) {
  const labels: Record<string, string> = {
    'GOL': 'Gol',
    'ASSISTENCIA': 'Assistência',
    'CARTAO_AMARELO': 'Cartão Amarelo',
    'CARTAO_VERMELHO': 'Cartão Vermelho',
    'SUBSTITUICAO': 'Substituição',
    'LESAO': 'Lesão',
    'INTERVALO': 'Intervalo',
    'INICIO_JOGO': 'Início do Jogo',
    'FIM_JOGO': 'Fim do Jogo'
  }
  return labels[tipo] || tipo
}

// Computadas
const eventosOrdenados = computed(() => {
  return [...eventos.value].sort((a, b) => b.minuto - a.minuto)
})

const jogadoresDisponiveis = computed(() => {
  const convocadosIds = new Set(convocados.value.map(c => c.jogadorId))
  return (jogadores.value || []).filter((j: any) => convocadosIds.has(j.id))
})

const onzeInicial = computed(() => {
  return convocados.value.filter(c => c.status === 'TITULAR')
})

// Placar reativo
const placar = computed(() => {
  const golsCasa = eventos.value.filter(e => e.tipo === 'GOL' && e.lado === 'CASA').length
  const golsFora = eventos.value.filter(e => e.tipo === 'GOL' && e.lado === 'FORA').length
  return { casa: golsCasa, fora: golsFora }
})

// Estatísticas reativas
const estatisticas = computed(() => {
  const stats = {
    cartoesAmarelos: { casa: 0, fora: 0 },
    cartoesVermelhos: { casa: 0, fora: 0 },
    substituicoes: { casa: 0, fora: 0 }
  }
  
  eventos.value.forEach(e => {
    const lado = e.lado === 'CASA' ? 'casa' : 'fora'
    if (e.tipo === 'CARTAO_AMARELO') stats.cartoesAmarelos[lado]++
    if (e.tipo === 'CARTAO_VERMELHO') stats.cartoesVermelhos[lado]++
    if (e.tipo === 'SUBSTITUICAO') stats.substituicoes[lado]++
  })
  
  return stats
})

// Funções
async function carregarDados() {
  try {
    const [eventosData, convocadosData] = await Promise.all([
      api.listarEventosJogo(id),
      api.listarConvocados(id)
    ])
    
    eventos.value = eventosData || []
    convocados.value = convocadosData || []
    
    // Calcular tempo de jogo baseado no último evento
    const ultimoEvento = eventos.value.reduce((max, e) => e.minuto > max ? e.minuto : max, 0)
    tempoJogo.value = ultimoEvento
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
  }
}

async function adicionarEvento() {
  if (!novoEvento.value.tipo || novoEvento.value.minuto == null) return
  
  enviandoEvento.value = true
  try {
    const payload: any = { ...novoEvento.value }
    if (!payload.jogadorId) delete payload.jogadorId
    if (!payload.observacao) delete payload.observacao
    
    await api.registrarEventoJogo(id, payload)
    toast.success('Evento registrado!')
    
    // Recarregar eventos
    await carregarDados()
    
    // Limpar formulário
    novoEvento.value = {
      tipo: 'GOL',
      minuto: tempoJogo.value,
      lado: 'CASA',
      jogadorId: undefined,
      observacao: ''
    }
  } catch (error: any) {
    console.error('Erro ao registrar evento:', error)
    toast.error(getApiErrorMessage(error, 'Erro ao registrar evento'))
  } finally {
    enviandoEvento.value = false
  }
}

async function finalizarJogo() {
  if (!confirm('Tem certeza que deseja finalizar este jogo? Esta ação não pode ser desfeita.')) return
  
  finalizandoJogo.value = true
  try {
    await api.finalizarJogo(id)
    toast.success('Jogo finalizado!')
    router.push('/jogos')
  } catch (error: any) {
    console.error('Erro ao finalizar jogo:', error)
    toast.error(getApiErrorMessage(error, 'Erro ao finalizar jogo'))
  } finally {
    finalizandoJogo.value = false
  }
}

async function atualizarDados() {
  atualizandoDados.value = true
  try {
    await carregarDados()
    toast.success('Dados atualizados!')
  } catch (error: any) {
    console.error('Erro ao atualizar dados:', error)
    toast.error('Erro ao atualizar dados')
  } finally {
    atualizandoDados.value = false
  }
}

// Atualização automática
let intervalId: NodeJS.Timeout | null = null

onMounted(async () => {
  await carregarDados()
  
  // Atualizar dados a cada 30 segundos
  intervalId = setInterval(carregarDados, 30000)
  
  // Definir minuto inicial baseado no tempo atual
  novoEvento.value.minuto = tempoJogo.value
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>
