import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import NumberPage from './pages/NumberPage'
import AdditionPage from './pages/AdditionPage'
import SubtractionPage from './pages/SubtractionPage'
import TestPage from './pages/TestPage'
import SimpleAdditionPage from './pages/SimpleAdditionPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/simple-addition" element={<SimpleAdditionPage />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/number/:level"
            element={
              <ProtectedRoute>
                <NumberPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addition/:level"
            element={
              <ProtectedRoute>
                <AdditionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/subtraction/:level"
            element={
              <ProtectedRoute>
                <SubtractionPage />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
