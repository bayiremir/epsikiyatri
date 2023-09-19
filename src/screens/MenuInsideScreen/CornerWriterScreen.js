import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {settings} from '../../utils/settings';
import {Divider} from 'react-native-paper';
import dateformat from 'dateformat';
import {colors} from '../../utils/colors';
import {useNavigation} from '@react-navigation/native';
import Header from '../../components/Header';
import {ArrowLeftIcon as ArrowLeftIconOutline} from 'react-native-heroicons/outline';
import LinearGradient from 'react-native-linear-gradient';

const LastNewScreen = () => {
  const [mostRead, setMostRead] = useState([]);
  const navigation = useNavigation();

  const turkishMonths = [
    'Ocak',
    'Şubat',
    'Mart',
    'Nisan',
    'Mayıs',
    'Haziran',
    'Temmuz',
    'Ağustosz',
    'Eylül',
    'Ekim',
    'Kasım',
    'Aralık',
  ];

  const formatDateToTurkish = dateString => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = turkishMonths[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  };

  const apiUrlMostRead =
    'https://yp.uskudar.dev/api/content/staff/3/tr?token=1';

  useEffect(() => {
    fetch(apiUrlMostRead)
      .then(response => response.json())
      .then(data => {
        setMostRead(data.contents);
      })
      .catch(error => console.error(error));
  }, []);

  const handleItemPress = slug => {
    const cleanSlug = slug.replace('https://e-psikiyatri.com/', '');
    navigation.navigate('ContentScreen', {slug: cleanSlug});
  };

  const renderMostReadItem = ({item}) => (
    <TouchableOpacity onPress={() => handleItemPress(item.slug)}>
      <View style={styles.mostReadItem}>
        <Image source={{uri: item.image}} style={styles.mostReadImage} />
        <View style={{paddingLeft: 10}}>
          <Text style={styles.mostReadText}>{item.title}</Text>
          <Text style={styles.updateText}>
            {formatDateToTurkish(item.updated_at)}
          </Text>
          <Text style={styles.updateText}>
            {item.staff.name} {item.staff.surname}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{flex: 1}}>
      <Header>
        <ScrollView>
          <TouchableOpacity
            style={{paddingTop: 40, paddingBottom: 20, paddingLeft: 20}}
            onPress={() => navigation.goBack()}>
            <ArrowLeftIconOutline width={35} height={35} color="black" />
          </TouchableOpacity>
          <View>
            <Image
              source={require('../../../assets/photo/logo.png')}
              style={styles.logo}
            />
          </View>
          <View style={{marginHorizontal: 20}}>
            <View style={styles.homeScreenCardContainer}>
              <View style={styles.rectangleContainer}>
                <View style={styles.headerContainer}>
                  <LinearGradient
                    colors={['rgba(64,183,176,1)', 'rgba(64,183,176,0.2)']}
                    style={styles.rectangleContainer}>
                    <Text style={styles.headerText}>Köşe Yazarları</Text>
                  </LinearGradient>
                </View>
              </View>
              {mostRead.map((item, index) => (
                <View
                  key={index.toString()}
                  style={{borderRadius: 20, overflow: 'hidden'}}>
                  {renderMostReadItem({item})}
                  <Divider />
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </Header>
    </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    resizeMode: 'contain',
    alignSelf: 'center',
    paddingTop: 20,
    marginBottom: 24,
  },
  mostReadHeaderContainer: {
    borderRadius: 10,
    marginHorizontal: 20,
  },
  rectangleContainer: {
    width: settings.CARD_WIDTH * 1.795,
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
  homeScreenCardContainer: {
    width: settings.CARD_WIDTH * 1.8,
    marginBottom: 30,
    borderWidth: 0.3,
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#00000040',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 4,
    justifyContent: 'flex-start',
    paddingBottom: 1,
  },
  mostReadItem: {
    width: settings.CARD_WIDTH * 1.6,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    padding: 10,
    borderRadius: 200,
    backgroundColor: 'white',
  },
  mostReadImage: {
    borderRadius: 20,
    borderWidth: 0.2,
    borderColor: 'black',
    width: 120,
    height: 60,
  },
  mostReadText: {
    flex: 1,
    width: '50%',
    color:"black",
    paddingBottom: 10,
  },
  updateText: {
    fontSize: 10,
    alignItems: 'flex-start',
    color: colors.darkPink,
  },
  viewAllContainer: {
    paddingBottom: 40,
    alignItems: 'center',
    marginVertical: 20,
  },
  viewAllButton: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  viewAllText: {
    color: 'white',
    fontWeight: 'bold',
  },
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
});

export default LastNewScreen;
