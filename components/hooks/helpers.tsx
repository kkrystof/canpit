import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';

const useKeyPress = (keys: any, callback: any, node = null) => {
  // implement the callback ref pattern
  const callbackRef = useRef(callback);
  useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  // handle what happens on key press
  const handleKeyPress = useCallback(
    (event: any) => {
      // check if one of the key is part of the ones we want
    //   if (keys.some((key) => event.key === key)) {
        callbackRef.current(event);
    //   }
    },
    [keys]
  );

  useEffect(() => {
    // target is either the provided node or the document
    const targetNode = node ?? document;
    // attach the event listener
    targetNode &&
      targetNode.addEventListener("keydown", handleKeyPress);

    // remove the event listener
    return () =>
      targetNode &&
        targetNode.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress, node]);
};





const useFocus = () => {
  const htmlElRef = useRef(null)
  
  //@ts-ignore
  const setFocus = () => {htmlElRef.current &&  htmlElRef.current.focus()}

  return [ htmlElRef, setFocus ] 
}




export {useKeyPress, useFocus}


// USAGE OF THIE HOOK
// const onKeyPress = (event) => {
//     console.log(`key pressed: ${event.key}`);
//   };

//   useKeyPress(['a', 'b', 'c'], onKeyPress);