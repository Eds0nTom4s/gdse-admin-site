import { toast } from 'vue-sonner'

/**
 * Composable para notificações usando vue-sonner
 * Fornece interface simples e consistente para mostrar toasts
 */
export const useToast = () => {
  /**
   * Mostra uma notificação toast
   * @param message - Mensagem a ser exibida
   * @param type - Tipo da notificação (success, error, warning, info)
   * @param options - Opções adicionais do vue-sonner
   */
  const showToast = (
    message: string,
    type: 'success' | 'error' | 'warning' | 'info' = 'info',
    options?: {
      description?: string
      duration?: number
      action?: { label: string; onClick: () => void }
    }
  ) => {
    const defaultOptions = {
      duration: type === 'error' ? 5000 : 3000,
      ...options
    }

    switch (type) {
      case 'success':
        toast.success(message, defaultOptions)
        break
      case 'error':
        toast.error(message, defaultOptions)
        break
      case 'warning':
        toast.warning(message, defaultOptions)
        break
      case 'info':
      default:
        toast.info(message, defaultOptions)
        break
    }
  }

  /**
   * Mostra toast de sucesso
   */
  const success = (message: string, options?: any) => {
    showToast(message, 'success', options)
  }

  /**
   * Mostra toast de erro
   */
  const error = (message: string, options?: any) => {
    showToast(message, 'error', options)
  }

  /**
   * Mostra toast de aviso
   */
  const warning = (message: string, options?: any) => {
    showToast(message, 'warning', options)
  }

  /**
   * Mostra toast de informação
   */
  const info = (message: string, options?: any) => {
    showToast(message, 'info', options)
  }

  /**
   * Mostra toast de loading
   */
  const loading = (message: string, options?: any) => {
    return toast.loading(message, options)
  }

  /**
   * Mostra toast de promessa (para operações assíncronas)
   */
  const promise = <T>(
    promise: Promise<T>,
    messages: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: any) => string)
    }
  ) => {
    return toast.promise(promise, messages)
  }

  /**
   * Fecha todos os toasts
   */
  const dismiss = (toastId?: string | number) => {
    toast.dismiss(toastId)
  }

  return {
    showToast,
    success,
    error,
    warning,
    info,
    loading,
    promise,
    dismiss
  }
}