import styled from 'styled-components'

const Container = styled.div`
  /* padding: 0 0.5rem; */
  display: flex;
  flex-flow: column nowrap;
  /* justify-content: center; */
  align-items: center;
  min-height: 100vh;
  /* gap: 1rem; */
`

enum ColorType {
  bg = 20,
  border = 15,
  title = 70,
  text = 45,
  overlay= 60
}

const colorShade = (color: any, type: ColorType) => {
  const colour = color.charAt(0) === "#" ? color.substring(1, 7) : color;

  const r = parseInt(colour.substring(0, 2), 16); // hexToR
  const g = parseInt(colour.substring(2, 4), 16); // hexToG
  const b = parseInt(colour.substring(4, 6), 16); // hexToB

  if(type === ColorType.title){
    return '#' +
    ((0|(1<<8) + r + (256 - r) * type / 100).toString(16)).substr(1) +
    ((0|(1<<8) + g + (256 - g) * type / 100).toString(16)).substr(1) +
    ((0|(1<<8) + b + (256 - b) * type / 100).toString(16)).substr(1);
  }


  return `rgba(${r},${g},${b}, ${type/100})`
};

const ActivityThnail = styled.div`

      min-width: 220px;
      /* max-width: 250px; */
      flex: 3 3 30%;
      /* width: 33%; */
      /* height: 180px; */
      /* height: 160px; */
      border: 2px solid ${props => colorShade(props.color, ColorType.border)};
      border-radius: 24px;
      /* border-radius: 18px; */
      padding: 14px 14px 14px 14px;
      box-sizing: border-box;
      background-color: ${props => colorShade(props.color, ColorType.bg)};
      transition: all 200ms;
      /* color: ${props => props.color}; */
      color: ${props => colorShade(props.color, ColorType.text)};
      
      &:hover{
        /* border: 2px solid ${({ theme }) => theme.colors.white[200]}; */
        border-color: transparent;
        background-color: ${props => colorShade(props.color, ColorType.text)};
        
      }
      
      h3{
        color: ${props => colorShade(props.color, ColorType.title)};
        font-size: 18px;
        font-weight: normal;
      }
    

    .icon{
      height: 80px;
      width: 80px;
      background-color: ${props => props.color};
      border-radius: 10px;
      cursor: pointer;
    }
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
  /* padding: 1rem; */

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

export { Container, Main, Title, Description, CodeTag, Avatar, Button, Playfull, Input, Divider, ActivityThnail }
