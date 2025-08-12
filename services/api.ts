import { ofetch } from 'ofetch'

export function createApiClient(baseURL: string) {
  const client = ofetch.create({ baseURL })

  return {
    // Contatos
    listContatos: () => client('/api/contatos'),
    getContato: (id: number | string) => client(`/api/contatos/${id}`),
    marcarContatoComoLido: (id: number | string) => client(`/api/contatos/${id}`, { method: 'PATCH', body: { estado: 'LIDO' } }),
    apagarContato: (id: number | string) => client(`/api/contatos/${id}`, { method: 'DELETE' }),

    // Direção - Membros
    listMembrosDirecao: () => client('/api/direcao/membros'),
    getMembroDirecao: (id: number | string) => client(`/api/direcao/membros/${id}`),
    criarMembroDirecao: (payload: any) => client('/api/direcao/membros', { method: 'POST', body: payload }),
    atualizarMembroDirecao: (id: number | string, payload: any) => client(`/api/direcao/membros/${id}`, { method: 'PUT', body: payload }),
    apagarMembroDirecao: (id: number | string) => client(`/api/direcao/membros/${id}`, { method: 'DELETE' }),

    // Direção - Cargos
    listCargosDirecao: () => client('/api/direcao/cargos'),

    // Jogos
    listJogos: () => client('/api/jogos'),
    getJogo: (id: number | string) => client(`/api/jogos/${id}`),
    listJogosPorGrupo: (grupoId: number | string) => client(`/api/jogos/por-grupo/${grupoId}`),
    listJogosPorCompeticao: (competicaoId: number | string) => client(`/api/jogos/por-competicao/${competicaoId}`),
    criarJogo: (formData: FormData) => client('/api/jogos', { method: 'POST', body: formData }),
    atualizarJogo: (id: number | string, formData: FormData) => client(`/api/jogos/${id}`, { method: 'PUT', body: formData }),
    apagarJogo: (id: number | string) => client(`/api/jogos/${id}`, { method: 'DELETE' }),
    listProximosJogos: () => client('/api/jogos/proximos'),

    // Classificações
    listClassificacoes: () => client('/api/classificacoes'),
    getClassificacao: (id: number | string) => client(`/api/classificacoes/${id}`),
    listClassificacoesPorCompeticao: (competicaoId: number | string) => client(`/api/classificacoes/competicao/${competicaoId}`),

    // Sobre
    getSobre: () => client('/api/sobre'),
    updateSobre: (payload: any) => client('/api/sobre', { method: 'PUT', body: payload }),

    // Usuários (Credenciais)
    listUsuarios: () => client('/api/usuarios'),
    getUsuario: (id: number | string) => client(`/api/usuarios/${id}`),
    criarUsuario: (payload: any) => client('/api/usuarios', { method: 'POST', body: payload }),
    atualizarUsuario: (id: number | string, payload: any) => client(`/api/usuarios/${id}`, { method: 'PUT', body: payload }),
    apagarUsuario: (id: number | string) => client(`/api/usuarios/${id}`, { method: 'DELETE' }),
  }
}

export function useApi() {
  const config = useRuntimeConfig()
  return createApiClient(config.public.apiBase)
}