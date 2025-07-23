// MoonPay API service for real-time pricing and quotes
class MoonPayService {
  constructor() {
    this.baseURL = 'https://api.moonpay.com'
    this.publicKey = process.env.REACT_APP_MOONPAY_PUBLIC_KEY || 'pk_test_123' // You'll need to get this from MoonPay
  }

  // Get real-time currency rates
  async getCurrencyRates( ) {
    try {
      const response = await fetch(`${this.baseURL}/v3/currencies?apiKey=${this.publicKey}`)
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching MoonPay rates:', error)
      return null
    }
  }

  // Get quote for specific amount and currency
  async getQuote(baseCurrencyAmount, baseCurrencyCode = 'usd', quoteCurrencyCode = 'eth') {
    try {
      const params = new URLSearchParams({
        apiKey: this.publicKey,
        baseCurrencyAmount: baseCurrencyAmount.toString(),
        baseCurrencyCode: baseCurrencyCode.toLowerCase(),
        quoteCurrencyCode: quoteCurrencyCode.toLowerCase(),
        fixed: 'true'
      })

      const response = await fetch(`${this.baseURL}/v3/currencies/${quoteCurrencyCode.toLowerCase()}/buy_quote?${params}`)
      const data = await response.json()
      
      if (data.quoteCurrencyAmount) {
        return {
          quoteCurrencyAmount: parseFloat(data.quoteCurrencyAmount),
          totalAmount: parseFloat(data.totalAmount),
          feeAmount: parseFloat(data.feeAmount),
          networkFeeAmount: parseFloat(data.networkFeeAmount || 0),
          extraFeeAmount: parseFloat(data.extraFeeAmount || 0),
          baseCurrencyAmount: parseFloat(data.baseCurrencyAmount),
          quoteCurrencyCode: data.quoteCurrencyCode,
          baseCurrencyCode: data.baseCurrencyCode
        }
      }
      return null
    } catch (error) {
      console.error('Error fetching MoonPay quote:', error)
      return null
    }
  }

  // Get supported currencies
  async getSupportedCurrencies() {
    try {
      const response = await fetch(`${this.baseURL}/v3/currencies?apiKey=${this.publicKey}`)
      const data = await response.json()
      
      // Filter for commonly used cryptocurrencies
      const supportedCryptos = data.filter(currency => 
        ['eth', 'btc', 'usdc', 'usdt', 'sol'].includes(currency.code.toLowerCase()) && 
        currency.type === 'crypto'
      )
      
      return supportedCryptos
    } catch (error) {
      console.error('Error fetching supported currencies:', error)
      return []
    }
  }

  // Create buy URL for MoonPay widget (fallback)
  createBuyURL(currencyCode, amount, walletAddress) {
    const params = new URLSearchParams({
      apiKey: this.publicKey,
      currencyCode: currencyCode.toLowerCase(),
      baseCurrencyAmount: amount.toString(),
      baseCurrencyCode: 'usd',
      walletAddress: walletAddress || '',
      redirectURL: window.location.origin,
      colorCode: '#fbbf24' // Your site's yellow color
    })

    return `https://buy.moonpay.com?${params}`
  }
}

export const moonPayService = new MoonPayService( )
