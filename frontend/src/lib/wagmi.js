import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  sepolia,
} from 'wagmi/chains'

export const config = getDefaultConfig({
  appName: 'KushAlara',
  projectId: '2f5a2b1c8d3e4f5a6b7c8d9e0f1a2b3c', // Temporary project ID
  chains: [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    ...(process.env.NODE_ENV === 'development' ? [sepolia] : []),
  ],
  ssr: false,
})
