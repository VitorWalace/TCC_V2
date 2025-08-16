import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useEffect } from 'react'
import api from '../services/api'
import toast from 'react-hot-toast'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'student' | 'instructor' | 'admin'
  avatarUrl?: string
  bio?: string
  isEmailVerified: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>
  register: (data: {
    email: string
    password: string
    firstName: string
    lastName: string
  }) => Promise<boolean>
  logout: () => void
  updateProfile: (data: Partial<User>) => Promise<boolean>
  checkAuth: () => Promise<void>
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true })
        
        try {
          console.log("🔐 Tentando fazer login com:", email)
          const response = await api.post('/api/auth/login', { email, password })
          console.log("📥 Resposta do login:", response.data)
          
          const { user: backendUser, token } = response.data.data || response.data
          
          // Convert snake_case to camelCase for frontend
          const user = {
            ...backendUser,
            firstName: backendUser.first_name,
            lastName: backendUser.last_name,
            avatarUrl: backendUser.avatar_url,
            isEmailVerified: backendUser.is_email_verified,
            isActive: backendUser.is_active || true,
            createdAt: backendUser.created_at,
            updatedAt: backendUser.updated_at
          }
          
          // Configurar token para próximas requisições
          api.defaults.headers.Authorization = `Bearer ${token}`
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          })
          
          toast.success(`Bem-vindo de volta, ${user.firstName}!`, {
            icon: '👋',
          })
          
          return true
        } catch (error: any) {
          const message = error.response?.data?.message || 'Erro ao fazer login'
          toast.error(message)
          
          set({ isLoading: false })
          return false
        }
      },

      register: async (data) => {
        set({ isLoading: true })
        
        try {
          // Convert camelCase to snake_case for backend
          const backendData = {
            email: data.email,
            password: data.password,
            first_name: data.firstName,
            last_name: data.lastName
          }
          
          console.log("📤 Enviando dados para backend:", backendData)
          
          const response = await api.post('/api/auth/register', backendData)
          console.log("📥 Resposta do backend:", response.data)
          
          const { user: backendUser, token } = response.data.data || response.data
          
          // Convert snake_case to camelCase for frontend
          const user = {
            ...backendUser,
            firstName: backendUser.first_name,
            lastName: backendUser.last_name,
            avatarUrl: backendUser.avatar_url,
            isEmailVerified: backendUser.is_email_verified,
            isActive: backendUser.is_active || true,
            createdAt: backendUser.created_at,
            updatedAt: backendUser.updated_at
          }
          
          // Configurar token para próximas requisições
          api.defaults.headers.Authorization = `Bearer ${token}`
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          })
          
          toast.success(`Conta criada com sucesso! Bem-vindo, ${user.firstName}!`, {
            icon: '🎉',
            duration: 5000,
          })
          
          return true
        } catch (error: any) {
          const message = error.response?.data?.message || 'Erro ao criar conta'
          toast.error(message)
          
          set({ isLoading: false })
          return false
        }
      },

      logout: () => {
        // Remover token das requisições
        delete api.defaults.headers.Authorization
        
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        })
        
        toast.success('Você foi desconectado com sucesso!', {
          icon: '👋',
        })
      },

      updateProfile: async (data) => {
        set({ isLoading: true })
        
        try {
          console.log("📤 Enviando dados de perfil para backend:", data)
          
          // Convert camelCase to snake_case for backend
          const backendData = {
            first_name: data.firstName,
            last_name: data.lastName,
            bio: data.bio,
            phone: data.phone,
            avatar_url: data.avatarUrl
          }
          
          // Remove undefined values
          Object.keys(backendData).forEach(key => {
            if (backendData[key] === undefined) {
              delete backendData[key]
            }
          })
          
          console.log("📤 Dados convertidos para backend:", backendData)
          
          const response = await api.put('/api/auth/profile', backendData)
          console.log("📥 Resposta do backend:", response.data)
          
          const { data: responseData } = response.data
          
          // Convert snake_case back to camelCase for frontend
          const updatedUser = {
            ...responseData,
            firstName: responseData.first_name,
            lastName: responseData.last_name,
            avatarUrl: responseData.avatar_url,
            isEmailVerified: responseData.is_email_verified,
            isActive: responseData.is_active,
            createdAt: responseData.created_at,
            updatedAt: responseData.updated_at
          }
          
          set({
            user: updatedUser,
            isLoading: false,
          })
          
          toast.success('Perfil atualizado com sucesso!', {
            icon: '✅',
            duration: 3000,
          })
          
          return true
        } catch (error: any) {
          console.error("❌ Erro ao atualizar perfil:", error)
          const message = error.response?.data?.message || 'Erro ao atualizar perfil'
          toast.error(message, {
            duration: 4000,
          })
          
          set({ isLoading: false })
          return false
        }
      },

      checkAuth: async () => {
        const { token } = get()
        
        if (!token) {
          set({ isLoading: false })
          return
        }
        
        set({ isLoading: true })
        
        try {
          // Configurar token para a requisição
          api.defaults.headers.Authorization = `Bearer ${token}`
          
          const response = await api.get('/api/auth/profile')
          const { user } = response.data
          
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          // Token inválido ou expirado
          delete api.defaults.headers.Authorization
          
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          })
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },
    }),
    {
      name: 'saber-auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

// Hook para inicializar autenticação na aplicação
export const useInitAuth = () => {
  const checkAuth = useAuthStore((state) => state.checkAuth)
  
  useEffect(() => {
    checkAuth()
  }, [checkAuth])
}

// Exportar tipos para uso em outros arquivos
export type { User, AuthState }
