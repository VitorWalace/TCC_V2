import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../../stores/authStore'
import {
  HomeIcon,
  BookOpenIcon,
  ChatBubbleBottomCenterTextIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

const Navbar: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsMobileMenuOpen(false)
  }

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: HomeIcon, emoji: '🏠' },
    { name: 'Cursos', path: '/courses', icon: BookOpenIcon, emoji: '📚' },
    { name: 'Instrutor', path: '/instructor', icon: SparklesIcon, emoji: '🎓' },
    { name: 'Chat', path: '/chat', icon: ChatBubbleBottomCenterTextIcon, emoji: '💬' },
    { name: 'Perfil', path: '/profile', icon: UserIcon, emoji: '👤' },
  ]

  return (
    <motion.nav 
      className="navbar-blur"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, type: "spring" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/dashboard" className="flex items-center space-x-3 group">
              <div className="relative">
                <SparklesIcon className="w-8 h-8 text-purple-400 group-hover:text-purple-300 transition-colors" />
                <div className="absolute inset-0 bg-purple-400/20 rounded-full animate-ping" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                  Saber em Fluxo
                </h1>
                <p className="text-xs text-purple-200">v2.0</p>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className="relative group"
                >
                  <motion.div
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-purple-600/30 text-purple-200 border border-purple-400/50'
                        : 'text-gray-300 hover:bg-purple-700/20 hover:text-white'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-lg">{item.emoji}</span>
                    <span>{item.name}</span>
                  </motion.div>
                  
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                      layoutId="activeTab"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </Link>
              )
            })}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-white">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-purple-200 capitalize">
                  {user?.role}
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </div>
            </div>

            <motion.button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-300 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4" />
              <span>Sair</span>
            </motion.button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-purple-700/20 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden absolute top-full left-0 right-0 bg-slate-800/95 backdrop-blur-md border-b border-purple-400/30 shadow-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-purple-600/30 text-purple-200 border border-purple-400/50'
                        : 'text-gray-300 hover:bg-purple-700/20 hover:text-white'
                    }`}
                  >
                    <span className="text-xl">{item.emoji}</span>
                    <span>{item.name}</span>
                  </Link>
                )
              })}

              <div className="pt-4 border-t border-purple-400/30">
                <div className="flex items-center space-x-3 px-4 py-2 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-purple-200 capitalize">
                      {user?.role}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 px-4 py-3 w-full text-left text-red-400 hover:bg-red-900/20 rounded-lg transition-all duration-200"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  <span>Sair</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navbar
