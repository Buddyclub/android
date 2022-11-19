/* @flow */
import React, {Component} from 'react';
import {withTheme, Text} from 'react-native-paper';
import getFontStyle from './getFontStyle';

// export type Opts = {
//   bold?: boolean,
//   semiBold?: boolean,
//   secondary?: boolean,
//   monospace?: boolean,
//   medium?: boolean,
//   extrabold?: boolean,
// };

// export type Res = {
//   fontFamily: string,
//   fontWeight:
//     | "normal"
//     | "bold"
//     | "100"
//     | "200"
//     | "300"
//     | "400"
//     | "500"
//     | "600"
//     | "700"
//     | "800"
//     | "900",
// };

/**
 * Usage:
 *
 * <Ttext>123</Ttext>
 * <Ttext bold>toto</Ttext>
 * <Ttext semiBold>foobar</Ttext>
 * <Ttext secondary>alternate font</Ttext>
 * <Ttext style={styles.text}>some specific styles</Ttext>
 */
class Ttext extends Component {
  render() {
    const {
      bold,
      semiBold,
      monospace,
      medium,
      thin,
      style,
      italic,
      theme: {fonts, colors},
      ...newProps
    } = this.props;
    return (
      <Text
        allowFontScaling={false}
        {...newProps}
        style={[
          style,
          getFontStyle({
            bold,
            semiBold,
            monospace,
            medium,
            thin,
            italic,
            fonts,
          }),
        ]}
      />
    );
  }
}
export default withTheme(Ttext);
