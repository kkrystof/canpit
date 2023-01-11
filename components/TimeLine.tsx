//@ts-nocheck
import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
// import { violet, blackA, mauve, green } from '@radix-ui/colors';
// import { Cross2Icon } from '@radix-ui/react-icons';
import styled, { keyframes } from 'styled-components'
import { Button, Divider, Input } from '../components/sharedstyles';
import { useForm, SubmitHandler } from "react-hook-form";

import { motion, useAnimationControls } from 'framer-motion'


//@ts-ignore
const TimeLine = ({menu}) => {

    const [open, setOpen] = React.useState(false);




  return <Line>
    {/* {menu && <div className='block'></div>} */}
    {activities.map((a,i) =>
        //@ts-ignore
        <Point color={a.color} key={i} h={100/activities.length}>
            <p>{a.title}</p>
        </Point>
    )}
  </Line>
};

const myColors = {
    green: '#30D158',
    red: '#FF0000',
    blue: '#2D31FA',
    orange: '#FF6D00',
    yellow: '#F1F200'
  }
  
  const activities = [
    {title: 'Let\’s have picnic', color: myColors.green, desc: 'Are you hungry? Gess what I have bring in my basket with me?'},
    {title: 'What did you said?', color: myColors.yellow, desc: 'Are you ready speak only in questions? You sad NO?'},
    {title: 'Among us', color: myColors.red, desc: 'haha'},
    {title: 'You are him!', color: myColors.blue, desc: 'I thought you are the peson!'},
    {title: 'Box of lies ...', color: myColors.red, desc: 'Lies are my teritory. So what is in my box?'},
  ]

  type dd = {
    color: string,
    hh: number
  }

const Line = styled.div`
    position: absolute;
    bottom: 0;
    display: block;
    /* width: {(menu) => {menu ? '20px' : '10px'}}; */
    /* width: ${menu => {return menu ? '30px' : '10px'}}; */
    width: 15px;
    height: 100vh;
    /* background: ${({ theme }) => theme.colors.white['300']}; */
    z-index: 999;
    transition: width 80ms linear;

    &:hover{
        width: 30px;
    }
`

const Point = styled.div`
height: ${props => props.h}%;
width: 100%;
background: ${props => props.color};

p{
    position: relative;
    margin: 0;
    width: max-content;
    left: 30px;
    /* bottom: 0 */
    top: 50px;
}
`



export default TimeLine;