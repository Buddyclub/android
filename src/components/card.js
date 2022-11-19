import * as React from 'react';
import {Platform} from 'react-native';
import {Card as RNPaperCard} from 'react-native-paper';

const Card = props => {
  // Till this is fixed in React Native https://github.com/facebook/react-native/issues/23090
  const elevation = Platform.OS === 'android' && Platform.Version >= 28 ? 0 : 1;

  return <RNPaperCard elevation={elevation} {...props} />;
};

Card.Content = RNPaperCard.Content;
Card.Actions = RNPaperCard.Actions;
Card.Cover = RNPaperCard.Cover;
Card.Title = RNPaperCard.Title;

export default Card;
