import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { config } from './lib/wagmi'
import './App.css'

// Import pages
import HomePage from './HomePage.jsx'
import CitizenshipApplication from './CitizenshipApplication.jsx'
import EResidencyApplication from './EResidencyApplication.jsx'

// Create a client
const queryClient = new QueryClient()

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Router>
            <div className="min-h-screen bg-gray-900">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/citizenship" element={<CitizenshipApplication />} />
                <Route path="/eresidency" element={<EResidencyApplication />} />
              </Routes>
            </div>
          </Router>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App
