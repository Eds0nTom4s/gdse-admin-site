export interface Modalidade {
  id: number;
  nome: string;
}

export interface Grupo {
  id: number;
  nome: string;
  modalidade: Modalidade;
}

export interface JogadorResponseDTO {
  id: number;
  nome: string;
  numero: number;
  posicao: string;
  fotoUrl: string;
  grupo: Grupo;
  ativo: boolean;
  criadoEm: string;
}

export interface JogadorRequestDTO {
  nome: string;
  numero: number;
  posicao: string;
  grupoId: number;
  ativo: boolean;
  fotoUrl?: string; // Nome do arquivo, sem a URL completa
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // 0-indexed
  first: boolean;
  last: boolean;
  empty: boolean;
}

export type PaginatedJogadoresResponse = PaginatedResponse<JogadorResponseDTO>
