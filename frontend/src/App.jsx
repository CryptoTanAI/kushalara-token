import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

// Import pages from src folder (no pages subfolder)
import HomePage from './HomePage.jsx'
import CitizenshipApplication from './CitizenshipApplication.jsx'
import EResidencyApplication from './EResidencyApplication.jsx'

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
