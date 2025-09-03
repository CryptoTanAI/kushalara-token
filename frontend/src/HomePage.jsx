import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAccount, useConnect, useDisconnect, useBalance, useWriteContract, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { parseEther, formatEther, parseUnits } from 'viem'
import CountdownTimer from './CountdownTimer.jsx'
import KushCrestLogo from './assets/kush-crest.png';
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js'
import QRCode from 'qrcode'
import WhitepaperPDF from './assets/Whitepaper.pdf';


// Wallet Detection and Installation Helper
const WalletInstallationModal = ({ isOpen, onClose, walletType }) => {
  const walletInfo = {
    metamask: {
      name: 'MetaMask',
      url: 'https://metamask.io/download/',
      description: 'The most popular Ethereum wallet',
      logo: '🦊',
      instructions: [
        'Visit metamask.io/download/',
        'Click "Download" for your browser',
        'Install the browser extension',
        'Create or import your wallet',
        'Refresh this page and try connecting again'
      ]
    },
    phantom: {
      name: 'Phantom',
      url: 'https://phantom.app/',
      description: 'The best Solana wallet',
      logo: '👻',
      instructions: [
        'Visit phantom.app',
        'Click "Download" for your browser',
        'Install the browser extension',
        'Create or import your wallet',
        'Refresh this page and try connecting again'
      ]
    },
    binance: {
      name: 'Binance Web3 Wallet',
      url: 'https://www.binance.com/en/web3wallet',
      description: 'Binance official Web3 wallet',
      logo: '🟡',
      instructions: [
        'Visit binance.com/en/web3wallet',
        'Download the Binance Web3 Wallet extension',
        'Install the browser extension',
        'Create or import your wallet',
        'Refresh this page and try connecting again'
      ]
    },
    exodus: {
      name: 'Exodus',
      url: 'https://www.exodus.com/download/',
      description: 'Beautiful multi-crypto wallet',
      logo: '🚀',
      instructions: [
        'Visit exodus.com/download/',
        'Download Exodus for your device',
        'Install and set up your wallet',
        'Enable browser extension if available',
        'Refresh this page and try connecting again'
      ]
    }
  }

  const wallet = walletInfo[walletType] || walletInfo.metamask

  if (!isOpen ) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-gray-800 rounded-2xl max-w-md w-full border border-gray-700 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white flex items-center">
            <span className="text-3xl mr-3">{wallet.logo}</span>
            Install {wallet.name}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>
        
        <p className="text-gray-300 mb-6">{wallet.description}</p>
        
        <div className="space-y-3 mb-6">
          <h4 className="text-lg font-semibold text-white">Installation Steps:</h4>
          {wallet.instructions.map((step, index) => (
            <div key={index} className="flex items-start">
              <span className="bg-yellow-400 text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                {index + 1}
              </span>
              <span className="text-gray-300 text-sm">{step}</span>
            </div>
          ))}
        </div>
        
        <div className="flex space-x-3">
          <a
            href={wallet.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black py-3 rounded-lg font-semibold text-center hover:shadow-lg transition-all duration-300"
          >
            Download {wallet.name}
          </a>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

//QR code generator

const generateQRCode = async (address, amount, crypto) => {
    try {
        let qrContent = address;
        
        if (crypto === 'BTC') {
            qrContent = `bitcoin:${address}?amount=${amount}`;
        } else if (crypto === 'ETH') {
            qrContent = `ethereum:${address}@1?value=${amount}e18`;
        } else if (crypto === 'SOL') {
            qrContent = address;
        } else if (crypto === 'USDC' || crypto === 'USDT') {
            qrContent = `ethereum:${address}@1`;
        }
        
        const qrCodeDataURL = await QRCode.toDataURL(qrContent, {
            width: 200,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            },
            errorCorrectionLevel: 'M'
        });
        
        return qrCodeDataURL;
    } catch (error) {
        console.error('QR code generation failed:', error);
        return null;
    }
};

const PaymentAddressDisplay = ({ selectedCrypto, walletAddresses, amount }) => {
    const [qrCode, setQrCode] = useState(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (selectedCrypto && walletAddresses[selectedCrypto] && amount) {
            generateQRCode(walletAddresses[selectedCrypto], amount, selectedCrypto)
                .then(setQrCode);
        }
    }, [selectedCrypto, walletAddresses, amount]);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    if (!selectedCrypto || !walletAddresses[selectedCrypto]) return null;

    const address = walletAddresses[selectedCrypto];
    const cryptoIcons = {
        BTC: '₿',
        ETH: 'Ξ',
        SOL: '◎',
        USDC: '$',
        USDT: '₮'
    };

    return (
        <div className="mt-6 p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700">
            <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-white flex items-center justify-center gap-2">
                    <span className="text-2xl">{cryptoIcons[selectedCrypto]}</span>
                    {selectedCrypto} Payment Details
                </h3>
                <p className="text-gray-300 mt-2">Send exactly {amount} {selectedCrypto}</p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        📍 Recipient Address:
                    </label>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={address}
                            readOnly
                            className="flex-1 p-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm font-mono"
                        />
                        <button
                            onClick={() => copyToClipboard(address)}
                            className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                            {copied ? '✓' : '📋'} {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                </div>

                {qrCode && (
                    <div className="text-center">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            📱 QR Code for Mobile Wallets:
                        </label>
                        <div className="inline-block p-4 bg-white rounded-lg">
                            <img src={qrCode} alt="Payment QR Code" className="w-48 h-48" />
                        </div>
                    </div>
                )}

                <div className="p-4 bg-yellow-900/30 border border-yellow-600 rounded-lg">
                    <p className="text-yellow-200 text-sm">
                        ⚠️ <strong>Important:</strong> Only send {selectedCrypto} to this address. 
                        Sending other cryptocurrencies may result in permanent loss of funds.
                    </p>
                </div>
            </div>
        </div>
    );
};

  const HomePage = () => {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentStep, setPaymentStep] = useState('selection')
  const [amount, setAmount] = useState('')
  const [selectedCrypto, setSelectedCrypto] = useState('ETH')
  const [gasEstimate, setGasEstimate] = useState(null)
  const [cryptoRates, setCryptoRates] = useState({
  ETH: 3843.30,
  BTC: 97000,
  SOL: 245.50,
  USDC: 1.00,
  USDT: 1.00
})

const [selectedDemoCrypto, setSelectedDemoCrypto] = useState('ETH')
const [selectedDemoFiat, setSelectedDemoFiat] = useState('USD')  
const [selectedDemoPayment, setSelectedDemoPayment] = useState('')
const [demoAmount, setDemoAmount] = useState(100)

const [showFooterBuyModal, setShowFooterBuyModal] = useState(false)
const [footerPaymentStep, setFooterPaymentStep] = useState('selection')
const [footerAmount, setFooterAmount] = useState('')
const [footerSelectedCrypto, setFooterSelectedCrypto] = useState('ETH')
const [kushPrice, setKushPrice] = useState(1.00)
const [realTimeFees, setRealTimeFees] = useState({
  ETH: 0, BTC: 0, SOL: 0, USDC: 0, USDT: 0
})
    
const [showWalletInstall, setShowWalletInstall] = useState(false)
const [selectedWalletType, setSelectedWalletType] = useState('')
const [isMenuOpen, setIsMenuOpen] = useState(false)
const [email, setEmail] = useState('');
const [showSuccessMessage, setShowSuccessMessage] = useState(false);
const [transactionHash, setTransactionHash] = useState('');
const [paymentType, setPaymentType] = useState(''); // 'crypto' or 'fiat'

const { data: balance, isLoading: balanceLoading } = useBalance({
    address: address,
    enabled: !!address && isConnected,
});

// Add this with your other hook declarations
const { data: hash, sendTransaction } = useSendTransaction()

  // Transaction confirmation tracking
const { data: transactionReceipt, isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: transactionHash,
    enabled: !!transactionHash,
});
    
// Add this useEffect to debug the hook's state
useEffect(() => {
    console.log('🔍 useWaitForTransactionReceipt state:', {
        transactionHash,
        isConfirming,
        isConfirmed,
        transactionReceipt
    });
}, [transactionHash, isConfirming, isConfirmed, transactionReceipt]);

   useEffect(() => {
    console.log('🔍 useEffect triggered - isConfirmed:', isConfirmed, 'transactionHash:', transactionHash);

     if (isConfirmed && transactionHash) {
    console.log('✅ Transaction confirmed on blockchain.');
  }   else {
        console.log('⏳ Waiting for confirmation - isConfirmed:', isConfirmed, 'transactionHash:', transactionHash);
    }
}, [isConfirmed, transactionHash]);
    
  // Contract write hook for sending ETH
  const { data: WriteHash, writeContract, isPending, error } = useWriteContract()

  // Wallet addresses for receiving payments
  const walletAddresses = {
    ETH: '0x07086A9a09b3B6A7A870094608eE99a0A6220AAD',
    USDC: '0x07086A9a09b3B6A7A870094608eE99a0A6220AAD',
    USDT: '0x07086A9a09b3B6A7A870094608eE99a0A6220AAD',
    BTC: 'bc1qp5amz3sck2hypxd8krhl5h3u68d25v72zt3cme0zxtyn5dhr64dq3x3lq2',
    SOL: 'DMLEbV5AYRmvKsjrHg1xcdsjxA3cNqCJmQMMDPDQnrUH'
  }

  // Fetch real-time crypto prices
  useEffect(() => {
    const fetchPrices = async () => {
      try {
      const apiUrl = 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum,bitcoin,solana,usd-coin,tether&vs_currencies=usd';
const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(apiUrl)}`;
const response = await fetch(proxyUrl);
const proxyData = await response.json();
const data = JSON.parse(proxyData.contents);


        setCryptoRates({
          ETH: data.ethereum?.usd || 3843.30,
          BTC: data.bitcoin?.usd || 97000,
          SOL: data.solana?.usd || 245.50,
          USDC: data['usd-coin']?.usd || 1.00,
          USDT: data.tether?.usd || 1.00
        })
      } catch (error) {
        console.error('Failed to fetch prices:', error)
      }
    }

    fetchPrices()
    const interval = setInterval(fetchPrices, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  // Simple, safe calculate crypto function
   const calculateCrypto = () => {
    if (!amount || amount === '') {
      return { cryptoAmount: 0, networkFee: 0, processingFee: 0, total: 0, totalCrypto: 0, hasEnoughBalance: false }
    }
    
    const usdAmount = parseFloat(amount)
    if (isNaN(usdAmount) || usdAmount <= 0) {
      return { cryptoAmount: 0, networkFee: 0, processingFee: 0, total: 0, totalCrypto: 0, hasEnoughBalance: false }
    }
    
    const rate = cryptoRates[selectedCrypto] || 1
    const cryptoAmount = usdAmount / rate
    
    // Use REAL network fees from APIs
    const networkFeeUSD = realTimeFees[selectedCrypto] || 0

    const processingFeeUSD = 0 // No processing fee for direct crypto transfers
    const totalUSD = usdAmount + networkFeeUSD + processingFeeUSD
    const totalCrypto = totalUSD / rate
    
    const hasEnoughBalance = balance ? parseFloat(formatEther(balance.value)) >= totalCrypto : false
    
    return { 
      cryptoAmount, 
      networkFee: networkFeeUSD, 
      processingFee: processingFeeUSD, 
      total: totalUSD, 
      totalCrypto, 
      hasEnoughBalance 
    }
  }

const checkSufficientBalance = (requiredAmount, cryptocurrency) => {
    if (!balance || balanceLoading) {
        return { sufficient: false, message: 'Loading balance...' };
    }
    
    // Convert balance to number for comparison
    const balanceInEth = parseFloat(formatEther(balance.value));
    const requiredInEth = parseFloat(requiredAmount);
    
    console.log('💰 Balance Check:', {
        available: balanceInEth,
        required: requiredInEth,
        cryptocurrency
    });
    
    if (balanceInEth < requiredInEth) {
        return {
            sufficient: false,
            message: `Insufficient ${cryptocurrency} balance. You have ${balanceInEth.toFixed(6)} ${cryptocurrency}, but need ${requiredInEth.toFixed(6)} ${cryptocurrency}.`
        };
    }
    
    return { sufficient: true, message: 'Sufficient balance' };
};
    
// User Information Validation Functions
const validateEmail = (email) => {
    console.log('🔍 validateEmail called with:', email);
    
    // More strict email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!emailRegex.test(email)) {
        console.log('❌ Email failed regex test');
        return false;
    }
    
    // Check for common typos in popular domains
    const domain = email.split('@')[1]?.toLowerCase();
    console.log('🔍 Email domain:', domain);
    
    const commonTypos = [
        'gmai.com', 'gmial.com', 'gmal.com', 'gmail.co', // Gmail typos (added gmal.com)
        'yahooo.com', 'yaho.com', 'yahoo.co', // Yahoo typos
        'hotmial.com', 'hotmai.com', 'hotmail.co', // Hotmail typos
        'outlok.com', 'outlook.co' // Outlook typos
    ];
    
    if (commonTypos.includes(domain)) {
        console.log('❌ Email domain is a known typo:', domain);
        return false;
    }
    
    console.log('✅ Email validation passed');
    return true;
};
    

// Fetch real-time network fees
useEffect(() => {
  const fetchNetworkFees = async () => {
    try {
      const ethGasResponse = await fetch('https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=demo' )
      const ethGasData = await ethGasResponse.json()
      const ethGasPrice = parseFloat(ethGasData.result.SafeGasPrice)
      const ethFeeUSD = (ethGasPrice * 21000 * 0.000000001) * cryptoRates.ETH
      
      const btcFeeResponse = await fetch('https://mempool.space/api/v1/fees/recommended' )
      const btcFeeData = await btcFeeResponse.json()
      const btcFeeUSD = (btcFeeData.fastestFee * 250 * 0.00000001) * cryptoRates.BTC
      
      const solFeeUSD = 0.000005 * cryptoRates.SOL
      const erc20FeeUSD = (ethGasPrice * 65000 * 0.000000001) * cryptoRates.ETH
      
      setRealTimeFees({
        ETH: ethFeeUSD,
        BTC: btcFeeUSD,
        SOL: solFeeUSD,
        USDC: erc20FeeUSD,
        USDT: erc20FeeUSD
      })
    }   catch (error) {
      setRealTimeFees({
        ETH: 5, BTC: 2, SOL: 0.01, USDC: 8, USDT: 8
      })
    }
  }
  fetchNetworkFees()
  const interval = setInterval(fetchNetworkFees, 30000)
  return () => clearInterval(interval)
}, [cryptoRates])

    
  // Estimate gas for transaction
  useEffect(() => {
    const estimateGas = async () => {
      if (amount && selectedCrypto === 'ETH' && isConnected) {
        try {
          const gasPrice = BigInt(50000000000) // 50 gwei
          const gasLimit = BigInt(21000) // Standard ETH transfer
          setGasEstimate(gasPrice * gasLimit)
        } catch (error) {
          console.error('Gas estimation failed:', error)
        }
      }
    }

    estimateGas()
  }, [amount, selectedCrypto, isConnected])

const viewWhitepaper = () => {
    window.open(WhitepaperPDF, "_blank");
};

const downloadWhitepaper = () => {
    const link = document.createElement('a');
    link.href = WhitepaperPDF;
    link.download = 'KingdomofKushNewWhitePaper.pdf';
    link.click();
};


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
    if (!isConnected) {
      setPaymentStep('wallet-connect')
    } else {
      setPaymentStep('payment-confirm')
    }
  }

    //handlesolpayment is below

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
        }
        else {
            throw new Error('No Solana wallet found. Please install Phantom, enable Solana in MetaMask, or install Solflare.');
        }

        // Connect to the wallet
        const response = await solanaWallet.connect();
        console.log('🔗 Connected to Solana wallet:', response.publicKey.toString());

        // Create connection to Solana network
        const connection = new Connection('https://api.mainnet-beta.solana.com' );
        
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
        alert(`SOL payment successful! Transaction: ${signature}`);
        
    } catch (error) {
        console.error('❌ SOL payment failed:', error);
        alert(`SOL payment failed: ${error.message}`);
    }
};

const handleETHPayment = async (cryptoAmount) => {
    console.log('🟠 ETH Payment Handler - Starting...');
    try {
        if (!isConnected) {
            throw new Error('Please connect your MetaMask wallet first');
        }
        
        if (selectedCrypto !== 'ETH') {
            throw new Error('Invalid payment method for ETH');
        }
        
        console.log('💰 Converting amount to Wei:', cryptoAmount);
        const amountInWei = parseEther(cryptoAmount.toString());
        console.log('✅ Wei conversion successful:', amountInWei.toString());
        
        console.log('📤 Initiating transaction...');
        
        const result = await sendTransaction({
            to: walletAddresses['ETH'],
            value: amountInWei,
        });
        
        console.log('✅ ETH payment transaction initiated successfully');
        console.log('📋 Transaction Hash (raw result):', result);
        console.log('📋 Transaction Hash (type):', typeof result);
        
        // CRITICAL: Set the transaction hash
        setTransactionHash(result || 'pending');
        console.log('📋 Transaction Hash set to:', result || 'pending');
              
        // IMMEDIATELY show success message (don't wait for confirmation)
        setShowSuccessMessage(true);
        console.log('✅ Success message shown immediately');
        
        // Prepare data for backend
        const paymentData = {
            transactionHash: result,
            walletAddress: address,
            amount: cryptoAmount,
            cryptocurrency: 'ETH',
            recipientAddress: walletAddresses['ETH'],
            timestamp: new Date().toISOString(),
            userEmail: email
        };
        
        console.log('📤 Payment data prepared for backend:', paymentData);
        // Here you would send this data to your backend API
        
    } catch (error) {
        console.error('❌ ETH payment failed:', error);
        alert(`ETH payment failed: ${error.message}`);
        throw error;
    }
};


const handleTokenPayment = async (cryptoAmount, tokenType) => {
    console.log(`🔵 ${tokenType} Payment Handler - Starting...`);
    const tokenDetails = {
        USDC: { address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6 },
        USDT: { address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6 }
    };
    const details = tokenDetails[tokenType];
    if (!details) throw new Error(`Unsupported token: ${tokenType}`);
    try {
        if (typeof window.ethereum === 'undefined' || !window.ethereum.isMetaMask) {
            throw new Error('MetaMask not found. Please install MetaMask to proceed.');
        }
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const tokenContract = new ethers.Contract(details.address, ["function transfer(address to, uint256 amount)"], signer);
        const amountInSmallestUnit = ethers.utils.parseUnits(cryptoAmount.toString(), details.decimals);
        const tx = await tokenContract.transfer(walletAddresses[tokenType], amountInSmallestUnit);
        await tx.wait();
        alert(`${tokenType} payment successful! Transaction: ${tx.hash}`);
    } catch (error) {
        console.error(`❌ ${tokenType} payment failed:`, error);
        alert(`${tokenType} payment failed: ${error.message}`);
        throw error;
    }
};

const handleBTCPayment = async (cryptoAmount) => {
    console.log('🟡 BTC Payment Handler - Starting...');
    alert(`Automated BTC payment is not yet supported. Please manually send ${cryptoAmount} BTC to the address shown.`);
};


    
// 3. CORRECT PAYMENT FUNCTION (replace your executePayment function)
const executePayment = async () => {
    
   if (!isConnected) { 
        alert('Please connect your wallet to proceed.');
        // Here, you might want to trigger the wallet connection modal
        return;
    }
    
    // 3. Validate payment details are selected
    if (!amount || !selectedCrypto) {
        alert('Please enter an amount and select a cryptocurrency.');
        return;
    }
  
   if (!email) {
    alert('Please enter your email address for transaction confirmation.');
    return;
}
    const { totalCrypto } = calculateCrypto();
    if (totalCrypto <= 0) {
        alert('Amount must be greater than zero.');
        return;
    }
  // 🔍 BALANCE CHECK BEFORE TRANSACTION
const balanceCheck = checkSufficientBalance(totalCrypto, selectedCrypto);
if (!balanceCheck.sufficient) {
    alert(balanceCheck.message);
    return;
}

    // 4. Prepare complete data for admin system (including wallet info)
    const paymentData = {
        wallet: {
    type: 'Web3',
    address: address, 
},
        payment: {
            amount_usd: parseFloat(amount),
            cryptocurrency: selectedCrypto,
            crypto_amount: totalCrypto,
            kush_tokens_owed: parseFloat(amount),
            timestamp: new Date().toISOString()
        }
    };
    
    // 5. Log all data as you originally had
    console.log('=== PAYMENT DATA FOR ADMIN SYSTEM ===');
    console.log(JSON.stringify(paymentData, null, 2));

    console.log('=== PAYMENT INITIATED ===');
    // console.log('Wallet Info:', { type: connectedWallet, address: connectedAddress });
    console.log('Amount (USD):', amount);
    console.log('Selected Crypto:', selectedCrypto);
    console.log('Total Crypto Amount:', totalCrypto);

   
    try {
          if (selectedCrypto === 'ETH') {
            console.log('🟠 ETH Payment - Using Web3 wallets');
             await handleETHPayment(totalCrypto);
   } else if (selectedCrypto === 'BTC') {
            console.log('🟡 BTC Payment - Using Bitcoin wallets');
             await handleBTCPayment(totalCrypto); // This will still fail
            alert('Automated payment for BTC is not available yet. Please use the manual payment address shown.');
        } else if (selectedCrypto === 'SOL') {
            console.log('🟣 SOL Payment - Using Solana wallets ONLY');
            await handleSOLPayment(totalCrypto); // This is the one that should work
        } else if (selectedCrypto === 'USDC') {
            console.log('🔵 USDC Payment - Using Web3 wallets');
             await handleUSDCPayment(totalCrypto); // This will still fail
            alert('Automated payment for USDC is not available yet. Please use the manual payment address shown.');
        } else if (selectedCrypto === 'USDT') {
            console.log('🟢 USDT Payment - Using Web3 wallets');
             await handleUSDTPayment(totalCrypto); // This will still fail
            alert('Automated payment for USDT is not available yet. Please use the manual payment address shown.');
        } else {
            throw new Error(`Unsupported cryptocurrency: ${selectedCrypto}`);
        }
    } catch (error) {
        console.error('Payment processing failed:', error);
        alert(`Payment failed: ${error.message}`);
    }
};




// executePayment function ends here. Below is the wallet detection
    
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
        coinbaseCheck3: !!(window.ethereum && window.ethereum.providerMap?.get('CoinbaseWallet')),
        trust: !!(window.ethereum && window.ethereum.isTrust),
        providers: window.ethereum?.providers?.length || 0
    });

    // Enhanced Coinbase Wallet detection
    const isCoinbaseWallet = () => {
        if (!window.ethereum) return false;
        
        // Multiple ways to detect Coinbase Wallet
        return (
            window.ethereum.isCoinbaseWallet ||
            window.ethereum.selectedProvider?.isCoinbaseWallet ||
            window.ethereum.providerMap?.get('CoinbaseWallet') ||
            (window.ethereum.providers && window.ethereum.providers.some(p => p.isCoinbaseWallet)) ||
            window.ethereum.constructor?.name === 'CoinbaseWalletProvider'
        );
    };

    // If multiple providers exist
    if (window.ethereum && window.ethereum.providers && window.ethereum.providers.length > 1) {
        console.log("Multiple providers detected:", window.ethereum.providers.length);
        
        for (const provider of window.ethereum.providers) {
            try {
                const accounts = await provider.request({ method: 'eth_accounts' });
                console.log(`Provider accounts:`, accounts);
                
                if (accounts.length > 0 && accounts[0].toLowerCase() === currentAddress.toLowerCase()) {
                    if (provider.isCoinbaseWallet) {
                        console.log("Found active Coinbase Wallet provider");
                        return { name: 'Coinbase Wallet', provider: () => provider };
                    } else if (provider.isMetaMask && !provider.isCoinbaseWallet) {
                        console.log("Found active MetaMask provider");
                        return { name: 'MetaMask', provider: () => provider };
                    } else if (provider.isTrust) {
                        return { name: 'Trust Wallet', provider: () => provider };
                    }
                }
            } catch (error) {
                console.log("Error checking provider:", error);
                continue;
            }
        }
    }

    // Single provider detection with enhanced Coinbase checking
    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            console.log("Single provider accounts:", accounts);
            
            if (accounts.length > 0 && accounts[0].toLowerCase() === currentAddress.toLowerCase()) {
                if (isCoinbaseWallet()) {
                    console.log("Detected: Coinbase Wallet (single provider)");
                    return { name: 'Coinbase Wallet', provider: () => window.ethereum };
                } else if (window.ethereum.isMetaMask && !isCoinbaseWallet()) {
                    console.log("Detected: MetaMask (single provider)");
                    return { name: 'MetaMask', provider: () => window.ethereum };
                } else if (window.ethereum.isTrust) {
                    return { name: 'Trust Wallet', provider: () => window.ethereum };
                } else {
                    console.log("Detected: Generic Ethereum Wallet");
                    return { name: 'Generic Ethereum Wallet', provider: () => window.ethereum };
                }
            }
        } catch (error) {
            console.error("Error in single provider detection:", error);
        }
    }

    // Fallback: If we can't detect the specific wallet but ethereum exists and address matches
    if (window.ethereum && currentAddress) {
        console.log("Using fallback detection");
        return { name: 'Connected Ethereum Wallet', provider: () => window.ethereum };
    }

    throw new Error('No compatible wallet detected or wallet not properly connected.');
};


//ends here


  const closeModal = () => {
    setShowPaymentModal(false)
    setPaymentStep('selection')
    setAmount('')
  }

  const backToSelection = () => {
    setPaymentStep('selection')
  }

  const copyAddress = (address) => {
    navigator.clipboard.writeText(address)
    alert('Address copied to clipboard!')
  }

    // Detect installed wallets and show installation modal if needed
const detectAndConnectWallet = (walletType) => {
  const walletChecks = {
    metamask: () => typeof window !== 'undefined' && window.ethereum?.isMetaMask,
    phantom: () => typeof window !== 'undefined' && window.solana?.isPhantom,
    binance: () => typeof window !== 'undefined' && window.BinanceChain,
    exodus: () => typeof window !== 'undefined' && window.exodus,
  }

  const isInstalled = walletChecks[walletType]?.()
  
  if (!isInstalled) {
    setSelectedWalletType(walletType)
    setShowWalletInstall(true)
    return
  }
  
  // If wallet is installed, proceed with connection
  // The RainbowKit ConnectButton will handle the actual connection
}

const { cryptoAmount, networkFee, processingFee, total, totalCrypto, hasEnoughBalance } = calculateCrypto()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
            {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto flex justify-between items-center p-6">
<a href="#home" className="flex items-center space-x-3">
  <img src={KushCrestLogo} alt="KushAlara Logo" className="h-10 w-auto" />
  <span className="text-2xl font-bold gradient-text">KushAlara</span>
</a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="#home" className="text-gray-300 hover:text-white transition-colors">Home</a>
            <a href="#about" className="text-gray-300 hover:text-white transition-colors">About</a>
            <a href="#tokenomics" className="text-gray-300 hover:text-white transition-colors">Tokenomics</a>
            <a href="#roadmap" className="text-gray-300 hover:text-white transition-colors">Roadmap</a>
            <Link to="/citizenship" className="text-gray-300 hover:text-white transition-colors">Citizenship</Link>
            <Link to="/eresidency" className="text-gray-300 hover:text-white transition-colors">e-Residency</Link>
          </div>
          
          {/* Right-side buttons - visible on desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={viewWhitepaper}
              className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-sm"
            >
              KushAlara Whitepaper
            </button>
            <a href="https://www.instagram.com/royalkingdomofkush/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-pink-400 transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a href="https://x.com/KushKingdom_Gov" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-400 transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <button onClick={buyTokens} className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 py-2 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300">Buy KushAlara</button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white focus:outline-none">
<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path> </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/50">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a href="#home" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Home</a>
              <a href="#about" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">About</a>
              <a href="#tokenomics" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Tokenomics</a>
              <a href="#roadmap" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Roadmap</a>
              <Link to="/citizenship" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Citizenship</Link>
              <Link to="/eresidency" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">e-Residency</Link>
            </div>
            <div className="pt-4 pb-3 border-t border-gray-700">
                <div className="px-5 flex flex-col space-y-4">
                    <button onClick={buyTokens} className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 py-2 rounded-lg font-semibold">Buy KushAlara</button>
                    <button onClick={downloadWhitepaper} className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white px-4 py-2 rounded-lg font-semibold">Download Whitepaper</button>
                </div>
            </div>
          </div>
         )}
      </nav>

      {/* Hero Section */}
      <section className="text-center py-20 px-6">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          <span className="gradient-text">Kingdom of</span> <span className="text-white">Kush</span>
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
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 card-hover text-center">
            <div className="text-4xl mb-4 text-yellow-400">🛡️</div>
            <h3 className="text-xl font-bold mb-3 text-white">Digital Sovereignty</h3>
            <p className="text-gray-300 text-sm">
              First Web3-native sovereign state with blockchain-integrated governance
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 card-hover text-center">
            <div className="text-4xl mb-4 text-yellow-400">🔗</div>
            <h3 className="text-xl font-bold mb-3 text-white">Multi-Utility Token</h3>
            <p className="text-gray-300 text-sm">
              Payments, staking, governance, and citizenship access in one token
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 card-hover text-center">
            <div className="text-4xl mb-4 text-yellow-400">📈</div>
            <h3 className="text-xl font-bold mb-3 text-white">CBDC Integration</h3>
            <p className="text-gray-300 text-sm">
              Central Bank Digital Currency for seamless financial inclusion
            </p>
          </div>

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
                <div className="text-gray-400 text-sm mt-1 ml-7">10M tokens (locked 2 years  )</div>
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
            {/* Column 1: Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 gradient-text">KushAlara</h3>
              <p className="text-gray-400 text-sm">
                The world's first Web3-native sovereign state, pioneering digital governance and economic innovation.
              </p>
            </div>
            
            {/* Column 2: Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#tokenomics" className="hover:text-white transition-colors">Tokenomics</a></li>
                <li><a href="#roadmap" className="hover:text-white transition-colors">Roadmap</a></li>
                <li><Link to="/citizenship" className="hover:text-white transition-colors">Citizenship</Link></li>
                <li>
                  <button 
                    onClick={() => setShowFooterBuyModal(true)}
                    className="hover:text-white transition-colors text-yellow-400 font-medium"
                  >
                    Buy KushAlara
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Services */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Services</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="/eresidency" className="hover:text-white transition-colors">e-Residency</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Digital Identity</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Business Registration</a></li>
              </ul>
            </div>

           <div>
  <h4 className="text-lg font-semibold mb-4 text-white">Follow us</h4>
  <div className="space-y-2">
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
  </div>

          
          {/* Copyright Section */}
          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2025 KushAlara Token. All rights reserved. Building the future of digital sovereignty.
            </p>
          </div>
        </div>
      </footer>


// THIS IS THE FINAL, SIMPLIFIED PAYMENT MODAL.
// REPLACE THE ENTIRE OLD MODAL WITH THIS.

{showPaymentModal && (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 rounded-3xl max-w-2xl w-full border border-gray-700 max-h-[90vh] overflow-y-auto relative">
            
            {/* Close Button */}
            <button 
                onClick={() => setShowPaymentModal(false)}
                className="absolute top-4 right-5 text-gray-400 hover:text-white text-3xl z-50"
            >
                &times;
            </button>

            {/* Single Payment View */}
            <div className="p-8">
                <h3 className="text-3xl font-bold gradient-text mb-2">Buy KushAlara Tokens</h3>
                <p className="text-lg text-gray-300 mb-8">Select amount and payment method.</p>
                
                <div className="space-y-4 mb-6">
                    {/* Amount and Crypto Selection */}
                    <div>
                        <label className="block text-white mb-2 font-semibold">Amount (USD $)</label>
                        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-400"/>
                    </div>
                   <div>
    <label className="block text-white mb-2 font-semibold">Payment Method</label>
    <div className="grid grid-cols-2 gap-4">
        {/* Crypto Option */}
        <button 
            onClick={() => setPaymentType('crypto')}
            className={`p-4 rounded-lg border-2 transition-colors ${
                paymentType === 'crypto' 
                    ? 'border-yellow-400 bg-yellow-400/10' 
                    : 'border-gray-600 bg-gray-700/50'
            }`}
        >
            <div className="text-center">
                <div className="text-2xl mb-2">🪙</div>
                <div className="text-white font-semibold">Crypto</div>
                <div className="text-gray-400 text-sm">ETH, BTC, SOL, etc.</div>
            </div>
        </button>
        
        {/* Fiat Option */}
        <button 
            onClick={() => setPaymentType('fiat')}
            className={`p-4 rounded-lg border-2 transition-colors ${
                paymentType === 'fiat' 
                    ? 'border-purple-400 bg-purple-400/10' 
                    : 'border-gray-600 bg-gray-700/50'
            }`}
        >
            <div className="text-center">
                <div className="text-2xl mb-2">💳</div>
                <div className="text-white font-semibold">USD</div>
                <div className="text-gray-400 text-sm">Credit/Debit Card</div>
            </div>
        </button>
    </div>
</div>
                </div>
                
                </div>

{/* Crypto Selection - Only show when crypto is selected */}
{paymentType === 'crypto' && (
    <div>
        <label className="block text-white mb-2 font-semibold">Select Cryptocurrency</label>
        <select 
            value={selectedCrypto} 
            onChange={(e) => setSelectedCrypto(e.target.value)} 
            className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-400"
        >
            <option value="">Choose cryptocurrency</option>
            <option value="ETH">Ethereum (ETH)</option>
            <option value="BTC">Bitcoin (BTC)</option>
            <option value="SOL">Solana (SOL)</option>
            <option value="USDC">USD Coin (USDC)</option>
            <option value="USDT">Tether (USDT)</option>
        </select>
    </div>
)}

{/* Fiat Payment Interface - Only show when fiat is selected */}
{paymentType === 'fiat' && (
    <div className="bg-gray-900/50 rounded-lg p-6 border border-purple-400/30">
        <div className="text-center mb-4">
            <div className="text-purple-400 font-semibold">Pay with USD</div>
            <div className="text-gray-400 text-sm">Credit card, debit card, or bank account via Stripe Link</div>
        </div>
        
        <div className="space-y-4">
            <div>
                <label className="block text-white text-sm mb-2">You will receive</label>
                <div className="bg-gray-800 p-3 rounded-lg flex justify-between items-center">
                    <span className="text-white text-lg">
                        {amount ? (parseFloat(amount) / kushPrice).toLocaleString(undefined, {maximumFractionDigits: 0}) : '0'}
                    </span>
                    <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                            <span className="text-black text-xs font-bold">K</span>
                        </div>
                        <span className="text-white">KUSH</span>
                    </div>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                    Rate: ${kushPrice.toFixed(4)} per KUSH
                </div>
            </div>
        </div>
    </div>
)}

{amount > 0 && selectedCrypto && paymentType === 'crypto' && (
    <div className="bg-gray-900/50 rounded-lg p-4 mb-6 text-center">
        <div className="text-gray-300 text-sm">You will send:</div>
        <div className="text-2xl font-bold text-yellow-400">{calculateCrypto().totalCrypto.toFixed(8)} {selectedCrypto}</div>
        <div className="text-gray-400 text-sm">Network fee: ${calculateCrypto().networkFee.toFixed(2)} • Processing fee: ${calculateCrypto().processingFee.toFixed(2)}</div>
    </div>
)}

                {/* Wallet Connection UI */}
                <div className="mt-6 text-center">
                    {!isConnected ? (
                        <div className="space-y-4">
                            <p className="text-gray-300">Connect your wallet to continue</p>
                            <div className="p-4 bg-gray-900/50 rounded-lg">
                                <ConnectButton />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="p-3 bg-green-900/30 border border-green-500/50 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm text-green-400">✅ Wallet Connected</p>
                                    <button onClick={() => disconnect()} className="text-red-500 hover:text-red-400 text-xs underline font-semibold">
                                        Disconnect
                                    </button>
                                </div>
                                <p className="font-mono text-xs text-gray-400 mt-1 truncate">{address}</p>
                            </div>
                {/* Email Field */}
<div className="mb-4">
    <label className="block text-white text-sm font-medium mb-2">
        Email Address *
    </label>
    <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email for transaction confirmation"
        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        required
    />
</div>

{/* Balance Display */}
{isConnected && balance && (
    <div className="mb-4 p-3 bg-gray-700 rounded-md">
        <p className="text-sm text-gray-300">
            Your {selectedCrypto} Balance: {parseFloat(formatEther(balance.value)).toFixed(6)} ETH
        </p>
    </div>
)}

{/* Success Message - Only show when transaction is CONFIRMED */}
{isConfirmed && transactionHash && (
    <div className="mb-4 p-4 bg-green-600 rounded-md">
       <h3 className="text-white font-semibold mb-2">🎉 Thank You!</h3>
<p className="text-white text-sm">
  Your payment has been submitted successfully. You will receive an email confirmation with transaction details shortly.
</p>
        <p className="text-white text-xs mt-2">
            Transaction Hash: {transactionHash}
        </p>
    </div>
)}

{/* Loading Message - Show while transaction is being confirmed */}
{isConfirming && transactionHash && (
    <div className="mb-4 p-4 bg-yellow-600 rounded-md">
        <h3 className="text-white font-semibold mb-2">⏳ Confirming Transaction...</h3>
        <p className="text-white text-sm">
            Your transaction is being confirmed on the blockchain. Please wait...
        </p>
        <p className="text-white text-xs mt-2">
            Transaction Hash: {transactionHash}
        </p>
    </div>
)}
                            <button onClick={executePayment} disabled={!amount || !selectedCrypto} className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black py-3 rounded-lg font-semibold hover:shadow-lg disabled:opacity-50">
                                Continue to Payment
                            </button>
                        </div>
                    )}
                </div>

                {/* Manual Payment Display */}
                {selectedCrypto && amount && 
                    <PaymentAddressDisplay selectedCrypto={selectedCrypto} walletAddresses={walletAddresses} amount={calculateCrypto().totalCrypto}/>
                }
            </div>
        </div>
    </div>
)}


{/* Footer Buy Modal - COMPLETE CORRECTED VERSION */}
{showFooterBuyModal && (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-gray-800 rounded-3xl max-w-4xl w-full max-h-[90dvh] overflow-y-auto border border-gray-700">
      <div className="flex justify-between items-center p-6 border-b border-gray-700 sticky top-0 bg-gray-800 z-10">
        <h3 className="text-2xl font-bold text-white">
          Buy KushAlara Token
        </h3>
        <button 
          onClick={() => {
            setShowFooterBuyModal(false)
            setFooterPaymentStep('selection')
          }}
          className="text-gray-400 hover:text-white text-2xl"
        >
          ×
        </button>
      </div>
      
      <div className="p-6 overflow-y-auto max-h-[calc(90dvh-120px)]">
        {/* Payment Selection Step */}
        {footerPaymentStep === 'selection' && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="text-yellow-400 text-4xl mb-2">👑</div>
              <h4 className="text-xl font-bold text-white mb-2">Choose Your Payment Method</h4>
              <p className="text-gray-300">Purchase KushAlara tokens using crypto or fiat currency</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Crypto Payment Option */}
              <div className="bg-gray-700/50 rounded-2xl p-6 border border-gray-600 hover:border-blue-500 transition-colors cursor-pointer"
                   onClick={() => setFooterPaymentStep('crypto-details')}>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl">₿</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Pay with Crypto</h3>
                  <p className="text-gray-300 text-sm mb-4">
                    Direct wallet transfers with ETH, BTC, SOL, USDC, or USDT
                  </p>
                  <div className="bg-blue-900/30 p-3 rounded-lg">
                    <div className="text-blue-400 text-sm font-medium">✅ Benefits</div>
                    <ul className="text-gray-300 text-xs mt-1 space-y-1">
                      <li>• Lower fees</li>
                      <li>• Instant transfers</li>
                      <li>• No KYC required</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* Fiat Payment Option */}
              <div className="bg-gray-700/50 rounded-2xl p-6 border border-gray-600 hover:border-purple-500 transition-colors cursor-pointer"
                   onClick={() => setFooterPaymentStep('stripe-link')}>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl">💳</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Pay with USD</h3>
                  <p className="text-gray-300 text-sm mb-4">
                    Credit card, debit card, or bank account via Stripe Link
                  </p>
                  <div className="bg-purple-900/30 p-3 rounded-lg">
                    <div className="text-purple-400 text-sm font-medium">✅ Benefits</div>
                    <ul className="text-gray-300 text-xs mt-1 space-y-1">
                      <li>• Easy for beginners</li>
                      <li>• Familiar checkout</li>
                      <li>• Secure payments</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Crypto Details Step */}
        {footerPaymentStep === 'crypto-details' && (
          <div className="space-y-6">
            <div className="flex items-center mb-6">
              <button 
                onClick={() => setFooterPaymentStep('selection')}
                className="text-gray-400 hover:text-white mr-4"
              >
                ← Back
              </button>
              <h4 className="text-xl font-bold text-white">Pay with Crypto</h4>
            </div>
            
            <div className="bg-white rounded-lg p-6 text-black">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Amount (USD)</label>
                  <input 
                    type="number" 
                    value={footerAmount}
                    onChange={(e) => {
                      setFooterAmount(e.target.value);
                      setAmount(e.target.value); // Sync with main modal
                    }}
                    className="w-full p-3 border rounded-lg outline-none focus:border-blue-500"
                    placeholder="100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Pay with</label>
                  <select 
                    value={footerSelectedCrypto}
                    onChange={(e) => {
                      setFooterSelectedCrypto(e.target.value);
                      setSelectedCrypto(e.target.value); // Sync with main modal
                    }}
                    className="w-full p-3 border rounded-lg outline-none focus:border-blue-500"
                  >
                    <option value="ETH">ETH - Ethereum</option>
                    <option value="BTC">BTC - Bitcoin</option>
                    <option value="SOL">SOL - Solana</option>
                    <option value="USDC">USDC - USD Coin</option>
                    <option value="USDT">USDT - Tether</option>
                  </select>
                </div>
                
                {footerAmount && (
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <div className="text-gray-700 text-sm mb-2">You will send:</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {totalCrypto.toFixed(8)} {footerSelectedCrypto}
                    </div>
                    <div className="text-gray-600 text-sm">
                      Network fee: ${networkFee.toFixed(2)} • Processing fee: ${processingFee.toFixed(2)}
                    </div>
                    {!hasEnoughBalance && balance && (
                      <div className="text-red-600 text-sm mt-2">
                        ⚠️ Insufficient balance. You have {parseFloat(formatEther(balance.value)).toFixed(4)} {footerSelectedCrypto}
                      </div>
                    )}
                  </div>
                )}
                
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <div className="text-sm font-medium text-yellow-800 mb-2">You will receive:</div>
                  <div className="text-2xl font-bold text-yellow-900">
                    {footerAmount ? (parseFloat(footerAmount) / kushPrice).toLocaleString(undefined, {maximumFractionDigits: 0}) : '0'} KUSH
                  </div>
                  <div className="text-xs text-yellow-700 mt-1">
                    Rate: 1 USD = {(1/kushPrice).toFixed(2)} KUSH tokens
                  </div>
                </div>
                
                {/* Wallet Status */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between text-gray-700 text-sm mb-2">
                    <div className="flex items-center">
                      <span className="mr-2">🔗</span>
                      Wallet Status:
                    </div>
                    {isConnected && (
                      <button 
                        onClick={disconnect}
                        className="text-red-600 hover:text-red-500 text-xs underline"
                      >
                        Disconnect
                      </button>
                    )}
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className={`flex items-center ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                      <span className={`w-2 h-2 ${isConnected ? 'bg-green-600' : 'bg-red-600'} rounded-full mr-2`}></span>
                      {isConnected ? `Connected: ${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Not connected'}
                    </div>
                    {balance && (
                      <div className="text-green-600 text-sm">
                        Balance: {parseFloat(formatEther(balance.value)).toFixed(4)} ETH
                      </div>
                    )}
                    {!isConnected && (
                      <div className="mt-2 space-y-4">
                        <div className="text-center">
                          <ConnectButton />
                        </div>
                        
                        <div className="text-center text-gray-600 text-sm">Or choose a specific wallet:</div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => detectAndConnectWallet('metamask')}
                            className="flex items-center justify-center p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                          >
                            <span className="text-lg mr-1">🦊</span>
                            <span className="text-gray-800 text-xs">MetaMask</span>
                          </button>
                          
                          <button
                            onClick={() => detectAndConnectWallet('phantom')}
                            className="flex items-center justify-center p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                          >
                            <span className="text-lg mr-1">👻</span>
                            <span className="text-gray-800 text-xs">Phantom</span>
                          </button>
                          
                          <button
                            onClick={() => detectAndConnectWallet('binance')}
                            className="flex items-center justify-center p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                          >
                            <span className="text-lg mr-1">🟡</span>
                            <span className="text-gray-800 text-xs">Binance</span>
                          </button>
                          
                          <button
                            onClick={() => detectAndConnectWallet('exodus')}
                            className="flex items-center justify-center p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                          >
                            <span className="text-lg mr-1">🚀</span>
                            <span className="text-gray-800 text-xs">Exodus</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Transaction Status */}
                {hash && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-blue-600 font-semibold mb-2">Transaction Submitted</div>
                    <div className="text-sm text-gray-600 break-all">Hash: {hash}</div>
                    {isConfirming && <div className="text-yellow-600 text-sm mt-2">Waiting for confirmation...</div>}
                    {isConfirmed && <div className="text-green-600 text-sm mt-2">✅ Transaction confirmed!</div>}
                  </div>
                )}
                
                {error && (
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="text-red-600 font-semibold mb-2">Transaction Error</div>
                    <div className="text-sm text-gray-600">{error.message}</div>
                  </div>
                )}
                
                <button 
                  onClick={executePayment}
                  disabled={!footerAmount || !isConnected || isPending || !hasEnoughBalance}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                    footerAmount && isConnected && !isPending && hasEnoughBalance
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  }`}
                >
                  {isPending ? 'Processing...' : 
                   !isConnected ? 'Connect Wallet First' :
                   !hasEnoughBalance ? 'Insufficient Balance' :
                   `Send ${footerSelectedCrypto} Payment`}
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Stripe Link Step */}
        {footerPaymentStep === 'stripe-link' && (
          <div className="space-y-6">
            <div className="flex items-center mb-6">
              <button 
                onClick={() => setFooterPaymentStep('selection')}
                className="text-gray-400 hover:text-white mr-4"
              >
                ← Back
              </button>
              <h4 className="text-xl font-bold text-white">Pay with USD</h4>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-600 max-w-md mx-auto">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">K</span>
                </div>
                <div>
                  <div className="text-white font-medium">KushAlara Token</div>
                  <div className="text-gray-400 text-sm">Buy crypto with credit, debit, or bank account</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Pay</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white text-lg">$</span>
                    <input 
                      type="number" 
                      value={footerAmount}
                      onChange={(e) => setFooterAmount(e.target.value)}
                      className="w-full pl-8 pr-16 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none text-lg"
                      placeholder="10"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center">
                      <span className="w-4 h-3 bg-red-500 rounded-sm mr-1"></span>
                      <span className="text-gray-300 text-sm">USD</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Receive</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={`${footerAmount ? (parseFloat(footerAmount) / kushPrice).toLocaleString(undefined, {maximumFractionDigits: 0}) : '0'} KUSH`}
                      readOnly
                      className="w-full pr-16 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white text-lg"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center">
                      <span className="w-4 h-4 bg-yellow-400 rounded-full mr-1"></span>
                      <span className="text-gray-300 text-sm">KUSH</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Price updating ⏳ • Rate: ${kushPrice.toFixed(4)} per KUSH
                  </div>
                </div>
                
                <button 
                  onClick={() => alert(`Stripe Link integration would process $${footerAmount || '0'} payment for ${footerAmount ? (parseFloat(footerAmount) / kushPrice).toLocaleString(undefined, {maximumFractionDigits: 0}) : '0'} KUSH tokens. This is a demo - real Stripe Link integration coming soon!`)}
                  disabled={!footerAmount}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  Continue
                </button>
                
                <div className="flex items-center justify-center text-gray-400 text-sm">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  link by Stripe
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
)}
      
</div>

  )
}
export default HomePage
