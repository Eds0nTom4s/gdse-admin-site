import type { Permission, UserRole } from '~/types/auth.types'
import { hasPermission, userHasPermission } from '~/types/auth.types'

/**
 * Composable para gerenciamento de permissões
 * Integra com o sistema de autenticação para verificações de autorização
 */
export const usePermissions = () => {
  const { user, isAuthenticated } = useAuth()

  /**
   * Verifica se o usuário atual possui uma permissão específica
   */
  const can = (permission: Permission): boolean => {
    return userHasPermission(user.value, permission)
  }

  /**
   * Verifica se o usuário atual NÃO possui uma permissão específica
   */
  const cannot = (permission: Permission): boolean => {
    return !can(permission)
  }

  /**
   * Verifica se o usuário possui pelo menos uma das permissões fornecidas
   */
  const canAny = (permissions: Permission[]): boolean => {
    return permissions.some(permission => can(permission))
  }

  /**
   * Verifica se o usuário possui todas as permissões fornecidas
   */
  const canAll = (permissions: Permission[]): boolean => {
    return permissions.every(permission => can(permission))
  }

  /**
   * Verifica se o usuário possui um papel específico
   */
  const hasRole = (role: UserRole): boolean => {
    return user.value?.papel === role
  }

  /**
   * Verifica se o usuário possui pelo menos um dos papéis fornecidos
   */
  const hasAnyRole = (roles: UserRole[]): boolean => {
    return user.value ? roles.includes(user.value.papel) : false
  }

  /**
   * Verifica se o usuário é SUPER_ADMIN (acesso total)
   */
  const isSuperAdmin = computed((): boolean => {
    return hasRole('SUPER_ADMIN')
  })

  /**
   * Verifica se o usuário é ADMIN ou SUPER_ADMIN
   */
  const isAdmin = computed((): boolean => {
    return hasAnyRole(['SUPER_ADMIN', 'ADMIN'])
  })

  /**
   * Verifica se o usuário pode gerenciar notícias
   */
  const canManageNews = computed((): boolean => {
    return canAny(['noticias:create', 'noticias:update', 'noticias:delete'])
  })

  /**
   * Verifica se o usuário pode gerenciar jogos
   */
  const canManageGames = computed((): boolean => {
    return canAny(['jogos:create', 'jogos:update', 'jogos:delete'])
  })

  /**
   * Verifica se o usuário pode gerenciar álbuns/galeria
   */
  const canManageGallery = computed((): boolean => {
    return canAny(['albums:create', 'albums:update', 'albums:delete'])
  })

  /**
   * Verifica se o usuário pode gerenciar contatos
   */
  const canManageContacts = computed((): boolean => {
    return canAny(['contatos:read', 'contatos:update', 'contatos:delete'])
  })

  /**
   * Verifica se o usuário pode gerenciar usuários
   */
  const canManageUsers = computed((): boolean => {
    return canAny(['usuarios:read', 'usuarios:create', 'usuarios:update', 'usuarios:delete'])
  })

  /**
   * Obtém uma mensagem explicativa sobre permissões insuficientes
   */
  const getPermissionMessage = (permission: Permission): string => {
    if (!isAuthenticated.value) {
      return 'Você precisa estar logado para realizar esta ação.'
    }

    const permissionMap: Record<string, string> = {
      'noticias:create': 'Você não tem permissão para criar notícias.',
      'noticias:update': 'Você não tem permissão para editar notícias.',
      'noticias:delete': 'Você não tem permissão para excluir notícias.',
      'jogos:create': 'Você não tem permissão para criar jogos.',
      'jogos:update': 'Você não tem permissão para editar jogos.',
      'jogos:delete': 'Você não tem permissão para excluir jogos.',
      'albums:create': 'Você não tem permissão para criar álbuns.',
      'albums:update': 'Você não tem permissão para editar álbuns.',
      'albums:delete': 'Você não tem permissão para excluir álbuns.',
      'midias:create': 'Você não tem permissão para fazer upload de mídias.',
      'midias:delete': 'Você não tem permissão para excluir mídias.',
      'contatos:read': 'Você não tem permissão para visualizar contatos.',
      'contatos:update': 'Você não tem permissão para gerenciar contatos.',
      'contatos:delete': 'Você não tem permissão para excluir contatos.',
      'usuarios:read': 'Você não tem permissão para visualizar usuários.',
      'usuarios:create': 'Você não tem permissão para criar usuários.',
      'usuarios:update': 'Você não tem permissão para editar usuários.',
      'usuarios:delete': 'Você não tem permissão para excluir usuários.',
    }

    return permissionMap[permission] || 'Você não tem permissão para realizar esta ação.'
  }

  /**
   * Obtém lista de funcionalidades disponíveis para o usuário atual
   */
  const getAvailableFeatures = computed(() => {
    if (!user.value) return []

    const features = []

    if (canManageNews.value) features.push('Gerenciar Notícias')
    if (canManageGames.value) features.push('Gerenciar Jogos')
    if (canManageGallery.value) features.push('Gerenciar Galeria')
    if (canManageContacts.value) features.push('Gerenciar Contatos')
    if (canManageUsers.value) features.push('Gerenciar Usuários')

    return features
  })

  return {
    // Verificações básicas
    can,
    cannot,
    canAny,
    canAll,
    hasRole,
    hasAnyRole,
    
    // Verificações por papel
    isSuperAdmin,
    isAdmin,
    
    // Verificações por funcionalidade
    canManageNews,
    canManageGames,
    canManageGallery,
    canManageContacts,
    canManageUsers,
    
    // Utilitários
    getPermissionMessage,
    getAvailableFeatures
  }
}