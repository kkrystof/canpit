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
  max-width: max-content;
  font-size: 4rem;
  color: ${({ theme }) => theme.colors.secondary};
  /* color: rgb(185, 21, 21); */
  /* text-align: center; */
  text-decoration: none;
  z-index: 2;

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
  height: 80px;
  width: 80px;
  border-radius: 100%;
  border: 1px solid ${({ theme }) => theme.colors.white[200]};
`

const Button = styled.button`
  color: ${({ theme }) => theme.colors.black[300]};
  font-family: inherit;
  background-color: ${({ theme }) => theme.colors.secondary};
  width: max-content;
  padding: 6px 10px 7px 10px;
  font-weight: 500;
  border-radius: 7px;
  font-size: 1rem;
  border: none;
  display: flex;
  gap: 5px;
  align-items: center;

  &:hover,:active,:focus {
    background-color: white;
    cursor: pointer;
  } 
`

export { Container, Main, Title, Description, CodeTag, Avatar, Button, Playfull }
