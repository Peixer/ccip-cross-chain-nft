import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import {
  ThirdwebProvider,
  metamaskWallet,
  coinbaseWallet,
  walletConnect,
  localWallet,
  embeddedWallet,
} from "@thirdweb-dev/react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
      clientId="604a5a0a55ca96b706c901437960ea6b"
      supportedWallets={[
        metamaskWallet(),
        coinbaseWallet({ recommended: true }),
        walletConnect(),
        localWallet(),
        embeddedWallet(),
      ]}
    >
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}
