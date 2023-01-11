import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
// import { violet, blackA, mauve, green } from '@radix-ui/colors';
// import { Cross2Icon } from '@radix-ui/react-icons';
import styled, { keyframes } from 'styled-components'
import { Button, Divider, Input } from '../components/sharedstyles';
import { useForm, SubmitHandler } from "react-hook-form";

import { motion, useAnimationControls } from 'framer-motion'


enum GenderEnum {
    female = "female",
    male = "male",
    other = "other"
  }
  
  interface IFormInput {
    fullName: String;
    userName: String;
  }

  const defaultFormVals = {
    fullName: 'Your name',
    userName: '@user_name'
  }

  const wait = () => new Promise((resolve) => setTimeout(resolve, 1000));

//@ts-ignore
const DialogDemo = ({children, content}) => {

    const [open, setOpen] = React.useState(false);


    const { register, handleSubmit, reset } = useForm<IFormInput>({mode: 'onBlur', defaultValues: defaultFormVals});
    const onSubmit: SubmitHandler<IFormInput> = data => {
        console.log(data);
        // wait().then(() => setOpen(false));
        // event.preventDefault();

        setOpen(false)

        // reset();


    }


  return <Dialog.Root open={open} onOpenChange={setOpen}>
    <Dialog.Trigger asChild>
      {children}
    </Dialog.Trigger>
    <Dialog.Portal>
      <DialogOverlay />
      <DD>
      {/* <DialogContent transition={{ default: { ease: "easeInOut" }, duration: 1000 }} animate={{  padding: '40px', width: '80vw', height: '500px', left: '50%', transform: 'translate(-50%, -50%)'}}> */}
      <DialogContent>
        <div className='content'>

        <DialogTitle>Settings</DialogTitle>
        <DialogDescription>
          Make changes to your profile here. Click save when you&aposre done.
        </DialogDescription>

        {content}

        <Divider/>

        <form onSubmit={handleSubmit(onSubmit)}>

        <Fieldset>
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register("fullName")}  />
        </Fieldset>
        <Divider/>
        <Fieldset>
          <Label htmlFor="username">Username</Label>
          <Input id="username" {...register("userName", { required: "Please enter your user name." })}/>
        </Fieldset>



        <Divider/>

        <Flex style={{ marginTop: 25, justifyContent: 'flex-end' }}>
          {/* <Dialog.Close asChild> */}
            <Button type='submit'>Save changes</Button>
            
          {/* </Dialog.Close> */}
        </Flex>
        </form>


        </div>
        <Dialog.Close asChild>
            <Exit></Exit>
        </Dialog.Close>
      </DialogContent>
      </DD>
    </Dialog.Portal>
  </Dialog.Root>
};

const overlayShow = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 1 },
});

const contentShow = keyframes({
  '0%': { opacity: 0, transform: 'translate(-50%, -48%) scale(.90)' },
  '100%': { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
});


const DialogOverlay = styled(Dialog.Overlay)`
  background-color: ${({ theme }) => theme.colors.black[200]};
  position: fixed;
  backdrop-filter: blur(6px);
  inset: 0;
  animation: ${overlayShow} 350ms cubic-bezier(0.16, 1, 0.3, 1);
  `;

const Exit = styled('div')`
    position: absolute;
    top: 10px;
    right: 10px;
    height: 30px;
    width: 30px;
    background-color: ${({ theme }) => theme.colors.white['200']};
    border-radius: 50%;

    &:hover{
        background-color: ${({ theme }) => theme.colors.white['300']};
    }

`

const DD = styled(Dialog.Content)`

`

const DialogContent = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.black['solid300']};
  border-radius: 20px;
  /* box-shadow: hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px; */
  /* transform: translate(-100%, -50%); */
  transform: translate(-50%, -50%);
  position: fixed;
  top: 50%;
  /* left: calc(50% + 400px); */
  left: 50%;
  width: 80vw;
  height: 500px;
  /* width: 170px; */
  /* height: 170px; */
  max-width: 800px;
  max-height: 85vh;
  /* padding: 0px; */
  padding: 40px;
  animation: ${contentShow} 250ms cubic-bezier(0.16, 1, 0.3, 1);

  .content{
    /* display: none */
  }

  &:focus:{
        outline: none;
    } 
`;

const DialogTitle = styled(Dialog.Title)`
  margin: 0;
  font-weight: 500;
  color: white;
  font-size: 17;
`;

const DialogDescription = styled(Dialog.Description)`
  margin: 10px 0 20px;
  color: white;
  font-size: 15;
  line-height: 1.5;
`;

const Flex = styled('div')`
    display: flex;
`;

// const Button = styled('button')`
//   all: unset;
//   display: inline-flex;
//   alignItems: center;
//   justifyContent: center;
//   borderRadius: 4;
//   padding: 0 15px;
//   fontSize: 15;
//   lineHeight: 1;
//   fontWeight: 500;
//   height: 35;

//   variants: {
//     variant: {
//       violet: {
//         backgroundColor: white;
//         color: violet.violet11;
//         boxShadow: 0 2px 10px black;
//         &:hover: { backgroundColor: red };
//         &:focus: { boxShadow: 0 0 0 2px black };
//       };
//       green: {
//         backgroundColor: green;
//         color: green;
//         &:hover: { backgroundColor: green };
//         &:focus: { boxShadow: 0 0 0 2px green };
//       },
//     },
//   },

//   defaultVariants: {
//     variant: 'violet',
//   },
// `;

// const IconButton = styled('button', {
//   all: 'unset',
//   fontFamily: 'inherit',
//   borderRadius: '100%',
//   height: 25,
//   width: 25,
//   display: 'inline-flex',
//   alignItems: 'center',
//   justifyContent: 'center',
//   color: violet.violet11,
//   position: 'absolute',
//   top: 10,
//   right: 10,

//   '&:hover': { backgroundColor: violet.violet4 },
//   '&:focus': { boxShadow: `0 0 0 2px ${violet.violet7}` },
// });

const Fieldset = styled('fieldset')`
  all: unset;
  display: flex;
  gap: 20px;
  align-items: center;
  margin-bottom: 15;
`;

const Label = styled('label')`
  font-size: 15;
  color: violet.violet11;
  width: 90;
  text-align: right;
`;

// const Input = styled('input')`
//   all: unset;
//   width: 100%;
//   flex: 1;
//   display: inline-flex;
//   alignItems: center;
//   justifyContent: center;
//   borderRadius: 4;
//   padding: 0 10px;
//   fontSize: 15;
//   lineHeight: 1;
//   color: violet.violet11;
//   boxShadow: 0 0 0 1px red;
//   height: 35;

//   &:focus: { boxShadow: 0 0 0 2px red };
// `;

export default DialogDemo;