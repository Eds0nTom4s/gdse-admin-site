// Tipos de autenticação baseados na documentação do backend

/**
 * Papéis de usuário disponíveis no sistema
 */
export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'FOTOGRAFO' | 'MODERADOR'

/**
 * Interface do usuário autenticado
 * Baseada na resposta do /api/auth/login e /api/auth/status
 */
export interface Usuario {
  id: number
  nome: string
  email: string
  username: string
  papel: UserRole
  ativo: boolean
  criadoEm: string // ISO string
}

/**
 * Credenciais para login
 */
export interface LoginCredentials {
  username: string
  password: string
}

/**
 * Resposta de erro da API de autenticação
 */
export interface AuthErrorResponse {
  error: string
  status: number
}

/**
 * Estado de autenticação do composable
 */
export interface AuthState {
  user: Usuario | null
  loading: boolean
  error: string | null
}

/**
 * Mapeamento de permissões por papel
 */
export type Permission = 
  | 'noticias:create' | 'noticias:update' | 'noticias:delete'
  | 'jogos:create' | 'jogos:update' | 'jogos:delete'
  | 'albums:create' | 'albums:update' | 'albums:delete'
  | 'midias:create' | 'midias:delete'
  | 'contatos:read' | 'contatos:update' | 'contatos:delete'
  | 'usuarios:read' | 'usuarios:create' | 'usuarios:update' | 'usuarios:delete'

/**
 * Configuração de permissões por papel
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[] | '*'> = {
  SUPER_ADMIN: '*', // Acesso total
  ADMIN: [
    'noticias:create', 'noticias:update', 'noticias:delete',
    'jogos:create', 'jogos:update', 'jogos:delete',
    'albums:create', 'albums:update', 'albums:delete',
    'midias:create', 'midias:delete',
    'contatos:read', 'contatos:update', 'contatos:delete',
    'usuarios:read', 'usuarios:create', 'usuarios:update', 'usuarios:delete'
  ],
  EDITOR: [
    'noticias:create', 'noticias:update',
    'jogos:create', 'jogos:update'
  ],
  FOTOGRAFO: [
    'albums:create', 'albums:update', 'albums:delete',
    'midias:create', 'midias:delete'
  ],
  MODERADOR: [
    'contatos:read', 'contatos:update', 'contatos:delete'
  ]
}

/**
 * Utilitário para verificar se um papel tem uma permissão específica
 */
export function hasPermission(userRole: UserRole, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[userRole]
  
  // SUPER_ADMIN tem acesso total
  if (permissions === '*') return true
  
  // Verificar se a permissão está na lista do papel
  return Array.isArray(permissions) && permissions.includes(permission)
}

/**
 * Utilitário para verificar se um usuário tem uma permissão específica
 */
export function userHasPermission(user: Usuario | null, permission: Permission): boolean {
  if (!user || !user.ativo) return false
  return hasPermission(user.papel, permission)
}