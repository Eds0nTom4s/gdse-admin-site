export type EstadoJogo = 'AGENDADO' | 'EM_ANDAMENTO' | 'FINALIZADO' | 'CANCELADO'

export interface JogoRequestDTO {
  dataHora: string // dd/MM/yyyy HH:mm:ss
  local: string
  adversario: string
  logotipoAdversario: string | null
  emCasa: boolean
  competicaoId: number
  grupoId: number
}

export interface CompeticaoResumo {
  id: number
  nome: string
}

export interface GrupoResumo {
  id: number
  nome: string
}

export interface JogoResponseDTO {
  id: number
  dataHora: string // backend may return in dd/MM/yyyy HH:mm:ss or ISO
  local: string
  adversario: string
  logotipoAdversario?: string | null
  emCasa: boolean
  estadoJogo: EstadoJogo
  competicao?: CompeticaoResumo
  grupo?: GrupoResumo
  golsCasa?: number | null
  golsFora?: number | null
}

export interface EventoJogoRequest {
  tipo: string
  minuto: number
  lado: 'CASA' | 'FORA'
  jogadorId?: number
  observacao?: string
}

export interface ConvocadoRequest {
  jogadorId: number
  status: 'TITULAR' | 'RESERVA'
  posicaoProvavel?: string
}


