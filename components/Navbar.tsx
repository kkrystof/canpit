import { useRouter } from "next/router";
import Link from "next/link";
import styled from "styled-components";
 
const navigationRoutes = [{text: 'Activities', href: 'activities'}, {text: 'How it works?', href: 'how-it-works'}, {text: 'About', href: 'about'}];

const Header = styled.header`
    /* position: fixed; */
    width: 70vw;
    display: flex;
    top: 0;
    /* left: 50%; */
    /* translate: -50%; */
    gap: 2em;
    /* padding: 1rem; */
    color: ${({ theme }) => theme.colors.white[400]};
    justify-content: center;
    align-items: center;
    min-width: 700px;
    margin-bottom: 3rem;

    .nav_item_active{
        color: white;
    }

  .box{
    margin: 0 auto;
    display: flex;
    flex-direction: row;
    gap: 1.5rem;
    width: max-content;

    a{
      text-decoration: none;
      padding: 1rem 0;
      
      &:hover{
        color: white;
      }
    }

  }
`
const CTA = styled.a`
  color: ${({ theme }) => theme.colors.black[300]};
  font-family: inherit;
  /* background-color: ${({ theme }) => theme.colors.primary}; */
  background-color: white;
  width: max-content;
  padding: 8px 12px 9px 12px;
  font-weight: 500;
  border-radius: 7px;
  font-size: 1rem;
  border: none;
  transition: background-color 150ms;
  text-decoration: none;
  
  &.max{
    color: ${({ theme }) => theme.colors.black[300]};
    padding: 12px 16px 12px 16px;
    border-radius: 10px;
    font-size: 1.2rem;
  }
  
  &:hover,:active,:focus {
    background-color: gray;
    cursor: pointer;
  } 
`
 
export default function Navbar() {
  const router = useRouter();

  return (
<Header>
<Link href={'/'}>
  <h2 style={{cursor: 'pointer'}}>Canpit</h2>
</Link>
<div className="box">

      {navigationRoutes.map((singleRoute) => {
          return (
              <NavigationLink
              key={singleRoute.href}
              href={`/${singleRoute.href}`}
              text={singleRoute.text}
              router={router}
              />
              );
            })}
</div>
    <Link href='/app'>
        <CTA>Jump into conversation →</CTA>
    </Link>
    </Header>
  );
}



 //@ts-ignore
function NavigationLink({ href, text, router }) {
  const isActive = router.asPath === (href === "/home" ? "/" : href);
  return (
    <Link href={href === "/home" ? "/" : href} passHref>
      <a
        href={href === "/home" ? "/" : href}
        className={`${isActive && "nav_item_active"}`}
      >
        {text}
      </a>
    </Link>
  );
}