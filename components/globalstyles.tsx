import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  html,
  body {
    color: ${({ theme }) => theme.colors.secondary};
    padding: 0;
    margin: 0;
    height: 100%;
    /* width: 100vw; */
    /* overflow: hidden; */
    background-color: ${({theme}) => theme.colors.black[300]};
    font-family: -apple-system, Inter, SF Pro Display , BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
      Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  }

  h2{
    color: white;
    font-size: 32px;
  }

  /* p, h1, h2, h3 {
    color: 
  } */

  a {
    /* color: blue; */
    text-decoration: underline;
    cursor: pointer;
  }

  * {
    box-sizing: border-box;
  }
`

export default GlobalStyle
