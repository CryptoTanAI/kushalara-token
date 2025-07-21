import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

// Import pages
import HomePage from './pages/HomePage'
import CitizenshipApplication from './pages/CitizenshipApplication'
import EResidencyApplication from './pages/EResidencyApplication'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/citizenship" element={<CitizenshipApplication />} />
          <Route path="/eresidency" element={<EResidencyApplication />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App


