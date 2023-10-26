import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  FlatList,
  Image,
  RefreshControl,
  Dimensions,
  StyleSheet,
  Text,
  Modal,
  Pressable,
  ScrollView,
  PanResponder,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {Divider} from 'react-native-paper';
import {settings} from '../utils/settings';
import {colors} from '../utils/colors';
import dateformat from 'dateformat';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {Linking} from 'react-native';
import {useGetContentQuery} from '../redux/slices/HomeScreenSlices';
import AdultPsychiatry from './HomeScreenDetailPage/AdultPsychiatry';
import LastNewScreen from './HomeScreenDetailPage/LastNewsScreen';
import RandevuAl from '../components/RandevuAl/RandevuAl';
import GoUp from '../components/GoUp/GoUp';
import LinearGradient from 'react-native-linear-gradient';
import {
  Bars3Icon as Bars3IconOutline,
  Squares2X2Icon as Squares2X2IconOutline,
} from 'react-native-heroicons/outline';
import NetInfo from '@react-native-community/netinfo';

const HomeScreen = ({navigation}) => {
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

  const [activeSlide, setActiveSlide] = useState(0);
  const flatListRef = useRef(null);
  const scrollViewRef = useRef();
  const [refreshing, setRefreshing] = useState(false);

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

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  });

  const handleViewableItemsChanged = useRef(({viewableItems}) => {
    setActiveSlide(viewableItems[0].index);
  });
  const {width, height} = Dimensions.get('window');

  const animation = useRef(null);

  if (isLoading) {
    return (
      <View style={styles.animationContainer}>
        <LottieView
          autoPlay
          ref={animation}
          style={{
            height: settings.CARD_WIDTH,
            width: settings.CARD_WIDTH * 2,
          }}
          source={require('../../assets/photo/loading.json')}
        />
      </View>
    );
  }
  if (isError) return <Text>Error</Text>;

  const renderItem = ({item}) => (
    <Pressable
      onPress={() => {
        const slug = item.slug.replace('https://e-psikiyatri.com/', '');
        navigation.navigate('ContentScreen', {slug: slug});
      }}>
      <View style={styles.sliderContainer}>
        <Image source={{uri: item.image}} style={styles.sliderImage} />
        <View style={styles.titleContainer}>
          <Text style={styles.titleInsideImage}>{item.title}</Text>
        </View>
      </View>
    </Pressable>
  );

  const renderMostReadItem = ({item}) => {
    const formattedDate = dateformat(item.updated_at, 'dd/mm/yyyy');

    return (
      <Pressable
        onPress={() => {
          const slug = item.slug.replace('https://e-psikiyatri.com/', '');
          navigation.navigate('ContentScreen', {slug: slug});
        }}>
        <View style={styles.mostReadItem}>
          <Image source={{uri: item.image}} style={styles.mostReadImage} />
          <LinearGradient
            colors={['transparent', 'black']}
            style={styles.titleBottomContainer}>
            <Text
              style={styles.titleBottomText}
              numberOfLines={3}
              ellipsizeMode="tail">
              {item.title}
            </Text>
          </LinearGradient>
          <View style={{paddingLeft: 10}}></View>
        </View>
      </Pressable>
    );
  };

  const {data, isLoading, isError, refetch} = useGetContentQuery();

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    refetch().then(() => {
      setRefreshing(false);
    });
  }, []);
  const sliders = data ? data.contents.slice(0, 3) : [];
  const mostRead = data ? data.contents.slice(3) : [];

  useEffect(() => {
    const timer = setInterval(() => {
      if (sliders && sliders.length > 0) {
        let nextSlide = activeSlide + 1;
        if (nextSlide >= sliders.length) nextSlide = 0;
        setActiveSlide(nextSlide);

        flatListRef.current?.scrollToIndex({
          animated: true,
          index: nextSlide,
        });
      }
    }, 3000);

    return () => {
      clearInterval(timer);
    };
  }, [activeSlide, sliders]);

  const [isMenuOpen, setMenuOpen] = React.useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) {
      setMenuOpen(false);
    }
  }, [isFocused]);

  const [isConnected, setIsConnected] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);
      setIsConnected(state.isConnected);

      if (!state.isConnected) {
        setModalVisible(true);
      } else {
        // Reload your content here if reconnected
        setModalVisible(false);
      }
    });

    return () => {
      // Unsubscribe
      unsubscribe();
    };
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: '#f3f3f3'}}>
      <RandevuAl />
      <GoUp scrollViewRef={scrollViewRef} />

      <ScrollView
        style={{marginBottom: 50, flex: 1}}
        ref={scrollViewRef}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
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
        <View>
          <FlatList
            data={sliders}
            ref={flatListRef}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={handleViewableItemsChanged.current}
            viewabilityConfig={viewabilityConfig.current}
          />
          <View style={styles.dotContainer}>
            {sliders.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  {
                    backgroundColor: index === activeSlide ? 'black' : 'gray', // use gray for non-active slides
                  },
                ]}
              />
            ))}
          </View>
        </View>

        <View style={{}}>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{width: 'auto'}}>
            {mostRead.map((item, index) => (
              <View
                key={index.toString()}
                style={{borderRadius: 20, overflow: 'hidden'}}>
                {renderMostReadItem({item})}
              </View>
            ))}
          </ScrollView>
        </View>
        <Modal animationType="fade" transparent={true} visible={modalVisible}>
          <View style={styles.centeredView}>
            <View style={styles.modalViews}>
              <Text style={styles.modalText}>
                İnternet bağlantınızı kontrol edin
              </Text>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.textStyle}>Tamam</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
                ItemSeparatorComponent={() => <Divider />}
              />

              <View>
                <Text style={{textAlign: 'center'}}>Versiyon 1.0.0</Text>
              </View>
            </View>
          </View>
        </Modal>

        <AdultPsychiatry />
        <LastNewScreen />
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  logo: {
    resizeMode: 'contain',
    alignSelf: 'center',
    width: settings.CARD_WIDTH,
  },
  menuIcon: {
    position: 'absolute',
    top: 60,
    left: 20,
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
  logoContainer: {
    width: '100%',
    height: settings.CARD_WIDTH / 1.9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingTop: 40,
  },
  sliderContainer: {
    overflow: 'hidden',
  },
  sliderImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 3,
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
    padding: 5,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  titleInsideImage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  mainContainer: {
    backgroundColor: '#ECF7FF',
    flex: 1,
  },
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  mostReadImage: {
    width: settings.CARD_WIDTH / 1.2,
    height: settings.CARD_WIDTH * 1.2,
  },
  mostReadItem: {
    alignItems: 'center',
    margin: 5,
    marginBottom: 5,
  },
  rectangleContainer: {
    width: settings.CARD_WIDTH * 1.8,
    height: settings.CARD_WIDTH * 0.18,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  updateText: {
    paddingTop: 10,
    color: colors.darkPink,
    fontSize: 10,
    textAlign: 'left',
    alignItems: 'flex-end',
  },
  animationContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 2,
    backgroundColor: 'gray',
  },
  titleBottomContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 5,
  },
  titleBottomText: {
    fontSize: 21,
    fontWeight: 'bold',
    color: 'white',
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // Arka planı karart
  },
  modalViews: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
  },
  button: {
    borderRadius: 10,
    marginTop: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 5,
    textAlign: 'center',
  },
});
