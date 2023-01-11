import '../styles/globals.css'
import type { AppProps } from 'next/app'

import { ThemeProvider, DefaultTheme } from 'styled-components'
import GlobalStyle from '../components/globalstyles'

import { useRouter } from 'next/router'
import { useState } from 'react'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'

const theme: DefaultTheme = {
  colors: {
    primary: '#F48B1D',
    // primary: '#ff6d00',
    // secondary: '#FFFFE0',
    secondary: '#FFFFE0',
    saturation: '#FFA500',
    black: {
      "100": 'rgba(21, 19, 14, 0.3)',
      "200": 'rgba(21, 19, 14, 0.5)',
      "300": '#15130E',
      "solid300" : '#312F27'
    },
    white: {
      "100": 'rgba(255, 255, 224, 0.02)',
      "200": 'rgba(255, 255, 224, 0.1)',
      "300": 'rgba(255, 255, 224, 0.3)',
      "400": 'rgba(255, 255, 224, 0.4)',
    }
  },
}


function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [supabaseClient] = useState(() => createBrowserSupabaseClient())

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      //@ts-ignore
      initialSession={pageProps.initialSession}
    >
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Component {...pageProps} />
      </ThemeProvider>
    </SessionContextProvider>
  )
}

export default MyApp
