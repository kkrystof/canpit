import { useUser, useSessionContext } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';

import { useRouter } from 'next/router';
import { Button, Input } from '../components/sharedstyles';
import { type } from 'os';
import styled from 'styled-components';


type Form = {
  email: string
  pass: string
}

const Box = styled.div`
  outline: 2px solid ${({ theme }) => theme.colors.white[200]};
  display: flex;
  flex-direction: column;
  width: 400px;
  padding: 2rem;
  position: absolute;
  top: 50%;
  left: 50%;
  translate: -50% -50%;
  border-radius: 20px;


`

const Login = () => {
  const router = useRouter()
  const { isLoading, session, error, supabaseClient } = useSessionContext();

  const user = useUser();
  // const [form, setForm] = useState<Form>({});
  const [mail, setMail] = useState('')
  const [pass, setPass] = useState('')


  async function signInWithEmail() {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: mail,
      password: pass,
    })

    console.log(error);
    
  }


  	// Signup using Google
	// async function signUpWithGoogle() {
	// 	const { error } = await supabaseClient.auth.signIn(
	// 		{
	// 			provider: 'google'
	// 		},
	// 		{ redirectTo: 'http://localhost:3000/provider?refresh=true' }
	// 	);
	// 	if (error) {
	// 		alert(error.message);
	// 	}
	// }


  if (user) {
    router.push('/app')
    return
  }

  if (!user)
    return (
      <>
      <Box>
        
            <h1>Sign in/up</h1>

            <Button style={{margin: '2rem auto'}} onClick={() => supabaseClient.auth.signInWithOAuth({provider: 'google'})}>
                <img src="/img/glogo.svg" />
                Sign in with Google
            </Button>

      <form onSubmit={() => signInWithEmail()}>
          <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            <div style={{display: 'flex', flexDirection: 'column'}}>
              <label htmlFor="">Email</label>
              <Input value={mail} onChange={i => setMail(i.target.value)} type="email"></Input>
            </div>
            <div style={{display: 'flex', flexDirection: 'column'}}>
              <label htmlFor="">Password</label>
              <Input value={pass} onChange={i => setPass(i.target.value)} type="password"></Input>
            </div>
            <Button type='submit'>
              Login with email
            </Button>
          </div>
      </form>
      </Box>
      </>
    )

};

export default Login;