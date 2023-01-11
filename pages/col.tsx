import { NextPage } from "next/types";
import { useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import styled from "styled-components";
import Coloseum from "../components/Coloseum";
import { useFocus, useKeyPress } from "../components/hooks/helpers";
import { Button } from "../components/sharedstyles";

import { motion, useAnimationControls } from 'framer-motion'
import TimeLine from "../components/TimeLine";
import { activitiesList as list } from "../components/acitivies/list";



const Homepage: NextPage = (req) => {


    const [people, setPeople] = useState(5)
    const [showChat, setShowChat] = useState(false)

    const [menu, setMenu] = useState(false)
    // const [inputRef, setInputFocus] = useFocus()

    useHotkeys('ctrl+m', () => {
        console.log('ctrl + m pressed !!!')
        setShowChat(current => !current);
        // setInputFocus()
        
    });

    const taptap = (event, info) => {
      console.log(info.point.x, info.point.y)
    }

    const click = () => {
      (menu) ? menuAnim.start({minWidth: '100vw'}) : menuAnim.start({minWidth: '50vw'})      
      setMenu(current => !current)
    }

    const menuAnim = useAnimationControls()


    


    return <Window>
        <div style={{position: 'absolute', zIndex: 999}}>
            <button onClick={()=> setPeople(people+1)}>Add</button>
            <button onClick={()=> setPeople(people-1)}>Delete</button>

            <button onClick={() => click()}>Menu</button>

            {/* <Exit><img src="/img/exit.svg"/>Leave it here</Exit> */}
            {showChat && <MessageInput show autoFocus={true}/>}
        </div>


    <Playground  animate={menuAnim} initial={{minWidth: '100vw'}}>
        {menu && <Overlay onClick={() => click()}/>}
        <Coloseum total={people}>
                <img src="/img/face.png"/>
                <img src="/img/face.png"/>
                <img src="/img/face.png"/>
                {/* <img src="/img/face.png"/> */}
                {/* <img src="/img/face.png"/> */}
                {/* <img src="/img/face.png"/> */}
          </Coloseum>
          {/* <TimeLine menu={menu} /> */}
    </Playground>

    <ActivityMenu>
      <div className="content">

      <header>
        <p>Settings</p>
        <p>Hide</p>
        <div style={{marginRight: 'auto'}}></div>
        <Button>Copy shareable link</Button>
        {/* <p>pff</p> */}
      </header>
      <ActivityLib>
        <section>
          <h2>Your favourite</h2>
          <div className="box">

            {
              Object.keys(list).map((a,i) =>
                <ActivityThnail color={list[a].color} key={i}>
                  <Icon color={list[a].color}   whileTap={{ scale: 0.7, opacity: 1, transition: {duration: 0.15}}} onTapCancel={() => taptap} whileInView={{ opacity: 1 }}/>
                  <h3>{list[a].title}</h3>
                  <p>{list[a].desc.substring(0, 32)}...</p>
                </ActivityThnail>                
                )
            }

                {/* <ActivityThnail color={myColors.orange}> */}
                  {/* <div className="icon" style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(calc(-25vw - 50%), -50%)' }}></div> */}
                  {/* <Icon color={myColors.orange} whileTap={{ scale: 0.8 }} animate={{position: 'absolute', zIndex: 3, height: '120px', width: '120px', borderRadius: '20px', top: '50%', left: '0', transform: 'translate(calc(-25vw - 50%), -50%)', transition: {type: "tween",duration: 0.5}}}/> */}
                  {/* <Icon color={myColors.orange} whileTap={{ scale: 0.7, opacity: 1, transition: {duration: 0.15}}} onTapCancel={() => taptap} whileInView={{ opacity: 1 }}/> */}
                  {/* <h3>Test</h3> */}
                  {/* <p>{a.desc}</p> */}
                {/* </ActivityThnail> */}

          </div>
        </section>
      </ActivityLib>
        </div>
      </ActivityMenu>
    </Window>
}

export default Homepage




// const myColors = {
//   green: '#30D158',
//   red: '#FF0000',
//   blue: '#4D96FF',
//   orange: '#FF6D00',
//   yellow: '#F1F200'
// }

// const activities = [
//   {title: 'Let\’s have picnic', color: myColors.green, desc: 'Are you hungry? Gess what I have bring in my basket with me?'},
//   {title: 'What did you said?', color: myColors.yellow, desc: 'Are you ready speak only in questions? You sad NO?'},
//   {title: 'Among us', color: myColors.red, desc: 'haha'},
//   {title: 'You are him!', color: myColors.blue, desc: 'I thought you are the peson!'},
//   {title: 'Box of lies ...', color: myColors.red, desc: 'Lies are my teritory. So what is in my box?'},
// ]


enum ColorType {
  bg = 20,
  border = 15,
  title = 70,
  text = 45,
  overlay= 60
}


const colorShade = (color: any, type: ColorType) => {
  const colour = color.charAt(0) === "#" ? color.substring(1, 7) : color;

  const r = parseInt(colour.substring(0, 2), 16); // hexToR
  const g = parseInt(colour.substring(2, 4), 16); // hexToG
  const b = parseInt(colour.substring(4, 6), 16); // hexToB

  if(type === ColorType.title){
    return '#' +
    ((0|(1<<8) + r + (256 - r) * type / 100).toString(16)).substr(1) +
    ((0|(1<<8) + g + (256 - g) * type / 100).toString(16)).substr(1) +
    ((0|(1<<8) + b + (256 - b) * type / 100).toString(16)).substr(1);
  }


  return `rgba(${r},${g},${b}, ${type/100})`
};



const Overlay = styled.div`
  position: absolute;
  width: 50vw;
  height: 100%;
  z-index: 2;
  /* background-color: ${colorShade('#00000', ColorType.overlay)}; */
  /* background-color: ${({ theme }) => theme.colors.black['300']}; */
  background-color: #15130ed4;
`



interface Props {
    show: boolean
  }


const ActivityLib = styled.div`

      /* overflow: scroll; */
      /* height: 50vh; */
    section{

    }

    .box{

      display: flex;
      flex-direction: row;
      /* gap: 10px; */
      /* gap: auto; */
      gap: 2rem;

      justify-content: space-between;
      flex-wrap: wrap;
      /* align-items: right; */

      /* flex-shrink: 3; */
      max-width: calc(50vw - 4em);
    
    }
`

const ActivityThnail = styled.div`

      min-width: 220px;
      /* max-width: 250px; */
      flex: 3 3 30%;
      /* width: 33%; */
      /* height: 180px; */
      /* height: 160px; */
      border: 2px solid ${props => colorShade(props.color, ColorType.border)};
      border-radius: 24px;
      /* border-radius: 18px; */
      padding: 14px 14px 14px 14px;
      box-sizing: border-box;
      background-color: ${props => colorShade(props.color, ColorType.bg)};
      transition: all 200ms;
      /* color: ${props => props.color}; */
      color: ${props => colorShade(props.color, ColorType.text)};
      
      &:hover{
        /* border: 2px solid ${({ theme }) => theme.colors.white[200]}; */
        border-color: transparent;
        background-color: ${props => colorShade(props.color, ColorType.text)};
        
      }
      
      h3{
        color: ${props => colorShade(props.color, ColorType.title)};
        font-size: 18px;
        font-weight: normal;
      }
    

    .icon{
      height: 80px;
      width: 80px;
      background-color: ${props => props.color};
      border-radius: 10px;
      cursor: pointer;
    }
`

const Icon = styled(motion.div)`
      height: 80px;
      width: 80px;
      background-color: ${props => props.color};
      border-radius: 10px;
      cursor: pointer;

      /* {position: 'absolute', top: '50%', left: '50%', transform: 'translate(calc(-25vw - 50%), -50%)' } */

`

const Window = styled.div`
      margin: 0;
      padding: 0;
      display: flex;
      gap: 0;
      height: 100vh;
      width: 100vw;
      overflow: hidden;
`

const Playground = styled(motion.section)`
      min-width: 100vw;
`

const ActivityMenu = styled.section`
      min-width: 50vw;
      color: rgba(255, 255, 255, 0.4);
      border-left: 1px solid rgba(128, 128, 128, 0.1);
      padding: 2rem;
      background: ${({ theme }) => theme.colors.white[100]};
      position: relative;
      height: 100vh;
      overflow-y: scroll;
      
      .content{
        /* width: 50vw; */

      }

      h2{
        font-weight: normal;
        font-size: 1.2rem;
        color: rgba(255, 255, 224, 0.4);

      }


      /* border-top-left-radius: 20px;
      border-bottom-left-radius: 20px; */
      /* background-color: red; */

      header{
          display: flex;
          flex-direction: row;
          gap: 16px;
          align-items: center;
          margin-bottom: 4rem;
      }
`

const MessageInput = styled.textarea<Props>`
    // display: ${props => !props.show ? 'block' : 'none'};
    background: ${({ theme }) => theme.colors.white[200]};
    border: 2px solid ${({ theme }) => theme.colors.white[300]};
    color: white;
    font-family: inherit;
    padding: 6px 10px 7px 10px;
    font-size: 1rem;
    border-radius: 7px;
    outline: none;
    transition: all 200ms;

    &::-webkit-scrollbar {
    width: 1em;
    display: none;
    }

    /* &::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    }

    &::-webkit-scrollbar-thumb {
    background-color: darkgrey;
    outline: 1px solid slategrey;
    } */
    
    
    &:hover{
        background: ${({ theme }) => theme.colors.white[100]};     
    }
    
    &:focus, :active{
        border-color: ${({ theme }) => theme.colors.primary};
        background: ${({ theme }) => theme.colors.white[200]};
    }
`


const Exit = styled.button`
  font-family: inherit;
  /* background-color: ${({ theme }) => theme.colors.secondary}; */
  background-color: transparent;
  width: max-content;
  padding: 6px 10px 7px 10px;
  /* padding: 12px 20px; */
  font-weight: 500;
  border-radius: 7px;
  /* line-height: 16px; */
  letter-spacing: .2px;
  font-size: 1rem;
  border: none;
  /* border: 2px solid ${({ theme }) => theme.colors.white[100]}; */

  display: flex;
  gap: 10px;
  align-items: center;
  transition: all 200ms;
  margin: 20px;
  color: rgba(38, 148, 99, 0.5);

  img{
        height: 24px;
    }

  &:hover {
      color: white;
      background-color: ${({ theme }) => theme.colors.white[200]};
    cursor: pointer;
  } 
  &:active {

  }
`