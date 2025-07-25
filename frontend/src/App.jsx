import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import { config } from './lib/wagmi'
import './App.css'

// Import RainbowKit styles
import '@rainbow-me/rainbowkit/styles.css'

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
        <RainbowKitProvider 
  theme={darkTheme({
    accentColor: '#fbbf24',
    accentColorForeground: 'black',
    borderRadius: 'medium',
  })}
>
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
