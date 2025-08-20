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

export interface NoticiaResponseDTO {
  id: number
  titulo: string
  conteudo: string
  imagemUrl?: string
  publicadoEm: string
  nomeAutor: string
  resumo: string
}

export interface NoticiaRequestDTO {
  titulo: string
  conteudo: string
  autorId?: number
  midiaId?: number
  imagemUrl?: string
}

export interface UsuarioResponseDTO {
  id: number
  nome: string
  email: string
  tipo: string
}