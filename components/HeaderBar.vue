<template>
  <header class="sticky top-0 z-40 bg-white border-b border-gray-200">
    <div class="mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <button class="md:hidden p-2 rounded hover:bg-gray-100" @click="$emit('toggle-sidebar')" aria-label="Alternar menu">
          <span class="i">☰</span>
        </button>
        <div class="flex items-center gap-2">
          <div class="w-2 h-6 bg-[var(--brand-green)] rounded"></div>
          <h1 class="text-lg font-semibold text-gray-800">Painel Administrativo</h1>
        </div>
      </div>
      
      <!-- Informações do usuário e menu -->
      <div class="flex items-center gap-4">
        <!-- Status de loading da autenticação -->
        <div v-if="authLoading" class="flex items-center gap-2 text-sm text-gray-500">
          <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Verificando...
        </div>

        <!-- Menu do usuário autenticado -->
        <div v-else-if="user" class="relative">
          <div class="flex items-center gap-3">
            <!-- Informações do usuário -->
            <div class="hidden sm:block text-right text-sm">
              <div class="font-medium text-gray-900">{{ user.nome }}</div>
              <div class="text-xs text-gray-500">{{ getRoleLabel(user.papel) }}</div>
            </div>

            <!-- Avatar e dropdown -->
            <div class="relative">
              <button 
                @click="userMenuOpen = !userMenuOpen"
                class="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Menu do usuário"
              >
                <!-- Avatar com iniciais -->
                <div class="w-8 h-8 bg-[var(--brand-green)] rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {{ getUserInitials(user.nome) }}
                </div>
                <!-- Ícone de dropdown -->
                <svg 
                  class="w-4 h-4 text-gray-500 transition-transform" 
                  :class="{ 'rotate-180': userMenuOpen }"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <!-- Dropdown menu -->
              <div 
                v-show="userMenuOpen"
                class="absolute right-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                @click.stop
              >
                <!-- Informações do usuário no mobile -->
                <div class="sm:hidden px-4 py-2 border-b border-gray-100">
                  <div class="font-medium text-gray-900">{{ user.nome }}</div>
                  <div class="text-sm text-gray-500">{{ user.email }}</div>
                  <div class="text-xs text-gray-400 mt-1">{{ getRoleLabel(user.papel) }}</div>
                </div>

                <!-- Informações detalhadas -->
                <div class="hidden sm:block px-4 py-2 border-b border-gray-100">
                  <div class="text-sm text-gray-600">{{ user.email }}</div>
                  <div class="text-xs text-gray-400 mt-1">
                    <span class="inline-flex items-center gap-1">
                      <div class="w-2 h-2 rounded-full" :class="user.ativo ? 'bg-green-400' : 'bg-red-400'"></div>
                      {{ user.ativo ? 'Ativo' : 'Inativo' }}
                    </span>
                  </div>
                </div>

                <!-- Funcionalidades disponíveis -->
                <div v-if="availableFeatures.length > 0" class="px-4 py-2 border-b border-gray-100">
                  <div class="text-xs font-medium text-gray-500 mb-2">Permissões:</div>
                  <div class="flex flex-wrap gap-1">
                    <span 
                      v-for="feature in availableFeatures.slice(0, 3)" 
                      :key="feature"
                      class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full"
                    >
                      {{ feature }}
                    </span>
                    <span 
                      v-if="availableFeatures.length > 3"
                      class="text-xs text-gray-500"
                    >
                      +{{ availableFeatures.length - 3 }} mais
                    </span>
                  </div>
                </div>

                <!-- Ações -->
                <div class="py-1">
                  <button
                    @click="handleRefreshUser"
                    class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Atualizar dados
                  </button>
                  
                  <button
                    @click="handleLogout"
                    :disabled="logoutLoading"
                    class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 disabled:opacity-50"
                  >
                    <svg v-if="logoutLoading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    {{ logoutLoading ? 'Saindo...' : 'Sair do sistema' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Fallback para usuário não autenticado -->
        <div v-else class="text-sm text-gray-500">
          Não autenticado
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { UserRole } from '~/types/auth.types'

// Emits
defineEmits<{
  'toggle-sidebar': []
}>()

// Composables
const { user, loading: authLoading, logout, refreshUser } = useAuth()
const { getAvailableFeatures } = usePermissions()

// Estado local
const userMenuOpen = ref(false)
const logoutLoading = ref(false)

// Computed
const availableFeatures = getAvailableFeatures

// Fechar menu ao clicar fora
const closeUserMenu = (event: Event) => {
  if (!event.target || !(event.target as Element).closest('.relative')) {
    userMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeUserMenu)
})

onUnmounted(() => {
  document.removeEventListener('click', closeUserMenu)
})

/**
 * Obtém as iniciais do nome do usuário
 */
const getUserInitials = (nome: string): string => {
  return nome
    .split(' ')
    .slice(0, 2) // Pegar só as duas primeiras palavras
    .map(word => word.charAt(0).toUpperCase())
    .join('')
}

/**
 * Obtém o label amigável do papel do usuário
 */
const getRoleLabel = (role: UserRole): string => {
  const roleLabels: Record<UserRole, string> = {
    SUPER_ADMIN: 'Super Administrador',
    ADMIN: 'Administrador',
    EDITOR: 'Editor',
    FOTOGRAFO: 'Fotógrafo',
    MODERADOR: 'Moderador'
  }
  return roleLabels[role] || role
}

/**
 * Realiza logout do usuário
 */
const handleLogout = async (): Promise<void> => {
  logoutLoading.value = true
  userMenuOpen.value = false
  
  try {
    await logout()
  } catch (error) {
    console.error('Erro durante logout:', error)
  } finally {
    logoutLoading.value = false
  }
}

/**
 * Atualiza os dados do usuário
 */
const handleRefreshUser = async (): Promise<void> => {
  userMenuOpen.value = false
  
  try {
    await refreshUser()
    
    // Mostrar toast de sucesso se disponível
    if (process.client) {
      const { showToast } = useToast()
      showToast('Dados atualizados com sucesso', 'success')
    }
  } catch (error) {
    console.error('Erro ao atualizar dados do usuário:', error)
    
    if (process.client) {
      const { showToast } = useToast()
      showToast('Erro ao atualizar dados', 'error')
    }
  }
}
</script>