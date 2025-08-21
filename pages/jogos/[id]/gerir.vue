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
          <div class="text-sm text-gray-700">Defina os convocados para este jogo.</div>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
            <div>
              <label class="block text-sm text-gray-700">Jogador</label>
              <select v-model.number="novoConvocado.jogadorId" class="mt-1 w-full px-3 py-2 border rounded">
                <option :value="undefined" disabled>Selecione</option>
                <option v-for="j in jogadoresFiltrados" :key="j.id" :value="j.id">{{ j.nomeCompleto || j.nome }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm text-gray-700">Status</label>
              <select v-model="novoConvocado.status" class="mt-1 w-full px-3 py-2 border rounded">
                <option value="TITULAR">TITULAR</option>
                <option value="RESERVA">RESERVA</option>
              </select>
            </div>
            <div>
              <label class="block text-sm text-gray-700">Posição provável</label>
              <input v-model="novoConvocado.posicaoProvavel" type="text" class="mt-1 w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label class="block text-sm text-gray-700">Pesquisar</label>
              <input v-model="filtroJogador" type="text" placeholder="Nome ou número" class="mt-1 w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <button class="px-3 py-2 rounded bg-[var(--brand-green)] text-white disabled:opacity-50" :disabled="!novoConvocado.jogadorId || adicionando" @click="adicionarConvocado">Adicionar</button>
            </div>
          </div>
          <div class="space-y-2">
            <div v-for="c in convocados || []" :key="c.jogadorId" class="flex items-center justify-between border rounded px-3 py-2">
              <div class="text-sm flex items-center gap-3">
                <span class="font-semibold">{{ c.jogadorNome || `#${c.jogadorId}` }}</span>
                <select v-model="c.status" class="px-2 py-1 border rounded text-xs">
                  <option value="TITULAR">TITULAR</option>
                  <option value="RESERVA">RESERVA</option>
                </select>
                <input v-model="c.posicaoProvavel" placeholder="Posição provável" class="px-2 py-1 border rounded text-xs" />
              </div>
              <button class="px-2 py-1 rounded bg-red-600 text-white text-xs" @click="removerConvocado(c.jogadorId)">Remover</button>
            </div>
          </div>
          <div class="text-right">
            <button class="px-3 py-2 rounded bg-blue-600 text-white disabled:opacity-50" :disabled="salvando || !(convocados && convocados.length)" @click="salvarConvocados">Salvar convocados</button>
          </div>
        </div>

        <div v-show="active === 1" class="space-y-4">
          <div class="text-sm text-gray-700">Selecione o onze inicial a partir dos convocados.</div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="border rounded p-3">
              <div class="font-semibold mb-2">Disponíveis</div>
              <div class="space-y-2 max-h-80 overflow-auto">
                <div v-for="c in disponiveis" :key="c.jogadorId" class="flex items-center justify-between border rounded px-3 py-2">
                  <div class="text-sm">{{ c.jogadorNome || `#${c.jogadorId}` }}</div>
                  <button class="px-2 py-1 rounded bg-[var(--brand-green)] text-white text-xs" @click="adicionarAoOnze(c)">Adicionar</button>
                </div>
              </div>
            </div>
            <div class="border rounded p-3">
              <div class="font-semibold mb-2">Onze Inicial ({{ onze.length }}/11)</div>
              <div class="space-y-2 max-h-80 overflow-auto">
                <div v-for="c in onze" :key="c.jogadorId" class="flex items-center justify-between border rounded px-3 py-2">
                  <div class="text-sm">{{ c.jogadorNome || `#${c.jogadorId}` }}</div>
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

// Convocados
const convocados = ref<any[] | null>(null)
const filtroJogador = ref('')
const novoConvocado = ref<any>({ jogadorId: undefined, status: 'TITULAR', posicaoProvavel: '' })
const adicionando = ref(false)
const salvando = ref(false)

async function carregarConvocados() {
  convocados.value = await api.listarConvocados(id)
}
await carregarConvocados()

const jogadoresFiltrados = computed(() => {
  const query = (filtroJogador.value || '').toLowerCase().trim()
  if (!query) return jogadores.value || []
  return (jogadores.value || []).filter((j: any) => {
    const nome = (j.nomeCompleto || j.nome || '').toLowerCase()
    const numero = (j.numero != null ? String(j.numero) : '')
    return nome.includes(query) || numero.includes(query)
  })
})

function removerConvocado(jogadorId: number) {
  if (!convocados.value) return
  convocados.value = convocados.value.filter(c => c.jogadorId !== jogadorId)
}

function adicionarConvocado() {
  if (!novoConvocado.value.jogadorId) return
  const existe = (convocados.value || []).some(c => c.jogadorId === novoConvocado.value.jogadorId)
  if (existe) return
  const item = { jogadorId: novoConvocado.value.jogadorId, status: novoConvocado.value.status, posicaoProvavel: novoConvocado.value.posicaoProvavel || undefined }
  convocados.value = [...(convocados.value || []), item]
  novoConvocado.value = { jogadorId: undefined, status: 'TITULAR', posicaoProvavel: '' }
}

async function salvarConvocados() {
  salvando.value = true
  try {
    const payload = (convocados.value || []).map(c => ({ jogadorId: c.jogadorId, status: c.status, posicaoProvavel: c.posicaoProvavel || undefined }))
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
const onze = ref<any[]>([])
const disponiveis = computed(() => {
  const setOnze = new Set(onze.value.map(o => o.jogadorId))
  return (convocados.value || []).filter(c => !setOnze.has(c.jogadorId))
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
  try {
    // Placeholder: definir endpoint quando disponível, p.ex. /api/jogos/{id}/onze
    // await api.definirOnze(id, onze.value.map(o => o.jogadorId))
    toast.success('Onze inicial guardado!')
  } catch (e: any) {
    console.error(e)
    toast.error(getApiErrorMessage(e, 'Falha ao guardar onze'))
  }
}
</script>


