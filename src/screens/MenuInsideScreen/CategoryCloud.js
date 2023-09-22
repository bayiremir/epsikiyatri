import React, {useState, useEffect} from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Text,
} from 'react-native';
import {settings} from '../../utils/settings';
import {colors} from '../../utils/colors';
import {useNavigation} from '@react-navigation/native';
import Header from '../../components/Header';
import {ArrowLeftIcon as ArrowLeftIconOutline} from 'react-native-heroicons/outline';
import LinearGradient from 'react-native-linear-gradient';
import cloudData from '../../utils/cloud.json';
import cloudIcon from '../../../assets/cloud-sketched-shape.png';

const CategoryCloud = () => {
  const [mostRead, setMostRead] = useState([]);
  const navigation = useNavigation();

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

  return (
    <View style={{flex: 1}}>
      <Header>
        <TouchableOpacity
          style={{paddingTop: 60, paddingBottom: 20, paddingLeft: 20}}
          onPress={() => navigation.goBack()}>
          <ArrowLeftIconOutline width={35} height={35} color="black" />
        </TouchableOpacity>

        <View>
          <Image
            source={require('../../../assets/photo/logo.png')}
            style={styles.logo}
          />
        </View>
        <View style={styles.rectangleContainer}>
          <View style={styles.headerContainer}>
            <LinearGradient
              colors={['rgba(64,183,176,1)', 'rgba(64,183,176,0.2)']}
              style={styles.rectangleContainer}>
              <Text style={styles.headerText}>Kategori Bulutu</Text>
            </LinearGradient>
          </View>
        </View>

        <FlatList
          data={cloudData}
          keyExtractor={item => item.slug}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.cloudItemContainer}
              onPress={() => handleItemPress(item.slug)}>
              <Text style={styles.cloudText}>{item.text}</Text>
            </TouchableOpacity>
          )}
          numColumns={3}
          horizontal={false}
        />
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
  rectangleContainer: {
    width: settings.CARD_WIDTH * 1.795,
    height: settings.CARD_WIDTH * 0.18,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 30,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  cloudItemContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
    margin: 5,
    borderRadius: 5,
    backgroundColor: colors.lightGray,
    width: '30%',
  },
  cloudIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginBottom: 5,
  },
  cloudText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#B04D4D',
    textAlign: 'center',
    backgroundColor: 'rgba(253,232,232,0.8)',
    padding: 10,
  },
});

export default CategoryCloud;
