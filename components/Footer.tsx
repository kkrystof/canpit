import { useRouter } from "next/router";
import Link from "next/link";
import styled from "styled-components";
 
const navigationRoutes = [{text: 'Activities', href: 'activities'}, {text: 'How it works?', href: 'how-it-works'}, {text: 'About', href: 'about'}];

const Foot = styled.footer`
    /* position: fixed; */
    width: 100%;
    display: flex;
    flex-direction: column;
    top: 0;
    /* left: 50%; */
    /* translate: -50%; */
    gap: 0.4rem;
    /* padding: 1rem; */
    color: ${({ theme }) => theme.colors.white[400]};
    justify-content: center;
    align-items: center;
    min-width: 700px;
    /* margin: 7rem 0 3rem 0; */
    padding: 2rem;

    p,a{
      width: max-content;
      margin: 0;
    }

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

 
export default function Footer() {

  return (
<Foot>
{/* <Link href={'/'}>
  <h2 style={{cursor: 'pointer'}}>Canpit</h2>
</Link> */}
<img src="/img/footerIcon.svg" height={130} alt="" />
{/* <div> */}
<p>Made with love in Czechia.</p>
{/* <p>2022 - 2023</p> */}
{/* </div> */}
{/* <div className="box">

      {navigationRoutes.map((singleRoute) => {
          return (
              <a
              key={singleRoute.href}
              href={`/${singleRoute.href}`}
              >
                {singleRoute.text}
              </a>
              );
            })}
</div> */}

    </Foot>
  );
}
