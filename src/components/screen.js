import React from 'react';
import {StyleSheet, SafeAreaView, View} from 'react-native';
import {withTheme} from 'react-native-paper';
class Screen extends React.Component {
  render() {
    const {
      theme: {colors},
    } = this.props;
    return (
      <SafeAreaView style={{...styles.safeareaContainer}}>
        <View style={[this.props.style, {backgroundColor: colors.dark}]}>
          {this.props.children}
        </View>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  safeareaContainer: {
    flex: 1,
  },
});
export default withTheme(Screen);
