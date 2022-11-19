import React, {forwardRef, useContext, useRef, createContext} from 'react';

import {useTheme} from 'react-native-paper';

import ActionSheet from './ActionSheet';

const context = createContext({
  showActionSheet: () => {},
  hideActionSheet: () => {},
});

export const useActionSheet = () => useContext(context);

const {Provider, Consumer} = context;

export const withActionSheet = Component =>
  forwardRef((props, ref) => (
    <Consumer>
      {contexts => <Component {...contexts} {...props} ref={ref} />}
    </Consumer>
  ));

export const ActionSheetProvider = React.memo(({children}) => {
  const ref = useRef();
  const theme = useTheme();
  const getContext = () => ({
    showActionSheet: options => {
      ref.current?.showActionSheet(options);
    },
    hideActionSheet: () => {
      ref.current?.hideActionSheet();
    },
  });

  return (
    <Provider value={getContext()}>
      <ActionSheet ref={ref} theme={theme}>
        <>{children}</>
      </ActionSheet>
    </Provider>
  );
});
