import {
  Linking,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Text,
  View,
  Animated,
  PanResponder,
} from 'react-native';
import React, { useState, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';
import { settings } from '../../utils/settings';
import { ArrowLeftIcon as ArrowLeftIconOutline } from 'react-native-heroicons/outline';
import LinearGradient from 'react-native-linear-gradient';

const SocialProjectScreen = () => {
  const openURL = url => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log(`Don't know how to open this URL: ${url}`);
      }
    });
  };
  const [scrollStart, setScrollStart] = useState(0);

  const [scrollAnim] = useState(new Animated.Value(0));
  const scrollRef = useRef(null);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: (e, gestureState) => {
      setScrollStart(gestureState.x0);
      scrollAnim.stopAnimation();
    },
    onPanResponderRelease: (e, gestureState) => {
      if (gestureState.moveX > scrollStart) {
        if (scrollRef.current) {
          scrollRef.current.scrollTo({ x: 0, animated: true });
        }
        Animated.timing(scrollAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  Animated.loop(
    Animated.sequence([
      Animated.timing(scrollAnim, {
        toValue: 1,
        duration: 5000,
        useNativeDriver: true,
      }),
      Animated.timing(scrollAnim, {
        toValue: 0,
        duration: 9000,
        useNativeDriver: true,
      }),
    ]),
    { iterations: -1 },
  ).start();

  const translateX = scrollAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -700],
  });

  const navigation = useNavigation();
  return (
    <ScrollView style={{ backgroundColor: 'white' }}>
      <Header>
        <TouchableOpacity
          style={{ paddingTop: 50, paddingLeft: 10 }}
          onPress={() => navigation.goBack()}>
          <ArrowLeftIconOutline width={35}
            height={35}
            color="black" />
        </TouchableOpacity>
        <View>
          <Image
            source={require('../../../assets/photo/logo.png')}
            style={styles.logo}
          />
        </View>
        <View
          style={{
            backgroundColor: 'white',
            borderWidth: 0.2,
            borderRadius: 10,
            margin: 10,
          }}>
          <View style={styles.rectangleContainer}>
            <View style={styles.headerContainer}>
              <LinearGradient
                colors={['rgba(64,183,176,1)', 'rgba(64,183,176,0.2)']}
                style={styles.rectangleContainer}>
                <Text style={styles.headerText}>
                  Sosyal Sorumluluk Projeleri
                </Text>
              </LinearGradient>
            </View>
          </View>
          <ScrollView
            ref={scrollRef}
            {...panResponder.panHandlers}
            style={{ backgroundColor: 'white' }}
            horizontal={true}
            showsHorizontalScrollIndicator={false}>
            <Animated.View
              {...panResponder.panHandlers}
              style={{
                flexDirection: 'row',
                paddingTop: 30,
                transform: [{ translateX }],
              }}>
              <View style={{ flexDirection: 'row', paddingTop: 30 }}>
                <TouchableOpacity
                  style={{ margin: 20 }}
                  onPress={() => openURL('https://tv.uskudar.edu.tr/')}>
                  <Image
                    source={require('../../../assets/uutv.webp')}
                    style={{ width: 152, height: 76 }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ margin: 20 }}
                  onPress={() => openURL('https://www.nevzattarhan.com/')}>
                  <Image
                    source={require('../../../assets/nevzat-tarhan.webp')}
                    style={{ width: 250, height: 61 }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ margin: 20 }}
                  onPress={() => openURL('https://psikoyorum.tv/')}>
                  <Image
                    source={require('../../../assets/psikoyorumtv.webp')}
                    style={{ width: 213, height: 76 }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ margin: 20 }}
                  onPress={() => openURL('https://mutluyuva.org/')}>
                  <Image
                    source={require('../../../assets/mutlu-yasam.webp')}
                    style={{ width: 340, height: 86 }}
                  />
                </TouchableOpacity>
              </View>
            </Animated.View>
          </ScrollView>
        </View>

        <View style={{ borderWidth: 0.2, borderRadius: 10, margin: 10 }}>
          <View style={styles.rectangleContainer}>
            <View style={styles.headerContainer}>
              <LinearGradient
                colors={['rgba(64,183,176,1)', 'rgba(64,183,176,0.2)']}
                style={styles.rectangleContainer}>
                <Text style={styles.headerText}>Hastanelerimiz</Text>
              </LinearGradient>
            </View>
          </View>
          <View showsHorizontalScrollIndicator={false}>
            <View style={{ paddingTop: 10, alignItems: 'center' }}>
              <TouchableOpacity
                style={{ margin: 20 }}
                onPress={() =>
                  openURL('https://nptipmerkezi.com/feneryolu-tip-merkezi')
                }>
                <Image
                  source={require('../../../assets/tip-merkezi.webp')}
                  style={{ width: 300, height: 93 }}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={{ margin: 20 }}
                onPress={() =>
                  openURL('https://nptipmerkezi.com/etiler-tip-merkezi')
                }>
                <Image
                  source={require('../../../assets/tip-merkezi2.webp')}
                  style={{ width: 300, height: 93 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ margin: 20 }}
                onPress={() => openURL('https://npistanbul.com/')}>
                <Image
                  source={require('../../../assets/np.webp')}
                  style={{ width: 300, height: 93 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ margin: 20 }}
                onPress={() => openURL('https://uskudardishastanesi.com/')}>
                <Image
                  source={require('../../../assets/uu-dis.webp')}
                  style={{ width: 244, height: 76 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ margin: 20 }}
                onPress={() => openURL('https://uskudar.edu.tr/')}>
                <Image
                  source={require('../../../assets/uu-logo.webp')}
                  style={{ width: 200 }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Header>
    </ScrollView>
  );
};

export default SocialProjectScreen;

const styles = StyleSheet.create({
  logo: {
    resizeMode: 'contain',
    alignSelf: 'center',
    paddingTop: 20,
    marginBottom: 24,
  },
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  rectangleContainer: {
    width: settings.CARD_WIDTH * 1.903,
    height: settings.CARD_WIDTH * 0.18,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
});
