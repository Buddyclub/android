import * as React from 'react';
import {Provider} from 'react-native-paper';
import {defaultTheme} from './theme';
const PaperThemeProvider = ({children}) => {
  return <Provider theme={defaultTheme}>{children}</Provider>;
};

export default PaperThemeProvider;
