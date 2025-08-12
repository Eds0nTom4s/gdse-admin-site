export interface NoticiaResponseDTO {
  id: number
  titulo: string
  conteudo: string
  imagemUrl?: string
  publicadoEm: string
  nomeAutor: string
  resumo: string
}

export interface UsuarioResponseDTO {
  id: number
  nome: string
  email: string
  tipo: string
}

// Reexportar também por conveniência
export type { NoticiaResponseDTO as NoticiaDTO, UsuarioResponseDTO as UsuarioDTO }


