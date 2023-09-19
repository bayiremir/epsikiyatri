import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  StyleSheet,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import RenderHtml from 'react-native-render-html';
import {useNavigation} from '@react-navigation/native';
import {WebView} from 'react-native-webview';
import {colors} from '../../utils/colors';
import {settings} from '../../utils/settings';
import GoUp from '../../components/GoUp/GoUp';

const ContentInside = ({route}) => {
  const navigation = useNavigation();
  const [content, setContent] = useState(null);
  const {slug} = route.params;
  const animation = useRef(null);
  const scrollViewRef = useRef();
  const HeaderHeight = Dimensions.get('screen').height * 0.3;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fixedSlug = slug.startsWith('/') ? slug.substring(1) : slug;
        const url = `https://yp.uskudar.dev/api/content/detail/3/${fixedSlug}/tr?token=1`;

        const response = await axios.get(url);
        let fetchedContent = response.data.content;

        const imageRegex = /src="\/\/(.*?)"/g;
        fetchedContent.post = fetchedContent.post.replace(
          imageRegex,
          'src="https://$1"',
        );

        if (
          fetchedContent.image &&
          !fetchedContent.image.startsWith('https://')
        ) {
          fetchedContent.image = 'https://' + fetchedContent.image;
        }
        setContent(fetchedContent);
      } catch (error) {
        console.error('Error fetching content:', error);
      }
    };

    fetchData();
  }, [slug]);

  const {width} = useWindowDimensions();
  const fixedImageURL = content?.image.startsWith('about://')
    ? content.image.replace('about://', 'https://')
    : content?.image || 'https://www.example.com/default-image.jpg';

  const getVideoIframe = htmlContent => {
    const videoRegex = /<iframe.*src=\"(.*?)\".*<\/iframe>/;
    const match = htmlContent.match(videoRegex);
    return match ? match[1] : '';
  };

  const videoIframe = getVideoIframe(content?.post || '');

  return (
    <View style={{flex: 1}}>
      <GoUp scrollViewRef={scrollViewRef}></GoUp>
      {content ? (
        <ScrollView style={{backgroundColor: 'white'}} ref={scrollViewRef}>
          <View
            style={{
              position: 'relative',
              zIndex: 0,
              flex: 1,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 16,
                paddingTop: 40,
                backgroundColor: 'rgba(64,183,176,0.3)',
              }}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{position: 'absolute', left: 16, top: 60}}>
                <AntDesign name="arrowleft" size={32} color="black" />
              </TouchableOpacity>

              <Image
                source={require('../../../assets/photo/logo.png')}
                style={styles.logo}
              />
            </View>
            <View style={styles.container}>
              {fixedImageURL !==
                'https://www.example.com/default-image.jpg' && (
                <Image
                  source={{
                    uri: fixedImageURL,
                  }}
                  style={{
                    width: '100%',
                    height: 200,
                    borderRadius: 30,
                    marginBottom: 20,
                  }}
                  onError={error => {
                    console.log('Image loading error:', error);
                  }}
                />
              )}
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>
                {content.title}
              </Text>

              {videoIframe && (
                <WebView
                  scalesPageToFit={true}
                  bounces={false}
                  javaScriptEnabled
                  style={{
                    height: settings.CARD_WIDTH * 1,
                    width: settings.CARD_WIDTH * 1.7,
                    borderRadius: 20,
                    marginLeft: 10,
                  }}
                  source={{
                    uri: videoIframe.startsWith('//')
                      ? 'https:' + videoIframe
                      : videoIframe,
                  }}
                  automaticallyAdjustContentInsets={false}
                />
              )}
              <RenderHtml
                contentWidth={width}
                tagsStyles={{
                  p: {
                    paddingTop: 10,
                    marginBottom: 10,
                  },
                  a: {
                    paddingTop: 10,
                  },
                  h1: {paddingTop: 20},
                  h2: {paddingTop: 20},
                  h3: {paddingTop: 30},
                  h4: {paddingTop: 20},
                  h5: {paddingTop: 20},
                  h6: {paddingTop: 30},
                }}
                baseStyle={{lineHeight: 24}}
                source={{
                  html: content?.post.replace(/<iframe.*<\/iframe>/, '') || '',
                }}
              />
            </View>
          </View>
          <View style={{flexDirection: 'row', flexWrap: 'wrap', margin: 20}}>
            {content?.contents?.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                onPress={() =>
                  navigation.navigate('ContentInside', {slug: item.slug})
                }
                style={[
                  {
                    width: '100%',
                    padding: '1%',
                  },
                  styles.homeScreenCardContainer,
                ]}>
                <Image
                  source={{
                    uri:
                      item.image || 'https://www.example.com/default-image.jpg',
                  }}
                  style={{
                    width: '100%',
                    height: settings.CARD_WIDTH * 0.4,
                    borderRadius: 15,
                  }}
                />
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                  <Text style={{fontSize: 12, textAlign: 'center', margin: 10}}>
                    {item.title}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
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
  );
};

export default ContentInside;

const styles = StyleSheet.create({
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
  logo: {
    resizeMode: 'contain',
    alignSelf: 'center',
    width: 200,
    height: 70,
  },
  relatedContentContainer: {
    flexDirection: 'row',
    margin: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  relatedContentImageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  relatedContentImage: {
    width: settings.CARD_WIDTH * 0.4,
    height: settings.CARD_WIDTH * 0.4,
    borderRadius: 5,
    borderWidth: 0.5,
  },
  relatedContentTitle: {
    position: 'absolute',
    fontSize: 12,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    margin: 20,
  },
  homeScreenCardContainer: {
    borderWidth: 0.5,
    borderColor: '#f0f0f0',
    width: settings.CARD_WIDTH * 0.8,
    height: settings.CARD_WIDTH * 0.7,
    backgroundColor: 'white',
    borderRadius: 20,
    marginTop: 20,
    elevation: 4,
    shadowColor: '#00000040',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 4,
    alignItems: 'center',
    margin: 10,
  },
});
