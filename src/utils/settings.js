import {Dimensions} from 'react-native';

export const settings = {
  SCREEN_WIDTH: Dimensions.get('window').width,
  SCREEN_HEIGHT: Dimensions.get('window').height,
  CARD_WIDTH: Dimensions.get('window').width / 2,
  BUTTON_WIDTH: Dimensions.get('window').width / 1.22,
};
