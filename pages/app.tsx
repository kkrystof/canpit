import { useEffect, useState } from 'react';
import { Button } from '../components/sharedstyles';
import router, { Router, useRouter } from 'next/router';
import { motion, useAnimationControls } from 'framer-motion';
import { useSessionContext, useUser } from '@supabase/auth-helpers-react';
import { createServerSupabaseClient, withPageAuth } from '@supabase/auth-helpers-nextjs';
import Dialog from '../components/Dialog';
import { GetServerSidePropsContext } from 'next';
import { FiLogOut } from 'react-icons/fi';
import Avatar from 'react-avatar';
import styled from 'styled-components'


type CardType = {
  avatar?: boolean
}

const Card = styled('div')<CardType>`
  /* position: relative; */
  height: 100%;
  cursor: pointer;
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
  padding: 20px;
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




const App = () => {

  const { isLoading, session, error, supabaseClient } = useSessionContext();
  const user = useUser();

  const router= useRouter()


  const [data, setData] = useState();
  const [btn, setBtn] = useState(false);

        // animation control
const iconAnim = useAnimationControls()
        // animatin keyframes
    const sequence = async () => {
      // await iconAnim.start({scale: [1, 0.85 , 1], transition: {default: { ease: "easeInOut" }, repeat: Infinity, duration: 0.20}})
    await iconAnim.start({scale: [1, 0.85 , 1], rotate: [0, 0, 10, -20, 10, -20, 0, 0], transition: {repeat: Infinity, repeatDelay: 0.7}})
      // await iconAnim.start({scale: 1.02, transition: {default: { ease: "easeInOut" },duration: 0.20}})
  }

  useEffect(() => {
    if(btn){
      sequence()
    fetch('/api/room',{ method: 'post', headers: {'Accept': 'application/json', 'Content-Type': 'application/json'}, body: JSON.stringify({userName: user?.id})})
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        console.log(data);
        router.push({pathname: `/room/${data?.roomId}`, query: { tokenQuery: data?.token  }}, `/room/${data?.roomId}`)
      })
    }
  }, [btn])

  
  return (
    <>
      <Layout>
        <Drower>
          <Card>
            <DrawerThree>
            <ActionBtn onClick={() => setBtn(true)} whileHover={{background: 'radial-gradient(206.72% 204.88% at 180.67% -6.67%, #F1F200 0%, #DF5B56 30.48%, #FFA500 100%)', transition: {duration: 0.35}}} initial={{background: 'radial-gradient(206.72% 204.88% at 106.67% -6.67%, #6F8BEC 0%, #DF5B56 49.48%, #FFA500 100%)'}}>
              <div className='inside'>
                <motion.img animate={iconAnim} initial={{scale: 1}} src="/img/newRoom.svg" height={60} alt="" />
                <p>Prepare<br/>Room</p>
              </div>
            </ActionBtn>
            <Menu>
              <p>{user?.user_metadata.full_name}</p>
              <p>{user?.email}</p>
            </Menu>
            </DrawerThree>
          </Card>
          <Dialog content={<Button onClick={async () => {await supabaseClient.auth.signOut(); router.push('/login')}}>Sign out <FiLogOut/></Button>}>
            <Card avatar>
              {/* <Avatar src={(user?.user_metadata.avatar_url)? user?.user_metadata.avatar_url : '/img/emo-melt.png'} alt="" /> */}
              {/* <Avatar googleId="118096717852922241760" size="100" round={true} /> */}
              <Avatar name={user?.email} size="120" color='white' fgColor='black' style={{fontFamily: 'unset'}} round={true} />

            </Card>
          </Dialog>
        </Drower>
      </Layout>
    </>
  );
};

export default App;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(ctx)
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession()

    // console.log('->', session);
    // console.log(ctx.query);
  
  if (!session){
    return {
      redirect: {
        destination: '/login',
        permanent: false,

      },
    }
  }

  return {
    props: {
      initialSession: session,
      user: session.user,
    },
  }
}

