// Exportar tipos de autenticação
export type * from './auth.types'

export interface Sede {
  cidade: string;
  provincia: string;
  pais: string;
  bairro: string | null;
}

export interface ClubeDTO {
  id?: number;
  nomeCompleto: string;
  sigla: string;
  slogan: string;
  logoUrl: string;
  fundacao: string;
  estadio: string;
  sede: Sede;
}

export type ClubeRequestDTO = Omit<ClubeDTO, 'id'>;
export type ClubeResponseDTO = Required<ClubeDTO>;

// Notícias
export interface NoticiaResponseDTO {
  id: number;
  titulo: string;
  conteudo: string;
  imagemUrl?: string;
  publicadoEm: string;
  nomeAutor: string;
  resumo: string;
}

export interface NoticiaRequestDTO {
  titulo: string;
  conteudo: string;
  autorId?: number;
  midiaId?: number;
  imagemUrl?: string;
}

export interface UsuarioResponseDTO {
  id: number;
  nome: string;
  email: string;
  tipo: string;
}