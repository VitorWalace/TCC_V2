import axios from 'axios'
import toast from 'react-hot-toast'

// Configurar base URL da API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4003'

// Criar instância do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para requisições
api.interceptors.request.use(
  (config) => {
    // Adicionar loading toast para requisições longas
    if (config.method !== 'get') {
      config.metadata = { startTime: Date.now() }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para respostas
api.interceptors.response.use(
  (response) => {
    // Remover loading toast se existir
    const { config } = response
    if (config.metadata?.startTime) {
      const duration = Date.now() - config.metadata.startTime
      if (duration > 2000) {
        // Requisição demorou mais de 2 segundos
        toast.success('Operação concluída!', { duration: 2000 })
      }
    }
    
    return response
  },
  (error) => {
    // Tratamento de erros globais
    const { response, request } = error
    
    if (response) {
      // Servidor respondeu com erro
      const { status, data } = response
      
      switch (status) {
        case 401:
          // Token inválido ou expirado
          if (data.message !== 'Token inválido ou expirado') {
            toast.error('Sessão expirada. Faça login novamente.')
            // Aqui você pode redirecionar para login
            window.location.href = '/login'
          }
          break
          
        case 403:
          toast.error('Você não tem permissão para esta ação.')
          break
          
        case 404:
          toast.error('Recurso não encontrado.')
          break
          
        case 422:
          // Erros de validação
          if (data.errors && Array.isArray(data.errors)) {
            data.errors.forEach((err: any) => {
              toast.error(err.message)
            })
          } else {
            toast.error(data.message || 'Dados inválidos.')
          }
          break
          
        case 429:
          toast.error('Muitas tentativas. Tente novamente em alguns minutos.')
          break
          
        case 500:
          toast.error('Erro interno do servidor. Tente novamente mais tarde.')
          break
          
        default:
          toast.error(data.message || 'Erro inesperado.')
      }
    } else if (request) {
      // Requisição foi feita mas não houve resposta
      toast.error('Erro de conexão. Verifique sua internet.')
    } else {
      // Erro na configuração da requisição
      toast.error('Erro na requisição.')
    }
    
    return Promise.reject(error)
  }
)

// Função para configurar token de autenticação
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.Authorization = `Bearer ${token}`
  } else {
    delete api.defaults.headers.Authorization
  }
}

// Função para verificar se a API está online
export const checkAPIHealth = async (): Promise<boolean> => {
  try {
    await api.get('/health')
    return true
  } catch (error) {
    return false
  }
}

// Tipos para requisições comuns
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface UpdateProfileRequest {
  firstName?: string
  lastName?: string
  bio?: string
  phone?: string
}

// Funções específicas da API
export const authAPI = {
  login: (data: LoginRequest) => api.post('/api/auth/login', data),
  register: (data: RegisterRequest) => api.post('/api/auth/register', data),
  getProfile: () => api.get('/api/auth/profile'),
  updateProfile: (data: UpdateProfileRequest) => api.put('/api/auth/profile', data),
  logout: () => api.post('/api/auth/logout'),
}

export const coursesAPI = {
  getAll: () => api.get('/api/courses'),
  getById: (id: string) => api.get(`/api/courses/${id}`),
  create: (data: any) => api.post('/api/courses', data),
  update: (id: string, data: any) => api.put(`/api/courses/${id}`, data),
  delete: (id: string) => api.delete(`/api/courses/${id}`),
}

export const chatAPI = {
  getMessages: (roomId?: string) => api.get(`/chat/messages${roomId ? `?room=${roomId}` : ''}`),
  sendMessage: (data: { message: string; roomId?: string }) => api.post('/chat/messages', data),
}

export default api
