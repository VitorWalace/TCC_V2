import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  BookOpenIcon, 
  ChatBubbleBottomCenterTextIcon,
  AcademicCapIcon,
  SparklesIcon,
  RocketLaunchIcon,
  UserGroupIcon,
  ChartBarIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline'

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Background com gradiente animado */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 opacity-90" />
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Elementos decorativos animados */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-white/10 backdrop-blur-3xl animate-pulse-slow" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-white/5 backdrop-blur-3xl animate-bounce-slow" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 backdrop-blur-3xl animate-spin" style={{ animationDuration: '20s' }} />
        </div>

        {/* Conteúdo principal */}
        <div className="relative z-10 text-center max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="mb-8"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <SparklesIcon className="w-16 h-16 mx-auto text-yellow-300 mb-4 animate-pulse" />
            </motion.div>

            <motion.h1 
              className="text-5xl md:text-7xl font-bold text-white mb-6 font-heading"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <span className="block">Saber em</span>
              <span className="block bg-gradient-to-r from-yellow-300 via-pink-300 to-blue-300 bg-clip-text text-transparent animate-pulse">
                Fluxo 
              </span>
            </motion.h1>

            <motion.p 
              className="text-xl md:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              🚀 A revolução na educação digital chegou! Aprenda, conecte-se e evolua em uma 
              plataforma que combina <span className="text-yellow-300 font-semibold">tecnologia de ponta</span> com 
              <span className="text-pink-300 font-semibold"> experiência humanizada</span>.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <Link
                to="/register"
                className="group relative px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 font-bold rounded-full text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/30 animate-glow"
              >
                <span className="relative z-10">
                  🎓 Começar Agora - Grátis!
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-110 blur-xl" />
              </Link>

              <Link
                to="/login"
                className="group px-8 py-4 bg-white/20 backdrop-blur-md text-white font-semibold rounded-full text-lg border-2 border-white/30 transition-all duration-300 hover:bg-white/30 hover:scale-105 hover:shadow-xl"
              >
                <span className="flex items-center gap-2">
                  <UserGroupIcon className="w-5 h-5" />
                  Já tenho conta
                </span>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <div className="w-1 h-16 bg-gradient-to-b from-transparent via-white to-transparent animate-pulse" />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-heading">
              ✨ Recursos <span className="text-gradient">Inovadores</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Descubra como nossa plataforma está redefinindo o futuro da educação digital
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="group relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="glass-card p-8 text-center hover:transform hover:-translate-y-2 transition-all duration-300">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center group-hover:animate-bounce">
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute inset-0 w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl opacity-20 group-hover:animate-ping" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <RocketLaunchIcon className="w-16 h-16 mx-auto text-yellow-300 mb-6 animate-bounce" />
            
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-heading">
              Pronto para <span className="text-yellow-300">Decolar</span>?
            </h2>
            
            <p className="text-xl text-blue-100 mb-8">
              🌟 Junte-se a milhares de estudantes que já estão transformando suas carreiras!
            </p>
            
            <Link
              to="/register"
              className="inline-block px-10 py-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 font-bold rounded-full text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/30"
            >
              🚀 Iniciar Jornada Gratuita
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

// Dados dos recursos
const features = [
  {
    title: "📚 Cursos Interativos",
    description: "Conteúdo dinâmico com vídeos, quizzes e atividades práticas que se adaptam ao seu ritmo de aprendizado.",
    icon: BookOpenIcon,
  },
  {
    title: "💬 Chat em Tempo Real", 
    description: "Conecte-se instantaneamente com colegas e instrutores. Tire dúvidas e colabore em projetos ao vivo!",
    icon: ChatBubbleBottomCenterTextIcon,
  },
  {
    title: "🎓 Certificações",
    description: "Obtenha certificados reconhecidos pelo mercado e destaque-se na sua área profissional.",
    icon: AcademicCapIcon,
  },
  {
    title: "📊 Progresso Gamificado",
    description: "Acompanhe sua evolução com sistema de pontos, conquistas e rankings motivacionais.",
    icon: ChartBarIcon,
  },
  {
    title: "👥 Comunidade Ativa",
    description: "Faça parte de uma comunidade vibrante de aprendizes e profissionais apaixonados por conhecimento.",
    icon: UserGroupIcon,
  },
  {
    title: "💡 IA Personalizada",
    description: "Inteligência artificial que adapta o conteúdo ao seu perfil e sugere caminhos de aprendizado únicos.",
    icon: LightBulbIcon,
  },
]

export default Landing
