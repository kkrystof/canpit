import styled from 'styled-components'

const Container = styled.div`
  padding: 0 0.5rem;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  height: 100vh;
  min-height: 100vh;
`
const Main = styled.main`
  padding: 5rem 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Playfull = styled.span`
  font-style: italic;
`

const Title = styled.h1`
  margin: 0 auto;
  position: relative;
  line-height: 1.15;
  /* max-width: 60vw; */
  /* max-width: max-content; */
  width: 100%
  font-size: 4rem;
  color: ${({ theme }) => theme.colors.secondary};
  /* color: rgb(185, 21, 21); */
  /* text-align: center; */
  text-decoration: none;
  z-index: 2;
  padding: 1rem;

  a {
    color: ${({ theme }) => theme.colors.secondary};
    text-decoration: none;
    &:hover,
    :focus,
    :active {
      text-decoration: underline;
    }
  }
`

const Divider = styled('hr')`
    border: solid ${({ theme }) => theme.colors.white['200']} 1px;
    margin: 20px 0;
`

const Description = styled.p`
  text-align: center;
  line-height: 1.5;
  font-size: 1.5rem;
`
const CodeTag = styled.code`
  background: #000;
  border-radius: 5px;
  margin: 0 0.75rem;
  padding: 0.75rem;
  font-size: 1.1rem;
  font-family: Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono,
    Bitstream Vera Sans Mono, Courier New, monospace;
`

const Avatar = styled.img`
  height: 120px;
  width: 120px;
  border-radius: 100%;
  border: 1px solid ${({ theme }) => theme.colors.white[200]};
  box-sizing: border-box;
  background-color: white;
  background-clip: padding-box;

`

/* export const hsl = (color: string, lightness: number) => {
  let hs: string

  switch (color) {
    case 'neutral':
      hs = '60, 100%'
      break
    case 'blue':
      hs = '224, 64%'
      break
    case 'pink':
      hs = '330, 80%'
      break
    default:
      break
  }

  return `hsl(${hs}, ${lightness}%)`
} */

const addSaturation = (color: any, amount: number) => {
  var color = color.replace('#', '').split('');
  var letters = '0123456789ABCDEF'.split('');
  for(var i = 0; i < color.length; i++){
      var newSaturation = 0;
      if(letters.indexOf(color[i]) + amount > 15) newSaturation = 15;
      else if(letters.indexOf(color[i]) + amount < 0) newSaturation = 0;
      else newSaturation = letters.indexOf(color[i]) + amount;
      color[i] = letters[newSaturation];
  }
  return "#" + color.join('');
}

const Button = styled.button`
  color: ${({ theme }) => theme.colors.black[300]};
  font-family: inherit;
  background-color: ${({ theme }) => theme.colors.primary};
  /* background-color: transparent; */
  width: max-content;
  padding: 6px 10px 7px 10px;
  /* padding: 12px 20px; */
  font-weight: 500;
  border-radius: 7px;
  /* line-height: 16px; */
  letter-spacing: .2px;
  font-size: 1rem;
  border: none;
  /* background-clip: padding-box; */
  /* border: 2px solid red; */

  display: flex;
  gap: 10px;
  align-items: center;
  transition: all 200ms;
/* 
  &:after{
    content: '';
    position: absolute;
    display: block;
    height: 10px;
    width: 10px;
    background-color: red;

  } */

  img{
        height: 1rem;
    }

  &:hover {
    background-color: ${({theme}) => addSaturation(theme.colors.primary, 2)};
    cursor: pointer;
  } 
  &:active {
    /* scale: 0.95 */
    /* padding: 4px 8px 5px 8px; */
  }
`

const Input = styled.input`
    background: ${({ theme }) => theme.colors.white[200]};
    border: 2px solid ${({ theme }) => theme.colors.white[300]};
    color: white;
    font-family: inherit;
    padding: 6px 10px 7px 10px;
    font-size: 1rem;
    border-radius: 7px;
    outline: none;
    transition: all 200ms;

    &:-webkit-autofill,
    &:-webkit-autofill:focus {
        transition: background-color 600000s 0s, color 600000s 0s;
    }
    &[data-autocompleted] {
        background-color: transparent !important;
    }

    /* &:-webkit-autofill,
    &:-webkit-autofill:hover, 
    &:-webkit-autofill:focus, 
    &:-webkit-autofill:active{
        -webkit-box-shadow: 0 0 0 30px white inset !important;
    } */
    
    &:hover{
        background: ${({ theme }) => theme.colors.white[100]};     
    }
    
    &:focus, :active{
        border-color: ${({ theme }) => theme.colors.primary};
        background: ${({ theme }) => theme.colors.white[200]};
    }
`

export { Container, Main, Title, Description, CodeTag, Avatar, Button, Playfull, Input, Divider }
