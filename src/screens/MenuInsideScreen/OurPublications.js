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

const OurPublications = () => {
  const navigation = useNavigation();
  const [content, setContent] = useState(null);
  const [newsContents, setNewsContents] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const animation = useRef(null);
  const HeaderHeight = Dimensions.get('screen').height * 0.3;

  useEffect(() => {
    const url =
      'https://yp.uskudar.dev/api/content/detail/3/kitaplarimiz/tr?token=1';
    axios
      .get(url)
      .then(response => {
        setContent(response.data.content);
        setNewsContents(response.data.content.contents);
        setIsLoading(false);
      })
      .catch(error => {
        setIsLoading(false);
        console.error(error);
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
      <ScrollView style={{ backgroundColor: 'white' }}>
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
              paddingTop: 50,
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
          <View style={{ padding: 20 }}>
            <Text
              style={{
                paddingTop: 20,
                fontSize: 30,
                fontWeight: 'bold',
                textAlign: 'center',
                color:"black"
              }}>
              {content.title}
            </Text>
            <RenderHtml
              contentWidth={width}
              style={{ fontSize: 20, fontWeight: '500' }}
              source={{ html: content.post }}
            />
          </View>
        ) : (
          <Text>Loading Content...</Text>
        )}
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            margin: 10,
            alignItems: 'center',
            justifyContent: 'center',
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
                      'https://www.example.com/default-image.jpg',
                  }}
                  style={{
                    width: '100%',
                    height: settings.CARD_WIDTH * 0.5,
                    width: settings.CARD_WIDTH * 0.8,
                    justifyContent: 'center',
                    borderRadius: 20,
                  }}
                />
                <Text style={{ textAlign: 'center', paddingTop: 15 ,  color:"black"}}>
                  {content.title}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text>Loading News...</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default OurPublications;

const styles = StyleSheet.create({
  homeScreenCardContainer: {
    width: settings.CARD_WIDTH * 0.9,
    backgroundColor: 'white',
    borderRadius: 20,
    marginTop: 10,
    marginBottom: 10,
    marginRight: 6,
    elevation: 4,
    shadowColor: '#00000040',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    alignItems: 'center',
    paddingBottom: 10,
  },
  animationContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  logo: {
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 21,
  },
});
