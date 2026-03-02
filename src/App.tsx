import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/" element={<div>Math Learning App</div>} />
      </Routes>
    </div>
  )
}

export default App
