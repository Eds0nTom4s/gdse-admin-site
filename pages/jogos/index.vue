<template>
  <div class="space-y-6 max-w-7xl mx-auto px-4">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-semibold text-gray-900">Jogos</h2>
      <button class="px-4 py-2 rounded bg-[var(--brand-green)] text-white hover:opacity-90" @click="openCriar">Novo Jogo</button>
    </div>

    <Tabs v-model="activeTab" :tabs="['Agendados', 'Em andamento', 'Finalizados', 'Cancelados']">
      <template #default="{ active }">
        <!-- Agendados -->
        <div v-show="active === 0">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="j in agendados"
              :key="j.id"
              class="rounded-lg bg-white border border-gray-200 shadow-sm overflow-hidden"
            >
              <div class="p-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <img v-if="j.logotipoAdversario" :src="j.logotipoAdversario" alt="logo adversário" class="h-8 w-8 object-contain" />
                    <div>
                      <div class="text-sm text-gray-500">{{ j.competicao?.nome || 'Competição' }}</div>
                      <div class="text-lg font-semibold text-gray-900">{{ j.adversario }}</div>
                    </div>
                  </div>
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">Agendado</span>
                </div>
                <div class="mt-2 text-sm text-gray-600">{{ formatDate24(j.dataHora) }} • {{ j.local }}</div>
                <div class="mt-3 flex items-center justify-end gap-2 text-sm">
                  <button class="px-2 py-1 rounded bg-blue-600 text-white" @click="openEditar(j)">Editar</button>
                  <button class="px-2 py-1 rounded bg-emerald-600 text-white" @click="goGerir(j)">Gerir jogo</button>
                  <button class="px-2 py-1 rounded bg-red-600 text-white" @click="remover(j)">Remover</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Em andamento -->
        <div v-show="active === 1">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="j in emAndamento" :key="j.id" class="rounded-lg bg-white border border-gray-200 shadow-sm overflow-hidden">
              <div class="p-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <img v-if="j.logotipoAdversario" :src="j.logotipoAdversario" alt="logo adversário" class="h-8 w-8 object-contain" />
                    <div>
                      <div class="text-sm text-gray-500">{{ j.competicao?.nome || 'Competição' }}</div>
                      <div class="text-lg font-semibold text-gray-900">{{ j.adversario }}</div>
                    </div>
                  </div>
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-700">Ao vivo</span>
                </div>
                <div class="mt-2 text-sm text-gray-600">{{ formatDate24(j.dataHora) }} • {{ j.local }}</div>
                <div class="mt-3 flex items-center justify-end gap-2 text-sm">
                  <button class="px-2 py-1 rounded bg-amber-600 text-white" @click="goGerir(j)">Gerir jogo</button>
                  <button class="px-2 py-1 rounded bg-blue-600 text-white" @click="openEditar(j)">Editar</button>
                  <button class="px-2 py-1 rounded bg-red-600 text-white" @click="remover(j)">Remover</button>
                  <button class="px-2 py-1 rounded bg-emerald-600 text-white" @click="goGerir(j)">Gerir jogo</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Finalizados -->
        <div v-show="active === 2">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="j in finalizados" :key="j.id" class="rounded-lg bg-white border border-gray-200 shadow-sm overflow-hidden">
              <div class="p-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <img v-if="j.logotipoAdversario" :src="j.logotipoAdversario" alt="logo adversário" class="h-8 w-8 object-contain" />
                    <div>
                      <div class="text-sm text-gray-500">{{ j.competicao?.nome || 'Competição' }}</div>
                      <div class="text-lg font-semibold text-gray-900">{{ j.adversario }}</div>
                    </div>
                  </div>
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">Finalizado</span>
                </div>
                <div class="mt-2 text-sm text-gray-600">{{ formatDate24(j.dataHora) }} • {{ j.local }}</div>
                <div class="mt-4 flex items-center justify-between">
                  <div class="text-2xl font-bold text-gray-900">{{ j.golsCasa != null && j.golsFora != null ? `${j.golsCasa}-${j.golsFora}` : '—' }}</div>
                  <div class="flex items-center gap-2 text-sm">
                    <button class="px-2 py-1 rounded bg-blue-600 text-white" @click="openEditar(j)">Editar</button>
                    <button class="px-2 py-1 rounded bg-red-600 text-white" @click="remover(j)">Remover</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Cancelados -->
        <div v-show="active === 3">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="j in cancelados" :key="j.id" class="rounded-lg bg-white border border-gray-200 shadow-sm overflow-hidden">
              <div class="p-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <img v-if="j.logotipoAdversario" :src="j.logotipoAdversario" alt="logo adversário" class="h-8 w-8 object-contain" />
                    <div>
                      <div class="text-sm text-gray-500">{{ j.competicao?.nome || 'Competição' }}</div>
                      <div class="text-lg font-semibold text-gray-900">{{ j.adversario }}</div>
                    </div>
                  </div>
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-200 text-gray-600">Cancelado</span>
                </div>
                <div class="mt-2 text-sm text-gray-600">{{ formatDate24(j.dataHora) }} • {{ j.local }}</div>
                <div class="mt-3 flex items-center justify-end gap-2 text-sm">
                  <button class="px-2 py-1 rounded bg-blue-600 text-white" @click="openEditar(j)">Editar</button>
                  <button class="px-2 py-1 rounded bg-red-600 text-white" @click="remover(j)">Remover</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Tabs>
  </div>

  <Modal :open="modalOpen" :title="form.id ? 'Editar Jogo' : 'Novo Jogo'" @close="closeModal">
    <form class="grid grid-cols-1 md:grid-cols-2 gap-3" @submit.prevent="salvar">
      <div>
        <label class="block text-sm text-gray-700">Competição</label>
        <select v-model.number="form.competicaoId" required class="mt-1 w-full px-3 py-2 border rounded">
          <option :value="undefined" disabled>Selecione uma competição</option>
          <option v-for="c in competicoes || []" :key="c.id" :value="c.id">{{ c.nome }}</option>
        </select>
      </div>
      <div>
        <label class="block text-sm text-gray-700">Grupo</label>
        <select v-model.number="form.grupoId" required class="mt-1 w-full px-3 py-2 border rounded">
          <option :value="undefined" disabled>Selecione um grupo</option>
          <option v-for="g in grupos || []" :key="g.id" :value="g.id">{{ g.nome }}</option>
        </select>
      </div>
      <div>
        <label class="block text-sm text-gray-700">Adversário</label>
        <input v-model="form.adversario" type="text" required class="mt-1 w-full px-3 py-2 border rounded" />
      </div>
      <div>
        <label class="block text-sm text-gray-700">Local</label>
        <input v-model="form.local" type="text" required :disabled="localDisabled" class="mt-1 w-full px-3 py-2 border rounded disabled:bg-gray-100 disabled:text-gray-500" />
        <p v-if="form.emCasa && !clube?.estadio" class="mt-1 text-xs text-amber-700">Estádio do clube não está configurado. Defina em Configurações.</p>
      </div>
      <div>
        <label class="block text-sm text-gray-700">Data e Hora</label>
        <div class="grid grid-cols-2 gap-2">
          <input v-model="dateField" type="date" required class="mt-1 w-full px-3 py-2 border rounded" />
          <div class="mt-1 grid grid-cols-2 gap-2">
            <select v-model="hoursField" class="w-full px-3 py-2 border rounded">
              <option v-for="h in 24" :key="h" :value="String(h-1).padStart(2,'0')">{{ String(h-1).padStart(2,'0') }}</option>
            </select>
            <select v-model="minutesField" class="w-full px-3 py-2 border rounded">
              <option v-for="m in [0,5,10,15,20,25,30,35,40,45,50,55]" :key="m" :value="String(m).padStart(2,'0')">{{ String(m).padStart(2,'0') }}</option>
            </select>
          </div>
        </div>
        <p class="mt-1 text-xs text-gray-500">Formato 24h (HH:mm)</p>
      </div>
      <div>
        <label class="block text-sm text-gray-700">Jogo em casa?</label>
        <div class="mt-2 flex items-center space-x-2">
          <input id="emCasa" v-model="form.emCasa" type="checkbox" class="h-4 w-4" />
          <label for="emCasa" class="text-sm text-gray-700">Sim</label>
        </div>
      </div>
      <div class="md:col-span-2">
        <label class="block text-sm text-gray-700">Logotipo do adversário</label>
        <div class="mt-2 flex items-center gap-3">
          <img v-if="logoPreview || form.logotipoAdversario" :src="logoPreview || form.logotipoAdversario" alt="Pré-visualização" class="h-12 w-12 object-contain border rounded bg-white" />
          <input ref="logoInput" type="file" accept="image/png,image/jpeg" class="hidden" @change="onLogoChange" />
          <button type="button" class="px-3 py-2 rounded bg-gray-100 text-gray-800 border" @click="logoInput?.click()" :disabled="uploadingLogo">{{ uploadingLogo ? 'Carregando...' : 'Carregar logo' }}</button>
          <button v-if="logoPreview || form.logotipoAdversario" type="button" class="px-3 py-2 rounded bg-red-100 text-red-700" @click="removerLogo">Remover</button>
        </div>
        <p class="mt-1 text-xs text-gray-500">Formatos: PNG/JPG. Tamanho sugerido: 256x256px. Máximo ~1MB.</p>
      </div>
    </form>
    <template #footer>
      <div class="flex justify-end space-x-2">
        <button class="px-3 py-2 rounded bg-gray-200" @click="closeModal">Cancelar</button>
        <button class="px-3 py-2 rounded bg-[var(--brand-green)] text-white" @click="salvar" :disabled="loading">Salvar</button>
      </div>
    </template>
  </Modal>

  <Modal :open="gerenciarOpen" :title="`Gerenciar Jogo`" @close="closeGerenciar">
    <div v-if="jogoAtual" class="space-y-4">
      <div class="text-sm text-gray-600">
        <div><span class="font-semibold">Adversário:</span> {{ jogoAtual.adversario }}</div>
        <div><span class="font-semibold">Data:</span> {{ formatDate24(jogoAtual.dataHora) }}</div>
        <div><span class="font-semibold">Local:</span> {{ jogoAtual.local }}</div>
        <div><span class="font-semibold">Estado:</span> {{ jogoAtual.estadoJogo || '—' }}</div>
      </div>

      <Tabs v-model="gerenciarTab" :tabs="gerenciarTabs">
        <template #default="{ active }">
          <div v-show="active === 0" class="space-y-3">
            <div class="flex items-center space-x-2">
              <label class="text-sm text-gray-700">Novo estado</label>
              <select v-model="novoEstado" class="px-3 py-2 border rounded" :disabled="estadosPossiveis.length === 0">
                <option v-if="estadosPossiveis.length === 0" :value="undefined">Sem transições</option>
                <option v-for="op in estadosPossiveis" :key="op" :value="op">{{ op }}</option>
              </select>
              <button class="px-3 py-2 rounded bg-blue-600 text-white disabled:opacity-50" :disabled="alterandoEstado || !novoEstado" @click="alterarEstado">Alterar</button>
              <button v-if="jogoAtual?.estadoJogo === 'EM_ANDAMENTO'" class="px-3 py-2 rounded bg-emerald-600 text-white disabled:opacity-50" :disabled="finalizandoJogo" @click="finalizarJogo">Finalizar</button>
            </div>
          </div>
          <div v-show="active === 1 && jogoAtual?.estadoJogo === 'EM_ANDAMENTO'" class="space-y-3">
            <div class="grid grid-cols-1 md:grid-cols-6 gap-2 items-end">
              <div>
                <label class="block text-sm text-gray-700">Tipo</label>
                <select v-model="novoEvento.tipo" class="mt-1 w-full px-3 py-2 border rounded">
                  <option v-for="t in tiposEvento" :key="t" :value="t">{{ t }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm text-gray-700">Minuto</label>
                <input v-model.number="novoEvento.minuto" type="number" min="0" max="130" class="mt-1 w-full px-3 py-2 border rounded" />
              </div>
              <div>
                <label class="block text-sm text-gray-700">Lado</label>
                <select v-model="novoEvento.lado" class="mt-1 w-full px-3 py-2 border rounded">
                  <option value="CASA">CASA</option>
                  <option value="FORA">FORA</option>
                </select>
              </div>
              <div>
                <label class="block text-sm text-gray-700">Jogador (opcional)</label>
                <select v-model.number="novoEvento.jogadorId" class="mt-1 w-full px-3 py-2 border rounded">
                  <option :value="undefined">—</option>
                  <option v-for="j in jogadores || []" :key="j.id" :value="j.id">{{ j.nomeCompleto || j.nome }}</option>
                </select>
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm text-gray-700">Observação</label>
                <input v-model="novoEvento.observacao" type="text" class="mt-1 w-full px-3 py-2 border rounded" />
              </div>
              <div>
                <button class="px-3 py-2 rounded bg-[var(--brand-green)] text-white disabled:opacity-50" :disabled="enviandoEvento" @click="adicionarEvento">Adicionar</button>
              </div>
            </div>
            <div class="space-y-2">
              <div v-for="e in eventos || []" :key="e.id || `${e.tipo}-${e.minuto}-${e.jogadorId || 'x'}`" class="flex items-center justify-between border rounded px-3 py-2">
                <div class="text-sm">
                  <span class="font-semibold">{{ e.tipo }}</span>
                  <span class="mx-2">{{ e.minuto }}'</span>
                  <span class="inline-block px-2 py-0.5 rounded text-xs" :class="e.lado === 'CASA' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'">{{ e.lado }}</span>
                  <span v-if="e.jogadorNome || e.jogadorId" class="ml-2 text-gray-600">{{ e.jogadorNome || `#${e.jogadorId}` }}</span>
                  <span v-if="e.observacao" class="ml-2 italic text-gray-500">— {{ e.observacao }}</span>
                </div>
              </div>
            </div>
          </div>
          <div v-show="active === 2 && jogoAtual?.estadoJogo === 'AGENDADO'" class="space-y-3">
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
                <label class="block text-sm text-gray-700">Posição provável (opcional)</label>
                <input v-model="novoConvocado.posicaoProvavel" type="text" class="mt-1 w-full px-3 py-2 border rounded" />
              </div>
              <div>
                <label class="block text-sm text-gray-700">Pesquisar jogador</label>
                <input v-model="filtroJogador" type="text" placeholder="Nome ou número" class="mt-1 w-full px-3 py-2 border rounded" />
              </div>
              <div>
                <button class="px-3 py-2 rounded bg-[var(--brand-green)] text-white disabled:opacity-50" :disabled="adicionandoConvocado || !novoConvocado.jogadorId" @click="adicionarConvocado">Adicionar</button>
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
              <button class="px-3 py-2 rounded bg-blue-600 text-white disabled:opacity-50" :disabled="salvandoConvocados || !(convocados && convocados.length)" @click="salvarConvocados">Salvar convocados</button>
            </div>
          </div>
          <div v-show="active === 1 && jogoAtual?.estadoJogo !== 'EM_ANDAMENTO'" class="text-sm text-gray-600">Gestão de eventos disponível apenas durante EM_ANDAMENTO.</div>
          <div v-show="active === 2 && jogoAtual?.estadoJogo !== 'AGENDADO'" class="text-sm text-gray-600">Gestão de convocados disponível apenas em AGENDADO.</div>
        </template>
      </Tabs>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Tabs from '@/components/Tabs.vue'
import { useApi } from '@/services/api'
import { toastManager } from '@/utils/toast'
import { getApiErrorMessage } from '@/utils/error'

const api = useApi()
const router = useRouter()
const toast = toastManager

const activeTab = ref(0)
const { data: jogos } = await useAsyncData('jogos:todos', () => api.listJogos())
const { data: competicoes } = await useAsyncData('jogos:competicoes', () => api.listCompeticoes())
const { data: grupos } = await useAsyncData('jogos:grupos', () => api.listGrupos())
const { data: jogadores } = await useAsyncData('jogos:jogadores', () => api.listJogadores())
const { data: clube } = await useAsyncData('jogos:clube', () => api.getClube())

// Lists por estado
const agendados = computed(() => (jogos.value || []).filter((j: any) => j.estadoJogo === 'AGENDADO').sort(sortByDateAsc))
const emAndamento = computed(() => (jogos.value || []).filter((j: any) => j.estadoJogo === 'EM_ANDAMENTO').sort(sortByDateAsc))
const finalizados = computed(() => (jogos.value || []).filter((j: any) => j.estadoJogo === 'FINALIZADO').sort(sortByDateDesc))
const cancelados = computed(() => (jogos.value || []).filter((j: any) => j.estadoJogo === 'CANCELADO').sort(sortByDateDesc))

function sortByDateAsc(a: any, b: any) {
  return new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime()
}
function sortByDateDesc(a: any, b: any) {
  return new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime()
}

function formatDate24(iso?: string) {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })
}

const modalOpen = ref(false)
const loading = ref(false)
const form = ref<any>({
  id: undefined,
  competicaoId: undefined,
  grupoId: undefined,
  adversario: '',
  local: '',
  dataHora: '',
  emCasa: false,
  logotipoAdversario: ''
})

// Campos separados para data e hora (24h)
const dateField = ref<string>('')
const hoursField = ref<string>('00')
const minutesField = ref<string>('00')

function updateFormDataHoraFromFields() {
  if (dateField.value) {
    const [year, month, day] = dateField.value.split('-').map(Number)
    const hour = Number(hoursField.value || '0')
    const minute = Number(minutesField.value || '0')
    const d = new Date()
    d.setFullYear(year)
    d.setMonth(month - 1)
    d.setDate(day)
    d.setHours(hour)
    d.setMinutes(minute)
    d.setSeconds(0)
    d.setMilliseconds(0)
    form.value.dataHora = d.toISOString()
  } else {
    form.value.dataHora = ''
  }
}

watch([dateField, hoursField, minutesField], updateFormDataHoraFromFields)

watch(() => form.value.dataHora, (iso) => {
  if (!iso) {
    dateField.value = ''
    hoursField.value = '00'
    minutesField.value = '00'
    return
  }
  const d = new Date(iso)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const mi = String(d.getMinutes()).padStart(2, '0')
  dateField.value = `${yyyy}-${mm}-${dd}`
  hoursField.value = hh
  minutesField.value = mi
}, { immediate: true })

// Upload logo adversário
const logoInput = ref<HTMLInputElement | null>(null)
const logoPreview = ref<string | null>(null)
const uploadingLogo = ref(false)

async function onLogoChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  if (file.size > 1_500_000) {
    toast.error('Ficheiro muito grande (máx ~1.5MB).')
    return
  }
  uploadingLogo.value = true
  try {
    const resp = await api.uploadLogoAdversario(file)
    // Espera-se que backend retorne { url }
    form.value.logotipoAdversario = resp?.url || resp
    logoPreview.value = form.value.logotipoAdversario
  } catch (err: any) {
    console.error(err)
    toast.error(getApiErrorMessage(err, 'Falha ao carregar logotipo.'))
  } finally {
    uploadingLogo.value = false
    if (logoInput.value) logoInput.value.value = ''
  }
}

function removerLogo() {
  logoPreview.value = null
  form.value.logotipoAdversario = ''
}

// Em casa → bloquear local com estádio do clube
const localDisabled = computed(() => !!form.value.emCasa)

watch(() => form.value.emCasa, (val) => {
  if (val) {
    if (clube.value?.estadio) {
      form.value.local = clube.value.estadio
    }
  }
})

function openCriar() {
  form.value = { id: undefined, competicaoId: undefined, grupoId: undefined, adversario: '', local: '', dataHora: '', emCasa: false, logotipoAdversario: '' }
  logoPreview.value = null
  if (logoInput.value) logoInput.value.value = ''
  modalOpen.value = true
}

function openEditar(row: any) {
  form.value = {
    id: row.id,
    competicaoId: row.competicao?.id,
    grupoId: row.grupo?.id,
    adversario: row.adversario,
    local: row.local,
    dataHora: (row.dataHora || row.data) || '',
    emCasa: !!row.emCasa,
    logotipoAdversario: row.logotipoAdversario || ''
  }
  logoPreview.value = row.logotipoAdversario || null
  modalOpen.value = true
}

function closeModal() {
  modalOpen.value = false
  logoPreview.value = null
  if (logoInput.value) logoInput.value.value = ''
}

async function salvar() {
  loading.value = true
  try {
    const payload = {
      competicaoId: form.value.competicaoId,
      grupoId: form.value.grupoId,
      adversario: form.value.adversario,
      local: form.value.local,
      dataHora: form.value.dataHora ? new Date(form.value.dataHora).toISOString() : undefined,
      emCasa: !!form.value.emCasa,
      logotipoAdversario: form.value.logotipoAdversario || undefined
    }
    if (form.value.id) {
      await api.atualizarJogo(form.value.id, payload)
      toast.success('Jogo atualizado com sucesso!')
    } else {
      await api.criarJogo(payload)
      toast.success('Jogo criado com sucesso!')
    }
    await useAsyncData('jogos:todos', () => api.listJogos(), { server: false })
    modalOpen.value = false
    logoPreview.value = null
    if (logoInput.value) logoInput.value.value = ''
  } catch (error: any) {
    console.error('Erro ao salvar jogo:', error)
    toast.error(getApiErrorMessage(error, 'Erro ao salvar jogo. Verifique os dados e tente novamente.'))
  } finally {
    loading.value = false
  }
}

async function remover(row: any) {
  if (!row?.id) return
  try {
    await api.apagarJogo(row.id)
    toast.success('Jogo removido com sucesso!')
    await useAsyncData('jogos:todos', () => api.listJogos(), { server: false })
  } catch (error: any) {
    console.error('Erro ao remover jogo:', error)
    toast.error(getApiErrorMessage(error, 'Não foi possível remover o jogo.'))
  }
}

// Gerenciar (estado, eventos, convocados)
const gerenciarOpen = ref(false)
const gerenciarTab = ref(0)
const jogoAtual = ref<any | null>(null)
const gerenciarTabs = computed(() => {
  const estado = jogoAtual.value?.estadoJogo
  if (estado === 'AGENDADO') return ['Estado', 'Convocados']
  if (estado === 'EM_ANDAMENTO') return ['Estado', 'Eventos']
  return ['Estado']
})

// Estado
const novoEstado = ref<string | undefined>(undefined)
const alterandoEstado = ref(false)
const finalizandoJogo = ref(false)
const estadosPossiveis = computed(() => {
  const atual = jogoAtual.value?.estadoJogo
  if (atual === 'AGENDADO') return ['EM_ANDAMENTO', 'CANCELADO']
  if (atual === 'EM_ANDAMENTO') return ['FINALIZADO', 'CANCELADO']
  return []
})

async function alterarEstado() {
  if (!jogoAtual.value?.id || !novoEstado.value) return
  alterandoEstado.value = true
  try {
    const updated = await api.alterarEstadoJogo(jogoAtual.value.id, { estado: novoEstado.value })
    jogoAtual.value = updated
    toast.success('Estado atualizado!')
    await useAsyncData('jogos:todos', () => api.listJogos(), { server: false })
    gerenciarTab.value = 0
  } catch (e: any) {
    console.error(e)
    toast.error(getApiErrorMessage(e, 'Falha ao alterar estado'))
  } finally {
    alterandoEstado.value = false
  }
}

async function finalizarJogo() {
  if (!jogoAtual.value?.id) return
  finalizandoJogo.value = true
  try {
    const updated = await api.finalizarJogo(jogoAtual.value.id)
    jogoAtual.value = updated
    toast.success('Jogo finalizado!')
    await useAsyncData('jogos:todos', () => api.listJogos(), { server: false })
  } catch (e: any) {
    console.error(e)
    toast.error(getApiErrorMessage(e, 'Falha ao finalizar jogo'))
  } finally {
    finalizandoJogo.value = false
  }
}

// Eventos
const eventos = ref<any[] | null>(null)
const novoEvento = ref<any>({ tipo: 'INICIO_JOGO', minuto: 0, lado: 'CASA', jogadorId: undefined, observacao: '' })
const tiposEvento = ['GOL', 'ASSISTENCIA', 'CARTAO_AMARELO', 'CARTAO_VERMELHO', 'SUBSTITUICAO', 'LESAO', 'INTERVALO', 'INICIO_JOGO', 'FIM_JOGO']
const enviandoEvento = ref(false)

async function carregarEventos() {
  if (!jogoAtual.value?.id) return
  eventos.value = await api.listarEventosJogo(jogoAtual.value.id)
}

async function adicionarEvento() {
  if (!jogoAtual.value?.id) return
  enviandoEvento.value = true
  try {
    const payload: any = { ...novoEvento.value }
    if (!payload.jogadorId) delete payload.jogadorId
    if (!payload.observacao) delete payload.observacao
    await api.registrarEventoJogo(jogoAtual.value.id, payload)
    toast.success('Evento registado!')
    await carregarEventos()
    novoEvento.value = { tipo: 'INICIO_JOGO', minuto: 0, lado: 'CASA', jogadorId: undefined, observacao: '' }
  } catch (e: any) {
    console.error(e)
    toast.error(getApiErrorMessage(e, 'Falha ao registar evento'))
  } finally {
    enviandoEvento.value = false
  }
}

// Convocados
const convocados = ref<any[] | null>(null)
const novoConvocado = ref<any>({ jogadorId: undefined, status: 'TITULAR', posicaoProvavel: '' })
const adicionandoConvocado = ref(false)
const salvandoConvocados = ref(false)
const filtroJogador = ref('')
const jogadoresFiltrados = computed(() => {
  const query = (filtroJogador.value || '').toLowerCase().trim()
  if (!query) return jogadores.value || []
  return (jogadores.value || []).filter((j: any) => {
    const nome = (j.nomeCompleto || j.nome || '').toLowerCase()
    const numero = (j.numero != null ? String(j.numero) : '')
    return nome.includes(query) || numero.includes(query)
  })
})

async function carregarConvocados() {
  if (!jogoAtual.value?.id) return
  convocados.value = await api.listarConvocados(jogoAtual.value.id)
}

function removerConvocado(jogadorId: number) {
  if (!convocados.value) return
  convocados.value = convocados.value.filter(c => c.jogadorId !== jogadorId)
}

function adicionarConvocado() {
  if (!novoConvocado.value.jogadorId) return
  const existente = (convocados.value || []).some(c => c.jogadorId === novoConvocado.value.jogadorId)
  if (existente) return
  const item = { jogadorId: novoConvocado.value.jogadorId, status: novoConvocado.value.status, posicaoProvavel: novoConvocado.value.posicaoProvavel || undefined }
  convocados.value = [...(convocados.value || []), item]
  novoConvocado.value = { jogadorId: undefined, status: 'TITULAR', posicaoProvavel: '' }
}

async function salvarConvocados() {
  if (!jogoAtual.value?.id) return
  salvandoConvocados.value = true
  try {
    const payload = (convocados.value || []).map(c => ({ jogadorId: c.jogadorId, status: c.status, posicaoProvavel: c.posicaoProvavel || undefined }))
    await api.definirConvocados(jogoAtual.value.id, payload)
    toast.success('Convocados atualizados!')
  } catch (e: any) {
    console.error(e)
    toast.error(getApiErrorMessage(e, 'Falha ao salvar convocados'))
  } finally {
    salvandoConvocados.value = false
  }
}

function openGerenciar(row: any) {
  jogoAtual.value = row
  gerenciarTab.value = 0
  novoEstado.value = undefined
  gerenciarOpen.value = true
  Promise.all([carregarEventos(), carregarConvocados()]).catch(() => {})
}

function closeGerenciar() {
  gerenciarOpen.value = false
}

function goGerir(row: any) {
  if (!row?.id) return
  router.push(`/jogos/${row.id}/gerir`)
}
</script>