import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/hooks/useAuth'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'

import Landing from '@/pages/Landing'
import Funding from '@/pages/Funding'
import Marketplace from '@/pages/Marketplace'
import Insights from '@/pages/Insights'
import ArticlePage from '@/pages/Article'
import Dashboard from '@/pages/Dashboard'
import AIAssistant from '@/pages/AIAssistant'
import Academy from '@/pages/Academy'
import Community from '@/pages/Community'
import Admin from '@/pages/Admin'
import Login from '@/pages/Login'
import Signup from '@/pages/Signup'
import NotFound from '@/pages/NotFound'

export default function App() {
  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/funding" element={<Funding />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/insights/:slug" element={<ArticlePage />} />
            <Route path="/academy" element={<Academy />} />
            <Route path="/community" element={<Community />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ai-assistant"
              element={
                <ProtectedRoute>
                  <AIAssistant />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  )
}
