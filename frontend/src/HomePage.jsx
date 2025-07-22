import React from 'react'
import { Link } from 'react-router-dom'
import CountdownTimer from './CountdownTimer.jsx'

// Rest of your HomePage component stays the same...
const HomePage = () => {
  const downloadWhitepaper = () => {
    // Create a simple PDF download link
    const link = document.createElement('a')
    link.href = '/whitepaper.pdf' // You'll need to add this file to public folder
    link.download = 'KushAlara-Whitepaper.pdf'
    link.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 bg-black/20 backdrop-blur-sm">
        <div className="text-2xl font-bold gradient-text">KushAlara</div>
        <div className="flex items-center space-x-4">
          <Link to="/citizenship" className="text-gray-300 hover:text-white transition-colors">
            Citizenship
          </Link>
          <Link to="/eresidency" className="text-gray-300 hover:text-white transition-colors">
            e-Residency
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6">
            <span className="gradient-text">KushAlara Token</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            The world's first Web3-native sovereign state, pioneering digital governance and economic innovation through blockchain technology.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Link 
              to="/citizenship" 
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-8 py-4 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Apply for Citizenship
            </Link>
            <Link 
              to="/eresidency" 
              className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Apply for e-Residency
            </Link>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="mb-16">
          <CountdownTimer />
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 card-hover">
            <h3 className="text-2xl font-bold mb-4 text-yellow-400">Digital Sovereignty</h3>
            <p className="text-gray-300">
              Experience true digital citizenship with blockchain-verified identity and governance participation.
            </p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 card-hover">
            <h3 className="text-2xl font-bold mb-4 text-blue-400">Economic Innovation</h3>
            <p className="text-gray-300">
              Access cutting-edge financial services, DeFi protocols, and Web3 business opportunities.
            </p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 card-hover">
            <h3 className="text-2xl font-bold mb-4 text-purple-400">Global Community</h3>
            <p className="text-gray-300">
              Join a worldwide network of digital pioneers building the future of governance and economy.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <button 
            onClick={downloadWhitepaper}
            className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 mr-4 mb-4"
          >
            Download Whitepaper
          </button>
          <a 
            href="https://instagram.com/kushalara" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-pink-500 to-pink-700 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 mr-4 mb-4 inline-block"
          >
            Follow on Instagram
          </a>
          <a 
            href="https://twitter.com/kushalara" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 mb-4 inline-block"
          >
            Follow on Twitter
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-sm py-8 mt-20">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400">
            © 2025 KushAlara Token. All rights reserved. Building the future of digital sovereignty.
          </p>
        </div>
      </footer>
    </div>
   )
}

export default HomePage
