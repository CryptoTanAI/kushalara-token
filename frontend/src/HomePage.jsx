import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAccount, useConnect, useDisconnect, useBalance, useWriteContract, useWaitForTransactionReceipt, useSendTransaction } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { parseEther, formatEther, parseUnits } from 'viem';
import CountdownTimer from './CountdownTimer.jsx';
import KushCrestLogo from './assets/kush-crest.png';
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import QRCode from 'qrcode';
import WhitepaperPDF from './assets/whitepaper.pdf';

const HomePage = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState('selection');
  const [amount, setAmount] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState('ETH');
  const [gasEstimate, setGasEstimate] = useState(null);
  const [cryptoRates, setCryptoRates] = useState({
    ETH: 3643.30,
    BTC: 97000,
    SOL: 245.50,
    USDC: 1.00,
    USDT: 1.00
  });

  const [selectedDemoCrypto, setSelectedDemoCrypto] = useState('ETH');
  const [selectedDemoFiat, setSelectedDemoFiat] = useState('USD');
  const [selectedDemoPayment, setSelectedDemoPayment] = useState('');
  const [demoAmount, setDemoAmount] = useState(100);

  const [showFooterBuyModal, setShowFooterBuyModal] = useState(false);
  const [footerPaymentStep, setFooterPaymentStep] = useState('selection');
  const [footerAmount, setFooterAmount] = useState('');
  const [footerSelectedCrypto, setFooterSelectedCrypto] = useState('ETH');
  const [kushPrice, setKushPrice] = useState(1.00);
  const [realTimeFees, setRealTimeFees] = useState({
    ETH: 0, BTC: 0, SOL: 0, USDC: 0, USDT: 0
  });

  const [showWalletInstall, setShowWalletInstall] = useState(false);
  const [selectedWalletType, setSelectedWalletType] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Get user's ETH balance
  const { data: balance } = useBalance({
    address: address,
  });

  // State to manage the entire payment flow: 'idle', 'processing', 'success', 'error'
  const [paymentStatus, setPaymentStatus] = useState('idle');

  // Hook for sending native ETH
  const { 
    data: ethTxHash, 
    isPending: isSendingEth, 
    sendTransactionAsync // Using the async version for better control
  } = useSendTransaction();

  // Hook for writing to a smart contract (for ERC20 tokens)
  const { 
    data: contractTxHash, 
    isPending: isSendingContract, 
    writeContractAsync // Using the async version
  } = useWriteContract();

  // A single hash state to monitor for confirmation
  const [txHashToMonitor, setTxHashToMonitor] = useState(null);

  // Hook to wait for the transaction to be confirmed
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ 
    hash: txHashToMonitor,
  });

  // Wallet addresses for receiving payments
  const walletAddresses = {
    ETH: '0x07086A9a09b386A7A870094600eE99a0A6220AD',
    USDC: '0x07086A9a09b386A7A870094600eE99a0A6220AD',
    USDT: '0x07086A9a09b386A7A870094600eE99a0A6220AD',
    BTC: 'bc1qp5am3sck2hypxd8krh15h3u68d25v72zt3cme0zxtyp5dhr6dq3x31q2',
    SOL: 'DMLEbV5AYRmvksjrHg1xcdsJvA3cHqCJmQYMDPDQnrUH'
  };

  // Fetch real-time crypto prices
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const apiUrl = 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum,bitcoin,solana,usd-coin,tether&vs_currencies=usd';
        const proxyUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent(apiUrl);
        const response = await fetch(proxyUrl);
        const proxyData = await response.json();
        const data = JSON.parse(proxyData.contents);

        setCryptoRates({
          ETH: data.ethereum?.usd || 3643.30,
          BTC: data.bitcoin?.usd || 97000,
          SOL: data.solana?.usd || 245.50,
          USDC: data['usd-coin']?.usd || 1.00,
          USDT: data.tether?.usd || 1.00,
        });
      } catch (error) {
        console.error('Failed to fetch prices:', error);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [cryptoRates]);

  // Simple, safe calculate crypto function
  const calculateCrypto = () => {
    if (!amount || amount === '') {
      return { cryptoAmount: 0, networkFee: 0, processingFee: 0, total: 0, totalCrypto: 0, hasEnoughBalance: false };
    }

    const usdAmount = parseFloat(amount);
    if (isNaN(usdAmount) || usdAmount <= 0) {
      return { cryptoAmount: 0, networkFee: 0, processingFee: 0, total: 0, totalCrypto: 0, hasEnoughBalance: false };
    }

    const rate = cryptoRates[selectedCrypto] || 1;
    const cryptoAmount = usdAmount / rate;

    // Use REAL network fees from APIs
    const networkFeeUSD = realTimeFees[selectedCrypto] || 0;
    const processingFeeUSD = 0; // No processing fee for direct crypto transfers
    const totalUSD = usdAmount + networkFeeUSD + processingFeeUSD;
    const totalCrypto = totalUSD / rate;

    const hasEnoughBalance = balance ? parseFloat(formatEther(balance.value)) >= totalCrypto : false;

    return {
      cryptoAmount,
      networkFee: networkFeeUSD,
      processingFee: processingFeeUSD,
      total: totalUSD,
      totalCrypto,
      hasEnoughBalance
    };
  };

  // Fetch real-time network fees
  useEffect(() => {
    const fetchNetworkFees = async () => {
      try {
        const ethGasResponse = await fetch('https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=demo');
        const ethGasData = await ethGasResponse.json();
        const ethGasPrice = parseFloat(ethGasData.result.SafeGasPrice);
        const ethFeeUSD = (ethGasPrice * 21000 * 0.000000001) * cryptoRates.ETH;

        const btcFeeResponse = await fetch('https://mempool.space/api/v1/fees/recommended');
        const btcFeeData = await btcFeeResponse.json();
        const btcFeeUSD = (btcFeeData.fastestFee * 250 * 0.00000001) * cryptoRates.BTC;

        const solFeeUSD = 0.000005 * cryptoRates.SOL;
        const erc20FeeUSD = (ethGasPrice * 65000 * 0.000000001) * cryptoRates.ETH;

        setRealTimeFees({
          ETH: ethFeeUSD,
          BTC: btcFeeUSD,
          SOL: solFeeUSD,
          USDC: erc20FeeUSD,
          USDT: erc20FeeUSD
        });
      } catch (error) {
        setRealTimeFees({
          ETH: 5, BTC: 2, SOL: 0.01, USDC: 8, USDT: 8
        });
      }
    };

    fetchNetworkFees();
    const interval = setInterval(fetchNetworkFees, 30000);
    return () => clearInterval(interval);
  }, [cryptoRates]);

  // Estimate gas for transaction
  useEffect(() => {
    const estimateGas = async () => {
      if (amount && selectedCrypto === 'ETH' && isConnected) {
        try {
          const gasPrice = BigInt(50000000000); // 50 gwei
          const gasLimit = BigInt(21000); // Standard ETH transfer
          setGasEstimate(gasPrice * gasLimit);
        } catch (error) {
          console.error('Gas estimation failed:', error);
        }
      }
    };

    estimateGas();
  }, [amount, selectedCrypto, isConnected]);

  const viewWhitepaper = () => {
    window.open(WhitepaperPDF, '_blank');
  };

  const downloadWhitepaper = () => {
    const link = document.createElement('a');
    link.href = WhitepaperPDF;
    link.download = 'KingdomOfKushNewWhitePaper.pdf';
    link.click();
  };

  const buyTokens = () => {
    setShowPaymentModal(true);
    setPaymentStep('selection');
  };

  const selectCryptoPayment = () => {
    setPaymentStep('crypto-details');
  };

  const selectFiatPayment = () => {
    setPaymentStep('moonpay-widget');
  };

  const proceedToWalletConnect = () => {
    if (!isConnected) {
      setPaymentStep('wallet-connect');
    } else {
      setPaymentStep('payment-confirm');
    }
  };

  const handleSOLPayment = async (amount) => {
    console.log('🟣 SOL Payment Handler - Starting...');
    
    try {
      let solanaWallet = null;

      // Check for Phantom wallet first (most popular)
      if (window.solana && window.solana.isPhantom) {
        console.log('✅ Phantom wallet detected');
        solanaWallet = window.solana;
      }
      // Check for MetaMask Solana support
      else if (window.ethereum && window.ethereum.solana) {
        console.log('✅ MetaMask Solana detected');
        solanaWallet = window.ethereum.solana;
      }
      // Check for Solflare wallet
      else if (window.solflare && window.solflare.isSolflare) {
        console.log('✅ Solflare wallet detected');
        solanaWallet = window.solflare;
      } else {
        throw new Error('No Solana wallet found. Please install Phantom, enable Solana in MetaMask, or install Solflare.');
      }

      // Connect to the wallet
      const response = await solanaWallet.connect();
      console.log('🔗 Connected to Solana wallet:', response.publicKey.toString());

      // Create connection to Solana network
      const connection = new Connection('https://api.mainnet-beta.solana.com');

      // Create transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: response.publicKey,
          toPubkey: new PublicKey(walletAddresses.SOL),
          lamports: amount * LAMPORTS_PER_SOL,
        })
      );

      // Get recent blockhash
      const { blockhash } = await connection.getRecentBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = response.publicKey;

      // Sign and send transaction
      const signedTransaction = await solanaWallet.signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signedTransaction.serialize());

      console.log('✅ SOL transaction sent:', signature);
      alert('SOL payment successful! Transaction: ' + signature);

    } catch (error) {
      console.error('❌ SOL payment failed:', error);
      alert('SOL payment failed: ' + error.message);
    }
  };

  const handleBTCPayment = async (cryptoAmount) => {
    console.log('🟡 BTC Payment Handler - Starting...');
    alert('Automated BTC payment is not yet supported. Please manually send $' + cryptoAmount + ' BTC to the address shown.');
  };

  // CORRECT PAYMENT FUNCTION (replace your executePayment function)
  const executePayment = async () => {
    // 1. Validations
    if (!isConnected) {
      return alert('Please connect your wallet to proceed.');
    }
    if (!amount || !selectedCrypto) {
      return alert('Please enter an amount and select a cryptocurrency.');
    }

    const { totalCrypto } = calculateCrypto();
    if (totalCrypto <= 0) {
      return alert('Amount must be greater than zero.');
    }

    setPaymentStatus('processing'); // Set status to processing
    setTxHashToMonitor(null); // Reset any previous transaction hash

    try {
      let hash; // Variable to store the transaction hash

      if (selectedCrypto === 'ETH') {
        console.log('🟠 Initiating ETH Payment...');
        const amountInWei = parseEther(totalCrypto.toString());
        hash = await sendTransactionAsync({
          to: walletAddresses['ETH'],
          value: amountInWei,
        });
      } else if (selectedCrypto === 'USDC' || selectedCrypto === 'USDT') {
        console.log(`🔵 Initiating ${selectedCrypto} Payment...`);
        const tokenDetails = {
          USDC: { address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6 },
          USDT: { address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6 }
        };
        const details = tokenDetails[selectedCrypto];
        const amountInSmallestUnit = parseUnits(totalCrypto.toString(), details.decimals);
        
        hash = await writeContractAsync({
          address: details.address,
          abi: [ // Minimal ABI for transfer
            { name: 'transfer', type: 'function', inputs: [{ name: 'to', type: 'address' }, { name: 'amount', type: 'uint256' }], outputs: [{ name: '', type: 'bool' }], stateMutability: 'nonpayable' }
          ],
          functionName: 'transfer',
          args: [walletAddresses[selectedCrypto], amountInSmallestUnit],
        });
      } else {
        // Handle BTC, SOL, or other cryptos manually for now
        console.log(`Manual payment required for ${selectedCrypto}`);
        alert(`Automated payment for ${selectedCrypto} is not yet supported. Please use the manual address.`);
        setPaymentStatus('idle'); // Reset status
        return;
      }

      console.log(`✅ Transaction sent! Hash: ${hash}`);
      setTxHashToMonitor(hash); // Start monitoring this transaction hash

    } catch (error) {
      console.error('❌ Payment failed:', error);
      const message = error.message.includes("User rejected the request")
        ? "Transaction was rejected by the user."
        : "An error occurred during the transaction.";
      alert(`Payment failed: ${message}`);
      setPaymentStatus('error'); // Set status to error
    }
  };

  // useEffect to handle confirmation status
  useEffect(() => {
    if (isConfirming) {
      console.log('⏳ Waiting for transaction confirmation...');
      // You can update the UI here to show "Confirming..."
    }
    
    if (isConfirmed) {
      console.log('🎉 Transaction confirmed!');
      setPaymentStatus('success');
      setTxHashToMonitor(null); // Stop monitoring
    }
  }, [isConfirming, isConfirmed]);

  // Wallet Detection Function
  const detectWallet = async () => {
    const currentAddress = address;
    
    console.log("Current connected address:", currentAddress);
    console.log("Detailed provider info:", {
      ethereum: !!window.ethereum,
      metamask: !!(window.ethereum && window.ethereum.isMetaMask),
      coinbase: !!(window.ethereum && (window.ethereum.isCoinbaseWallet || window.ethereum.selectedProvider?.isCoinbaseWallet)),
      coinbaseCheck1: !!(window.ethereum && window.ethereum.isCoinbaseWallet),
      coinbaseCheck2: !!(window.ethereum && window.ethereum.selectedProvider?.isCoinbaseWallet),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-700 text-white">
      {/* Header */}
      <header className="bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img src={KushCrestLogo} alt="Kingdom of Kush" className="h-12 w-12" />
            <h1 className="text-2xl font-bold">Kingdom of Kush</h1>
          </div>
          
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-green-300 transition-colors">Home</Link>
            <Link to="/citizenship" className="hover:text-green-300 transition-colors">Citizenship</Link>
            <Link to="/e-residency" className="hover:text-green-300 transition-colors">E-Residency</Link>
            <button onClick={viewWhitepaper} className="hover:text-green-300 transition-colors">Whitepaper</button>
          </nav>

          <div className="flex items-center space-x-4">
            <ConnectButton />
            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black bg-opacity-75 px-4 py-2">
            <Link to="/" className="block py-2 hover:text-green-300">Home</Link>
            <Link to="/citizenship" className="block py-2 hover:text-green-300">Citizenship</Link>
            <Link to="/e-residency" className="block py-2 hover:text-green-300">E-Residency</Link>
            <button onClick={viewWhitepaper} className="block py-2 hover:text-green-300 text-left w-full">Whitepaper</button>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <img src={KushCrestLogo} alt="Kingdom of Kush Crest" className="h-32 w-32 mx-auto mb-8" />
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-green-400 bg-clip-text text-transparent">
            Kingdom of Kush
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-green-100">
            The World's First Blockchain-Based Sovereign Nation
          </p>
          <p className="text-lg mb-12 text-green-200 max-w-3xl mx-auto">
            Join the revolution in digital sovereignty. Become a citizen of the Kingdom of Kush, 
            where blockchain technology meets traditional governance to create a new paradigm for nations.
          </p>
          
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-12">
            <button 
              onClick={buyTokens}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105"
            >
              Buy KUSH Tokens
            </button>
            <Link 
              to="/citizenship"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105"
            >
              Apply for Citizenship
            </Link>
            <button 
              onClick={viewWhitepaper}
              className="border-2 border-green-400 hover:bg-green-400 hover:text-black text-green-400 font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300"
            >
              Read Whitepaper
            </button>
          </div>

          {/* Countdown Timer */}
          <div className="bg-black bg-opacity-30 rounded-lg p-6 mb-12">
            <h3 className="text-2xl font-bold mb-4">Token Sale Countdown</h3>
            <CountdownTimer />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-black bg-opacity-30 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Why Choose Kingdom of Kush?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Blockchain Sovereignty</h3>
              <p className="text-green-200">Experience true digital sovereignty with blockchain-based governance and transparent decision-making processes.</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Economic Freedom</h3>
              <p className="text-green-200">Participate in a decentralized economy with KUSH tokens, enabling true financial independence and growth.</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Global Community</h3>
              <p className="text-green-200">Join a worldwide community of digital citizens working together to build the future of governance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Token Information */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8">KUSH Token</h2>
            <div className="bg-black bg-opacity-30 rounded-lg p-8 mb-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-yellow-400">Token Details</h3>
                  <div className="space-y-2 text-left">
                    <p><span className="font-semibold">Symbol:</span> KUSH</p>
                    <p><span className="font-semibold">Total Supply:</span> 1,000,000,000 KUSH</p>
                    <p><span className="font-semibold">Current Price:</span> ${kushPrice.toFixed(2)} USD</p>
                    <p><span className="font-semibold">Blockchain:</span> Ethereum (ERC-20)</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-yellow-400">Use Cases</h3>
                  <ul className="space-y-2 text-left">
                    <li>• Governance voting rights</li>
                    <li>• Citizenship application fees</li>
                    <li>• Access to exclusive services</li>
                    <li>• Staking rewards</li>
                    <li>• Economic participation</li>
                  </ul>
                </div>
              </div>
            </div>
            <button 
              onClick={buyTokens}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105"
            >
              Buy KUSH Tokens Now
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black bg-opacity-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img src={KushCrestLogo} alt="Kingdom of Kush" className="h-8 w-8" />
                <span className="font-bold text-lg">Kingdom of Kush</span>
              </div>
              <p className="text-green-200 text-sm">
                Building the future of digital sovereignty through blockchain technology.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="text-green-200 hover:text-white">Home</Link></li>
                <li><Link to="/citizenship" className="text-green-200 hover:text-white">Citizenship</Link></li>
                <li><Link to="/e-residency" className="text-green-200 hover:text-white">E-Residency</Link></li>
                <li><button onClick={viewWhitepaper} className="text-green-200 hover:text-white">Whitepaper</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Token</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={buyTokens} className="text-green-200 hover:text-white">Buy KUSH</button></li>
                <li><span className="text-green-200">Price: ${kushPrice.toFixed(2)}</span></li>
                <li><span className="text-green-200">Supply: 1B KUSH</span></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-green-200 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-green-200 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-green-600 mt-8 pt-8 text-center text-sm text-green-200">
            <p>&copy; 2024 Kingdom of Kush. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Buy KUSH Tokens</h2>
                <button 
                  onClick={() => setShowPaymentModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {paymentStep === 'selection' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold mb-4">Choose Payment Method</h3>
                  <button 
                    onClick={selectCryptoPayment}
                    className="w-full p-4 border border-green-600 rounded-lg hover:bg-green-600 hover:bg-opacity-20 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className="font-semibold">Cryptocurrency</div>
                        <div className="text-sm text-gray-400">Pay with ETH, BTC, SOL, USDC, USDT</div>
                      </div>
                    </div>
                  </button>
                  <button 
                    onClick={selectFiatPayment}
                    className="w-full p-4 border border-green-600 rounded-lg hover:bg-green-600 hover:bg-opacity-20 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className="font-semibold">Credit/Debit Card</div>
                        <div className="text-sm text-gray-400">Pay with USD, EUR, and other fiat currencies</div>
                      </div>
                    </div>
                  </button>
                </div>
              )}

              {paymentStep === 'crypto-details' && (
                <div className="space-y-4">
                  <button 
                    onClick={() => setPaymentStep('selection')}
                    className="flex items-center text-green-400 hover:text-green-300 mb-4"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                  </button>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Amount (USD)</label>
                    <input 
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none"
                      placeholder="Enter amount in USD"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Select Cryptocurrency</label>
                    <select 
                      value={selectedCrypto}
                      onChange={(e) => setSelectedCrypto(e.target.value)}
                      className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-green-500 focus:outline-none"
                    >
                      <option value="ETH">Ethereum (ETH)</option>
                      <option value="BTC">Bitcoin (BTC)</option>
                      <option value="SOL">Solana (SOL)</option>
                      <option value="USDC">USD Coin (USDC)</option>
                      <option value="USDT">Tether (USDT)</option>
                    </select>
                  </div>

                  {amount && (
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Payment Summary</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Amount:</span>
                          <span>${amount} USD</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Crypto Amount:</span>
                          <span>{calculateCrypto().cryptoAmount.toFixed(6)} {selectedCrypto}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Network Fee:</span>
                          <span>${calculateCrypto().networkFee.toFixed(2)} USD</span>
                        </div>
                        <div className="flex justify-between font-semibold border-t border-gray-600 pt-1">
                          <span>Total:</span>
                          <span>{calculateCrypto().totalCrypto.toFixed(6)} {selectedCrypto}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <button 
                    onClick={proceedToWalletConnect}
                    disabled={!amount}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-colors"
                  >
                    Continue to Payment
                  </button>
                </div>
              )}

              {paymentStep === 'wallet-connect' && (
                <div className="text-center space-y-4">
                  <button 
                    onClick={() => setPaymentStep('crypto-details')}
                    className="flex items-center text-green-400 hover:text-green-300 mb-4"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                  </button>
                  
                  <h3 className="text-lg font-semibold mb-4">Connect Your Wallet</h3>
                  <p className="text-gray-400 mb-6">Please connect your wallet to proceed with the payment.</p>
                  
                  <ConnectButton />
                  
                  {isConnected && (
                    <button 
                      onClick={() => setPaymentStep('payment-confirm')}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors mt-4"
                    >
                      Continue to Payment
                    </button>
                  )}
                </div>
              )}

              {paymentStep === 'payment-confirm' && (
                <div className="space-y-4">
                  <button 
                    onClick={() => setPaymentStep('crypto-details')}
                    className="flex items-center text-green-400 hover:text-green-300 mb-4"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                  </button>
                  
                  <h3 className="text-lg font-semibold mb-4">Confirm Payment</h3>
                  
                  <div className="bg-gray-800 p-4 rounded-lg mb-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Connected Wallet:</span>
                        <span className="font-mono">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Amount:</span>
                        <span>${amount} USD</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Crypto Amount:</span>
                        <span>{calculateCrypto().totalCrypto.toFixed(6)} {selectedCrypto}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Recipient:</span>
                        <span className="font-mono">{walletAddresses[selectedCrypto]?.slice(0, 6)}...{walletAddresses[selectedCrypto]?.slice(-4)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-900 bg-opacity-50 border border-yellow-600 p-4 rounded-lg mb-4">
                    <div className="flex items-start space-x-2">
                      <svg className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="text-yellow-400 font-semibold text-sm">Important</p>
                        <p className="text-yellow-200 text-sm">Please confirm the transaction in your wallet. Make sure you have enough {selectedCrypto} to cover the transaction and gas fees.</p>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={executePayment}
                    disabled={isSendingEth || isSendingContract || paymentStatus === 'processing'}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-colors"
                  >
                    {(isSendingEth || isSendingContract || paymentStatus === 'processing') ? 'Processing...' : `Pay ${calculateCrypto().totalCrypto.toFixed(6)} ${selectedCrypto}`}
                  </button>
                </div>
              )}

              {paymentStep === 'moonpay-widget' && (
                <div className="space-y-4">
                  <button 
                    onClick={() => setPaymentStep('selection')}
                    className="flex items-center text-green-400 hover:text-green-300 mb-4"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                  </button>
                  
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-4">Fiat Payment</h3>
                    <p className="text-gray-400 mb-6">Credit/Debit card payments will be available soon. Please use cryptocurrency payment for now.</p>
                    <button 
                      onClick={selectCryptoPayment}
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                      Use Cryptocurrency Instead
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer Buy Modal */}
      {showFooterBuyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Quick Buy KUSH</h2>
                <button 
                  onClick={() => setShowFooterBuyModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Amount (USD)</label>
                  <input 
                    type="number"
                    value={footerAmount}
                    onChange={(e) => setFooterAmount(e.target.value)}
                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none"
                    placeholder="Enter amount in USD"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Pay with</label>
                  <select 
                    value={footerSelectedCrypto}
                    onChange={(e) => setFooterSelectedCrypto(e.target.value)}
                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-green-500 focus:outline-none"
                  >
                    <option value="ETH">Ethereum (ETH)</option>
                    <option value="BTC">Bitcoin (BTC)</option>
                    <option value="SOL">Solana (SOL)</option>
                    <option value="USDC">USD Coin (USDC)</option>
                    <option value="USDT">Tether (USDT)</option>
                  </select>
                </div>

                {footerAmount && (
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span>You'll receive:</span>
                      <span className="font-semibold">{(parseFloat(footerAmount) / kushPrice).toFixed(4)} KUSH</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-400 mt-1">
                      <span>Rate:</span>
                      <span>1 KUSH = ${kushPrice.toFixed(2)}</span>
                    </div>
                  </div>
                )}

                <button 
                  onClick={() => {
                    setAmount(footerAmount);
                    setSelectedCrypto(footerSelectedCrypto);
                    setShowFooterBuyModal(false);
                    setShowPaymentModal(true);
                    setPaymentStep('crypto-details');
                  }}
                  disabled={!footerAmount}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-center text-gray-400 text-sm">
        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
        <span>Powered by Stripe</span>
      </div>
    </div>
  );
};

export default HomePage;
