import { useUser, useSessionContext } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';

import { useRouter } from 'next/router';
import { Button, Divider, Input } from '../components/sharedstyles';
import { type } from 'os';
import styled from 'styled-components';
import { SubmitHandler, useForm } from 'react-hook-form';
import { dataPacket_KindFromJSON } from 'livekit-server-sdk/dist/proto/livekit_models';
import { GetServerSidePropsContext } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';


type Form = {
  email: string
  pass: string
}

const Box = styled.div`
  /* outline: 2px solid ${({ theme }) => theme.colors.white[300]}; */
  border: 2px solid ${({ theme }) => theme.colors.white[200]};
  display: flex;
  flex-direction: column;
  width: 500px;
  padding: 2rem;
  position: absolute;
  top: 50%;
  left: 50%;
  translate: -50% -50%;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.colors.white[100]};

  

  h1{
    text-align: center;
  }

  section{
    width: 70%;
    margin: 1rem auto;
  }

  label{
    margin-bottom: 4px;
  }


`
interface IFormInput {
  email: string;
  password: string;
}

const Login = ({room}: any) => {
  const router = useRouter()
  const { isLoading, session, error, supabaseClient } = useSessionContext();

  const user = useUser();

  const { register, handleSubmit, watch } = useForm<IFormInput>();
  const onSubmit: SubmitHandler<IFormInput> = async d => {
    
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: d.email,
      password: d.password,
    })
    
      if(error){
        alert(`${error}`)
        return
      }

      if(room){
        router.push(`/room/${room}`)
        return
      }
      
      router.push('/app')


  }

  const data = watch()

  const resetPass = async (mail: string) => {
    const { data, error } = await supabaseClient.auth.resetPasswordForEmail(mail)
    console.log(data, error);
    alert('Email for pass reset was sent to you :)')
    
  }


    return (
      <>
      <Box>
        
            <h1 style={{color: '#F1F200'}}>Before you start talking.</h1>

            <Button style={{margin: '1rem auto', backgroundColor: 'white'}} onClick={async () => await supabaseClient.auth.signInWithOAuth({provider: 'google', options: {redirectTo: `http://canpit.com/red${(room) ? '?room='+room : ''}`, queryParams: {room: room}}})}>
                <img src="/img/glogo.svg" />
                Sign in with Google
            </Button>

            <Divider/>
      <section>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              <div style={{display: 'flex', flexDirection: 'column'}}>
                <label htmlFor="">Email</label>
                <Input {...register("email")}type="email"/>
              </div>
              <div style={{display: 'flex', flexDirection: 'column'}}>
                <label htmlFor="">Password</label>
                <Input {...register("password")} type="password"/>
              </div>
              <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px'}}>
                <Button type='submit'>
                  Login with email
                </Button>
                <p>/</p>
                <a onClick={()=>supabaseClient.auth.signUp({email: data.email, password: data.password, options: {}})}>Register</a>
              </div>

            </div>
        </form>
        <p>Did you forget your pass? - <a onClick={() => resetPass(data.email)}>Reset</a></p>
      </section>

      </Box>
      </>
    )

};

export default Login;


export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(ctx)
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession()
  

  if (session)
    return {
      redirect: {
        destination: '/app',
        permanent: false,

      },
  }

    // console.log(ctx.query);

    return {
      props: ctx.query, // will be passed to the page component as props
    }

}
