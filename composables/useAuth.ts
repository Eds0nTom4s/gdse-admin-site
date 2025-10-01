import type { Usuario, LoginCredentials } from '~/types/auth.types'
import { useAuthService } from '~/services/auth.service'

/**
 * Composable principal para gerenciamento de autenticação
 * Mantém estado global usando useState do Nuxt
 */
export const useAuth = () => {
  // Estado global da aplicação usando useState do Nuxt
  const user = useState<Usuario | null>('auth.user', () => null)
  const loading = useState<boolean>('auth.loading', () => false)
  const error = useState<string | null>('auth.error', () => null)

  // Instância do serviço de autenticação
  const authService = useAuthService()

  // Computed para verificar se está autenticado
  const isAuthenticated = computed(() => {
    return user.value !== null && user.value.ativo
  })

  // Computed para obter o papel do usuário
  const userRole = computed(() => {
    return user.value?.papel || null
  })

  /**
   * Realiza login do usuário
   */
  const login = async (credentials: LoginCredentials): Promise<Usuario> => {
    loading.value = true
    error.value = null

    try {
      const userData = await authService.login(credentials)
      user.value = userData
      
      // Log otimizado para produção
      console.log(`✅ Login bem-sucedido: ${userData.username} (${userData.papel})`)
      
      return userData
    } catch (err: any) {
      const errorMsg = err.message || 'Erro ao fazer login'
      error.value = errorMsg
      user.value = null
      
      console.error('❌ Erro no login:', errorMsg)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Realiza logout do usuário
   */
  const logout = async (): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      await authService.logout()
    } catch (err: any) {
      // Log do erro mas não impede o logout no frontend
      console.warn('Erro no logout do backend:', err.message)
    } finally {
      // Sempre limpa o estado local
      user.value = null
      loading.value = false
      
      // Redireciona para login
      await navigateTo('/login')
    }
  }

  /**
   * Verifica o status atual da autenticação
   */
  const checkAuth = async (): Promise<Usuario | null> => {
    loading.value = true
    error.value = null

    try {
      const userData = await authService.checkStatus()
      user.value = userData
      return userData
    } catch (err: any) {
      error.value = err.message || 'Erro ao verificar autenticação'
      user.value = null
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Limpa erros de autenticação
   */
  const clearError = (): void => {
    error.value = null
  }

  /**
   * Força atualização dos dados do usuário
   */
  const refreshUser = async (): Promise<void> => {
    if (!isAuthenticated.value) return

    try {
      const userData = await authService.checkStatus()
      if (userData) {
        user.value = userData
      } else {
        // Sessão expirou
        await logout()
      }
    } catch (err) {
      console.warn('Erro ao atualizar dados do usuário:', err)
    }
  }

  /**
   * Verifica se a sessão ainda é válida
   * Útil para verificações periódicas
   */
  const validateSession = async (): Promise<boolean> => {
    try {
      const userData = await authService.checkStatus()
      if (userData) {
        user.value = userData
        return true
      } else {
        user.value = null
        return false
      }
    } catch {
      user.value = null
      return false
    }
  }

  return {
    // Estado (readonly para componentes)
    user: readonly(user),
    loading: readonly(loading),
    error: readonly(error),
    
    // Computed
    isAuthenticated,
    userRole,
    
    // Métodos
    login,
    logout,
    checkAuth,
    clearError,
    refreshUser,
    validateSession
  }
}