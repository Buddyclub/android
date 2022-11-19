/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {useTheme, Divider} from 'react-native-paper';
import DeviceInfor from 'react-native-device-info';
import {View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import Share from 'react-native-share';
import Icon from 'react-native-vector-icons/Feather';
import Ttext from '../text';
import Screen from '../screen';
import windowDimensions from '../../utils/metrics/windowDimensions';
import {email, web, text, phonecall} from '../../utils/links/communication';

const {Dw: W} = windowDimensions();

const options = {
  message: 'I am on Budyclub, come Join me😊, Get the app on Play Store,',
  // title: 'John Ngugi',
  url: 'https://play.google.com/store/apps/details?id=com.budyclub.app',
  // subject: 'John Ngugi',
};

const shareContent = async () => {
  try {
    await Share.open(options);
  } catch (err) {
    console.log(err);
  }
};

const openLink = (fn, ar) => fn(ar);

const SettingsButtonComponet = props => {
  const {colors} = useTheme();

  return (
    <TouchableOpacity
      onPress={async () =>
        props.param ? await props.onPress(...props?.arg) : await props.onPress()
      }
      style={{
        ...styles.settingBnt,
        borderBottomColor: colors.disabled,
      }}>
      <Icon
        name={props.icon}
        size={20}
        color={props.color ? props.color : colors.snow}
      />
      <Ttext
        style={{
          ...styles.bntText,
        }}>
        {props.text}
      </Ttext>
      <Ttext
        style={{
          ...styles.name,
        }}>
        {props.firstName ? 'John' : ' '}
      </Ttext>
      <Icon name="chevron-right" size={19} color={colors.placeholder} />
    </TouchableOpacity>
  );
};

const SeperatorComponent = ({colors}) => (
  <Divider style={{...styles.divider, backgroundColor: colors.dark}} />
);

const privacy_terms = [
  {
    privacy_t: 'Privacy policy',
    icon: 'lock',
    link: 'https://budyclub-privacy-policy.netlify.app',
  },
  {
    privacy_t: 'Terms conditions',
    icon: 'file-text',
    link: 'https://budyclub-privacy-policy.netlify.app',
  },
];

const appVersion = DeviceInfor.getVersion();
const UserAccountSettings = ({loagout}) => {
  const {colors} = useTheme();
  return (
    <Screen style={{...styles.screen}}>
      <ScrollView>
        <View style={{...styles.settingsContainer}}>
          <SettingsButtonComponet
            text="Pause Notification"
            icon="bell"
            onPress={() => {}}
          />
          <SeperatorComponent colors={colors} />
          <SettingsButtonComponet
            text="share with friends"
            icon="share-2"
            onPress={shareContent}
          />
          {/* <SettingsButtonComponet
            text="Contact Us"
            icon="mail"
            param={true}
            arg={[['bizz.john@yahoo.com'], null, null, null, null]}
            onPress={email}
          /> */}
          <SettingsButtonComponet
            text="Rate Buddyclub"
            icon="star"
            param
            arg={[
              'https://play.google.com/store/apps/details?id=com.budyclub.app',
            ]}
            onPress={web}
          />
          <SettingsButtonComponet
            text="Donate"
            icon="dollar-sign"
            onPress={() => {}}
          />
          <SeperatorComponent colors={colors} />
          {privacy_terms.map((item, i) => (
            <SettingsButtonComponet
              text={item.privacy_t}
              icon={item.icon}
              key={i}
              arg={[item.link]}
              param
              onPress={web}
            />
          ))}
          <SeperatorComponent colors={colors} />
          <SeperatorComponent colors={colors} />
          <SettingsButtonComponet
            text="Log out"
            icon="log-out"
            color={colors.danger}
            onPress={loagout}
          />
        </View>
      </ScrollView>
      <View
        style={{
          justifyContent: 'flex-end',
          alignSelf: 'center',
          flex: 1,
          marginBottom: 20,
        }}>
        <Ttext style={{...styles.vText}}>
          Version {'  '} {appVersion}
        </Ttext>
      </View>
    </Screen>
  );
};

export default UserAccountSettings;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  settingsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  vText: {
    fontSize: 13,
    textAlign: 'center',
  },
  loagoutBtn: {},
  settingBnt: {
    padding: 10,
    width: W,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
  },
  bntText: {
    paddingHorizontal: 10,
    fontSize: 16,
  },
  name: {
    textAlign: 'right',
    flex: 1,
    marginTop: 2,
  },
  versionText: {
    textAlign: 'center',
    flex: 1,
    marginTop: 20,
    fontSize: 16,
  },
  divider: {
    width: W,
    height: 25,
  },
});
