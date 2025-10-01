import type { Usuario, LoginCredentials, AuthErrorResponse } from '~/types/auth.types'

/**
 * Serviço de autenticação
 * Implementa comunicação com os endpoints do backend Spring Security
 */
export class AuthService {
  private baseUrl: string

  constructor() {
    const config = useRuntimeConfig()
    this.baseUrl = config.public.apiBase as string || 'http://localhost:8080'
  }

  /**
   * Realiza login com username e password
   * Fluxo correto: 1. POST /api/auth/login → 2. GET /api/auth/status
   */
  async login(credentials: LoginCredentials): Promise<Usuario> {
    console.log('🔐 Tentando login:', credentials.username)

    // Preparar dados como form-data conforme especificação
    const formData = new URLSearchParams()
    formData.append('username', credentials.username)
    formData.append('password', credentials.password)

    // PASSO 1: Fazer login (retorna apenas success/message)
    const loginResponse = await fetch(`${this.baseUrl}/api/auth/login`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData
    })

    console.log('📡 Status do login:', loginResponse.status)

    if (!loginResponse.ok) {
      // Tratar erro de login
      let errorMessage = 'Erro ao fazer login'
      
      try {
        const errorData: AuthErrorResponse = await loginResponse.json()
        errorMessage = errorData.error || errorMessage
      } catch {
        if (loginResponse.status === 401) {
          errorMessage = 'Credenciais inválidas'
        }
      }

      throw new Error(errorMessage)
    }

    // Verificar se o login retornou success
    const loginResult = await loginResponse.json()
    console.log('✅ Login realizado com sucesso')

    // PASSO 2: Buscar dados do usuário autenticado
    const statusResponse = await fetch(`${this.baseUrl}/api/auth/status`, {
      method: 'GET',
      credentials: 'include'
    })

    if (!statusResponse.ok) {
      throw new Error('Erro ao obter dados do usuário após login')
    }

    const userData: Usuario = await statusResponse.json()
    console.log(`✅ Usuário autenticado: ${userData.username} (${userData.papel})`)
    
    return userData
  }

  /**
   * Realiza logout e invalida a sessão
   * POST /api/auth/logout
   */
  async logout(): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include' // Inclui cookies de sessão
      })
    } catch (error) {
      // Log do erro mas não falha - logout deve sempre funcionar no frontend
      console.warn('Erro ao fazer logout no backend:', error)
    }
  }

  /**
   * Verifica o status da sessão atual
   * GET /api/auth/status
   */
  async checkStatus(): Promise<Usuario | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/status`, {
        method: 'GET',
        credentials: 'include' // Inclui cookies de sessão
      })

      if (response.ok) {
        const userData: Usuario = await response.json()
        return userData
      } else if (response.status === 401) {
        // Usuário não autenticado - retorna null
        return null
      } else {
        // Outros erros - log e retorna null
        console.warn('Erro ao verificar status de autenticação:', response.status)
        return null
      }
    } catch (error) {
      // Erro de rede ou outro - log e retorna null
      console.warn('Erro ao verificar status de autenticação:', error)
      return null
    }
  }

  /**
   * Verifica se o usuário está autenticado sem fazer nova requisição
   */
  async isAuthenticated(): Promise<boolean> {
    const user = await this.checkStatus()
    return user !== null && user.ativo
  }
}

/**
 * Composable para obter instância do serviço de autenticação
 */
export const useAuthService = () => {
  return new AuthService()
}