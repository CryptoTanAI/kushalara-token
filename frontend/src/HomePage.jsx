import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import CountdownTimer from './CountdownTimer.jsx'

const HomePage = () => {
  const [walletConnected, setWalletConnected] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentStep, setPaymentStep] = useState('selection') // 'selection', 'crypto-details', 'wallet-connect', 'payment-confirm', 'moonpay-widget'
  const [amount, setAmount] = useState('')
  const [selectedCrypto, setSelectedCrypto] = useState('ETH')
  const [cryptoRates, setCryptoRates] = useState({
    ETH: 3843.30,
    BTC: 97000,
    SOL: 245.50,
    USDC: 1.00,
    USDT: 1.00
  })
  const [selectedWallet, setSelectedWallet] = useState('')

  // Wallet addresses
  const walletAddresses = {
    ETH: '0x07086A9a09b3B6A7A870094608eE99a0A6220AAD',
    USDC: '0x07086A9a09b3B6A7A870094608eE99a0A6220AAD',
    USDT: '0x07086A9a09b3B6A7A870094608eE99a0A6220AAD',
    BTC: 'bc1qp5amz3sck2hypxd8krhl5h3u68d25v72zt3cme0zxtyn5dhr64dq3x3lq2',
    SOL: 'DMLEbV5AYRmvKsjrHg1xcdsjxA3cNqCJmQMMDPDQnrUH'
  }

  // Calculate crypto amount and fees
  const calculateCrypto = () => {
    if (!amount) return { cryptoAmount: 0, networkFee: 0, processingFee: 0, total: 0 }
    
    const usdAmount = parseFloat(amount)
    const rate = cryptoRates[selectedCrypto]
    const cryptoAmount = usdAmount / rate
    
    // Calculate fees based on crypto type
    let networkFee = 0
    let processingFee = usdAmount * 0.025 // 2.5% processing fee
    
    switch(selectedCrypto) {
      case 'ETH':
        networkFee = 15 // $15 ETH gas fee
        break
      case 'BTC':
        networkFee = 8 // $8 BTC network fee
        break
      case 'SOL':
        networkFee = 0.5 // $0.50 SOL fee
        break
      case 'USDC':
      case 'USDT':
        networkFee = 12 // $12 ERC-20 gas fee
        break
    }
    
    const total = usdAmount + networkFee + processingFee
    
    return { cryptoAmount, networkFee, processingFee, total }
  }

  const downloadWhitepaper = () => {
    const link = document.createElement('a')
    link.href = '/whitepaper.pdf'
    link.download = 'KushAlara-Whitepaper.pdf'
    link.click()
  }

  const buyTokens = () => {
    setShowPaymentModal(true)
    setPaymentStep('selection')
  }

  const selectCryptoPayment = () => {
    setPaymentStep('crypto-details')
  }

  const selectFiatPayment = () => {
    setPaymentStep('moonpay-widget')
  }

  const proceedToWalletConnect = () => {
    setPaymentStep('wallet-connect')
  }

  const connectWallet = (walletType) => {
    setSelectedWallet(walletType)
    setPaymentStep('payment-confirm')
    // Simulate wallet connection
    setTimeout(() => {
      setWalletConnected(true)
    }, 1000)
  }

  const closeModal = () => {
    setShowPaymentModal(false)
    setPaymentStep('selection')
    setAmount('')
    setSelectedWallet('')
  }

  const copyAddress = (address) => {
    navigator.clipboard.writeText(address)
    alert('Address copied to clipboard!')
  }

  const backToSelection = () => {
    setPaymentStep('selection')
  }

  const backToDetails = () => {
    setPaymentStep('crypto-details')
  }

  const { cryptoAmount, networkFee, processingFee, total } = calculateCrypto()

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
      <section className="text-center py-20 px-6">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          <span className="gradient-text">KushAlara</span> Token
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
          The world's first Web3-native sovereign state, pioneering digital governance and economic innovation through blockchain technology.
        </p>
      </section>

      {/* Countdown Timer */}
      <div className="mb-16">
        <CountdownTimer />
      </div>

      {/* Digital Sovereignty Section */}
      <section className="mb-16 px-6">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="text-center p-8 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 card-hover">
            <div className="text-4xl mb-4">🛡️</div>
            <h3 className="text-2xl font-bold mb-4 gradient-text">Digital Sovereignty</h3>
            <p className="text-gray-300">
              Experience true digital citizenship with blockchain-verified identity and governance participation in the world's first Web3 nation.
            </p>
          </div>
          <div className="text-center p-8 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 card-hover">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-2xl font-bold mb-4 gradient-text">Economic Innovation</h3>
            <p className="text-gray-300">
              Access cutting-edge financial services, DeFi protocols, and Web3 business opportunities in our digital economy.
            </p>
          </div>
          <div className="text-center p-8 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 card-hover">
            <div className="text-4xl mb-4">🌍</div>
            <h3 className="text-2xl font-bold mb-4 gradient-text">Global Community</h3>
            <p className="text-gray-300">
              Join a worldwide network of digital pioneers building the future of governance and decentralized society.
            </p>
          </div>
        </div>
      </section>

      {/* About KushAlara Section */}
      <section id="about" className="mb-16 fade-in px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 gradient-text">About KushAlara</h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto">
            The world's first Web3-native sovereign state, pioneering digital governance and economic innovation
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
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

      {/* Token Utilities */}
      <section className="mb-16 fade-in px-6">
        <h2 className="text-4xl font-bold mb-12 gradient-text text-center">Token Utilities</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 card-hover">
            <h3 className="text-xl font-bold mb-3 text-yellow-400">Governance</h3>
            <p className="text-gray-300 text-sm">Vote on proposals, elect representatives, and shape the future of KushAlara through democratic participation.</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 card-hover">
            <h3 className="text-xl font-bold mb-3 text-blue-400">Services</h3>
            <p className="text-gray-300 text-sm">Access government services, business registration, legal documentation, and citizen benefits.</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 card-hover">
            <h3 className="text-xl font-bold mb-3 text-green-400">Commerce</h3>
            <p className="text-gray-300 text-sm">Trade within the KushAlara ecosystem, access DeFi protocols, and participate in the digital economy.</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 card-hover">
            <h3 className="text-xl font-bold mb-3 text-purple-400">Staking</h3>
            <p className="text-gray-300 text-sm">Stake tokens to secure the network, earn rewards, and gain enhanced voting power in governance.</p>
          </div>
        </div>
      </section>

      {/* Tokenomics Section */}
      <section id="tokenomics" className="mb-16 fade-in px-6">
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
      <section id="roadmap" className="mb-16 fade-in px-6">
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
      <section className="mb-16 fade-in px-6">
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
              className="block w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white py-4 rounded-lg font-semibold text-center hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Apply for e-Residency
            </Link>
          </div>
        </div>
      </section>

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
                <li><a href="#" className="hover:text-white transition-colors">Digital Identity</a></li>
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

      {/* Advanced Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-3xl max-w-6xl w-full border border-gray-700 max-h-[90vh] overflow-y-auto">
            
            {/* Payment Selection Screen */}
            {paymentStep === 'selection' && (
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-3xl font-bold gradient-text">Buy KushAlara Tokens</h3>
                  <button 
                    onClick={closeModal}
                    className="text-gray-400 hover:text-white text-3xl"
                  >
                    ×
                  </button>
                </div>
                <p className="text-xl text-gray-300 text-center mb-8">
                  Join the world's first Web3-native sovereign state
                </p>
                
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Crypto Payment Card */}
                  <div className="bg-gray-700/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-600">
                    <h4 className="text-2xl font-bold mb-4 gradient-text text-center">Buy KushAlara Tokens</h4>
                    <p className="text-gray-300 text-center mb-6">
                      Connect your wallet or use direct cryptocurrency payment
                    </p>
                    
                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-white mb-2 font-semibold">Amount (USD )</label>
                        <input 
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="Enter amount"
                          className="w-full p-3 bg-gray-600/50 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-white mb-2 font-semibold">Payment Method</label>
                        <select 
                          value={selectedCrypto}
                          onChange={(e) => setSelectedCrypto(e.target.value)}
                          className="w-full p-3 bg-gray-600/50 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                        >
                          <option value="ETH">Ethereum (ETH)</option>
                          <option value="BTC">Bitcoin (BTC)</option>
                          <option value="SOL">Solana (SOL)</option>
                          <option value="USDC">USD Coin (USDC)</option>
                          <option value="USDT">Tether (USDT)</option>
                        </select>
                      </div>
                    </div>
                    
                    <button 
                      onClick={selectCryptoPayment}
                      disabled={!amount}
                      className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue to Payment
                    </button>
                    
                    <div className="text-center text-sm text-gray-400 mt-4">
                      Secure wallet integration • Multiple payment options
                    </div>
                    
                    {/* Wallet Status */}
                    <div className="mt-6 p-4 bg-gray-600/30 rounded-lg">
                      <div className="flex items-center text-gray-300 text-sm mb-2">
                        <span className="mr-2">🔗</span>
                        Wallet Status (Debug Info):
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center text-red-400">
                          <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                          Ethereum: Not connected
                        </div>
                        <div className="flex items-center text-red-400">
                          <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                          Solana: Not connected
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* MoonPay Card */}
                  <div className="bg-gray-700/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-600">
                    <h4 className="text-2xl font-bold mb-4 gradient-text text-center">
                      Buy KushAlara  

                      <span className="text-yellow-400">with USD</span>
                    </h4>
                    <p className="text-gray-300 text-center mb-6">
                      Securely purchase crypto with your debit/credit card via MoonPay.
                    </p>
                    
                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-white mb-2 font-semibold">Amount (USD)</label>
                        <input 
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="Enter amount in USD (min $20)"
                          className="w-full p-3 bg-gray-600/50 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                        />
                      </div>
                    </div>
                    
                    <button 
                      onClick={selectFiatPayment}
                      disabled={!amount || parseFloat(amount) < 20}
                      className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue to MoonPay
                    </button>
                    
                    <div className="text-center text-sm text-gray-400 mt-4">
                      Minimum purchase amount is $20 USD.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Crypto Payment Details Screen */}
            {paymentStep === 'crypto-details' && (
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-3xl font-bold gradient-text">Complete Your Payment</h3>
                  <button 
                    onClick={closeModal}
                    className="text-gray-400 hover:text-white text-3xl"
                  >
                    ×
                  </button>
                </div>
                <p className="text-xl text-gray-300 text-center mb-8">
                  Connect your wallet and send payment
                </p>
                
                {/* Amount to Send */}
                <div className="max-w-md mx-auto mb-8">
                  <div className="bg-gray-700/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-600 text-center">
                    <h4 className="text-xl font-bold mb-3 gradient-text">Amount to Send</h4>
                    <div className="text-3xl font-bold text-white mb-2">
                      {cryptoAmount.toFixed(8)} {selectedCrypto}
                    </div>
                    <div className="text-gray-400">≈ ${amount} USD</div>
                  </div>
                </div>
                
                <div className="text-center mb-8">
                  <p className="text-gray-300 mb-4">Connect your {selectedCrypto === 'BTC' ? 'Bitcoin' : selectedCrypto === 'SOL' ? 'Solana' : 'Ethereum'} wallet to continue</p>
                  <button 
                    onClick={proceedToWalletConnect}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300"
                  >
                    Connect Wallet
                  </button>
                  <div className="mt-4">
                    <span className="text-yellow-400 font-semibold">{selectedCrypto === 'BTC' ? 'Bitcoin' : selectedCrypto === 'SOL' ? 'Solana' : 'Ethereum'} Network</span>
                  </div>
                </div>
                
                <div className="text-center">
                  <button 
                    onClick={backToSelection}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    ← Back to Payment Form
                  </button>
                </div>
              </div>
            )}

            {/* Wallet Connection Screen */}
            {paymentStep === 'wallet-connect' && (
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-3xl font-bold gradient-text">Connect a Wallet</h3>
                  <button 
                    onClick={closeModal}
                    className="text-gray-400 hover:text-white text-3xl"
                  >
                    ×
                  </button>
                </div>
                
                <div className="max-w-md mx-auto">
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-300 mb-4">Popular</h4>
                    <div className="space-y-3">
                      <button 
                        onClick={() => connectWallet('MetaMask')}
                        className="w-full flex items-center p-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg border border-gray-600 transition-all duration-300"
                      >
                        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mr-4">
                          🦊
                        </div>
                        <div className="text-left">
                          <div className="text-white font-semibold">MetaMask</div>
                          <div className="text-blue-400 text-sm">Recent</div>
                        </div>
                      </button>
                      
                      <button 
                        onClick={() => connectWallet('Rainbow')}
                        className="w-full flex items-center p-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg border border-gray-600 transition-all duration-300"
                      >
                        <div className="w-10 h-10 bg-gradient-to-r from-red-400 to-blue-400 rounded-lg flex items-center justify-center mr-4">
                          🌈
                        </div>
                        <div className="text-left">
                          <div className="text-white font-semibold">Rainbow</div>
                        </div>
                      </button>
                      
                      <button 
                        onClick={() => connectWallet('Coinbase')}
                        className="w-full flex items-center p-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg border border-gray-600 transition-all duration-300"
                      >
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                          💼
                        </div>
                        <div className="text-left">
                          <div className="text-white font-semibold">Coinbase Wallet</div>
                        </div>
                      </button>
                      
                      <button 
                        onClick={() => connectWallet('WalletConnect')}
                        className="w-full flex items-center p-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg border border-gray-600 transition-all duration-300"
                      >
                        <div className="w-10 h-10 bg-blue-400 rounded-lg flex items-center justify-center mr-4">
                          🔗
                        </div>
                        <div className="text-left">
                          <div className="text-white font-semibold">WalletConnect</div>
                        </div>
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-gray-400 text-sm mb-4">New to Ethereum wallets?</div>
                    <button className="text-blue-400 hover:text-blue-300 text-sm">Learn More</button>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Confirmation Screen */}
            {paymentStep === 'payment-confirm' && (
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-3xl font-bold gradient-text">Complete Your Payment</h3>
                  <button 
                    onClick={closeModal}
                    className="text-gray-400 hover:text-white text-3xl"
                  >
                    ×
                  </button>
                </div>
                <p className="text-xl text-gray-300 text-center mb-8">
                  Connect your wallet and send payment
                </p>
                
                {/* Amount to Send */}
                <div className="max-w-md mx-auto mb-8">
                  <div className="bg-gray-700/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-600 text-center">
                    <h4 className="text-xl font-bold mb-3 gradient-text">Amount to Send</h4>
                    <div className="text-3xl font-bold text-white mb-2">
                      {cryptoAmount.toFixed(8)} {selectedCrypto}
                    </div>
                    <div className="text-gray-400">≈ ${amount} USD</div>
                  </div>
                </div>
                
                <div className="max-w-md mx-auto mb-8">
                  <div className="text-center mb-6">
                    <p className="text-gray-300 mb-4">Connect your {selectedCrypto === 'BTC' ? 'Bitcoin' : selectedCrypto === 'SOL' ? 'Solana' : 'Ethereum'} wallet to continue</p>
                  </div>
                  
                  {/* Wallet Selection */}
                  <div className="flex space-x-4 mb-6">
                    <select 
                      value={selectedCrypto}
                      onChange={(e) => setSelectedCrypto(e.target.value)}
                      className="flex-1 p-3 bg-gray-600/50 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                    >
                      <option value="ETH">Ethereum</option>
                      <option value="BTC">Bitcoin</option>
                      <option value="SOL">Solana</option>
                      <option value="USDC">USDC</option>
                      <option value="USDT">USDT</option>
                    </select>
                    
                    <div className="flex-1 p-3 bg-gray-600/50 border border-gray-500 rounded-lg text-white flex items-center">
                      <span className="mr-2">👑</span>
                      <span className="truncate">{walletAddresses[selectedCrypto].substring(0, 8)}...{walletAddresses[selectedCrypto].slice(-4)}</span>
                    </div>
                  </div>
                  
                  {/* Recipient Address */}
                  <div className="mb-6">
                    <div className="text-center text-gray-300 mb-2">Sending to:</div>
                    <div className="bg-gray-600/30 rounded-lg p-4 text-center">
                      <div className="text-yellow-400 font-mono text-sm break-all">
                        {walletAddresses[selectedCrypto]}
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => alert(`Sending ${cryptoAmount.toFixed(8)} ${selectedCrypto} to ${walletAddresses[selectedCrypto]}`)}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition-all duration-300"
                  >
                    Send {selectedCrypto}
                  </button>
                  
                  <div className="mt-4">
                    <span className="text-yellow-400 font-semibold">{selectedCrypto === 'BTC' ? 'Bitcoin' : selectedCrypto === 'SOL' ? 'Solana' : 'Ethereum'} Network</span>
                  </div>
                </div>
                
                <div className="text-center text-gray-400 text-sm">
                  After sending, your tokens will be processed within 24 hours
                </div>
                
                <div className="text-center mt-6">
                  <button 
                    onClick={backToDetails}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    ← Back to Payment Form
                  </button>
                </div>
              </div>
            )}

            {/* MoonPay Widget Screen */}
            {paymentStep === 'moonpay-widget' && (
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-3xl font-bold gradient-text">Buy KushAlara with USD</h3>
                  <button 
                    onClick={closeModal}
                    className="text-gray-400 hover:text-white text-3xl"
                  >
                    ×
                  </button>
                </div>
                <p className="text-xl text-gray-300 text-center mb-8">
                  Securely purchase crypto with your debit/credit card via MoonPay.
                </p>
                
                {/* MoonPay-style Widget */}
                <div className="max-w-md mx-auto">
                  <div className="bg-white rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="text-xl font-bold text-gray-800">Buy</h4>
                      <button className="text-gray-600">☰</button>
                    </div>
                    
                    {/* USD Input */}
                    <div className="mb-4">
                      <div className="flex items-center bg-gray-100 rounded-lg p-4">
                        <input 
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="flex-1 text-2xl font-bold text-gray-800 bg-transparent outline-none"
                          placeholder="100"
                        />
                        <div className="flex items-center text-gray-600">
                          <span className="mr-2">🇺🇸</span>
                          <span className="font-semibold">USD</span>
                          <span className="ml-2">▼</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Crypto Output */}
                    <div className="mb-6">
                      <div className="flex items-center bg-gray-100 rounded-lg p-4">
                        <div className="flex-1 text-2xl font-bold text-gray-800">
                          {amount ? (parseFloat(amount) / cryptoRates[selectedCrypto]).toFixed(4) : '0.0254'}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <span className="mr-2">⟠</span>
                          <span className="font-semibold">ETH</span>
                          <span className="ml-2">▼</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Quick Amount Buttons */}
                    <div className="grid grid-cols-4 gap-2 mb-6">
                      {['$200', '$300', '$500', '$1,000'].map((amt) => (
                        <button 
                          key={amt}
                          onClick={() => setAmount(amt.replace('$', '').replace(',', ''))}
                          className="py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-semibold text-sm transition-colors"
                        >
                          {amt}
                        </button>
                      ))}
                    </div>
                    
                    {/* Summary */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">You get {amount ? (parseFloat(amount) / cryptoRates[selectedCrypto]).toFixed(4) : '0.0254'} ETH for ${amount || '100.00'}</span>
                        <span className="text-gray-400">▲</span>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">{amount ? (parseFloat(amount) / cryptoRates[selectedCrypto]).toFixed(4) : '0.0254'} ETH @ ${cryptoRates.ETH.toLocaleString()}</span>
                          <span className="text-gray-800 font-semibold">${amount ? (parseFloat(amount) - networkFee - processingFee).toFixed(2) : '97.63'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 flex items-center">
                            Network fee
                            <span className="ml-1 text-gray-400">ⓘ</span>
                          </span>
                          <span className="text-gray-800">${networkFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 flex items-center">
                            MoonPay fee
                            <span className="ml-1 text-gray-400">ⓘ</span>
                          </span>
                          <span className="text-gray-800">as low as ${processingFee.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center text-xs text-gray-500 mb-6">
                      ⏱ Quote updates in 5s
                    </div>
                    
                    <button 
                      onClick={() => alert(`Processing $${amount} USD purchase for ${(parseFloat(amount || '100') / cryptoRates[selectedCrypto]).toFixed(4)} ETH`)}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center"
                    >
                      Continue
                      <span className="ml-2">→</span>
                    </button>
                    
                    <div className="text-center text-xs text-gray-500 mt-4">
                      Cryptocurrency services in NY powered by Zero Hash. Zero Hash
                    </div>
                  </div>
                </div>
                
                <div className="text-center mt-6">
                  <button 
                    onClick={backToSelection}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    ← Back to Payment Options
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default HomePage
