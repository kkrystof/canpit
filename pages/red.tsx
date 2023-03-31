import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { useSessionContext, useUser } from "@supabase/auth-helpers-react";
import { GetServerSidePropsContext, NextPage } from "next"
import Link from "next/link"
import Router from "next/router";
import { useEffect } from "react";

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    
    return {
        props: ctx.query, // will be passed to the page component as props
    }
  }

  const Red: NextPage = ({room}: any) => {
    // const user = useUser();
    const { isLoading, session} = useSessionContext();

    useEffect(()=>{
        if(session)
        Router.push((room) ? '/room/'+room : '/app')
    }, [isLoading])


    return <>
      <p style={{textAlign: 'center'}}>{isLoading && 'Loading...'}</p>
    </>
  }




  export default Red
  