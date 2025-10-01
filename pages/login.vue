<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--brand-green)]/10 to-green-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Cabeçalho -->
      <div class="text-center">
        <div class="mx-auto h-20 w-20 bg-[var(--brand-green)] rounded-full flex items-center justify-center mb-6">
          <svg class="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 class="text-3xl font-bold text-gray-900 mb-2">
          Painel Administrativo
        </h2>
        <p class="text-gray-600">
          Sagrada Esperança - Área Restrita
        </p>
      </div>

      <!-- Formulário -->
      <div class="bg-white rounded-lg shadow-xl p-8">
        <form class="space-y-6" @submit.prevent="handleLogin">
          <!-- Campo Username -->
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
              Usuário
            </label>
            <input
              id="username"
              v-model="credentials.username"
              name="username"
              type="text"
              autocomplete="username"
              required
              :disabled="loading"
              class="w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)] focus:border-[var(--brand-green)] disabled:bg-gray-100 disabled:cursor-not-allowed"
              :class="{ 'border-red-500': error && !credentials.username }"
              placeholder="Digite seu usuário"
            />
          </div>

          <!-- Campo Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="credentials.password"
                name="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                required
                :disabled="loading"
                class="w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)] focus:border-[var(--brand-green)] disabled:bg-gray-100 disabled:cursor-not-allowed pr-10"
                :class="{ 'border-red-500': error && !credentials.password }"
                placeholder="Digite sua senha"
              />
              <!-- Botão para mostrar/ocultar senha -->
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                :disabled="loading"
              >
                <svg v-if="showPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
                <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Mensagem de erro -->
          <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-red-800">{{ error }}</p>
              </div>
            </div>
          </div>

          <!-- Botão de login -->
          <div>
            <button
              type="submit"
              :disabled="loading || !credentials.username || !credentials.password"
              class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[var(--brand-green)] hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--brand-green)] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <span v-if="loading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Entrando...
              </span>
              <span v-else>Entrar no Sistema</span>
            </button>
          </div>
        </form>

        <!-- Informações de teste (visível apenas em desenvolvimento) -->
        <div v-if="showTestCredentials" class="mt-6 pt-6 border-t border-gray-200">
          <p class="text-xs text-gray-500 text-center mb-4">
            <strong>Usuários de Teste (Desenvolvimento)</strong>
          </p>
          <div class="grid grid-cols-1 gap-2 text-xs">
            <div class="flex justify-between bg-gray-50 p-2 rounded">
              <span><strong>SUPER_ADMIN:</strong> superadmin / admin123</span>
              <button 
                @click="fillCredentials('superadmin', 'admin123')"
                class="text-[var(--brand-green)] hover:underline"
                type="button"
              >
                Usar
              </button>
            </div>
            <div class="flex justify-between bg-gray-50 p-2 rounded">
              <span><strong>ADMIN:</strong> admin / admin123</span>
              <button 
                @click="fillCredentials('admin', 'admin123')"
                class="text-[var(--brand-green)] hover:underline"
                type="button"
              >
                Usar
              </button>
            </div>
            <div class="flex justify-between bg-gray-50 p-2 rounded">
              <span><strong>EDITOR:</strong> editor / editor123</span>
              <button 
                @click="fillCredentials('editor', 'editor123')"
                class="text-[var(--brand-green)] hover:underline"
                type="button"
              >
                Usar
              </button>
            </div>
            <div class="flex justify-between bg-gray-50 p-2 rounded">
              <span><strong>FOTOGRAFO:</strong> fotografo / foto123</span>
              <button 
                @click="fillCredentials('fotografo', 'foto123')"
                class="text-[var(--brand-green)] hover:underline"
                type="button"
              >
                Usar
              </button>
            </div>
            <div class="flex justify-between bg-gray-50 p-2 rounded">
              <span><strong>MODERADOR:</strong> moderador / mod123</span>
              <button 
                @click="fillCredentials('moderador', 'mod123')"
                class="text-[var(--brand-green)] hover:underline"
                type="button"
              >
                Usar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="text-center text-xs text-gray-500">
        <p>&copy; {{ currentYear }} Sagrada Esperança. Todos os direitos reservados.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LoginCredentials } from '~/types/auth.types'

// Configuração da página
definePageMeta({
  layout: false, // Não usar layout padrão
  middleware: 'guest' // Middleware para usuários não autenticados
})

// SEO
useHead({
  title: 'Login - Painel Administrativo Sagrada Esperança'
})

// Composables
const { user, login, loading, error, clearError, isAuthenticated } = useAuth()
const router = useRouter()
const route = useRoute()

// Estado local do formulário
const credentials = reactive<LoginCredentials>({
  username: '',
  password: ''
})

const showPassword = ref(false)
const currentYear = new Date().getFullYear()

// Mostrar credenciais de teste apenas em desenvolvimento
const config = useRuntimeConfig()
const showTestCredentials = computed(() => {
  return process.dev || config.public.environment === 'development'
})

// Redirecionar se já estiver autenticado
watch(isAuthenticated, (newValue) => {
  console.log('🔄 Estado de autenticação mudou:', newValue)
  console.log('👤 Usuário atual:', user.value)
  
  if (newValue && user.value) {
    const redirectTo = route.query.redirect as string || '/'
    console.log('🚀 Redirecionando para:', redirectTo)
    router.push(redirectTo)
  }
}, { immediate: true })

// Limpar erros quando o usuário começar a digitar
watch(credentials, () => {
  if (error.value) {
    clearError()
  }
}, { deep: true })

/**
 * Manipula o envio do formulário de login
 */
const handleLogin = async (): Promise<void> => {
  if (!credentials.username.trim() || !credentials.password.trim()) {
    return
  }

  try {
    console.log('🔐 Iniciando processo de login...')
    const userData = await login(credentials)
    console.log('✅ Login concluído, dados recebidos:', userData)
    
    // Aguardar um tick para garantir que o estado foi atualizado
    await nextTick()
    
    // Verificar se o estado foi atualizado corretamente
    if (isAuthenticated.value) {
      const redirectTo = route.query.redirect as string || '/'
      console.log('🚀 Redirecionando manualmente para:', redirectTo)
      await router.push(redirectTo)
    } else {
      console.warn('⚠️ Usuário não está autenticado após login')
    }
  } catch (err) {
    console.error('❌ Erro no login:', err)
  }
}

/**
 * Preenche credenciais de teste (apenas desenvolvimento)
 */
const fillCredentials = (username: string, password: string): void => {
  credentials.username = username
  credentials.password = password
}

// Auto-foco no campo username
onMounted(() => {
  const usernameInput = document.getElementById('username')
  if (usernameInput) {
    usernameInput.focus()
  }
})
</script>

<style scoped>
/* Adicionar se necessário - estilos específicos da página de login */
</style>