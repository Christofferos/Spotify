import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { ToastProvider } from 'react-toast-notifications'
import { RecoilRoot } from 'recoil'

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <ToastProvider>
        <RecoilRoot>
          <Component {...pageProps} />
        </RecoilRoot>
      </ToastProvider>
    </SessionProvider>
  )
}

export default MyApp
