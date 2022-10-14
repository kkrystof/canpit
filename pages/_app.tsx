import '../styles/globals.css'
import type { AppProps } from 'next/app'

import { ThemeProvider, DefaultTheme } from 'styled-components'
import GlobalStyle from '../components/globalstyles'


const theme: DefaultTheme = {
  colors: {
    primary: '#FFCC70',
    secondary: '#FFFFE0',
    saturation: '#FFA500',
    black: {
      "100": 'rgba(21, 19, 14, 0.3)',
      "200": 'rgba(21, 19, 14, 0.5)',
      "300": '#15130E'
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
  return <>
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Component {...pageProps} />
    </ThemeProvider>
  </> 

}

export default MyApp
