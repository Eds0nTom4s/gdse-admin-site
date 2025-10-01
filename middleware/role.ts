import type { Permission, UserRole } from '~/types/auth.types'

/**
 * Middleware de autorização baseado em permissões
 * Verifica se o usuário tem a permissão necessária para acessar a rota
 */
export default defineNuxtRouteMiddleware((to) => {
  const { user, isAuthenticated } = useAuth()
  const { can, hasRole } = usePermissions()

  // Primeiro verificar se está autenticado
  if (!isAuthenticated.value) {
    const loginUrl = `/login${to.path !== '/' ? `?redirect=${encodeURIComponent(to.path)}` : ''}`
    return navigateTo(loginUrl)
  }

  // Mapeamento de rotas para permissões necessárias
  const routePermissions: Record<string, Permission | Permission[] | UserRole | UserRole[]> = {
    // Notícias
    '/noticias': ['noticias:create', 'noticias:update'],
    
    // Jogos
    '/jogos': ['jogos:create', 'jogos:update'],
    
    // Galeria
    '/galeria': ['albums:create', 'albums:update', 'albums:delete'],
    
    // Contatos
    '/contatos': ['contatos:read', 'contatos:update'],
    
    // Configurações (usuários)
    '/configuracoes': ['usuarios:read', 'usuarios:create', 'usuarios:update'],
    
    // Direção (apenas admins)
    '/direcao': ['ADMIN', 'SUPER_ADMIN']
  }

  // Verificar permissão para a rota atual
  const routePath = to.path
  const requiredPermissions = routePermissions[routePath]

  if (requiredPermissions) {
    let hasAccess = false

    if (Array.isArray(requiredPermissions)) {
      // Verificar se é array de papéis ou permissões
      if (requiredPermissions.every(item => typeof item === 'string' && item.includes(':'))) {
        // Array de permissões - usuário precisa ter pelo menos uma
        hasAccess = (requiredPermissions as Permission[]).some(permission => can(permission))
      } else {
        // Array de papéis - usuário precisa ter pelo menos um
        hasAccess = (requiredPermissions as UserRole[]).some(role => hasRole(role))
      }
    } else {
      // Permissão ou papel único
      if (typeof requiredPermissions === 'string' && requiredPermissions.includes(':')) {
        // É uma permissão
        hasAccess = can(requiredPermissions as Permission)
      } else {
        // É um papel
        hasAccess = hasRole(requiredPermissions as UserRole)
      }
    }

    // Se não tem acesso, redirecionar ou mostrar erro
    if (!hasAccess) {
      // Para APIs, retornar erro 403
      if (routePath.startsWith('/api/')) {
        throw createError({
          statusCode: 403,
          statusMessage: 'Acesso negado'
        })
      }
      
      // Para páginas, redirecionar para página de acesso negado
      throw createError({
        statusCode: 403,
        statusMessage: `Acesso negado. Você não tem permissão para acessar "${routePath}".`
      })
    }
  }
})