import { LinkingOptions } from '@react-navigation/native';
import { baseDomain, deepLinkScheme } from '../Linking/Domains';

const linking = {
  prefixes: [deepLinkScheme, baseDomain],
  config: {
    screens: {}
  }
};
