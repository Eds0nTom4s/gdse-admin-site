import { vi } from 'vitest'

// Mock do Nuxt runtime config
vi.mock('#app', () => ({
  useRuntimeConfig: () => ({
    public: {
      apiBase: 'http://localhost:8080',
      environment: 'test'
    }
  }),
  useState: (key: string, init: () => any) => {
    const state = ref(init())
    return state
  },
  useRoute: () => ({
    path: '/',
    params: {},
    query: {}
  }),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn()
  }),
  navigateTo: vi.fn(),
  createError: (opts: any) => new Error(opts.statusMessage)
}))

// Mock do composable useAuth
vi.mock('~/composables/useAuth', () => ({
  useAuth: () => ({
    user: ref(null),
    loading: ref(false),
    error: ref(null),
    isAuthenticated: computed(() => false),
    userRole: computed(() => null),
    login: vi.fn(),
    logout: vi.fn(),
    checkAuth: vi.fn()
  })
}))

// Globals para testes
global.console = {
  ...console,
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn()
}
