import React, {useContext, useEffect, useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';

const DeactivateContextOnBlur = ({children, Context}) => {
  const {addListener} = useNavigation();
  const context = useContext(Context);
  const contextRef = useRef(context);
  const [overrideContext, setOverrideContext] = useState();

  // We assign the current `context` to a ref so we can access the latest value
  // in our focus/blur handlers without adding `context` to the `useEffect`
  // dependency list, which would result in us needing to add/remove
  // navigation listeners every time `context` changes.
  contextRef.current = context;

  useEffect(() => {
    const unsubscribeFocus = addListener('focus', () => {
      setOverrideContext(undefined);
    });

    const unsubscribeBlur = addListener('blur', () => {
      setOverrideContext(contextRef.current);
    });

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [addListener]);

  return (
    <Context.Provider value={overrideContext || context}>
      {children}
    </Context.Provider>
  );
};

// import React, { FC, memo } from 'react';
// import { StateContext } from 'rest-hooks';

// const Screen: FC = ({ children }) => (
//   <DeactivateContextOnBlur Context={StateContext}>
//     {children}
//   </DeactivateContextOnBlur>
// );

// const Home: FC = memo(() => {
//   // Home content goes here...
// });

// const HomeScreen: FC = memo(() => (
//   <Screen>
//     <Home />
//   </Screen>
// ));

export {DeactivateContextOnBlur};
