import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from './stores/authStore'
import { GameProvider } from './contexts/GameContext'
import { ChatProvider } from './contexts/ChatContext'
import Navbar from './components/layout/Navbar'
import Landing from './pages/Landing'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/Dashboard'
import Courses from './pages/Courses'
import CourseView from './pages/CourseView'
// import LessonView from './pages/LessonView'
import InstructorDashboard from './pages/InstructorDashboard'
import CourseEditorNew from './pages/instructor/CourseEditorNew'
import Chat from './pages/Chat'
import Profile from './pages/Profile'
import LoadingScreen from './components/ui/LoadingScreen'

function App() {
  const { user, isLoading } = useAuthStore()

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <GameProvider>
      <ChatProvider>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
          {/* Partículas de fundo decorativas */}
          <div className="particles-bg" />
          
          <AnimatePresence mode="wait">
            <Routes>
            {/* Rotas públicas */}
            <Route 
              path="/" 
              element={
                user ? <Navigate to="/dashboard" replace /> : <Landing />
              } 
            />
            <Route 
              path="/login" 
              element={
                user ? <Navigate to="/dashboard" replace /> : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Login />
                  </motion.div>
                )
              } 
            />
            <Route 
              path="/register" 
              element={
                user ? <Navigate to="/dashboard" replace /> : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Register />
                  </motion.div>
                )
              } 
            />

            {/* Rotas protegidas */}
            {user ? (
              <>
                <Route path="/*" element={<MainLayout />} />
              </>
            ) : (
              <Route path="*" element={<Navigate to="/login" replace />} />
            )}
          </Routes>
        </AnimatePresence>
      </div>
      </ChatProvider>
    </GameProvider>
  )
}

// Layout principal para usuários autenticados
function MainLayout() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <AnimatePresence mode="wait">
          <Routes>
            <Route 
              path="/dashboard" 
              element={
                <PageWrapper>
                  <Dashboard />
                </PageWrapper>
              } 
            />
            <Route 
              path="/courses" 
              element={
                <PageWrapper>
                  <Courses />
                </PageWrapper>
              } 
            />
            <Route 
              path="/courses/:courseId" 
              element={
                <PageWrapper>
                  <CourseView />
                </PageWrapper>
              } 
            />
            <Route 
              path="/courses/:courseId/lessons/:lessonId" 
              element={
                <PageWrapper>
                  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-2xl font-bold text-gray-900 mb-4">Lição em Desenvolvimento</h1>
                      <p className="text-gray-600 mb-6">Esta funcionalidade estará disponível em breve.</p>
                      <a href="/courses" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Voltar aos Cursos
                      </a>
                    </div>
                  </div>
                </PageWrapper>
              } 
            />
            <Route 
              path="/instructor" 
              element={
                <PageWrapper>
                  <InstructorDashboard />
                </PageWrapper>
              } 
            />
            <Route 
              path="/instructor/course/:courseId/edit" 
              element={
                <PageWrapper>
                  <CourseEditorNew />
                </PageWrapper>
              } 
            />
            <Route 
              path="/instructor/course-editor/:courseId" 
              element={
                <PageWrapper>
                  <CourseEditorNew />
                </PageWrapper>
              } 
            />
            <Route 
              path="/chat" 
              element={
                <PageWrapper>
                  <Chat />
                </PageWrapper>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <PageWrapper>
                  <Profile />
                </PageWrapper>
              } 
            />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  )
}

// Wrapper para animações de página
function PageWrapper({ children }: { children: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full"
    >
      {children}
    </motion.div>
  )
}

export default App
