/**
 * Composable básico para toast/notificações
 * Pode ser expandido com uma biblioteca de toast completa posteriormente
 */
export const useToast = () => {
  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    // Implementação básica usando console por enquanto
    // Posteriormente pode ser substituído por uma biblioteca como vue-toastification
    
    const typeEmojis = {
      success: '✅',
      error: '❌', 
      warning: '⚠️',
      info: 'ℹ️'
    }
    
    console.log(`${typeEmojis[type]} ${message}`)
    
    // Implementação básica usando alert para demonstração
    if (process.client && type === 'error') {
      // Apenas mostrar alerts para erros críticos
      setTimeout(() => alert(message), 100)
    }
  }

  return {
    showToast
  }
}