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
    await checkAuth()
  } catch (error) {
    // Log do erro mas não bloquear a aplicação
    console.warn('Erro ao verificar autenticação na inicialização:', error)
  }
})