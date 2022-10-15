import styled from 'styled-components'
import { Button } from '../components/sharedstyles'

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
    
    
    &:hover{
        background: ${({ theme }) => theme.colors.white[100]};
        
    }
    
    &:focus, :active{
        border-color: ${({ theme }) => theme.colors.primary};
        background: ${({ theme }) => theme.colors.white[200]};
    }
`

export default function Home() {

    return (
        <>
        <div style={{display: 'flex', gap: '8px', margin: '2rem'}}>
            <Input></Input>
            <Button>
                <img src="/img/glogo.svg" />
                Sign in with Google
            </Button>
        </div>
        </>
    )
}