// import { Auth } from '@supabase/ui';
// import { useUser } from '@supabase/auth-helpers-react';
// import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';

import { Avatar, Button } from '../components/sharedstyles';

import styled from 'styled-components'


const Card = styled.div`
  /* position: relative; */
  height: 100%;

  padding: ${(props) => props.avatar ? '25px' : '10px'};
  width: ${(props) => props.avatar ? 'auto' : '100%'};
  background-color: ${({ theme }) => theme.colors.white[100]};
  outline: 2px solid ${({ theme }) => theme.colors.white[200]};
  border-radius: 20px;
  /* padding: 20px; */
  /* box-sizing: border; */
  transition: all 200ms;
  max-height: 170px;


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
  `

const DrawerThree = styled.div`
/* border: 1px solid blue; */
  position: relative;
  display: flex;
  gap: 10px;
  /* border: 1px solid red; */
  /* height: 100%; */
`

const Menu = styled.div`
  position: relative;
  width: 100%;
  height: 150px;
  background-color: ${({ theme }) => theme.colors.white[200]};
  border-radius: 10px;
`

const ActionBtn = styled(motion.button)`
  /* color: ${({ theme }) => theme.colors.white[300]}; */
  color: white;
  font-family: inherit;
  /* background-color: ${({ theme }) => theme.colors.primary}; */
  min-width: 150px;
  max-height: 150px;
  padding: 10px;
  font-weight: 500;
  border-radius: 10px;
  font-size: 1rem;
  border: none;
  transition: background-color 150ms;
  text-align: left;
  /* background: radial-gradient(206.72% 204.88% at 106.67% -6.67%, #6F8BEC 0%, #DF5B56 49.48%, #FFA500 100%); */
  transition: all 800ms;

  .inside{
    display: flex;
    flex-direction: column;
    height: 100%;
    bottom: 0;
    align-items: flex-start;
    gap: 10px;

    p{
      margin: 0;

    }
  }
  
  /* &.max{
    color: ${({ theme }) => theme.colors.black[300]};
    padding: 12px 16px 12px 16px;
    border-radius: 10px;
    font-size: 1.2rem;

  } */
  
  &:hover,:active,:focus {
    cursor: pointer;

  } 
`


import { useUser, useSessionContext } from '@supabase/auth-helpers-react';
import Link from 'next/link';
// import { Drawer } from '@chakra-ui/react';
// import { Button, TextField, useColorScheme } from '@mui/joy';
import { Router, useRouter } from 'next/router';
import { motion } from 'framer-motion';

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





  // if (!user)
  //   return (
  //     <>
  //       {/* {error && <p>{error.message}</p>} */}
  //       <Link href='/login'>Login</Link>
  //     </>
  //   );

  return (
    <>
      <Layout>
        <h2>Canpit</h2>
        <Drower>
          <Card>
            <DrawerThree>
            <ActionBtn onClick={() => {}} whileHover={{background: 'radial-gradient(206.72% 204.88% at 180.67% -6.67%, #6F8BEC 0%, #DF5B56 30.48%, #FFA500 100%)', transition: {duration: 0.35}}} initial={{background: 'radial-gradient(206.72% 204.88% at 106.67% -6.67%, #6F8BEC 0%, #DF5B56 49.48%, #FFA500 100%)'}}>
              <div className='inside'>
                <img src="/img/newRoom.svg" height={60} alt="" />
                <p>Prepare<br/>Room</p>
              </div>
            </ActionBtn>
            <Menu></Menu>
            </DrawerThree>
          </Card>
          <Card avatar>
            <Avatar src="/img/face.png" alt="" />
          </Card>
        </Drower>
        {/* <Drower>
          <Card>
          <p>Krystof Kulhanek</p>
          <p>some content here</p>
          <Button onClick={logOut}>Sign out</Button>
          <pre>{JSON.stringify(data, null, 2)}</pre>
          </Card>
        </Drower> */}
      </Layout>
    </>
  );
};

export default Login;