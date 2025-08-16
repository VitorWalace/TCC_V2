import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '../../stores/authStore'
import { 
  EyeIcon, 
  EyeSlashIcon, 
  EnvelopeIcon,
  LockClosedIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

const Login: React.FC = () => {
  const navigate = useNavigate()
  const { login, isLoading } = useAuthStore()
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    const success = await login(formData.email, formData.password)
    if (success) {
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background animado */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600" />
      <div className="absolute inset-0 bg-black/20" />
      
      {/* Elementos decorativos */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-white/10 backdrop-blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-white/5 backdrop-blur-3xl animate-bounce-slow" />
      </div>

      <motion.div
        className="relative z-10 max-w-md w-full space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <motion.div
            className="mb-6"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
          >
            <SparklesIcon className="w-12 h-12 mx-auto text-yellow-300 animate-pulse" />
          </motion.div>
          
          <h2 className="text-3xl font-bold text-white font-heading mb-2">
            Bem-vindo de volta! 👋
          </h2>
          <p className="text-blue-100">
            Entre na sua conta e continue sua jornada de aprendizado
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          className="glass-card p-8 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                📧 Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`input-modern pl-10 ${errors.email ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                  placeholder="seu@email.com"
                />
              </div>
              {errors.email && (
                <motion.p 
                  className="mt-1 text-sm text-red-600"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {errors.email}
                </motion.p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                🔒 Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`input-modern pl-10 pr-10 ${errors.password ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                  placeholder="Sua senha secreta"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </button>
              </div>
              {errors.password && (
                <motion.p 
                  className="mt-1 text-sm text-red-600"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {errors.password}
                </motion.p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3 text-base font-semibold relative overflow-hidden group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10">
                {isLoading ? (
                  <>
                    <div className="spinner mr-2" />
                    Entrando...
                  </>
                ) : (
                  '🚀 Entrar na Plataforma'
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 py-1 bg-white text-gray-400 font-medium rounded-full border border-gray-100 shadow-sm">
                ou
              </span>
            </div>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-gray-600">
              Ainda não tem uma conta?{' '}
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-500 font-semibold transition-colors hover:underline"
              >
                Criar conta gratuita 🎉
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Back to Home */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <Link
            to="/"
            className="text-blue-200 hover:text-white transition-colors text-sm flex items-center justify-center gap-2"
          >
            ← Voltar ao início
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Login
