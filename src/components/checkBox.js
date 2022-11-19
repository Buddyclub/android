import * as React from 'react';
import {Checkbox} from 'react-native-paper';

export const CheckBox = props => {
  return (
    <Checkbox
      {...props}
      status={props.checked ? 'checked' : 'unchecked'}
      onPress={() => {
        props.setChecked();
      }}
    />
  );
};

export default CheckBox;
