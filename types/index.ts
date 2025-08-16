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