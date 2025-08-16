export type AlbumTipo = 'JOGO' | 'TREINO' | 'EVENTO' | 'OUTRO'
export type MidiaTipo = 'IMAGEM' | 'VIDEO'

export interface Midia {
  id: number;
  tipo: MidiaTipo;
  url: string;
  legenda: string;
}

export interface AlbumResponseDTO {
  id: number;
  titulo: string;
  descricao: string;
  tipo: AlbumTipo;
  publicadoEm: string;
  midias: Midia[];
}

export interface MidiaRequestDTO {
  tipo: MidiaTipo;
  url: string;
  legenda: string;
}

export interface AlbumRequestDTO {
  titulo: string;
  descricao: string;
  tipo: AlbumTipo;
  midias?: MidiaRequestDTO[];
}
