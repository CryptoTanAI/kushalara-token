import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import CountdownTimer from './CountdownTimer.jsx'

const HomePage = () => {
  const [walletConnected, setWalletConnected] = useState(false)

  const downloadWhitepaper = () => {
    // Create a simple PDF download link
    const link = document.createElement('a')
    link.href = '/whitepaper.pdf' // You'll need to add this file to public folder
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
    if (!walletConnected) {
      connectWallet()
    } else {
      // Integrate with MoonPay or other payment processor
      window.open('https://buy.moonpay.com/', '_blank' )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Navigation */}
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
    {/* Social Media Icons */}
    <a 
      href="https://www.instagram.com/royalkingdomofkush/" 
      target="_blank" 
      rel="noopener noreferrer"
      className="text-gray-300 hover:text-white transition-colors text-xl"
    >
      📱
    </a>
    <a 
      href="https://x.com/KushKingdom_Gov" 
      target="_blank" 
      rel="noopener noreferrer"
      className="text-gray-300 hover:text-white transition-colors text-xl"
    >
      🐦
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

{/* Payment Processing Section */}
<section className="mb-16 fade-in">
  <div className="text-center mb-12">
    <h2 className="text-4xl font-bold mb-4">
      Buy <span className="gradient-text">KushAlara</span> Tokens
    </h2>
    <p className="text-xl text-gray-300">
      Join the world's first Web3-native sovereign state
    </p>
  </div>
  
  <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
    {/* Crypto Payment Card */}
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700 card-hover">
      <h3 className="text-2xl font-bold mb-4 gradient-text text-center">Buy KushAlara Tokens</h3>
      <p className="text-gray-300 text-center mb-6">
        Connect your wallet or use direct cryptocurrency payment
      </p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-white mb-2 font-semibold">Amount (USD)</label>
          <input 
            type="text" 
            placeholder="Enter amount" 
            className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
          />
        </div>
        
        <div>
          <label className="block text-white mb-2 font-semibold">Payment Method</label>
          <select className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-400">
            <option>Choose cryptocurrency</option>
            <option>Ethereum (ETH)</option>
            <option>Bitcoin (BTC)</option>
            <option>USDC</option>
            <option>USDT</option>
          </select>
        </div>
        
        <button 
          onClick={connectWallet}
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

    {/* MoonPay Card */}
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700 card-hover">
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
            type="text" 
            placeholder="Enter amount in USD (min $20)" 
            className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
          />
        </div>
        
        <button 
          onClick={buyTokens}
          className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
        >
          Continue to MoonPay
        </button>
        
        <div className="text-center text-sm text-gray-400">
          Minimum purchase amount is $20 USD.
        </div>
      </div>
    </div>
  </div>
</section>

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
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-3xl p-12 border border-gray-700">
            <h2 className="text-4xl font-bold mb-12 gradient-text text-center">Tokenomics</h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold mb-6 text-yellow-400">Token Distribution</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg">
                    <span className="text-gray-300">Public Sale</span>
                    <span className="text-white font-bold">40%</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg">
                    <span className="text-gray-300">Development</span>
                    <span className="text-white font-bold">25%</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg">
                    <span className="text-gray-300">Community Rewards</span>
                    <span className="text-white font-bold">20%</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg">
                    <span className="text-gray-300">Team & Advisors</span>
                    <span className="text-white font-bold">10%</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg">
                    <span className="text-gray-300">Reserve Fund</span>
                    <span className="text-white font-bold">5%</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-6 text-blue-400">Token Metrics</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-700/50 rounded-lg">
                    <div className="text-gray-300 mb-1">Total Supply</div>
                    <div className="text-2xl font-bold text-white">1,000,000,000 KUSH</div>
                  </div>
                  <div className="p-4 bg-gray-700/50 rounded-lg">
                    <div className="text-gray-300 mb-1">Initial Price</div>
                    <div className="text-2xl font-bold text-white">$0.10 USD</div>
                  </div>
                  <div className="p-4 bg-gray-700/50 rounded-lg">
                    <div className="text-gray-300 mb-1">Blockchain</div>
                    <div className="text-2xl font-bold text-white">Ethereum</div>
                  </div>
                  <div className="p-4 bg-gray-700/50 rounded-lg">
                    <div className="text-gray-300 mb-1">Token Standard</div>
                    <div className="text-2xl font-bold text-white">ERC-20</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Development Roadmap */}
        <section id="roadmap" className="mb-16 fade-in">
          <h2 className="text-4xl font-bold mb-12 gradient-text text-center">Development Roadmap</h2>
          <div className="space-y-8">
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-black font-bold">
                Q1
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 flex-1">
                <h3 className="text-xl font-bold mb-3 text-yellow-400">Foundation & Launch</h3>
                <p className="text-gray-300">Token launch, initial governance framework, citizenship applications open, basic DeFi integration.</p>
              </div>
            </div>
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                Q2
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 flex-1">
                <h3 className="text-xl font-bold mb-3 text-blue-400">Governance & Services</h3>
                <p className="text-gray-300">DAO implementation, digital identity system, business registration portal, legal framework establishment.</p>
              </div>
            </div>
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                Q3
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 flex-1">
                <h3 className="text-xl font-bold mb-3 text-green-400">Economic Expansion</h3>
                <p className="text-gray-300">DeFi ecosystem launch, NFT marketplace, cross-chain integration, international partnerships.</p>
              </div>
            </div>
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                Q4
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 flex-1">
                <h3 className="text-xl font-bold mb-3 text-purple-400">Global Recognition</h3>
                <p className="text-gray-300">International recognition efforts, advanced governance features, metaverse integration, full sovereignty.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Join the Kingdom Section */}
        <section className="mb-16 fade-in">
          <div className="bg-gradient-to-r from-yellow-400/20 via-blue-400/20 to-purple-400/20 rounded-3xl p-12 border border-gray-700 text-center">
            <h2 className="text-4xl font-bold mb-6 gradient-text">Join the Kingdom</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Become a founding citizen of the world's first Web3 nation. Shape the future of digital governance and be part of history in the making.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
              <Link 
                to="/citizenship" 
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-8 py-4 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                Become a Citizen
              </Link>
              <Link 
                to="/eresidency" 
                className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                Get e-Residency
              </Link>
              <button 
                onClick={buyTokens}
                className="bg-gradient-to-r from-green-500 to-green-700 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                Buy Tokens
              </button>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <div className="text-center mb-16">
          <button 
            onClick={downloadWhitepaper}
            className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 mr-4 mb-4"
          >
            Download Whitepaper
          </button>
          <a 
  href="https://www.instagram.com/royalkingdomofkush/" 
  target="_blank" 
  rel="noopener noreferrer"
  className="bg-gradient-to-r from-pink-500 to-pink-700 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 mr-4 mb-4 inline-block"
>
  📱 Follow on Instagram
</a>
<a 
  href="https://x.com/KushKingdom_Gov" 
  target="_blank" 
  rel="noopener noreferrer"
  className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 mb-4 inline-block"
>
  🐦 Follow on X (Twitter )
</a>

        </div>
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
                <li><a href="#" className="hover:text-white transition-colors">Legal Services</a></li>
                <li><a href="#" className="hover:text-white transition-colors">DeFi Access</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Connect</h4>
              <div className="flex space-x-4">
                <a href="https://www.instagram.com/royalkingdomofkush/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
  📱
</a>
<a href="https://x.com/KushKingdom_Gov" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
  🐦
</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  💬
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
    </div>
   )
}

export default HomePage
