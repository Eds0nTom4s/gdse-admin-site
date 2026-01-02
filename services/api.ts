import { ofetch } from 'ofetch'
import type { ClubeRequestDTO, NoticiaRequestDTO } from '@/types'
import type { JogadorRequestDTO } from '@/types/jogador'
import type { AlbumRequestDTO, MidiaRequestDTO } from '@/types/galeria'

// Dados mock para demonstração (estrutura atualizada para corresponder à API real)
const mockNoticias = [
  {
    id: 1,
    titulo: "Sagrada Esperança vence por 2-1",
    conteudo: "Em um jogo emocionante no Estádio dos Coqueiros, o Sagrada Esperança conseguiu uma importante vitória por 2-1 contra o adversário. Os golos foram marcados no segundo tempo, garantindo três pontos importantes para a equipa.",
    imagemUrl: "https://via.placeholder.com/600x400/04aa5d/ffffff?text=Sagrada+Esperança",
    publicadoEm: "2025-01-12T10:30:00Z",
    nomeAutor: "Administrador Teste",
    resumo: "Em um jogo emocionante no Estádio dos Coqueiros, o Sagrada Esperança conseguiu uma importante vitória por 2-1 contra o adversário."
  },
  {
    id: 2,
    titulo: "Novo reforço chega ao clube",
    conteudo: "O Sagrada Esperança anuncia oficialmente a contratação de um novo jogador para reforçar o plantel para a segunda metade da temporada. O jogador, que vem de um clube da primeira divisão, assinou contrato por duas temporadas.",
    imagemUrl: "https://via.placeholder.com/600x400/04aa5d/ffffff?text=Novo+Reforço",
    publicadoEm: "2025-01-11T15:00:00Z",
    nomeAutor: "Editor Teste",
    resumo: "O Sagrada Esperança anuncia oficialmente a contratação de um novo jogador para reforçar o plantel para a segunda metade da temporada."
  }
]

// Dados mock removidos - agora usando dados reais do banco

// Função para simular delay de rede
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Flag para usar dados mock (quando backend não estiver disponível)
const useMockData = false

export function createApiClient(baseURL: string) {
  // Criar cliente com configuração de autenticação
  const client = ofetch.create({ 
    baseURL,
    credentials: 'include', // Incluir cookies de sessão automaticamente
    onResponseError({ response, error }) {
      const { showToast } = useToast()
      
      // Tratar erros de autenticação/autorização
      if (response.status === 401) {
        // Sessão expirou - redirecionar para login
        console.warn('Sessão expirada, redirecionando para login')
        
        // No cliente, usar navigateTo
        if (process.client) {
          const router = useRouter()
          const route = useRoute()
          
          // Limpar estado de autenticação
          const { logout } = useAuth()
          logout()
          
          // Redirecionar com query parameter para voltar após login
          const redirectUrl = route.path !== '/login' ? `?redirect=${encodeURIComponent(route.path)}` : ''
          router.push(`/login${redirectUrl}`)
        }
      } else if (response.status === 403) {
        console.warn('Acesso negado:', response.statusText)
        
        // Mostrar toast de erro
        if (process.client) {
          showToast('Você não tem permissão para realizar esta ação', 'error')
        }
      } else if (response.status === 404) {
        // Recurso não encontrado
        if (process.client) {
          showToast('Recurso não encontrado', 'error')
        }
      } else if (response.status === 422) {
        // Erro de validação
        if (process.client) {
          const errorMessage = response._data?.message || 'Dados inválidos. Verifique os campos e tente novamente.'
          showToast(errorMessage, 'error')
        }
      } else if (response.status === 500) {
        // Erro interno do servidor
        console.error('Erro interno do servidor:', response)
        if (process.client) {
          showToast('Erro no servidor. Tente novamente em alguns instantes.', 'error', {
            duration: 5000
          })
        }
      } else if (response.status === 502 || response.status === 503) {
        // Serviço indisponível
        console.error('Serviço indisponível:', response.status)
        if (process.client) {
          showToast('Serviço temporariamente indisponível. Tente novamente mais tarde.', 'error', {
            duration: 6000
          })
        }
      } else if (response.status === 504) {
        // Timeout do gateway
        console.error('Timeout da requisição')
        if (process.client) {
          showToast('A requisição demorou muito tempo. Verifique sua conexão.', 'error', {
            duration: 5000
          })
        }
      } else if (response.status >= 400 && response.status < 500) {
        // Outros erros do cliente
        const errorMessage = response._data?.message || 'Erro ao processar requisição'
        if (process.client) {
          showToast(errorMessage, 'error')
        }
      }
    },
    onRequestError({ error }) {
      console.error('Erro na requisição:', error)
      
      // Erro de rede ou timeout
      if (process.client) {
        const { showToast } = useToast()
        
        if (error.message?.includes('fetch') || error.message?.includes('network')) {
          showToast('Erro de conexão. Verifique sua internet e tente novamente.', 'error', {
            duration: 5000
          })
        } else {
          showToast('Erro ao realizar requisição. Tente novamente.', 'error')
        }
      }
    }
  })

  return {
    // Notícias
    listNoticias: async () => {
      if (useMockData) {
        await delay(500) // Simular delay de rede
        return mockNoticias
      }
      return client('/api/noticias')
    },
    getNoticia: async (id: number | string) => {
      if (useMockData) {
        await delay(300)
        const noticia = mockNoticias.find(n => n.id == id)
        if (!noticia) throw new Error('Notícia não encontrada')
        return noticia
      }
      return client(`/api/noticias/${id}`)
    },
    criarNoticia: async (payload: NoticiaRequestDTO) => {
      if (useMockData) {
        await delay(500)
        const novaNoticia = {
          id: Math.max(...mockNoticias.map(n => n.id)) + 1,
          ...payload,
          publicadoEm: new Date().toISOString(),
          nomeAutor: 'Mock Autor',
          resumo: payload.conteudo?.slice(0, 120) || ''
        }
        mockNoticias.unshift(novaNoticia as any)
        return novaNoticia
      }
      return client('/api/noticias', { method: 'POST', body: payload })
    },
    atualizarNoticia: async (id: number | string, payload: NoticiaRequestDTO) => {
      if (useMockData) {
        await delay(500)
        const index = mockNoticias.findIndex(n => n.id == id)
        if (index === -1) throw new Error('Notícia não encontrada')
        const updated = { ...mockNoticias[index], ...payload }
        mockNoticias[index] = updated as any
        return updated
      }
      return client(`/api/noticias/${id}`, { method: 'PUT', body: payload })
    },
    apagarNoticia: async (id: number | string) => {
      if (useMockData) {
        await delay(300)
        const index = mockNoticias.findIndex(n => n.id == id)
        if (index === -1) throw new Error('Notícia não encontrada')
        mockNoticias.splice(index, 1)
        return { success: true }
      }
      return client(`/api/noticias/${id}`, { method: 'DELETE' })
    },

    // Contatos
    listContatos: () => client('/api/contatos'),
    getContato: (id: number | string) => client(`/api/contatos/${id}`),
    marcarContatoComoLido: (id: number | string) => client(`/api/contatos/${id}`, { method: 'PATCH', body: { estado: 'LIDO' } }),
    marcarContatoComoNaoLido: (id: number | string) => client(`/api/contatos/${id}`, { method: 'PATCH', body: { estado: 'NAO_LIDO' } }),
    apagarContato: (id: number | string) => client(`/api/contatos/${id}`, { method: 'DELETE' }),

    // Direção - Membros
    listMembrosDirecao: () => client('/api/direcao/membros'),
    getMembroDirecao: (id: number | string) => client(`/api/direcao/membros/${id}`),
    criarMembroDirecao: async (membroData: any, foto?: File) => {
      const formData = new FormData()
      const membroBlob = new Blob([JSON.stringify(membroData)], { type: 'application/json' })
      formData.append('membro', membroBlob, 'membro.json')
      if (foto) formData.append('foto', foto, foto.name)

      return client('/api/direcao/membros', {
        method: 'POST',
        body: formData,
        headers: {
          // sem Content-Type manual para deixar o boundary correto
        }
      })
    },
    atualizarMembroDirecao: async (id: number | string, membroData: any, foto?: File) => {
      const formData = new FormData()
      const membroBlob = new Blob([JSON.stringify(membroData)], { type: 'application/json' })
      formData.append('membro', membroBlob, 'membro.json')
      if (foto) formData.append('foto', foto, foto.name)

      return client(`/api/direcao/membros/${id}`, {
        method: 'PUT',
        body: formData,
        headers: {
          // sem Content-Type manual para deixar o boundary correto
        }
      })
    },
    apagarMembroDirecao: (id: number | string) => client(`/api/direcao/membros/${id}`, { method: 'DELETE' }),

    // Direção - Cargos
    listCargosDirecao: () => client('/api/direcao/cargos'),

    // Jogos (JSON conforme contrato)
    listJogos: () => client('/api/jogos'),
    getJogo: (id: number | string) => client(`/api/jogos/${id}`),
    listJogosPorGrupo: (grupoId: number | string) => client(`/api/jogos/por-grupo/${grupoId}`),
    listJogosPorCompeticao: (competicaoId: number | string) => client(`/api/jogos/por-competicao/${competicaoId}`),
    criarJogo: (payload: any) => client('/api/jogos', { method: 'POST', body: payload }),
    atualizarJogo: (id: number | string, payload: any) => client(`/api/jogos/${id}`, { method: 'PUT', body: payload }),
    apagarJogo: (id: number | string) => client(`/api/jogos/${id}`, { method: 'DELETE' }),
    listProximosJogos: () => client('/api/jogos/proximos'),
    // Jogos - Convocados
    definirConvocados: (id: number | string, convocados: any[]) => client(`/api/jogos/${id}/convocados`, { method: 'POST', body: convocados }),
    listarConvocados: (id: number | string) => client(`/api/jogos/${id}/convocados`),
    // Jogos - Eventos
    registrarEventoJogo: (id: number | string, evento: any) => client(`/api/jogos/${id}/eventos`, { method: 'POST', body: evento }),
    listarEventosJogo: (id: number | string) => client(`/api/jogos/${id}/eventos`),
    // Jogos - Estado e Finalização
    alterarEstadoJogo: (id: number | string, payload: any) => client(`/api/jogos/${id}/estado`, { method: 'PATCH', body: payload }),
    finalizarJogo: (id: number | string) => client(`/api/jogos/${id}/finalizar`, { method: 'POST' }),
    // Competições (para seleção no formulário de jogos)
    listCompeticoes: () => client('/api/competicoes'),

    // Ficheiros - Jogos (logotipo do adversário)
    uploadLogoAdversario: async (file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      return client('/api/ficheiros/adversarios', { method: 'POST', body: formData })
    },

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

    // Clube
    getClube: () => client('/api/clube'),
    atualizarClube: (payload: ClubeRequestDTO) => client('/api/clube', { method: 'PUT', body: payload }),
    atualizarLogoClube: async (nomeCompleto: string, estadio: string, logo: File) => {
      const formData = new FormData()
      const clubeBlob = new Blob([JSON.stringify({ nomeCompleto, estadio })], { type: 'application/json' })
      formData.append('clube', clubeBlob, 'clube.json')
      formData.append('logo', logo)

      return client('/api/clube/logo', {
        method: 'PUT',
        body: formData
      })
    },
    getLogoMetadata: () => client('/api/clube/logo'),

    // Jogadores
    listJogadores: (page: number = 1, size: number = 8, sortBy: string = 'nome') => {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        sortBy
      })
      return client(`/api/jogadores?${params.toString()}`)
    },
    getJogador: (id: number | string) => client(`/api/jogadores/${id}`),
    criarJogador: async (jogador: JogadorRequestDTO, foto?: File) => {
      if (foto) {
        const formData = new FormData()
        const jogadorBlob = new Blob([JSON.stringify(jogador)], { type: 'application/json' })
        formData.append('jogador', jogadorBlob, 'jogador.json')
        formData.append('foto', foto)
        return client('/api/jogadores', { method: 'POST', body: formData })
      }
      // Sem ficheiro: enviar JSON
      return client('/api/jogadores', { method: 'POST', body: jogador })
    },
    atualizarJogador: async (id: number | string, jogador: JogadorRequestDTO, foto?: File) => {
      if (foto) {
        const formData = new FormData()
        const jogadorBlob = new Blob([JSON.stringify(jogador)], { type: 'application/json' })
        formData.append('jogador', jogadorBlob, 'jogador.json')
        formData.append('foto', foto)
        return client(`/api/jogadores/${id}`, { method: 'PUT', body: formData })
      }
      // Sem ficheiro: enviar JSON
      return client(`/api/jogadores/${id}`, { method: 'PUT', body: jogador })
    },
    apagarJogador: (id: number | string) => client(`/api/jogadores/${id}`, { method: 'DELETE' }),

    // Grupos
    listGrupos: () => client('/api/grupos'),
    getGrupo: (id: number | string) => client(`/api/grupos/${id}`),
    criarGrupo: (payload: any) => client('/api/grupos', { method: 'POST', body: payload }),
    atualizarGrupo: (id: number | string, payload: any) => client(`/api/grupos/${id}`, { method: 'PUT', body: payload }),
    apagarGrupo: (id: number | string) => client(`/api/grupos/${id}`, { method: 'DELETE' }),

    // Modalidades
    listModalidades: () => client('/api/modalidades'),
    getModalidade: (id: number | string) => client(`/api/modalidades/${id}`),
    criarModalidade: (payload: any) => client('/api/modalidades', { method: 'POST', body: payload }),
    atualizarModalidade: (id: number | string, payload: any) => client(`/api/modalidades/${id}`, { method: 'PUT', body: payload }),
    apagarModalidade: (id: number | string) => client(`/api/modalidades/${id}`, { method: 'DELETE' }),

    // Galeria
    listAlbuns: () => client('/api/galeria/albuns'),
    getAlbum: (id: number | string) => client(`/api/galeria/albuns/${id}`),
    criarAlbum: (payload: AlbumRequestDTO) => client('/api/galeria/albuns', { method: 'POST', body: payload }),
    atualizarAlbum: (id: number | string, payload: AlbumRequestDTO) => client(`/api/galeria/albuns/${id}`, { method: 'PUT', body: payload }),
    apagarAlbum: (id: number | string) => client(`/api/galeria/albuns/${id}`, { method: 'DELETE' }),
    adicionarMidia: (albumId: number | string, payload: MidiaRequestDTO) => client(`/api/galeria/albuns/${albumId}/midias`, { method: 'POST', body: payload }),
    apagarMidia: (midiaId: number | string) => client(`/api/galeria/albuns/midias/${midiaId}`, { method: 'DELETE' }),
    uploadMidiaGaleria: async (file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      return client('/api/ficheiros/galeria', {
        method: 'POST',
        body: formData
      })
    },
    uploadMultiplasMidiasGaleria: async (files: File[]) => {
      const formData = new FormData()
      for (const file of files) {
        formData.append('files', file)
      }
      return client('/api/ficheiros/galeria/multi', {
        method: 'POST',
        body: formData
      })
    },
  }
}

export function useApi() {
  const config = useRuntimeConfig()
  return createApiClient(config.public.apiBase)
}