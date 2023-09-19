import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import RenderHtml from 'react-native-render-html';
import { colors } from '../../utils/colors';
import { settings } from '../../utils/settings';
import { ArrowLeftIcon as ArrowLeftIconOutline } from 'react-native-heroicons/outline';
import LottieView from 'lottie-react-native';

const GeneticCounseling = () => {
  const navigation = useNavigation();
  const [content, setContent] = useState(null);
  const [newsContents, setNewsContents] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const animation = useRef(null);
  const HeaderHeight = Dimensions.get('screen').height * 0.3;

  useEffect(() => {
    const url =
      'https://yp.uskudar.dev/api/content/detail/3/kisiye-ozel-tedaviler/tr?token=1';
    axios
      .get(url)
      .then(response => {
        setContent(response.data.content);
        setNewsContents(response.data.content.contents);
        setIsLoading(false);
      })
      .catch(error => {
        setIsLoading(false);
        setIsError(true);
      });
  }, []);
  const { width } = useWindowDimensions();

  if (isLoading) {
    return (
      <View style={styles.animationContainer}>
        <LottieView
          autoPlay
          ref={animation}
          style={{
            width: 200,
            height: 200,
          }}
          source={require('../../../assets/photo/loading.json')}
        />
      </View>
    );
  }

  return (
    <View>
      <ScrollView style={{ backgroundColor: '#f0f0f0' }}>
        <View
          style={{
            position: 'relative',
            zIndex: 0,
            flex: 1,
          }}>
          <View
            style={{
              position: 'absolute',
              height: HeaderHeight,
              width: '100%',
              backgroundColor: colors.darkPurple,
              borderBottomLeftRadius: Dimensions.get('screen').height / 4,
              transform: [{ scaleX: 1.2 }],
              borderBottomRightRadius: Dimensions.get('screen').height / 4,
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginLeft: 15,
              marginTop: 60,
            }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ArrowLeftIconOutline width={35}
                height={35}
                color="black" />
            </TouchableOpacity>
            <View />
          </View>
        </View>
        <View>
          <Image
            source={require('../../../assets/photo/logo.png')}
            style={styles.logo}
          />
        </View>
        {content ? (
          <View style={{ padding: 12 }}>
            <Text
              style={{
                fontSize: 30,
                fontWeight: 'bold',
                textAlign: 'center',
                paddingTop: 20,
                color:"black",
              }}>
              {content.title}
            </Text>
            <ScrollView style={styles.container}>
              <RenderHtml
                contentWidth={width}
                tagsStyle={{
                  p: { fontSize: 20, fontWeight: '500', lineHeight: 24 , color:"black" },
                }}
                baseStyle={{ lineHeight: 24, color:"black" }}
                source={{
                  html: content?.post.replace(/<iframe.*<\/iframe>/, '') || '',
                }}
              />
            </ScrollView>
          </View>
        ) : (
          <Text></Text>
        )}
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            paddingTop: 20,
            justifyContent: 'space-between',
          }}>
          {newsContents ? (
            newsContents.map((content, index) => (
              <TouchableOpacity
                key={index}
                style={styles.homeScreenCardContainer}
                onPress={() =>
                  navigation.navigate('ContentScreen', { slug: content.slug })
                }>
                <Image
                  source={{
                    uri:
                      content.image ||
                      'https://png.pngtree.com/png-vector/20190820/ourmid/pngtree-no-image-vector-illustration-isolated-png-image_1694547.jpg',
                  }}
                  style={{
                    width: '100%',
                    width: settings.CARD_WIDTH * 0.8,
                    height: settings.CARD_WIDTH * 0.5,
                    justifyContent: 'center',
                    borderRadius: 20,
                  }}
                />
                <Text
                  style={{
                    fontSize: 12,
                    textAlign: 'center',
                    fontWeight: '500',
                    marginTop: 10,
                    color:"black",
                  }}>
                  {content.title}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.fullScreenContainer}>
              <LottieView
                autoPlay
                ref={animation}
                style={styles.fullScreenAnimation}
                source={require('../../../assets/photo/loading.json')}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default GeneticCounseling;

const styles = StyleSheet.create({
  homeScreenCardContainer: {
    borderWidth: 0.5,
    borderColor: '#f0f0f0',
    width: settings.CARD_WIDTH * 0.8,
    height: settings.CARD_WIDTH * 0.8,
    backgroundColor: 'white',
    borderRadius: 20,
    marginTop: 20,
    elevation: 4,
    shadowColor: '#00000040',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    alignItems: 'center',
    margin: 10,
  },
  animationContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  container: {
    margin: 10,
    paddingTop: 20,
  },
  logo: {
    resizeMode: 'contain',
    alignSelf: 'center',
    paddingTop: 10,
    marginBottom: 15,
  },
  fullScreenContainer: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  fullScreenAnimation: {
    width: settings.CARD_WIDTH,
    height: settings.CARD_WIDTH,
  },
});
