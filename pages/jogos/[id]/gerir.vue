<template>
  <div class="space-y-6 max-w-5xl mx-auto px-4">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-semibold text-gray-900">Gerir Jogo</h2>
      <NuxtLink to="/jogos" class="text-[var(--brand-green)]">← Voltar</NuxtLink>
    </div>

    <div v-if="jogo" class="rounded-lg bg-white border p-4">
      <div class="flex items-center justify-between">
        <div>
          <div class="text-sm text-gray-500">{{ jogo.competicao?.nome }}</div>
          <div class="text-lg font-semibold text-gray-900">{{ jogo.adversario }}</div>
          <div class="text-sm text-gray-600 mt-1">{{ formatDate24(jogo.dataHora) }} • {{ jogo.local }}</div>
        </div>
        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs" :class="badgeClass">{{ jogo.estadoJogo }}</span>
      </div>
    </div>

    <Tabs v-model="tab" :tabs="tabs">
      <template #default="{ active }">
        <div v-show="active === 0" class="space-y-4">
          <div class="flex items-center justify-between text-sm text-gray-700">
            <div>Defina os convocados para este jogo.</div>
            <div class="text-gray-600">Convocados: <span class="font-semibold">{{ (convocados || []).length }}</span></div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Coluna 1: Disponíveis -->
            <div class="border rounded p-3">
              <div class="flex items-center justify-between mb-2">
                <div class="font-semibold">Jogadores disponíveis</div>
                <input v-model="filtroJogador" type="text" placeholder="Buscar por nome ou número" class="px-3 py-2 border rounded text-sm w-44" />
              </div>
              <div class="space-y-1 max-h-96 overflow-auto">
                <button
                  v-for="p in disponiveisFiltrados"
                  :key="p.id"
                  type="button"
                  class="w-full text-left px-3 py-2 border rounded hover:bg-[var(--brand-mint)]/30"
                  @click="adicionarConvocadoDireto(p)"
                >
                  <div class="flex items-center justify-between text-sm">
                    <div class="truncate"><span class="text-gray-500">#{{ p.numero }}</span> — {{ p.nomeCompleto || p.nome }}</div>
                    <span class="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700">{{ p.posicao }}</span>
                  </div>
                </button>
                <div v-if="!disponiveisFiltrados.length" class="text-sm text-gray-500">Nenhum jogador disponível com o filtro atual.</div>
              </div>
            </div>

            <!-- Coluna 2: Convocados (agrupados por posição) -->
            <div class="border rounded p-3">
              <div class="flex items-center justify-between mb-2">
                <div class="font-semibold">Convocados</div>
                <div class="text-xs text-gray-500">Clique para remover</div>
              </div>
              <div class="space-y-3 max-h-96 overflow-auto">
                <div v-for="(lista, pos) in convocadosAgrupados" :key="pos">
                  <div class="text-xs font-semibold text-gray-600 uppercase mb-1">{{ pos }} ({{ lista.length }})</div>
                  <div class="space-y-1">
                    <button
                      v-for="c in lista"
                      :key="c.jogadorId"
                      type="button"
                      class="w-full text-left px-3 py-2 border rounded hover:bg-red-50"
                      @click="removerConvocado(c.jogadorId)"
                    >
                      <div class="flex items-center justify-between text-sm">
                        <div class="truncate"><span class="text-gray-500">#{{ c.numero || '-' }}</span> — {{ c.jogadorNome || ('#'+c.jogadorId) }}</div>
                        <span class="text-xs text-red-600">Remover</span>
                      </div>
                    </button>
                  </div>
                </div>
                <div v-if="!(convocados && convocados.length)" class="text-sm text-gray-500">Nenhum jogador convocado ainda.</div>
              </div>
              <div class="text-right mt-3">
                <button class="px-3 py-2 rounded bg-blue-600 text-white disabled:opacity-50" :disabled="salvando || !(convocados && convocados.length)" @click="salvarConvocados">Salvar Convocados</button>
              </div>
            </div>
          </div>
        </div>

        <div v-show="active === 1" class="space-y-4">
          <div class="text-sm text-gray-700">Selecione o onze inicial a partir dos convocados.</div>
          <div class="grid grid-cols-1 md-grid-cols-2 md:grid-cols-2 gap-4">
            <div class="border rounded p-3">
              <div class="font-semibold mb-2">Disponíveis</div>
              <div class="space-y-2 max-h-80 overflow-auto">
                <div v-for="c in disponiveis" :key="c.jogadorId" class="flex items-center justify-between border rounded px-3 py-2">
                  <div class="text-sm truncate">
                    <span class="text-gray-500 mr-1">#{{ c.numero || '-' }}</span>
                    {{ c.jogadorNome || `#${c.jogadorId}` }}
                    <span class="ml-2 text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700">{{ c.posicao || '—' }}</span>
                  </div>
                  <button class="px-2 py-1 rounded bg-[var(--brand-green)] text-white text-xs" @click="adicionarAoOnze(c)">Adicionar</button>
                </div>
              </div>
            </div>
            <div class="border rounded p-3">
              <div class="font-semibold mb-2">Onze Inicial ({{ onze.length }}/11)</div>
              <div class="space-y-2 max-h-80 overflow-auto">
                <div v-for="c in onze" :key="c.jogadorId" class="flex items-center justify-between border rounded px-3 py-2">
                  <div class="text-sm truncate">
                    <span class="text-gray-500 mr-1">#{{ c.numero || '-' }}</span>
                    {{ c.jogadorNome || `#${c.jogadorId}` }}
                    <span class="ml-2 text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700">{{ c.posicao || '—' }}</span>
                  </div>
                  <button class="px-2 py-1 rounded bg-red-600 text-white text-xs" @click="removerDoOnze(c.jogadorId)">Remover</button>
                </div>
              </div>
              <div class="text-right mt-2">
                <button class="px-3 py-2 rounded bg-blue-600 text-white disabled:opacity-50" :disabled="onze.length !== 11 || salvandoOnze" @click="salvarOnze">Salvar onze</button>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Tabs from '@/components/Tabs.vue'
import { useRoute, useRouter } from 'vue-router'
import { useApi } from '@/services/api'
import { toastManager } from '@/utils/toast'
import { getApiErrorMessage } from '@/utils/error'

const api = useApi()
const toast = toastManager
const route = useRoute()
const router = useRouter()

const id = route.params.id as string
const { data: jogo } = await useAsyncData(`jogos:gerir:${id}`, () => api.getJogo(id))
const { data: jogadores } = await useAsyncData('jogos:gerir:jogadores', () => api.listJogadores())

// Verificar se o jogo está finalizado e redirecionar para relatório
if (jogo.value?.estadoJogo === 'FINALIZADO') {
  router.push(`/jogos/${id}/relatorio`)
}

const tab = ref(0)
const tabs = computed(() => ['Convocados', 'Onze Inicial'])

function formatDate24(iso?: string) {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })
}

const badgeClass = computed(() => {
  const estado = jogo.value?.estadoJogo
  if (estado === 'AGENDADO') return 'bg-amber-100 text-amber-800'
  if (estado === 'EM_ANDAMENTO') return 'bg-red-100 text-red-700'
  if (estado === 'FINALIZADO') return 'bg-gray-100 text-gray-700'
  return 'bg-gray-200 text-gray-600'
})

// Helpers
function findJogadorById(id: number) {
  return (jogadores.value || []).find((j: any) => j.id === id)
}

// Convocados
const convocados = ref<any[] | null>(null)
const filtroJogador = ref('')
const salvando = ref(false)
const onze = ref<any[]>([])

async function carregarConvocados() {
  const list = await api.listarConvocados(id)
  const mapped = (list || []).map((c: any) => {
    const j = c.jogadorId ? findJogadorById(c.jogadorId) : null
    return {
      ...c,
      jogadorNome: c.jogadorNome || j?.nomeCompleto || j?.nome,
      posicao: c.posicao || j?.posicao,
      numero: c.numero || j?.numero
    }
  })
  convocados.value = mapped
  // Pre-popular onze a partir dos convocados TITULARES (se houver)
  onze.value = mapped.filter((c: any) => c.status === 'TITULAR')
}
await carregarConvocados()

const disponiveisFiltrados = computed(() => {
  const query = (filtroJogador.value || '').toLowerCase().trim()
  const convocadosIds = new Set((convocados.value || []).map(c => c.jogadorId))
  const base = (jogadores.value || []).filter((j: any) => !convocadosIds.has(j.id))
  if (!query) return base
  return base.filter((j: any) => {
    const nome = (j.nomeCompleto || j.nome || '').toLowerCase()
    const numero = (j.numero != null ? String(j.numero) : '')
    const posicao = (j.posicao || '').toLowerCase()
    return nome.includes(query) || numero.includes(query) || posicao.includes(query)
  })
})

const convocadosEnriquecidos = computed(() => {
  return (convocados.value || []).map((c: any) => {
    const j = findJogadorById(c.jogadorId)
    return {
      ...c,
      jogadorNome: c.jogadorNome || j?.nomeCompleto || j?.nome,
      posicao: c.posicao || j?.posicao,
      numero: c.numero || j?.numero
    }
  })
})

const convocadosAgrupados = computed<Record<string, any[]>>(() => {
  const groups: Record<string, any[]> = {}
  for (const c of convocadosEnriquecidos.value) {
    const pos = c.posicao || 'Sem posição'
    if (!groups[pos]) groups[pos] = []
    groups[pos].push(c)
  }
  for (const key of Object.keys(groups)) {
    groups[key].sort((a, b) => (a.numero || 0) - (b.numero || 0))
  }
  return groups
})

function adicionarConvocadoDireto(p: any) {
  const existe = (convocados.value || []).some(c => c.jogadorId === p.id)
  if (existe) return
  const item = { jogadorId: p.id, jogadorNome: p.nomeCompleto || p.nome, numero: p.numero, posicao: p.posicao, status: 'RESERVA' }
  convocados.value = [...(convocados.value || []), item]
}

function removerConvocado(jogadorId: number) {
  if (!convocados.value) return
  convocados.value = convocados.value.filter(c => c.jogadorId !== jogadorId)
}

async function salvarConvocados() {
  salvando.value = true
  try {
    const payload = (convocados.value || []).map((c: any) => ({ jogadorId: c.jogadorId, status: c.status || 'RESERVA' }))
    await api.definirConvocados(id, payload)
    toast.success('Convocados salvos!')
  } catch (e: any) {
    console.error(e)
    toast.error(getApiErrorMessage(e, 'Falha ao salvar convocados'))
  } finally {
    salvando.value = false
  }
}

// Onze inicial
const disponiveis = computed(() => {
  // Disponíveis para onze: convocados que NÃO são TITULARES
  return convocadosEnriquecidos.value.filter(c => c.status !== 'TITULAR')
})
const salvandoOnze = ref(false)

function adicionarAoOnze(c: any) {
  if (onze.value.length >= 11) return
  if (onze.value.some(o => o.jogadorId === c.jogadorId)) return
  onze.value = [...onze.value, c]
}

function removerDoOnze(jogadorId: number) {
  onze.value = onze.value.filter(o => o.jogadorId !== jogadorId)
}

async function salvarOnze() {
  if (onze.value.length !== 11) return
  salvandoOnze.value = true
  try {
    const titularIds = new Set(onze.value.map(o => o.jogadorId))
    const payload = (convocados.value || []).map((c: any) => ({
      jogadorId: c.jogadorId,
      status: titularIds.has(c.jogadorId) ? 'TITULAR' : 'RESERVA',
      posicaoProvavel: c.posicaoProvavel || undefined
    }))
    await api.definirConvocados(id, payload)
    await carregarConvocados()
    toast.success('Onze inicial guardado!')
  } catch (e: any) {
    console.error(e)
    toast.error(getApiErrorMessage(e, 'Falha ao guardar onze'))
  } finally {
    salvandoOnze.value = false
  }
}
</script>
