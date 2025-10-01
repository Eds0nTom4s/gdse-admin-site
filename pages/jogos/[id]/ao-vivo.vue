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
                <div class="text-2xl font-bold">{{ clube?.sigla || 'Sagrada Esperança' }}</div>
                <div class="text-sm opacity-90">CASA</div>
              </div>
              <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <img v-if="clube?.logoUrl" :src="clube.logoUrl" alt="Logo Casa" class="w-12 h-12 object-contain" />
                <div v-else class="text-green-600 font-bold text-lg">{{ clube?.sigla }}</div>
              </div>
            </div>

            <!-- Placar -->
            <div class="text-center">
              <div class="text-6xl font-bold mb-2">
                {{ placar.casa }} - {{ placar.fora }}
              </div>
              <div class="text-lg opacity-90">
                {{ tempoJogoFormatado }}
              </div>
              <div class="text-sm opacity-75 mt-1">
                {{ statusJogo }}
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
                  <option value="CASA">{{ clube?.sigla || 'Casa' }}</option>
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
                      {{ evento.lado === 'CASA' ? (clube?.sigla || 'Casa') : (jogo?.adversario || 'Fora') }}
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

          <!-- Controle do Timer -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4">Controle do Jogo</h3>
            <div class="space-y-3">
              <button 
                @click="abrirModalSubstituicao" 
                class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                🔄 Nova Substituição
              </button>
              <button 
                v-if="!jogoEmIntervalo" 
                @click="pausarTimer" 
                class="w-full px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
              >
                ⏸️ Pausar Timer
              </button>
              <button 
                v-else 
                @click="retomarTimer" 
                class="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                ▶️ Retomar Timer
              </button>
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

    <!-- Modal de Substituição -->
    <Modal :open="modalSubstituicao" title="Nova Substituição" @close="modalSubstituicao = false">
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Minuto</label>
            <input v-model.number="substituicao.minuto" type="number" min="0" max="130" class="w-full px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Equipa</label>
            <select v-model="substituicao.lado" class="w-full px-3 py-2 border rounded-md">
              <option value="CASA">{{ clube?.sigla || 'Casa' }}</option>
              <option value="FORA">{{ jogo?.adversario || 'Fora' }}</option>
            </select>
          </div>
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Jogador que sai</label>
            <select v-model.number="substituicao.jogadorSai" class="w-full px-3 py-2 border rounded-md">
              <option :value="undefined">Selecione</option>
              <option v-for="jogador in jogadoresEmCampo" :key="jogador.jogadorId" :value="jogador.jogadorId">
                #{{ jogador.numero || '-' }} {{ jogador.jogadorNome || `Jogador ${jogador.jogadorId}` }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Jogador que entra</label>
            <select v-model.number="substituicao.jogadorEntra" class="w-full px-3 py-2 border rounded-md">
              <option :value="undefined">Selecione</option>
              <option v-for="jogador in jogadoresReserva" :key="jogador.jogadorId" :value="jogador.jogadorId">
                #{{ jogador.numero || '-' }} {{ jogador.jogadorNome || `Jogador ${jogador.jogadorId}` }}
              </option>
            </select>
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Observação (opcional)</label>
          <input v-model="substituicao.observacao" type="text" placeholder="Motivo da substituição" class="w-full px-3 py-2 border rounded-md" />
        </div>
      </div>
      
      <template #footer>
        <div class="flex justify-end gap-2">
          <button @click="modalSubstituicao = false" class="px-4 py-2 text-gray-600 border rounded-md hover:bg-gray-50">
            Cancelar
          </button>
          <button 
            @click="processarSubstituicao" 
            :disabled="processandoSubstituicao || !substituicao.jogadorSai || !substituicao.jogadorEntra"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {{ processandoSubstituicao ? 'Processando...' : 'Registrar Substituição' }}
          </button>
        </div>
      </template>
    </Modal>
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

// Timer do jogo
const timerIniciado = ref<Date | null>(null)
const tempoRealJogo = ref(0)
const jogoEmIntervalo = ref(false)
const tempoIntervalo = ref(0)

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
  const convocadosIds = new Set(convocados.value.map((c: any) => c.jogadorId))
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

// Timer e status do jogo
const tempoJogoFormatado = computed(() => {
  if (tempoRealJogo.value > 0) {
    return `${tempoRealJogo.value}'`
  }
  return `${tempoJogo.value}'`
})

const statusJogo = computed(() => {
  if (jogoEmIntervalo.value) {
    return 'Intervalo'
  }
  
  const eventoIntervalo = eventos.value.find(e => e.tipo === 'INTERVALO')
  const eventoInicio = eventos.value.find(e => e.tipo === 'INICIO_JOGO')
  
  if (eventoIntervalo && !eventoInicio) {
    return 'Intervalo'
  }
  
  if (tempoRealJogo.value > 45 && tempoRealJogo.value <= 90) {
    return '2º Tempo'
  }
  
  if (tempoRealJogo.value > 90) {
    return 'Acréscimos'
  }
  
  return '1º Tempo'
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
    
    // Atualiza a UI localmente para reatividade imediata, sem esperar pelo refetch.
    const jogador = jogadores.value?.find((j: any) => j.id === payload.jogadorId)
    eventos.value.push({
      ...payload,
      id: `temp-${Date.now()}`, // ID temporário para a key do v-for
      jogadorNome: jogador ? (jogador.nomeCompleto || jogador.nome) : undefined
    })
    
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

// Timer em tempo real
let timerIntervalId: NodeJS.Timeout | null = null

function iniciarTimer() {
  // Verificar se já existe um evento de início
  const eventoInicio = eventos.value.find(e => e.tipo === 'INICIO_JOGO')
  if (eventoInicio) {
    // Calcular tempo baseado no timestamp do evento de início
    timerIniciado.value = new Date(eventoInicio.timestamp || Date.now())
  } else {
    // Iniciar timer agora
    timerIniciado.value = new Date()
  }
  
  // Atualizar timer a cada segundo
  timerIntervalId = setInterval(() => {
    if (timerIniciado.value && !jogoEmIntervalo.value) {
      const agora = new Date()
      const diferenca = agora.getTime() - timerIniciado.value.getTime()
      tempoRealJogo.value = Math.floor(diferenca / 60000) // Converter para minutos
      
      // Atualizar o minuto sugerido para novos eventos
      novoEvento.value.minuto = tempoRealJogo.value
    }
  }, 1000)
}

function pausarTimer() {
  jogoEmIntervalo.value = true
}

function retomarTimer() {
  jogoEmIntervalo.value = false
}

// Gestão de substituições
const modalSubstituicao = ref(false)
const substituicao = ref({
  minuto: 0,
  lado: 'CASA',
  jogadorSai: undefined as number | undefined,
  jogadorEntra: undefined as number | undefined,
  observacao: ''
})
const processandoSubstituicao = ref(false)

const jogadoresEmCampo = computed(() => {
  // Jogadores titulares menos os que saíram por substituição
  const substituicoes = eventos.value.filter(e => e.tipo === 'SUBSTITUICAO')
  const jogadoresSairam = new Set(substituicoes.map(s => s.jogadorId).filter(Boolean))
  
  return convocados.value.filter(c => 
    c.status === 'TITULAR' && !jogadoresSairam.has(c.jogadorId)
  )
})

const jogadoresReserva = computed(() => {
  // Jogadores reservas menos os que já entraram
  const substituicoes = eventos.value.filter(e => e.tipo === 'SUBSTITUICAO')
  const jogadoresEntraram = new Set()
  
  substituicoes.forEach(s => {
    if (s.observacao) {
      // Extrair ID do jogador que entrou da observação
      const match = s.observacao.match(/entra:?\s*(\d+)/)
      if (match) {
        jogadoresEntraram.add(parseInt(match[1]))
      }
    }
  })
  
  return convocados.value.filter(c => 
    c.status === 'RESERVA' && !jogadoresEntraram.has(c.jogadorId)
  )
})

function abrirModalSubstituicao() {
  substituicao.value = {
    minuto: tempoRealJogo.value || tempoJogo.value,
    lado: 'CASA',
    jogadorSai: undefined,
    jogadorEntra: undefined,
    observacao: ''
  }
  modalSubstituicao.value = true
}

async function processarSubstituicao() {
  if (!substituicao.value.jogadorSai || !substituicao.value.jogadorEntra) {
    toast.error('Selecione os jogadores que saem e entram')
    return
  }
  
  processandoSubstituicao.value = true
  try {
    // Buscar nomes dos jogadores
    const jogadorSai = jogadores.value?.find((j: any) => j.id === substituicao.value.jogadorSai)
    const jogadorEntra = jogadores.value?.find((j: any) => j.id === substituicao.value.jogadorEntra)
    
    const observacao = `${jogadorSai?.nomeCompleto || jogadorSai?.nome || `#${substituicao.value.jogadorSai}`} sai, ${jogadorEntra?.nomeCompleto || jogadorEntra?.nome || `#${substituicao.value.jogadorEntra}`} entra`
    
    // Registrar evento de substituição
    const payload = {
      tipo: 'SUBSTITUICAO',
      minuto: substituicao.value.minuto,
      lado: substituicao.value.lado,
      jogadorId: substituicao.value.jogadorSai,
      observacao: observacao
    }
    
    await api.registrarEventoJogo(id, payload)
    toast.success('Substituição registrada!')
    
    // Recarregar dados
    await carregarDados()
    
    // Fechar modal
    modalSubstituicao.value = false
  } catch (error: any) {
    console.error('Erro ao processar substituição:', error)
    toast.error(getApiErrorMessage(error, 'Erro ao registrar substituição'))
  } finally {
    processandoSubstituicao.value = false
  }
}

// Atualização automática
let intervalId: NodeJS.Timeout | null = null

onMounted(async () => {
  await carregarDados()
  
  // Iniciar timer
  iniciarTimer()
  
  // Atualizar dados a cada 30 segundos
  intervalId = setInterval(carregarDados, 30000)
  
  // Definir minuto inicial baseado no tempo atual
  novoEvento.value.minuto = tempoRealJogo.value || tempoJogo.value
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
  if (timerIntervalId) {
    clearInterval(timerIntervalId)
  }
})
</script>
