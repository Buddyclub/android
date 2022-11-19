import React, {Component} from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';

const defaultHitSlop = {
  // default & can be overridden by rest
  top: 16,
  left: 16,
  right: 16,
  bottom: 16,
};

export default class Touchable extends Component {
  state = {
    pending: false,
  };

  unmounted = false;

  componentWillUnmount() {
    this.unmounted = true;
  }

  onPress = async () => {
    const {onPress} = this.props;
    if (!onPress) {
      return;
    }
    try {
      const res = onPress();
      if (res && res.then) {
        // it's a promise, we will use pending/spinnerOn state
        this.setState({pending: true});
        await res;
      }
    } finally {
      if (!this.unmounted) {
        this.setState(({pending}) => (pending ? {pending: false} : null));
      }
    }
  };

  render() {
    const {onPress, children, ...rest} = this.props;
    const {pending} = this.state;
    const disabled = !onPress || pending;
    return (
      <TouchableOpacity
        onPress={this.onPress}
        disabled={disabled}
        hitSlop={defaultHitSlop}
        {...rest}>
        {children}
      </TouchableOpacity>
    );
  }
}
