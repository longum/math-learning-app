import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<div>Math Learning App</div>} />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
