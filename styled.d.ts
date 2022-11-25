import 'styled-components'

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      black: {
        '100' : string
        '200' : string
        '300' : string
        'solid300' : string
      }
      white: {
        '100' : string
        '200' : string
        '300' : string
        '400' : string
      }
      primary: string
      secondary: string
      saturation: string
    }
  }
}
