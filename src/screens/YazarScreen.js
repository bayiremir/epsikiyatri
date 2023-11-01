import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  PanResponder,
  FlatList,
  Divider,
} from 'react-native';
import {settings} from '../utils/settings';
import RandevuAl from '../components/RandevuAl/RandevuAl';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {
  Bars3Icon as Bars3IconOutline,
  MagnifyingGlassIcon as MagnifyingGlassIconOutline,
} from 'react-native-heroicons/outline';

const YazarScreen = ({navigation}) => {
  const [isMenuOpen, setMenuOpen] = React.useState(false);
  const isFocused = useIsFocused();
  const [yazarlar, setYazarlar] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(0);

  const ITEMS_PER_PAGE = 10;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderRelease: (e, gestureState) => {
        if (gestureState.dx < -50) {
          setMenuOpen(false);
        }
      },
    }),
  ).current;

  useEffect(() => {
    if (!isFocused) {
      setMenuOpen(false);
    }
  }, [isFocused]);

  const menuData = [
    {
      text: 'Tıbbi Birimler',
      icon: require('../../assets/photo/icons/care.png'),
      screen: 'MedicalUnits',
    },
    {
      text: 'Psikolojik Testler',
      icon: require('../../assets/photo/icons/quiz.png'),
      screen: 'QuizScreen',
    },
    {
      text: 'Hakkımızda',
      slug: '/hakimizda',
      icon: require('../../assets/photo/icons/info.png'),
      screen: 'AboutUsScreen',
    },
    {
      text: 'Gen Temelli Tedaviler',
      icon: require('../../assets/photo/icons/gene.png'),
      screen: 'GeneticCounseling',
    },
    {
      text: 'Yayınlarımız',
      icon: require('../../assets/photo/icons/publication.png'),
      screen: 'OurPublications',
    },
    {
      text: 'Sosyal Sorumluluk Projeleri',
      icon: require('../../assets/photo/icons/worldwide.png'),
      screen: 'SocialProjectScreen',
    },
    {
      text: 'Online Randevu',
      icon: require('../../assets/photo/icons/paper-plane.png'),
      url: 'https://online.npistanbul.com/login',
    },
    {
      text: 'Köşe Yazarları',
      icon: require('../../assets/photo/icons/content-writing.png'),
      screen: 'CornerWriterScreen',
    },
    {
      text: 'Kategori Bulutu',
      icon: require('../../assets/photo/icons/cloud.png'),
      screen: 'CategoryCloud',
    },
    {
      text: 'Bildirim Ayarları',
      icon: require('../../assets/photo/icons/alarm.png'),
      screen: 'NotificationSettings',
    },
  ];

  useEffect(() => {
    fetch('https://yp.uskudar.dev/api/content/detail/3/yazarlar/tr?token=1')
      .then(response => response.json())
      .then(data => {
        setYazarlar(data.content.staffs);
      })
      .catch(error => console.error(error));
  }, []);

  const renderYazar = ({item}) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('YazarDetail', {slug: item.slug});
      }}>
      <View style={styles.homeScreenCardContainer}>
        <Image source={{uri: item.image}} style={styles.yazarImage} />
        <Text style={styles.yazarName}>
          {item.title} {item.name} {item.surname}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const normalizeText = text => {
    return text
      .toLowerCase()
      .replace(/ğ/gim, 'g')
      .replace(/ü/gim, 'u')
      .replace(/ş/gim, 's')
      .replace(/ı/gim, 'i')
      .replace(/ö/gim, 'o')
      .replace(/ç/gim, 'c');
  };

  const loadMore = () => {
    setCurrentPage(currentPage + 1);
  };

  const filteredYazarlar = searchText
    ? yazarlar
        .filter(yazar => {
          const fullName = `${yazar.title} ${yazar.name} ${yazar.surname}`;
          return normalizeText(fullName).includes(normalizeText(searchText));
        })
        .slice(0, (currentPage + 1) * ITEMS_PER_PAGE) // Sayfa sayısına göre dilimleme
    : yazarlar.slice(0, (currentPage + 1) * ITEMS_PER_PAGE);

  return (
    <>
      <RandevuAl />
      <View style={{flex: 1, marginBottom: 80}}>
        <ScrollView style={styles.container}>
          <View style={styles.logoContainer}>
            <TouchableOpacity
              style={{
                position: 'absolute',
                left: 20,
                paddingTop: 40,
              }}
              onPress={() => setMenuOpen(true)}>
              <Bars3IconOutline color="black" width={30} height={30} />
            </TouchableOpacity>
            <Image
              source={require('../../assets/photo/logo.png')}
              style={styles.logo}
            />
          </View>
          <View style={styles.mostReadHeaderContainer}>
            <LinearGradient
              colors={['rgba(64,183,176,1)', 'rgba(64,183,176,0.2)']}
              start={{x: 0, y: 0}}
              end={{x: 1.4, y: 0}}
              style={styles.rectangleContainer}>
              <Text style={styles.headerText}>Yazarlar</Text>
            </LinearGradient>
          </View>
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <MagnifyingGlassIconOutline
                width={25}
                height={20}
                left={3}
                color="black"
              />
              <TextInput
                style={styles.searchInput}
                placeholderTextColor={'black'}
                placeholder="Aramak istediğiniz yazarı yazınız..."
                onChangeText={text => setSearchText(text)}
              />
            </View>
          </View>
          <View style={styles.flatListContainer}>
            <FlatList
              data={filteredYazarlar}
              renderItem={renderYazar}
              keyExtractor={item => item.id.toString()}
              numColumns={2}
              contentContainerStyle={styles.flatListContent}
              scrollEnabled={false}
            />
          </View>
          <TouchableOpacity onPress={loadMore} style={styles.loadMoreButton}>
            <Text style={styles.loadMoreText}>Daha Fazla Yükle</Text>
          </TouchableOpacity>
          <Modal
            animationType="fade"
            transparent={true}
            visible={isMenuOpen}
            onRequestClose={() => {
              setMenuOpen(!isMenuOpen);
            }}>
            <View style={styles.container}>
              <TouchableOpacity
                style={styles.closeArea}
                onPress={() => setMenuOpen(false)}></TouchableOpacity>

              <View
                style={styles.modalView}
                onStartShouldSetResponder={() => true}>
                <Image
                  source={require('../../assets/photo/logo.png')}
                  style={styles.logo}
                />

                <View
                  {...panResponder.panHandlers}
                  style={styles.draggableArea}></View>

                <FlatList
                  data={menuData}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      onPress={() => {
                        if (item.url) {
                          Linking.openURL(item.url);
                        } else if (item.screen) {
                          navigation.navigate(item.screen, {slug: item.slug});
                        }
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          padding: 15,
                        }}>
                        <Image
                          source={item.icon}
                          style={{width: 30, height: 30, marginRight: 15}}
                        />
                        <Text style={{color: 'black'}}>{item.text}</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  ItemSeparatorComponent={() => (
                    <View style={{height: 1, backgroundColor: '#E0E0E0'}} />
                  )}
                />

                <View>
                  <Text style={{textAlign: 'center'}}>Versiyon 0.1</Text>
                </View>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </View>
    </>
  );
};

export default YazarScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  closeArea: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    width: '75%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  mostReadHeaderContainer: {
    borderRadius: 10,
    marginHorizontal: 10,
    marginTop: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  rectangleContainer: {
    height: settings.CARD_WIDTH * 0.2,
    width: settings.CARD_WIDTH * 1.9,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  logo: {
    resizeMode: 'contain',
    alignSelf: 'center',
    width: settings.CARD_WIDTH,
  },
  flatListContent: {
    padding: 10,
  },
  homeScreenCardContainer: {
    width: settings.CARD_WIDTH * 0.9,
    height: settings.CARD_WIDTH * 1,
    marginLeft: 10,
    marginBottom: 10,
    borderRadius: 20,
    backgroundColor: 'white',
    padding: 15,
    alignItems: 'center',
  },
  yazarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  yazarName: {
    paddingTop: 20,
    color: '#DA5169',
    fontSize: 16,
    textAlign: 'center',
  },
  searchContainer: {
    margin: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    width: settings.CARD_WIDTH * 1.85,
  },
  searchInput: {
    padding: 10,
    flex: 1,
  },
  loadMoreButton: {
    backgroundColor: 'rgba(64,183,176,0.7)',
    padding: 10,
    margin: 20,
    alignItems: 'center',
    borderRadius: 8,
  },
  loadMoreText: {
    color: 'white',
    fontSize: 16,
  },
  flatListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  flatListContent: {
    alignItems: 'center',
  },
  menuIcon: {
    position: 'absolute',
    top: 60,
    left: 20,
  },
  logoContainer: {
    width: '100%',
    height: settings.CARD_WIDTH / 1.9,
    flexDirection: 'row', // elemanları yatay olarak sıralamak için
    alignItems: 'center', // elemanları dikey olarak merkeze hizalamak için
    justifyContent: 'center',
    backgroundColor: 'rgba(64,183,176,0.3)',
    paddingTop: 40,
  },
});
