import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Dimensions,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import {settings} from '../../utils/settings';
import dateformat from 'dateformat';
import {useNavigation} from '@react-navigation/native';
import {
  Bars3Icon as Bars3IconOutline,
  Squares2X2Icon as Squares2X2IconOutline,
  Square3Stack3DIcon as Square3Stack3DIconOutline,
} from 'react-native-heroicons/outline';

const LastNewScreen = () => {
  const [mostRead, setMostRead] = useState([]);
  const [isAlternateLayout, setIsAlternateLayout] = useState(true);

  const navigation = useNavigation();

  const apiUrlMostRead =
    'https://yp.uskudar.dev/api/content/last/3/tr?token=1&page=1&limit=15&tag_id=216';

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

  const renderMostReadItem = ({item}) => {
    const formattedDate = dateformat(item.updated_at, 'dd/mm/yyyy');

    if (isAlternateLayout) {
      return (
        <View>
          <Pressable
            onPress={() => handleItemPress(item.slug)}
            style={
              isAlternateLayout
                ? styles.alternatePressableContainer
                : styles.pressableContainer
            }>
            {isAlternateLayout ? (
              <>
                <Text style={styles.alternateTitleText}>{item.title}</Text>
                <Image
                  source={{uri: item.image}}
                  style={styles.alternateImage}
                />
              </>
            ) : (
              <View style={styles.mostReadItem}>
                <Image
                  source={{uri: item.image}}
                  style={styles.mostReadImage}
                />
                <Text style={styles.titleBottomText}>{item.title}</Text>
              </View>
            )}
          </Pressable>
          <View style={styles.divider}></View>
        </View>
      );
    }

    return (
      <Pressable
        onPress={() => handleItemPress(item.slug)}
        style={styles.pressableContainer} // Ekledim
      >
        <View style={styles.mostReadItem}>
          <Image source={{uri: item.image}} style={styles.mostReadImage} />
          <Text style={styles.titleBottomText}>{item.title}</Text>
        </View>
      </Pressable>
    );
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <View>
        <View style={{marginHorizontal: 0}}>
          <View style={styles.featuredNewsContainer}>
            <View style={styles.featuredNewsTextContainer}>
              <View style={styles.featuredNewsWithIcon}>
                <Text style={styles.featuredNewsText}>En Son Haberler</Text>
                <View style={{marginLeft: 'auto'}}>
                  {isAlternateLayout ? (
                    <TouchableOpacity
                      onPress={() => setIsAlternateLayout(!isAlternateLayout)}>
                      <Square3Stack3DIconOutline
                        style={styles.listIcon}
                        color="black"
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => setIsAlternateLayout(!isAlternateLayout)}>
                      <Squares2X2IconOutline
                        style={styles.listIcon}
                        name="list"
                        size={24}
                        color="black"
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              <View style={styles.featuredNewsLine}></View>
            </View>
          </View>
          <ScrollView
            horizontal={false}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{width: 'auto'}}>
            {mostRead.map((item, index) => (
              <View key={index.toString()} style={{overflow: 'hidden'}}>
                {renderMostReadItem({item})}
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mostReadImage: {
    height: settings.CARD_WIDTH,
    width: settings.CARD_WIDTH * 1.8,
    margin: 10,
  },
  mostReadItem: {
    alignItems: 'center',
  },
  featuredNewsContainer: {
    marginBottom: 30,
  },
  featuredNewsTextContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    position: 'relative',
    backgroundColor: 'rgba(64,183,176,0.3)',
  },
  featuredNewsWithIcon: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
  },
  featuredNewsText: {
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 20,
    marginTop: 10,
    color: '#ec5051',
  },
  listIcon: {
    position: 'absolute',
    right: 20,
    top: 10,
  },
  featuredNewsLine: {
    height: 3,
    width: '32%',
    backgroundColor: '#952323',
    alignSelf: 'flex-start',
    marginLeft: 20,
    marginBottom: 10,
    marginTop: 5,
  },
  pressableContainer: {
    backgroundColor: 'white',
    width: '100%',
    height: settings.CARD_WIDTH * 1.4,
    marginBottom: 10,
  },
  alternatePressableContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
  },
  alternateImage: {
    width: settings.CARD_WIDTH * 0.6,
    height: settings.CARD_WIDTH / 3,
    marginRight: 10,
  },
  alternateTitleText: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  divider: {
    height: 0.5,
    backgroundColor: 'black',
    width: '100%', // to make sure it takes the full width
  },
  titleBottomText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default LastNewScreen;
