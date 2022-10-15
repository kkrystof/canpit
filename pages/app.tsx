// import { Auth } from '@supabase/ui';
// import { useUser } from '@supabase/auth-helpers-react';
// import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';

import { Avatar, Button } from '../components/sharedstyles';

import styled from 'styled-components'


const Card = styled.div`
  /* position: relative; */
  /* height: 150px; */

  // @ts-ignore
  padding: ${(props) => props.avatar ? '2em' : '20px'};
  width: ${(props) => props.avatar ? 'auto' : '100%'};
  background-color: ${({ theme }) => theme.colors.white[100]};
  border: 1px solid ${({ theme }) => theme.colors.white[200]};
  border-radius: 20px;

  &:hover {
    background-color: ${({ theme }) => theme.colors.white[200]};
  }
`

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 50vh;
  left: 50vw;
  width: 80vw;
  max-width: 800px;
  transform: translate(-50%, -50%);
  /* border: 1px solid red; */
  gap: 1rem;
  `

const Drower = styled.div`
  display: flex;
  gap: 1rem;
  /* border: 1px solid red; */
  /* height: 200px; */
`

const DrawerThree = styled.div`
  display: flex;
  gap: 1rem;
  /* border: 1px solid red; */
  height: 100%;
`

const ActionBtn = styled.button`
  color: ${({ theme }) => theme.colors.black[300]};
  font-family: inherit;
  background-color: ${({ theme }) => theme.colors.primary};
  width: max-content;
  padding: 8px 12px 9px 12px;
  font-weight: 500;
  border-radius: 17px;
  font-size: 1rem;
  border: none;
  transition: background-color 150ms;
  
  &.max{
    color: ${({ theme }) => theme.colors.black[300]};
    padding: 12px 16px 12px 16px;
    border-radius: 10px;
    font-size: 1.2rem;

  }
  
  &:hover,:active,:focus {
    background-color: white;
    cursor: pointer;
  } 
`


import { useUser, useSessionContext } from '@supabase/auth-helpers-react';
import Link from 'next/link';
// import { Drawer } from '@chakra-ui/react';
// import { Button, TextField, useColorScheme } from '@mui/joy';
import { Router, useRouter } from 'next/router';

// export const getServerSideProps = withPageAuth({ redirectTo: '/login' });



const Login = () => {

  const { isLoading, session, error, supabaseClient } = useSessionContext();
  const user = useUser();
  const [data, setData] = useState();

  
  let router= useRouter()
  
  async function logOut() {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      alert(error.message);
    }
  
    router.push('/login')
  
  
  }

  
  useEffect(() => {
    async function loadData() {
      const { data } = await supabaseClient;
      setData(data);
    }
    // Only run query once user is logged in.
    if (user) loadData();

  }, [user]);





  if (!user)
    return (
      <>
        {/* {error && <p>{error.message}</p>} */}
        <Link href='/login'>Login</Link>
      </>
    );

  return (
    <>
      <Layout>
        <h2>Canpit</h2>
        <Drower>
          <Card>
            <DrawerThree>
            <ActionBtn>Create room</ActionBtn>
            <TextField
  disabled={false}
  size="md"
  variant="outlined"
/>
            </DrawerThree>
          </Card>
          <Card avatar>
          <Avatar src={user.user_metadata.avatar_url} alt="" />
          </Card>
        </Drower>
        <Drower>
          <Card>
          <p>{user.user_metadata.full_name}</p>
          <p>some content here</p>
          <Button onClick={logOut}>Sign out</Button>
          <pre>{JSON.stringify(data, null, 2)}</pre>
          </Card>
        </Drower>
      </Layout>
    </>
  );
};

export default Login;