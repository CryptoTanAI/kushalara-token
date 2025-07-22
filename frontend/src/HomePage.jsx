import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import CountdownTimer from './CountdownTimer.jsx'

const HomePage = () => {
  const [walletConnected, setWalletConnected] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [amount, setAmount] = useState('')
  const [selectedCrypto, setSelectedCrypto] = useState('ETH')

  // Wallet addresses
  const walletAddresses = {
    ETH: '0x07086A9a09b3B6A7A870094608eE99a0A6220AAD',
    USDC: '0x07086A9a09b3B6A7A870094608eE99a0A6220AAD',
    USDT: '0x07086A9a09b3B6A7A870094608eE99a0A6220AAD',
    BTC: 'bc1qp5amz3sck2hypxd8krhl5h3u68d25v72zt3cme0zxtyn5dhr64dq3x3lq2',
    SOL: 'DMLEbV5AYRmvKsjrHg1xcdsjxA3cNqCJmQMMDPDQnrUH'
  }

  const downloadWhitepaper = () => {
    const link = document.createElement('a')
    link.href = '/whitepaper.pdf'
    link.download = 'KushAlara-Whitepaper.pdf'
    link.click()
  }

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' })
        setWalletConnected(true)
      } else {
        alert('Please install MetaMask or another Web3 wallet')
      }
    } catch (error) {
      console.error('Error connecting wallet:', error)
    }
  }

  const buyTokens = () => {
    setShowPaymentModal(true)
  }

  const closeModal = () => {
    setShowPaymentModal(false)
    setAmount('')
  }

  const handleCryptoPayment = () => {
    if (!amount) {
      alert('Please enter an amount')
      return
    }
    
    const walletAddress = walletAddresses[selectedCrypto]
    const tokenAmount = parseFloat(amount)
    
    alert(`Send ${amount} ${selectedCrypto} to:\n${walletAddress}\n\nYou will receive ${tokenAmount} KUSH tokens\nRate: 1 USD = 1 KUSH`)
  }

  const handleFiatPayment = () => {
    if (!amount || parseFloat(amount) < 20) {
      alert('Minimum purchase amount is $20 USD')
      return
    }
    
    const tokenAmount = parseFloat(amount)
    alert(`You will receive ${tokenAmount} KUSH tokens for $${amount} USD\nRate: 1 USD = 1 KUSH\n\nRedirecting to MoonPay...`)
    // Here you would integrate with MoonPay
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    alert('Address copied to clipboard!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 bg-black/20 backdrop-blur-sm">
        <div className="text-2xl font-bold gradient-text flex items-center">
          👑 KushAlara
        </div>
        <div className="hidden md:flex items-center space-x-6">
          <a href="#home" className="text-gray-300 hover:text-white transition-colors">Home</a>
          <a href="#about" className="text-gray-300 hover:text-white transition-colors">About</a>
          <a href="#tokenomics" className="text-gray-300 hover:text-white transition-colors">Tokenomics</a>
          <a href="#roadmap" className="text-gray-300 hover:text-white transition-colors">Roadmap</a>
          <Link to="/citizenship" className="text-gray-300 hover:text-white transition-colors">Contact</Link>
        </div>
        <div className="flex items-center space-x-4">
          {/* Download Whitepaper Button */}
          <button 
            onClick={downloadWhitepaper}
            className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-sm"
          >
            Download Whitepaper
          </button>
          {/* Social Media Icons */}
          <a 
            href="https://www.instagram.com/royalkingdomofkush/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-pink-400 transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
          <a 
            href="https://x.com/KushKingdom_Gov" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-blue-400 transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          {/* Buy KushAlara Button */}
          <button 
            onClick={buyTokens}
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 py-2 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            Buy KushAlara
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16 fade-in">
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
            <button 
              onClick={buyTokens}
              className="bg-gradient-to-r from-green-500 to-green-700 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Buy KushAlara Tokens
            </button>
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
              Experience true digital citizenship with blockchain-verified identity and governance participation in the world's first Web3 nation.
            </p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 card-hover">
            <h3 className="text-2xl font-bold mb-4 text-blue-400">Economic Innovation</h3>
            <p className="text-gray-300">
              Access cutting-edge financial services, DeFi protocols, and Web3 business opportunities in our digital economy.
            </p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 card-hover">
            <h3 className="text-2xl font-bold mb-4 text-purple-400">Global Community</h3>
            <p className="text-gray-300">
              Join a worldwide network of digital pioneers building the future of governance and decentralized society.
            </p>
          </div>
        </div>

        {/* About KushAlara Section */}
        <section id="about" className="mb-16 fade-in">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 gradient-text">About KushAlara</h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto">
              The world's first Web3-native sovereign state, pioneering digital governance and economic innovation
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Digital Sovereignty */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 card-hover text-center">
              <div className="text-4xl mb-4 text-yellow-400">🛡️</div>
              <h3 className="text-xl font-bold mb-3 text-white">Digital Sovereignty</h3>
              <p className="text-gray-300 text-sm">
                First Web3-native sovereign state with blockchain-integrated governance
              </p>
            </div>

            {/* Multi-Utility Token */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 card-hover text-center">
              <div className="text-4xl mb-4 text-yellow-400">🔗</div>
              <h3 className="text-xl font-bold mb-3 text-white">Multi-Utility Token</h3>
              <p className="text-gray-300 text-sm">
                Payments, staking, governance, and citizenship access in one token
              </p>
            </div>

            {/* CBDC Integration */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 card-hover text-center">
              <div className="text-4xl mb-4 text-yellow-400">📈</div>
              <h3 className="text-xl font-bold mb-3 text-white">CBDC Integration</h3>
              <p className="text-gray-300 text-sm">
                Central Bank Digital Currency for seamless financial inclusion
              </p>
            </div>

            {/* e-Residency Program */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 card-hover text-center">
              <div className="text-4xl mb-4 text-yellow-400">🌐</div>
              <h3 className="text-xl font-bold mb-3 text-white">e-Residency Program</h3>
              <p className="text-gray-300 text-sm">
                Global digital citizenship for innovators and entrepreneurs
              </p>
            </div>
          </div>
        </section>

        {/* Token Utilities Section */}
        <section id="utilities" className="mb-16 fade-in">
          <h2 className="text-4xl font-bold mb-12 gradient-text text-center">Token Utilities</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 card-hover">
              <h3 className="text-xl font-bold mb-3 text-yellow-400">Governance</h3>
              <p className="text-gray-300 text-sm">
                Vote on proposals, elect representatives, and shape the future of KushAlara through democratic participation.
              </p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 card-hover">
              <h3 className="text-xl font-bold mb-3 text-blue-400">Services</h3>
              <p className="text-gray-300 text-sm">
                Access government services, business registration, legal documentation, and citizen benefits.
              </p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 card-hover">
              <h3 className="text-xl font-bold mb-3 text-green-400">Commerce</h3>
              <p className="text-gray-300 text-sm">
                Trade within the KushAlara ecosystem, access DeFi protocols, and participate in the digital economy.
              </p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 card-hover">
              <h3 className="text-xl font-bold mb-3 text-purple-400">Staking</h3>
              <p className="text-gray-300 text-sm">
                Stake tokens to secure the network, earn rewards, and gain enhanced voting power in governance.
              </p>
            </div>
          </div>
        </section>

        {/* Tokenomics Section */}
        <section id="tokenomics" className="mb-16 fade-in">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 gradient-text">Tokenomics</h2>
            <p className="text-xl text-gray-300">
              Total Supply: 100 Million KushAlara Tokens
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Token Distribution */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-white">Token Distribution</h3>
              <div className="space-y-4">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-yellow-400 rounded-full mr-3"></div>
                      <span className="text-white font-semibold">Public Sale</span>
                    </div>
                    <span className="text-yellow-400 font-bold text-xl">88.5%</span>
                  </div>
                  <div className="text-gray-400 text-sm mt-1 ml-7">88.5M tokens</div>
                </div>
                
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-blue-400 rounded-full mr-3"></div>
                      <span className="text-white font-semibold">Pre-Sale</span>
                    </div>
                    <span className="text-blue-400 font-bold text-xl">10%</span>
                  </div>
                  <div className="text-gray-400 text-sm mt-1 ml-7">10M tokens (locked 2 years )</div>
                </div>
                
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-purple-400 rounded-full mr-3"></div>
                      <span className="text-white font-semibold">Kingdom Treasury</span>
                    </div>
                    <span className="text-purple-400 font-bold text-xl">1%</span>
                  </div>
                  <div className="text-gray-400 text-sm mt-1 ml-7">1M tokens</div>
                </div>
                
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-green-400 rounded-full mr-3"></div>
                      <span className="text-white font-semibold">Community Rewards</span>
                    </div>
                    <span className="text-green-400 font-bold text-xl">0.5%</span>
                  </div>
                  <div className="text-gray-400 text-sm mt-1 ml-7">500K tokens</div>
                </div>
              </div>
            </div>

            {/* Fund Allocation */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-white">Fund Allocation</h3>
              <div className="space-y-4">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">Kingdom Blockchain Development</span>
                    <span className="text-yellow-400 font-bold text-xl">40%</span>
                  </div>
                </div>
                
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">Central Bank & CBDC Development</span>
                    <span className="text-blue-400 font-bold text-xl">30%</span>
                  </div>
                </div>
                
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">Digital IDs & Passports</span>
                    <span className="text-purple-400 font-bold text-xl">20%</span>
                  </div>
                </div>
                
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">Ecosystem Development</span>
                    <span className="text-green-400 font-bold text-xl">10%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Development Roadmap */}
        <section id="roadmap" className="mb-16 fade-in">
          <h2 className="text-4xl font-bold mb-12 gradient-text text-center">Development Roadmap</h2>
          <div className="space-y-8 max-w-4xl mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 card-hover">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-black font-bold text-lg">
                  Phase 1
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3 text-yellow-400">Foundation & Launch</h3>
                  <p className="text-gray-300">Token launch, initial governance framework, citizenship applications open, basic DeFi integration.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 card-hover">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  Phase 2
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3 text-blue-400">Governance & Services</h3>
                  <p className="text-gray-300">DAO implementation, digital identity system, business registration portal, legal framework establishment.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 card-hover">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  Phase 3
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3 text-green-400">Economic Expansion</h3>
                  <p className="text-gray-300">DeFi ecosystem launch, NFT marketplace, cross-chain integration, international partnerships.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 card-hover">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  Phase 4
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3 text-purple-400">Global Recognition</h3>
                  <p className="text-gray-300">International recognition efforts, advanced governance features, metaverse integration, full sovereignty.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Join the Kingdom Section */}
        <section className="mb-16 fade-in">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6 gradient-text">Join the Kingdom</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Become part of the world's first Web3-native sovereign state
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Citizenship Card */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700 card-hover">
              <div className="text-center mb-6">
                <div className="text-4xl mb-4">👑</div>
                <h3 className="text-2xl font-bold text-white mb-4">Citizenship</h3>
                <p className="text-gray-300">
                  Become a full citizen of the Kingdom of Kush with voting rights, governance participation, and access to all Kingdom services.
                </p>
              </div>
              <Link 
                to="/citizenship"
                className="block w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black py-4 rounded-lg font-semibold text-center hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                Apply for Citizenship
              </Link>
            </div>

            {/* e-Residency Card */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700 card-hover">
              <div className="text-center mb-6">
                <div className="text-4xl mb-4">🌐</div>
                <h3 className="text-2xl font-bold text-white mb-4">e-Residency</h3>
                <p className="text-gray-300">
                  Access Kingdom digital services, register your business, and participate in our digital economy from anywhere in the world.
                </p>
              </div>
              <Link 
                to="/eresidency"
                className="block w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black py-4 rounded-lg font-semibold text-center hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                Apply for e-Residency
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-sm py-12 mt-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4 gradient-text">KushAlara</h3>
              <p className="text-gray-400 text-sm">
                The world's first Web3-native sovereign state, pioneering digital governance and economic innovation.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#tokenomics" className="hover:text-white transition-colors">Tokenomics</a></li>
                <li><a href="#roadmap" className="hover:text-white transition-colors">Roadmap</a></li>
                <li><Link to="/citizenship" className="hover:text-white transition-colors">Citizenship</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Services</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="/eresidency" className="hover:text-white transition-colors">e-Residency</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Business Registration</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Connect</h4>
              <div className="flex space-x-4">
                <a 
                  href="https://www.instagram.com/royalkingdomofkush/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-pink-400 transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a 
                  href="https://x.com/KushKingdom_Gov" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2025 KushAlara Token. All rights reserved. Building the future of digital sovereignty.
            </p>
          </div>
        </div>
      </footer>

      {/* Payment Modal - Matches Your Screenshot Exactly */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-3xl p-8 max-w-6xl w-full border border-gray-700">
            {/* Modal Header */}
            <div className="text-center mb-8">
              <div className="flex justify-between items-center mb-4">
                <div></div>
                <h2 className="text-4xl font-bold">
                  Buy <span className="gradient-text">KushAlara</span> Tokens
                </h2>
                <button 
                  onClick={closeModal}
                  className="text-gray-400 hover:text-white text-3xl"
                >
                  ×
                </button>
              </div>
              <p className="text-xl text-gray-300">
                Join the world's first Web3-native sovereign state
              </p>
            </div>

            {/* Two Cards Side by Side - Exactly Like Your Screenshot */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Card - Crypto Payment */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700">
                <h3 className="text-2xl font-bold mb-4 gradient-text text-center">Buy KushAlara Tokens</h3>
                <p className="text-gray-300 text-center mb-6">
                  Connect your wallet or use direct cryptocurrency payment
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-white mb-2 font-semibold">Amount (USD )</label>
                    <input 
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount" 
                      className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white mb-2 font-semibold">Payment Method</label>
                    <select 
                      value={selectedCrypto}
                      onChange={(e) => setSelectedCrypto(e.target.value)}
                      className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                    >
                      <option value="ETH">Ethereum (ETH)</option>
                      <option value="BTC">Bitcoin (BTC)</option>
                      <option value="USDC">USDC</option>
                      <option value="USDT">USDT</option>
                      <option value="SOL">Solana (SOL)</option>
                    </select>
                  </div>

                  {/* Wallet Address Display */}
                  {amount && (
                    <div className="bg-gray-700/30 rounded-lg p-4">
                      <div className="text-gray-300 text-sm mb-2">Send {selectedCrypto} to:</div>
                      <div className="bg-gray-600/50 rounded p-2 text-xs text-gray-200 break-all">
                        {walletAddresses[selectedCrypto]}
                      </div>
                      <button 
                        onClick={() => copyToClipboard(walletAddresses[selectedCrypto])}
                        className="text-yellow-400 text-xs mt-1 hover:text-yellow-300"
                      >
                        📋 Copy Address
                      </button>
                      <div className="text-yellow-400 font-bold mt-2">
                        You will receive: {amount} KUSH tokens
                      </div>
                      <div className="text-gray-400 text-xs">Rate: 1 USD = 1 KUSH</div>
                    </div>
                  )}
                  
                  <button 
                    onClick={handleCryptoPayment}
                    className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                  >
                    Continue to Payment
                  </button>
                  
                  <div className="text-center text-sm text-gray-400">
                    Secure wallet integration • Multiple payment options
                  </div>
                  
                  {/* Wallet Status Debug Info */}
                  <div className="bg-gray-700/30 rounded-lg p-4 text-sm">
                    <div className="flex items-center text-gray-300 mb-2">
                      🔗 <span className="ml-2">Wallet Status (Debug Info):</span>
                    </div>
                    <div className="space-y-1 text-gray-400">
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                        Ethereum: Not connected
                      </div>
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                        Solana: Not connected
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Card - Fiat Payment */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700">
                <h3 className="text-2xl font-bold mb-4 gradient-text text-center">
                  Buy KushAlara  

                  <span className="text-yellow-400">with USD</span>
                </h3>
                <p className="text-gray-300 text-center mb-6">
                  Securely purchase crypto with your debit/credit card via MoonPay.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-white mb-2 font-semibold">Amount (USD)</label>
                    <input 
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount in USD (min $20)" 
                      className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                    />
                  </div>

                  {amount && (
                    <div className="bg-gray-700/30 rounded-lg p-4">
                      <div className="text-gray-300 text-sm">You will receive:</div>
                      <div className="text-2xl font-bold text-yellow-400">
                        {parseFloat(amount).toLocaleString()} KUSH
                      </div>
                      <div className="text-gray-400 text-sm">Rate: 1 USD = 1 KUSH</div>
                    </div>
                  )}
                  
                  <button 
                    onClick={handleFiatPayment}
                    disabled={!amount || parseFloat(amount) < 20}
                    className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue to MoonPay
                  </button>
                  
                  <div className="text-center text-sm text-gray-400">
                    Minimum purchase amount is $20 USD.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HomePage
