import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '../../stores/authStore'
import { 
  EyeIcon, 
  EyeSlashIcon, 
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
  SparklesIcon,
  CheckIcon
} from '@heroicons/react/24/outline'

const Register: React.FC = () => {
  const navigate = useNavigate()
  const { register, isLoading } = useAuthStore()
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
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

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Nome é obrigatório'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Sobrenome é obrigatório'
    }

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Senha deve ter pelo menos 8 caracteres'
    } else if (!/(?=.*[a-z])/.test(formData.password)) {
      newErrors.password = 'Senha deve conter pelo menos 1 letra minúscula'
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password = 'Senha deve conter pelo menos 1 letra maiúscula'
    } else if (!/(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Senha deve conter pelo menos 1 número'
    } else if (!/(?=.*[^A-Za-z0-9])/.test(formData.password)) {
      newErrors.password = 'Senha deve conter pelo menos 1 caractere especial (@, #, $, %, etc.)'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    const success = await register({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password
    })
    
    if (success) {
      navigate('/dashboard')
    }
  }

  const passwordStrength = () => {
    const { password } = formData
    if (!password) return { score: 0, text: '', color: 'bg-gray-200' }
    
    let score = 0
    if (password.length >= 8) score += 1
    if (password.length >= 12) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/[a-z]/.test(password)) score += 1
    if (/[0-9]/.test(password)) score += 1
    if (/[^A-Za-z0-9]/.test(password)) score += 1

    const levels = [
      { text: 'Muito fraca', color: 'bg-red-500' },
      { text: 'Fraca', color: 'bg-orange-500' },
      { text: 'Regular', color: 'bg-yellow-500' },
      { text: 'Boa', color: 'bg-blue-500' },
      { text: 'Muito forte', color: 'bg-green-500' }
    ]

    return { score, ...levels[Math.min(score, 4)] }
  }

  const benefits = [
    'Acesso a todos os cursos da plataforma',
    'Chat em tempo real com a comunidade',
    'Certificados reconhecidos pelo mercado',
    'Acompanhamento personalizado do progresso',
    'Suporte prioritário da equipe'
  ]

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background animado */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600" />
      <div className="absolute inset-0 bg-black/20" />
      
      {/* Elementos decorativos */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-white/10 backdrop-blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-white/5 backdrop-blur-3xl animate-bounce-slow" />
        <div className="absolute top-1/2 left-1/4 w-32 h-32 rounded-full bg-gradient-to-r from-yellow-400/20 to-pink-400/20 backdrop-blur-3xl animate-float" />
      </div>

      <div className="relative z-10 max-w-4xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Left Side - Benefits */}
          <motion.div
            className="hidden lg:block text-white"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="mb-8"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <SparklesIcon className="w-16 h-16 text-yellow-300 mb-4 animate-pulse" />
            </motion.div>

            <h1 className="text-4xl font-bold mb-6 font-heading">
              Comece sua jornada de{' '}
              <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                aprendizado
              </span>
            </h1>

            <p className="text-xl text-blue-100 mb-8">
              🚀 Junte-se a milhares de estudantes e transforme sua carreira com nossos cursos inovadores!
            </p>

            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                >
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckIcon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-blue-100">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Side - Form */}
          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header Mobile */}
            <motion.div 
              className="lg:hidden text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <SparklesIcon className="w-12 h-12 mx-auto text-yellow-300 animate-pulse mb-4" />
              <h2 className="text-3xl font-bold text-white font-heading mb-2">
                Criar Conta Gratuita! 🎉
              </h2>
              <p className="text-blue-100">
                Comece sua jornada de aprendizado hoje mesmo
              </p>
            </motion.div>

            {/* Form */}
            <motion.div
              className="glass-card p-8 space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="hidden lg:block text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 font-heading mb-2">
                  Criar Conta Gratuita! 🎉
                </h2>
                <p className="text-gray-600">
                  Preencha os dados abaixo para começar
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nome e Sobrenome */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      👤 Nome
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`input-modern pl-10 ${errors.firstName ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                        placeholder="Seu nome"
                      />
                    </div>
                    {errors.firstName && (
                      <motion.p 
                        className="mt-1 text-sm text-red-600"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {errors.firstName}
                      </motion.p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      👤 Sobrenome
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`input-modern pl-10 ${errors.lastName ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                        placeholder="Seu sobrenome"
                      />
                    </div>
                    {errors.lastName && (
                      <motion.p 
                        className="mt-1 text-sm text-red-600"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {errors.lastName}
                      </motion.p>
                    )}
                  </div>
                </div>

                {/* Email */}
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

                {/* Senha */}
                <div className="w-full">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    🔒 Senha
                  </label>
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockClosedIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`input-modern w-full pl-10 pr-10 ${errors.password ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                      placeholder="Mín. 8 caracteres, maiúscula, número e símbolo"
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
                  
                  {/* Password Requirements */}
                  {!formData.password && (
                    <div className="mt-2 text-xs text-gray-500">
                      <p>A senha deve conter:</p>
                      <ul className="mt-1 space-y-1">
                        <li>• Pelo menos 8 caracteres</li>
                        <li>• 1 letra maiúscula e 1 minúscula</li>
                        <li>• 1 número</li>
                        <li>• 1 caractere especial (@, #, $, %, etc.)</li>
                      </ul>
                    </div>
                  )}
                  
                  {/* Password Strength */}
                  {formData.password && (
                    <div className="mt-2 w-full">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-600">Força da senha:</span>
                        <span className={`text-xs font-medium ${
                          passwordStrength().score >= 3 ? 'text-green-600' : 
                          passwordStrength().score >= 2 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {passwordStrength().text}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${passwordStrength().color}`}
                          style={{ width: `${Math.min((passwordStrength().score / 6) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}

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

                {/* Confirmar Senha */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    🔒 Confirmar Senha
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockClosedIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`input-modern pl-10 pr-10 ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                      placeholder="Confirme sua senha"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <motion.p 
                      className="mt-1 text-sm text-red-600"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {errors.confirmPassword}
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
                        Criando sua conta...
                      </>
                    ) : (
                      '🚀 Criar Conta Gratuita'
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                </motion.button>
              </form>

              {/* Login Link */}
              <div className="text-center">
                <p className="text-gray-600">
                  Já tem uma conta?{' '}
                  <Link
                    to="/login"
                    className="text-blue-600 hover:text-blue-500 font-semibold transition-colors hover:underline"
                  >
                    Fazer login 👋
                  </Link>
                </p>
              </div>
            </motion.div>

            {/* Back to Home */}
            <motion.div 
              className="text-center mt-6"
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
      </div>
    </div>
  )
}

export default Register
