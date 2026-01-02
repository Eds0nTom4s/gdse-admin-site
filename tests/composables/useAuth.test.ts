import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import type { Usuario } from '~/types/auth.types'

// Mock do serviço de autenticação
const mockAuthService = {
  login: vi.fn(),
  logout: vi.fn(),
  checkStatus: vi.fn()
}

vi.mock('~/services/auth.service', () => ({
  useAuthService: () => mockAuthService
}))

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve inicializar com usuário null', () => {
    const { useAuth } = await import('~/composables/useAuth')
    const { user, isAuthenticated } = useAuth()

    expect(user.value).toBeNull()
    expect(isAuthenticated.value).toBe(false)
  })

  it('deve fazer login com sucesso', async () => {
    const mockUser: Usuario = {
      id: 1,
      nome: 'Teste User',
      email: 'teste@example.com',
      username: 'teste',
      papel: 'ADMIN',
      ativo: true,
      criadoEm: '2025-01-01T00:00:00Z'
    }

    mockAuthService.login.mockResolvedValue(mockUser)

    const { useAuth } = await import('~/composables/useAuth')
    const { login, user, isAuthenticated } = useAuth()

    await login({ username: 'teste', password: 'senha123' })

    expect(mockAuthService.login).toHaveBeenCalledWith({
      username: 'teste',
      password: 'senha123'
    })
    expect(user.value).toEqual(mockUser)
    expect(isAuthenticated.value).toBe(true)
  })

  it('deve tratar erro de login', async () => {
    mockAuthService.login.mockRejectedValue(new Error('Credenciais inválidas'))

    const { useAuth } = await import('~/composables/useAuth')
    const { login, error, user } = useAuth()

    await expect(
      login({ username: 'teste', password: 'errada' })
    ).rejects.toThrow('Credenciais inválidas')

    expect(error.value).toBe('Credenciais inválidas')
    expect(user.value).toBeNull()
  })

  it('deve fazer logout corretamente', async () => {
    const { useAuth } = await import('~/composables/useAuth')
    const { logout, user } = useAuth()

    // Simular usuário logado
    user.value = {
      id: 1,
      nome: 'Teste',
      email: 'teste@example.com',
      username: 'teste',
      papel: 'ADMIN',
      ativo: true,
      criadoEm: '2025-01-01T00:00:00Z'
    }

    await logout()

    expect(mockAuthService.logout).toHaveBeenCalled()
    expect(user.value).toBeNull()
  })

  it('deve calcular userRole corretamente', () => {
    const { useAuth } = await import('~/composables/useAuth')
    const { user, userRole } = useAuth()

    user.value = {
      id: 1,
      nome: 'Teste',
      email: 'teste@example.com',
      username: 'teste',
      papel: 'EDITOR',
      ativo: true,
      criadoEm: '2025-01-01T00:00:00Z'
    }

    expect(userRole.value).toBe('EDITOR')
  })
})
