/**
 * Middleware para usuários não autenticados (guests)
 * Redireciona usuários autenticados para a página inicial
 */
export default defineNuxtRouteMiddleware(() => {
  const { isAuthenticated } = useAuth()

  // Se estiver autenticado, redirecionar para a página inicial
  if (isAuthenticated.value) {
    return navigateTo('/')
  }
})