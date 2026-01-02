import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import type { Usuario, UserRole } from '~/types/auth.types'

describe('usePermissions', () => {
  it('deve verificar permissão corretamente para SUPER_ADMIN', () => {
    const { usePermissions } = await import('~/composables/usePermissions')
    const { useAuth } = await import('~/composables/useAuth')
    
    const { user } = useAuth()
    user.value = {
      id: 1,
      nome: 'Super Admin',
      email: 'admin@gdse.ao',
      username: 'superadmin',
      papel: 'SUPER_ADMIN',
      ativo: true,
      criadoEm: '2025-01-01T00:00:00Z'
    }

    const { can, isSuperAdmin } = usePermissions()

    expect(isSuperAdmin.value).toBe(true)
    expect(can('noticias:create')).toBe(true)
    expect(can('usuarios:delete')).toBe(true)
  })

  it('deve verificar permissões de EDITOR corretamente', () => {
    const { usePermissions } = await import('~/composables/usePermissions')
    const { useAuth } = await import('~/composables/useAuth')
    
    const { user } = useAuth()
    user.value = {
      id: 2,
      nome: 'Editor',
      email: 'editor@gdse.ao',
      username: 'editor',
      papel: 'EDITOR',
      ativo: true,
      criadoEm: '2025-01-01T00:00:00Z'
    }

    const { can, cannot } = usePermissions()

    expect(can('noticias:create')).toBe(true)
    expect(can('noticias:update')).toBe(true)
    expect(cannot('usuarios:delete')).toBe(true)
  })

  it('deve verificar papel corretamente', () => {
    const { usePermissions } = await import('~/composables/usePermissions')
    const { useAuth } = await import('~/composables/useAuth')
    
    const { user } = useAuth()
    user.value = {
      id: 3,
      nome: 'Admin',
      email: 'admin@gdse.ao',
      username: 'admin',
      papel: 'ADMIN',
      ativo: true,
      criadoEm: '2025-01-01T00:00:00Z'
    }

    const { hasRole, hasAnyRole, isAdmin } = usePermissions()

    expect(hasRole('ADMIN')).toBe(true)
    expect(hasRole('SUPER_ADMIN')).toBe(false)
    expect(hasAnyRole(['ADMIN', 'SUPER_ADMIN'])).toBe(true)
    expect(isAdmin.value).toBe(true)
  })

  it('deve verificar múltiplas permissões com canAny', () => {
    const { usePermissions } = await import('~/composables/usePermissions')
    const { useAuth } = await import('~/composables/useAuth')
    
    const { user } = useAuth()
    user.value = {
      id: 4,
      nome: 'Fotografo',
      email: 'foto@gdse.ao',
      username: 'foto',
      papel: 'FOTOGRAFO',
      ativo: true,
      criadoEm: '2025-01-01T00:00:00Z'
    }

    const { canAny, canAll } = usePermissions()

    expect(canAny(['albums:create', 'noticias:delete'])).toBe(true)
    expect(canAll(['albums:create', 'albums:update'])).toBe(true)
    expect(canAll(['albums:create', 'usuarios:delete'])).toBe(false)
  })
})
