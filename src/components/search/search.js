/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useState, useEffect} from 'react';
import {FlatList} from 'react-native-gesture-handler';
import {Searchbar, useTheme} from 'react-native-paper';
import {View, StyleSheet, Platform} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import Screen from '../screen';
import Ttext from '../text';
import debounce from '../../utils/debounce/debounce';
import UserAvatar from '../avatar/avatar';
import LoadingApp from '../loadingApp';
import scrollPersistTaps from '../../utils/scrollPersistTaps';
import Touchable from '../Touchable';
import baseUrl from '../../config/url';

const SearchComponent = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState(() => ({
    sq: '',
  }));
  const [state, setState] = useState(() => {
    return {
      searchResult: [],
      loading: false,
    };
  });

  useEffect(() => {
    return () => searchDebounced?.stop?.();
  }, [searchDebounced]);

  const search = async (query, debounced) => {
    const q = query.replace(/\s/g, "''").trim();
    await fetch(`${baseUrl.baseUrl}search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'force-cache',
      body: JSON.stringify({q}),
    })
      .then(resp => resp.json())
      .then(result => {
        setState(prevState => ({
          searchResult: debounced
            ? result
            : [...prevState.searchResult, ...result],
          loading: false,
        }));
      })
      .catch(err => {
        console.log(err);
        setState({loading: false});
      });
  };

  const _onSearchChange = useCallback(
    sq => {
      setSearchQuery({sq});
      if (sq.length === 0) {
        setState({
          loading: false,
          searchResult: [],
        });
        return;
      }
      searchDebounced(sq);
      setState({
        loading: true,
        searchResult: [],
      });
    },
    [searchDebounced],
  );

  const searchDebounced = debounce(async function (sq) {
    await search(sq, true);
  }, 500);

  const goToUserProfile = useCallback(
    user_id =>
      navigation.navigate('UserProfile', {
        user_id,
      }),
    [navigation],
  );

  const renderItem = React.useCallback(
    ({item}) => {
      const photoUrl =
        'https://graph.facebook.com/' + item.FB_id + '/picture?type=large';
      return (
        <>
          <Touchable
            onPress={() => goToUserProfile(item.user_id)}
            style={{
              flexDirection: 'row',
              padding: 10,
              alignItems: 'center',
            }}>
            <UserAvatar
              src={photoUrl}
              contentContainerStyle={{}}
              size={49}
              style={{}}
            />
            <View style={{paddingLeft: 10}}>
              <Ttext style={{fontSize: 13}}>{item.full_name}</Ttext>
              <Ttext medium style={{fontSize: 13}}>
                {item.user_name}
              </Ttext>
            </View>
          </Touchable>
        </>
      );
    },
    [goToUserProfile],
  );

  const {loading, searchResult} = state;

  return (
    <Screen style={{...styles.screen}}>
      <View style={{...styles.searchToolbar}}>
        <Searchbar
          style={[styles.searchBar]}
          onChangeText={_onSearchChange}
          placeholder="Find People"
          icon="magnify"
          value={searchQuery.sq}
          onIconPress={() => {}}
          theme={theme}
          // theme
          testID="SEARCHPEAOPLECLUBS"
        />
      </View>
      <FlatList
        data={searchResult}
        renderItem={renderItem}
        keyExtractor={(item, index) => String(index)}
        style={{flex: 1}}
        ListFooterComponent={loading ? <LoadingApp /> : null}
        ListFooterComponentStyle={{paddingTop: 20}}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        {...scrollPersistTaps}
      />
    </Screen>
  );
};

export default SearchComponent;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  searchToolbar: {
    marginHorizontal: 8,
    ...Platform.select({
      android: {
        elevation: 4,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
      },
      ios: {marginTop: 4},
    }),
  },
  searchBar: {
    elevation: 0,
    paddingHorizontal: 4,
    marginTop: 10,
    ...Platform.select({
      ios: {height: 44},
      android: {flex: 1, height: 44, paddingRight: 42},
    }),
  },
  clearAndroid: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
});
