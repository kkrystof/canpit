import { useUser, useSessionContext } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';

import { useRouter } from 'next/router';
import { Button } from '../components/sharedstyles';



const Login = () => {
  const router = useRouter()
  const { isLoading, session, error, supabaseClient } = useSessionContext();

  const user = useUser();


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
            <h1>Sign in/up</h1>
            <Button onClick={() => supabaseClient.auth.signInWithOAuth({provider: 'google'})}>
                <img src="/img/glogo.svg" />
                Sign in with Google
            </Button>
      </>
    )

};

export default Login;