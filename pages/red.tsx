import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { useSessionContext, useUser } from "@supabase/auth-helpers-react";
import { GetServerSidePropsContext, NextPage } from "next"
import Link from "next/link"
import Router from "next/router";
import { useEffect } from "react";

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    // Create authenticated Supabase Client
    // const supabase = createServerSupabaseClient(ctx)
    // Check if we have a session
    // const {
    //   data: { session },
    // } = await supabase.auth.getSession()
    
    return {
        props: ctx.query, // will be passed to the page component as props
    }
  
    // if (session)
    //   return {
    //     redirect: {
    //       destination: '/app',
    //       permanent: false,
  
    //     },
    // }
  }

  const Red: NextPage = ({room}: any) => {
    // const user = useUser();
    const { isLoading, session} = useSessionContext();

    // if(session){
    //     Router.push('/app')
    // }

    useEffect(()=>{
        if(session)
        Router.push((room) ? '/room/'+room : '/app')
    }, [isLoading])


    return <>
    <p style={{textAlign: 'center'}}>{isLoading && 'Loading...'}</p>
    {/* <Link href={'/app'}>Go to app </Link> */}
    </>
  }




  export default Red
  