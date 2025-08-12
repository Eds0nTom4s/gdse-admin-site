interface ToastMessage {
  id: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

class ToastManager {
  private toasts: ToastMessage[] = []
  private callbacks: Array<(toasts: ToastMessage[]) => void> = []

  subscribe(callback: (toasts: ToastMessage[]) => void) {
    this.callbacks.push(callback)
    return () => {
      const index = this.callbacks.indexOf(callback)
      if (index > -1) {
        this.callbacks.splice(index, 1)
      }
    }
  }

  private notify() {
    this.callbacks.forEach(callback => callback([...this.toasts]))
  }

  private addToast(message: string, type: ToastMessage['type'], duration = 5000) {
    const id = Date.now().toString() + Math.random().toString(36)
    const toast: ToastMessage = { id, message, type, duration }
    
    this.toasts.push(toast)
    this.notify()
    
    if (duration > 0) {
      setTimeout(() => {
        this.removeToast(id)
      }, duration)
    }
    
    return id
  }

  removeToast(id: string) {
    const index = this.toasts.findIndex(toast => toast.id === id)
    if (index > -1) {
      this.toasts.splice(index, 1)
      this.notify()
    }
  }

  success(message: string, duration?: number) {
    return this.addToast(message, 'success', duration)
  }

  error(message: string, duration?: number) {
    return this.addToast(message, 'error', duration)
  }

  warning(message: string, duration?: number) {
    return this.addToast(message, 'warning', duration)
  }

  info(message: string, duration?: number) {
    return this.addToast(message, 'info', duration)
  }

  getToasts() {
    return [...this.toasts]
  }
}

export const toastManager = new ToastManager()
export type { ToastMessage }
