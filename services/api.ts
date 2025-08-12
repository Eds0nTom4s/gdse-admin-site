import { ofetch } from 'ofetch'

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
  const client = ofetch.create({ baseURL })

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
    criarNoticia: async (noticiaData: any, imagem?: File) => {
      if (useMockData) {
        await delay(500)
        const novaNoticia = {
          id: Math.max(...mockNoticias.map(n => n.id)) + 1,
          ...noticiaData,
          imagemUrl: imagem ? `https://via.placeholder.com/600x400/04aa5d/ffffff?text=${encodeURIComponent(noticiaData.titulo)}` : null,
          publicadoEm: new Date().toISOString()
        }
        mockNoticias.unshift(novaNoticia)
        return novaNoticia
      }
      
      const formData = new FormData()
      
      // Debug: verificar se estamos criando FormData corretamente
      console.log('Criando FormData para POST')
      console.log('noticiaData:', noticiaData)
      console.log('imagem:', imagem)
      
      // Criar Blob para o JSON com tipo específico
      const noticiaBlob = new Blob([JSON.stringify(noticiaData)], { 
        type: 'application/json' 
      })
      
      formData.append('noticia', noticiaBlob, 'noticia.json')
      if (imagem) {
        formData.append('imagem', imagem, imagem.name)
      }
      
      // Debug: verificar conteúdo do FormData
      console.log('FormData entries:')
      for (let [key, value] of formData.entries()) {
        console.log(key, value)
        if (value instanceof File || value instanceof Blob) {
          console.log(`${key} - tipo: ${value.type}, tamanho: ${value.size}`)
        }
      }
      
      // Tentar uma abordagem completamente diferente - usar ofetch com configuração específica
      const config = useRuntimeConfig()
      const url = `${config.public.apiBase}/api/noticias`
      
      console.log('Enviando para:', url)
      
      try {
        console.log('Tentando com ofetch e configuração específica')
        
        return await client('/api/noticias', {
          method: 'POST',
          body: formData,
          headers: {
            // Remover qualquer header que possa interferir - deixar vazio para FormData
          }
        })
      } catch (error) {
        console.error('Ofetch falhou, tentando fetch básico')
        
        // Fallback: fetch simples
        const response = await $fetch(url, {
          method: 'POST',
          body: formData
        })
        
        return response
      }
    },
    atualizarNoticia: async (id: number | string, noticiaData: any, imagem?: File) => {
      if (useMockData) {
        await delay(500)
        const index = mockNoticias.findIndex(n => n.id == id)
        if (index === -1) throw new Error('Notícia não encontrada')
        
        const updatedNoticia = { ...mockNoticias[index], ...noticiaData }
        if (imagem) {
          updatedNoticia.imagemUrl = `https://via.placeholder.com/600x400/04aa5d/ffffff?text=${encodeURIComponent(noticiaData.titulo || updatedNoticia.titulo)}`
        }
        
        mockNoticias[index] = updatedNoticia
        return mockNoticias[index]
      }
      
      const formData = new FormData()
      
      // Debug: verificar se estamos criando FormData corretamente
      console.log('Criando FormData para PUT')
      console.log('noticiaData:', noticiaData)
      console.log('imagem:', imagem)
      
      // Criar Blob para o JSON com tipo específico
      const noticiaBlob = new Blob([JSON.stringify(noticiaData)], { 
        type: 'application/json' 
      })
      
      formData.append('noticia', noticiaBlob, 'noticia.json')
      if (imagem) {
        formData.append('imagem', imagem, imagem.name)
      }
      
      // Debug: verificar conteúdo do FormData
      console.log('FormData entries:')
      for (let [key, value] of formData.entries()) {
        console.log(key, value)
        if (value instanceof File || value instanceof Blob) {
          console.log(`${key} - tipo: ${value.type}, tamanho: ${value.size}`)
        }
      }
      
      // Usar fetch nativo para multipart/form-data
      const config = useRuntimeConfig()
      const url = `${config.public.apiBase}/api/noticias/${id}`
      
      console.log('Enviando para:', url)
      
      // Tentar uma abordagem completamente diferente - usar ofetch com configuração específica
      try {
        console.log('Tentando com ofetch e configuração específica')
        
        return await client(`/api/noticias/${id}`, {
          method: 'PUT',
          body: formData,
          headers: {
            // Remover qualquer header que possa interferir - deixar vazio para FormData
          }
        })
      } catch (error) {
        console.error('Ofetch falhou, tentando fetch básico')
        
        // Fallback: fetch simples
        const response = await $fetch(`${config.public.apiBase}/api/noticias/${id}`, {
          method: 'PUT',
          body: formData
        })
        
        return response
      }
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