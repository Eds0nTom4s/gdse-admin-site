/**
 * Middleware de autenticação
 * Verifica se o usuário está autenticado antes de acessar rotas protegidas
 */
export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated, checkAuth } = useAuth()

  // Se não estiver autenticado, verificar sessão no servidor
  if (!isAuthenticated.value) {
    // Em SSR, verificar status no servidor
    if (process.server) {
      // Permitir que o plugin de inicialização verifique a autenticação
      return
    }
    
    // No cliente, redirecionar para login se não autenticado
    const loginUrl = `/login${to.path !== '/' ? `?redirect=${encodeURIComponent(to.path)}` : ''}`
    return navigateTo(loginUrl)
  }
  
  // Se estiver tentando acessar a página de login e já estiver autenticado
  if (to.path === '/login' && isAuthenticated.value) {
    return navigateTo('/')
  }
})