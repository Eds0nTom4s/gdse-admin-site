// Tipos simples para auxiliar (não exaustivos)
export interface ContatoResponseDTO {
  id: number
  nomeCompleto: string
  email: string
  assunto: string
  mensagem: string
  dataEnvio: string
  estado: 'LIDO' | 'NAO_LIDO'
}

export interface CargoDirecaoResponseDTO {
  id: number
  nome: string
  ordem: number
}

export interface MembroDirecaoRequestDTO {
  nome: string
  fotoUrl: string
  biografia: string
  cargoId: number
  inicioMandato: string
  fimMandato: string
  ativo: boolean
}