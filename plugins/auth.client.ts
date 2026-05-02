/**
 * Plugin de inicialização da autenticação
 * Verifica o status de autenticação quando a aplicação carrega
 */
export default defineNuxtPlugin(async () => {
  // Só executar no cliente
  if (process.server) return

  const { checkAuth } = useAuth()

  try {
    // Verificar status de autenticação na inicialização
    const user = await checkAuth()
    
    // No modo SPA (ssr: false), o middleware de rota pode não rodar no client 
    // durante o load inicial se a rota foi pré-renderizada.
    // Portanto, garantimos o redirecionamento aqui no plugin se não houver sessão.
    const route = useRoute()
    if (!user && route.path !== '/login') {
      const redirectUrl = `?redirect=${encodeURIComponent(route.path)}`
      return navigateTo(`/login${redirectUrl}`)
    }
  } catch (error) {
    // Log do erro mas não bloquear a aplicação
    console.warn('Erro ao verificar autenticação na inicialização:', error)
  }
})