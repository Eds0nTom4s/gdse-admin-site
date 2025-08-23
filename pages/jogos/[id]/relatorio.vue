<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header do Relatório -->
    <div class="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
      <div class="max-w-6xl mx-auto px-4 py-6">
        <div class="flex items-center justify-between mb-4">
          <NuxtLink to="/jogos" class="text-blue-100 hover:text-white flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Voltar aos Jogos
          </NuxtLink>
          <div class="flex items-center gap-4">
            <button 
              @click="exportarPDF" 
              :disabled="exportandoPDF"
              class="px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-gray-50 disabled:opacity-50 flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              {{ exportandoPDF ? 'Exportando...' : 'Exportar PDF' }}
            </button>
            <span class="px-3 py-1 rounded-full text-xs bg-gray-500 text-white">
              FINALIZADO
            </span>
          </div>
        </div>

        <!-- Cabeçalho do Jogo -->
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
                <div v-else class="text-blue-600 font-bold text-lg">SE</div>
              </div>
            </div>

            <!-- Resultado Final -->
            <div class="text-center">
              <div class="text-6xl font-bold mb-2">
                {{ placarFinal.casa }} - {{ placarFinal.fora }}
              </div>
              <div class="text-lg opacity-90">
                RESULTADO FINAL
              </div>
              <div class="text-sm opacity-75 mt-1">
                {{ formatDate24(jogo.dataHora) }}
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

    <!-- Conteúdo do Relatório -->
    <div class="max-w-6xl mx-auto px-4 py-6" id="relatorio-content">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Coluna Principal - Resumo e Eventos -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Resumo do Jogo -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4">Resumo do Jogo</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div class="p-4 bg-gray-50 rounded-lg">
                <div class="text-2xl font-bold text-green-600">{{ estatisticas.golos.casa }}</div>
                <div class="text-sm text-gray-600">Golos Casa</div>
              </div>
              <div class="p-4 bg-gray-50 rounded-lg">
                <div class="text-2xl font-bold text-blue-600">{{ estatisticas.golos.fora }}</div>
                <div class="text-sm text-gray-600">Golos Fora</div>
              </div>
              <div class="p-4 bg-gray-50 rounded-lg">
                <div class="text-2xl font-bold text-yellow-600">{{ estatisticas.cartoesAmarelos.total }}</div>
                <div class="text-sm text-gray-600">Cartões Amarelos</div>
              </div>
              <div class="p-4 bg-gray-50 rounded-lg">
                <div class="text-2xl font-bold text-red-600">{{ estatisticas.cartoesVermelhos.total }}</div>
                <div class="text-sm text-gray-600">Cartões Vermelhos</div>
              </div>
            </div>
          </div>

          <!-- Timeline Completa de Eventos -->
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
                Nenhum evento registrado
              </div>
            </div>
          </div>

          <!-- Golos Detalhados -->
          <div v-if="golos.length > 0" class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4">Golos</h3>
            <div class="space-y-3">
              <div v-for="gol in golos" :key="gol.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div class="flex items-center gap-3">
                  <span class="text-2xl">⚽</span>
                  <div>
                    <div class="font-medium">{{ gol.jogadorNome || `Jogador #${gol.jogadorId}` }}</div>
                    <div class="text-sm text-gray-600">{{ gol.minuto }}' - {{ gol.lado === 'CASA' ? clube?.nomeCompleto : jogo?.adversario }}</div>
                  </div>
                </div>
                <div v-if="gol.observacao" class="text-sm text-gray-500 italic">
                  {{ gol.observacao }}
                </div>
              </div>
            </div>
          </div>

          <!-- Cartões -->
          <div v-if="cartoes.length > 0" class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4">Cartões</h3>
            <div class="space-y-3">
              <div v-for="cartao in cartoes" :key="cartao.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div class="flex items-center gap-3">
                  <span class="text-2xl">{{ cartao.tipo === 'CARTAO_AMARELO' ? '🟨' : '🟥' }}</span>
                  <div>
                    <div class="font-medium">{{ cartao.jogadorNome || `Jogador #${cartao.jogadorId}` }}</div>
                    <div class="text-sm text-gray-600">{{ cartao.minuto }}' - {{ cartao.lado === 'CASA' ? clube?.nomeCompleto : jogo?.adversario }}</div>
                  </div>
                </div>
                <div v-if="cartao.observacao" class="text-sm text-gray-500 italic">
                  {{ cartao.observacao }}
                </div>
              </div>
            </div>
          </div>

          <!-- Substituições -->
          <div v-if="substituicoes.length > 0" class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4">Substituições</h3>
            <div class="space-y-3">
              <div v-for="sub in substituicoes" :key="sub.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div class="flex items-center gap-3">
                  <span class="text-2xl">🔄</span>
                  <div>
                    <div class="font-medium">{{ sub.minuto }}' - {{ sub.lado === 'CASA' ? clube?.nomeCompleto : jogo?.adversario }}</div>
                    <div class="text-sm text-gray-600">{{ sub.observacao || 'Substituição' }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar - Informações Detalhadas -->
        <div class="space-y-6">
          <!-- Informações do Jogo -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4">Informações</h3>
            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Data:</span>
                <span class="font-medium">{{ formatDate24(jogo?.dataHora) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Local:</span>
                <span class="font-medium">{{ jogo?.local }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Competição:</span>
                <span class="font-medium">{{ jogo?.competicao?.nome || '—' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Grupo:</span>
                <span class="font-medium">{{ jogo?.grupo?.nome || '—' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Estado:</span>
                <span class="font-medium text-gray-700">{{ jogo?.estadoJogo }}</span>
              </div>
            </div>
          </div>

          <!-- Estatísticas Detalhadas -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4">Estatísticas</h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span>Golos</span>
                <span class="font-bold">{{ estatisticas.golos.casa }} - {{ estatisticas.golos.fora }}</span>
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
              <div class="flex justify-between">
                <span>Total de Eventos</span>
                <span class="font-bold">{{ eventos.length }}</span>
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
              <div v-if="!onzeInicial.length" class="text-center text-gray-500 py-4">
                Onze inicial não disponível
              </div>
            </div>
          </div>

          <!-- Convocados -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4">Convocados</h3>
            <div class="space-y-2 max-h-64 overflow-y-auto">
              <div v-for="jogador in convocados" :key="jogador.jogadorId" 
                   class="flex items-center gap-2 text-sm">
                <span class="text-gray-500">#{{ jogador.numero || '-' }}</span>
                <span class="flex-1">{{ jogador.jogadorNome || `Jogador ${jogador.jogadorId}` }}</span>
                <span class="text-xs px-2 py-1 rounded" 
                      :class="jogador.status === 'TITULAR' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'">
                  {{ jogador.status }}
                </span>
              </div>
              <div v-if="!convocados.length" class="text-center text-gray-500 py-4">
                Convocados não disponíveis
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '@/services/api'
import { toastManager } from '@/utils/toast'
import { getApiErrorMessage } from '@/utils/error'

const api = useApi()
const route = useRoute()
const toast = toastManager

const id = route.params.id as string

// Dados principais
const { data: jogo } = await useAsyncData(`jogo:relatorio:${id}`, () => api.getJogo(id))
const { data: clube } = await useAsyncData('jogo:relatorio:clube', () => api.getClube())

// Verificar se o jogo está finalizado
if (jogo.value?.estadoJogo !== 'FINALIZADO') {
  throw createError({
    statusCode: 403,
    statusMessage: 'Este relatório está disponível apenas para jogos finalizados'
  })
}

// Estados reativos
const eventos = ref<any[]>([])
const convocados = ref<any[]>([])
const exportandoPDF = ref(false)

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
  return [...eventos.value].sort((a, b) => a.minuto - b.minuto)
})

const onzeInicial = computed(() => {
  return convocados.value.filter(c => c.status === 'TITULAR')
})

// Placar final
const placarFinal = computed(() => {
  const golsCasa = eventos.value.filter(e => e.tipo === 'GOL' && e.lado === 'CASA').length
  const golsFora = eventos.value.filter(e => e.tipo === 'GOL' && e.lado === 'FORA').length
  return { casa: golsCasa, fora: golsFora }
})

// Estatísticas completas
const estatisticas = computed(() => {
  const stats = {
    golos: { casa: 0, fora: 0 },
    cartoesAmarelos: { casa: 0, fora: 0, total: 0 },
    cartoesVermelhos: { casa: 0, fora: 0, total: 0 },
    substituicoes: { casa: 0, fora: 0, total: 0 }
  }
  
  eventos.value.forEach(e => {
    const lado = e.lado === 'CASA' ? 'casa' : 'fora'
    if (e.tipo === 'GOL') stats.golos[lado]++
    if (e.tipo === 'CARTAO_AMARELO') {
      stats.cartoesAmarelos[lado]++
      stats.cartoesAmarelos.total++
    }
    if (e.tipo === 'CARTAO_VERMELHO') {
      stats.cartoesVermelhos[lado]++
      stats.cartoesVermelhos.total++
    }
    if (e.tipo === 'SUBSTITUICAO') {
      stats.substituicoes[lado]++
      stats.substituicoes.total++
    }
  })
  
  return stats
})

// Eventos por tipo
const golos = computed(() => {
  return eventos.value.filter(e => e.tipo === 'GOL').sort((a, b) => a.minuto - b.minuto)
})

const cartoes = computed(() => {
  return eventos.value.filter(e => e.tipo === 'CARTAO_AMARELO' || e.tipo === 'CARTAO_VERMELHO').sort((a, b) => a.minuto - b.minuto)
})

const substituicoes = computed(() => {
  return eventos.value.filter(e => e.tipo === 'SUBSTITUICAO').sort((a, b) => a.minuto - b.minuto)
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
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
    toast.error('Erro ao carregar dados do jogo')
  }
}

async function exportarPDF() {
  exportandoPDF.value = true
  try {
    // Implementar exportação para PDF
    // Por enquanto, usar window.print() como fallback
    const printContent = document.getElementById('relatorio-content')
    if (printContent) {
      const originalTitle = document.title
      document.title = `Relatório - ${clube.value?.nomeCompleto || 'Sagrada Esperança'} vs ${jogo.value?.adversario} - ${formatDate24(jogo.value?.dataHora)}`
      
      // Criar uma nova janela para impressão
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>${document.title}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #ccc; padding-bottom: 20px; }
              .score { font-size: 48px; font-weight: bold; margin: 20px 0; }
              .team-info { display: flex; justify-content: space-between; align-items: center; margin: 20px 0; }
              .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin: 20px 0; }
              .stat-box { text-align: center; padding: 15px; border: 1px solid #ddd; border-radius: 8px; }
              .events { margin: 20px 0; }
              .event { display: flex; align-items: center; padding: 10px; border-bottom: 1px solid #eee; }
              .event-time { font-weight: bold; margin-right: 15px; min-width: 40px; }
              .lineup { margin: 20px 0; }
              .player { padding: 5px 0; border-bottom: 1px solid #f0f0f0; }
              @media print {
                body { margin: 0; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Relatório do Jogo</h1>
              <div class="team-info">
                <div><strong>${clube.value?.nomeCompleto || 'Sagrada Esperança'}</strong> (Casa)</div>
                <div class="score">${placarFinal.value.casa} - ${placarFinal.value.fora}</div>
                <div><strong>${jogo.value?.adversario}</strong> (Fora)</div>
              </div>
              <p><strong>Data:</strong> ${formatDate24(jogo.value?.dataHora)} | <strong>Local:</strong> ${jogo.value?.local}</p>
              <p><strong>Competição:</strong> ${jogo.value?.competicao?.nome || '—'}</p>
            </div>
            
            <div class="stats">
              <div class="stat-box">
                <div style="font-size: 24px; font-weight: bold; color: #059669;">${estatisticas.value.golos.casa}</div>
                <div>Golos Casa</div>
              </div>
              <div class="stat-box">
                <div style="font-size: 24px; font-weight: bold; color: #2563eb;">${estatisticas.value.golos.fora}</div>
                <div>Golos Fora</div>
              </div>
              <div class="stat-box">
                <div style="font-size: 24px; font-weight: bold; color: #d97706;">${estatisticas.value.cartoesAmarelos.total}</div>
                <div>Cartões Amarelos</div>
              </div>
              <div class="stat-box">
                <div style="font-size: 24px; font-weight: bold; color: #dc2626;">${estatisticas.value.cartoesVermelhos.total}</div>
                <div>Cartões Vermelhos</div>
              </div>
            </div>
            
            <div class="events">
              <h2>Timeline de Eventos</h2>
              ${eventosOrdenados.value.map(evento => `
                <div class="event">
                  <div class="event-time">${evento.minuto}'</div>
                  <div>
                    ${getEventoIcon(evento.tipo)} ${getEventoLabel(evento.tipo)} - 
                    ${evento.lado === 'CASA' ? clube.value?.nomeCompleto : jogo.value?.adversario}
                    ${evento.jogadorNome ? ` (${evento.jogadorNome})` : ''}
                    ${evento.observacao ? ` - ${evento.observacao}` : ''}
                  </div>
                </div>
              `).join('')}
            </div>
            
            <div class="lineup">
              <h2>Onze Inicial</h2>
              ${onzeInicial.value.map(jogador => `
                <div class="player">
                  #${jogador.numero || '-'} ${jogador.jogadorNome || `Jogador ${jogador.jogadorId}`}
                  ${jogador.posicao ? ` (${jogador.posicao})` : ''}
                </div>
              `).join('')}
            </div>
          </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.print()
        printWindow.close()
      }
      
      document.title = originalTitle
      toast.success('Relatório preparado para impressão/PDF')
    }
  } catch (error: any) {
    console.error('Erro ao exportar PDF:', error)
    toast.error('Erro ao exportar relatório')
  } finally {
    exportandoPDF.value = false
  }
}

onMounted(async () => {
  await carregarDados()
})
</script>
