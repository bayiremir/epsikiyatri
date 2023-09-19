import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import RenderHtml from 'react-native-render-html';
import { settings } from '../../utils/settings';
import { colors } from '../../utils/colors';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { ArrowLeftIcon as ArrowLeftIconOutline } from 'react-native-heroicons/outline';
import GoUp from '../../components/GoUp/GoUp';

const YazarDetail = ({ route }) => {
  const [isLoadingMore, setIsLoadingMore] = useState(false); // Yeni eklenen state
  const { slug } = route.params;
  const [yazar, setYazar] = useState(null);
  const { width } = useWindowDimensions();
  const animation = useRef(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [showFullText, setShowFullText] = useState(false);
  const [contents, setContents] = useState([]);
  const [page, setPage] = useState(1);
  const scrollViewRef = useRef();

  const halfwayIndex =
    yazar && yazar.resume ? Math.floor(yazar.resume.length / 2) : 0;
  const firstHalfHtml = yazar ? yazar.resume.substring(0, halfwayIndex) : '';
  const secondHalfHtml = yazar ? yazar.resume.substring(halfwayIndex) : '';

  const handleContentPress = contentSlug => {
    navigation.navigate('ContentScreen', { slug: contentSlug });
  };

  useEffect(() => {
    fetch(`https://yp.uskudar.dev/api/staff/detail/3/${slug}/tr?token=1`)
      .then(response => response.json())
      .then(data => {
        setYazar(data.staff);
        setLoading(false);
        loadContents();
      })
      .catch(error => console.error(error));
  }, [page, slug]);

  const loadContents = () => {
    fetch(
      `https://yp.uskudar.dev/api/staff/contents/3/${slug}?token=1&limit=16&page=${page}`,
    )
      .then(response => response.json())
      .then(data => {
        if (page === 1) {
          setContents(data.staff_contents);
        } else {
          setContents(prevContents => [
            ...prevContents,
            ...data.staff_contents,
          ]);
        }
        setIsLoadingMore(false); // Loading animasyonunu kaldır
      })
      .catch(error => console.error(error));
  };

  const handleLoadMore = () => {
    if (!isLoadingMore) {
      // Yeni yazılar yüklenirken tekrar tıklanamasın
      setIsLoadingMore(true); // Loading animasyonunu göster
      setPage(prevPage => prevPage + 1);
    }
  };

  useEffect(() => {
    if (page > 1) {
      // İlk sayfa değilse
      loadContents();
    }
  }, [page]);
  const HeaderHeight = Dimensions.get('screen').height * 0.3;

  return loading ? (
    <View style={styles.fullScreenContainer}>
      <LottieView
        autoPlay
        ref={animation}
        style={styles.fullScreenAnimation}
        source={require('../../../assets/photo/loading.json')}
      />
    </View>
  ) : (
    <View>
      <GoUp scrollViewRef={scrollViewRef}></GoUp>
      <ScrollView style={styles.container} ref={scrollViewRef}>
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
              <ArrowLeftIconOutline
                width={35}
                height={35}
                color="black"
              />
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
        <View style={{ alignItems: 'center' }}>
          <Image source={{ uri: yazar.image }} style={styles.yazarImage} />
        </View>
        <View style={{ padding: 20 }}>
          <Text style={styles.yazarName}>
            {yazar.title} {yazar.name} {yazar.surname}
          </Text>
          <Text style={styles.bioHeader}>Kısa Özgeçmiş</Text>
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
              h1: { paddingTop: 20, lineHeight: 32, fontSize: 22 },
              h2: { paddingTop: 20 },
              h3: { paddingTop: 20 },
              h4: { paddingTop: 20 },
              h5: { paddingTop: 20 },
              h6: { paddingTop: 20 },
            }}
            baseStyle={{ lineHeight: 18, color: 'black' }}
            source={{ html: showFullText ? yazar.resume : firstHalfHtml }}
          />

          {!showFullText && (
            <TouchableOpacity
              onPress={() => setShowFullText(true)}
              style={styles.readMoreButton}>
              <Text style={styles.readMoreText}>Devamı için tıklayın</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.yazarName}>
          {yazar.title} {yazar.name} {yazar.surname} yazıları
        </Text>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            paddingTop: 20,
            justifyContent: 'space-between',
          }}>
          {contents &&
            contents.map((content, index) => (
              <TouchableOpacity
                key={index}
                style={styles.homeScreenCardContainer}
                onPress={() => handleContentPress(content.slug)}>
                <Image
                  source={{
                    uri:
                      content.image ||
                      'https://png.pngtree.com/png-vector/20190820/ourmid/pngtree-no-image-vector-illustration-isolated-png-image_1694547.jpg',
                  }}
                  style={{
                    width: '100%',
                    width: settings.CARD_WIDTH * 0.9,
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
                    margin: 15,
                    color: 'black'  // Bu satır yazının rengini siyah yapar
                  }}>
                  {content.title}
                </Text>
              </TouchableOpacity>
            ))}
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              marginBottom: 50,
            }}>
            <TouchableOpacity
              onPress={handleLoadMore}
              style={styles.readMoreButton}
              disabled={isLoadingMore}>
              {isLoadingMore ? (
                <LottieView
                  autoPlay
                  style={{
                    width: settings.CARD_WIDTH / 3,
                    height: settings.CARD_WIDTH / 8,
                  }}
                  source={require('../../../assets/photo/loading.json')}
                />
              ) : (
                <Text style={styles.readMoreText}>
                  Yazıların devamı için tıklayın
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default YazarDetail;

const styles = StyleSheet.create({
  container: {},
  textStyle: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
    margin: 15,
    color: 'black'
  },
  yazarImage: {
    width: settings.CARD_WIDTH * 1.15,
    height: settings.CARD_WIDTH * 0.8,
    borderRadius: 20,
  },
  yazarName: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: "black",
  },
  bioHeader: {
    fontSize: 28,
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: "black",

  },
  yazarBio: {
    fontSize: 16,
    lineHeight: 24,
  },
  logo: {
    resizeMode: 'contain',
    alignSelf: 'center',
    paddingTop: 20,
    marginBottom: 24,
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
  readMoreButton: {
    padding: 10,
    backgroundColor: colors.darkPurple,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center', // Bu da merkezleme yardımcı olabilir
    width: Dimensions.get('window').width - 40, // Ekran genişliği kadar olacak
  },
  readMoreText: {
    color: 'white',
    fontWeight: 'bold',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  contentImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  contentTitle: {
    fontSize: 16,
    flex: 1,
    flexWrap: 'wrap',
  },
  homeScreenCardContainer: {
    borderWidth: 0.5,
    borderColor: '#f0f0f0',
    width: settings.CARD_WIDTH * 0.9,
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
});
