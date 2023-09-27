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
  Linking,
} from 'react-native';
import {settings} from '../utils/settings';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import RandevuAl from '../components/RandevuAl/RandevuAl';
import LinearGradient from 'react-native-linear-gradient';
import {
  Bars3Icon as Bars3IconOutline,
  MagnifyingGlassIcon as MagnifyingGlassIconOutline,
} from 'react-native-heroicons/outline';

const CategoryScreen = () => {
  const [categories, setCategories] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState([]);
  const navigation = useNavigation();
  const [isMenuOpen, setMenuOpen] = React.useState(false);
  const isFocused = useIsFocused();

  const navigateToContent = slug => {
    navigation.navigate('ContentScreen', {slug});
  };

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

  const toggleExpandCategory = categoryId => {
    setActiveCategory(prev => (prev === categoryId ? null : categoryId));
    if (expandedCategories.includes(categoryId)) {
      setExpandedCategories(prev => prev.filter(id => id !== categoryId));
    } else {
      setExpandedCategories(prev => [...prev, categoryId]);
    }
  };

  useEffect(() => {
    fetch('https://yp.uskudar.dev/api/content/detail/3/kategoriler/tr?token=1')
      .then(response => response.json())
      .then(data => {
        const departments = data.content.departments;

        const groupedCategories = departments.reduce((acc, cat) => {
          const firstLetter = cat.name.charAt(0).toUpperCase();
          if (!acc[firstLetter]) {
            acc[firstLetter] = [];
          }
          acc[firstLetter].push(cat);
          return acc;
        }, {});

        const sortedCategories = Object.keys(groupedCategories)
          .sort()
          .reduce((acc, key) => {
            acc[key] = groupedCategories[key];
            return acc;
          }, {});

        setCategories(sortedCategories);
      })
      .catch(error => console.error(error));
  }, []);

  const filteredCategories = searchText
    ? Object.keys(categories).reduce((acc, key) => {
        categories[key].forEach(cat => {
          if (
            cat.name.toLowerCase().includes(searchText.toLowerCase()) ||
            (cat.children &&
              cat.children.some(child =>
                child.name.toLowerCase().includes(searchText.toLowerCase()),
              ))
          ) {
            if (!acc[key]) {
              acc[key] = [];
            }
            acc[key].push(cat);
          }
        });
        return acc;
      }, {})
    : categories;

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
    ];

  return (
    <View style={{flex: 1}}>
      <RandevuAl />
      <View style={{flex: 1, marginBottom: 50}}>
        <ScrollView>
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
              <Text style={styles.headerText}>Kategoriler</Text>
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
                placeholder="Aramak istediğiniz kategorinin adını yazınız..."
                onChangeText={text => setSearchText(text)}
              />
            </View>
          </View>
          {Object.keys(filteredCategories).map(key => (
            <View key={key} style={styles.homeScreenCardContainer}>
              <Text style={styles.categoryTitle}>{key}</Text>
              {filteredCategories[key].map(cat => (
                <View key={cat.id}>
                  <TouchableOpacity
                    onPress={() => {
                      if (cat.children && cat.children.length > 0) {
                        toggleExpandCategory(cat.id);
                      } else {
                        navigateToContent(cat.url);
                      }
                    }}
                    style={styles.categoryItem}>
                    <View style={styles.categoryItemInnerContainer}>
                      <Text style={styles.categoryItemText}>{cat.name}</Text>
                      {cat.children && cat.children.length > 0 && (
                        <View
                          name={
                            expandedCategories.includes(cat.id)
                              ? 'angle-up'
                              : 'angle-down'
                          }
                          size={24}
                          color="black"
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                  {expandedCategories.includes(cat.id) && cat.children && (
                    <View>
                      <TouchableOpacity
                        onPress={() => navigateToContent(cat.url)}
                        style={{marginLeft: 20}}>
                        <Text style={styles.categoryItem}>{cat.name}</Text>
                      </TouchableOpacity>
                      {cat.children.map(child => (
                        <TouchableOpacity
                          key={child.id}
                          onPress={() => navigateToContent(child.url)}
                          style={{marginLeft: 40}}>
                          <Text style={styles.categoryItem}>{child.name}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </View>
          ))}
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
                        <Text>{item.text}</Text>
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
    </View>
  );
};
export default CategoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  homeScreenCardContainer: {
    width: settings.CARD_WIDTH * 1.9,
    marginBottom: 10,
    borderWidth: 0.3,
    backgroundColor: 'white',
    borderRadius: 4,
    elevation: 3,
    shadowColor: '#00000040',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 4,
    justifyContent: 'flex-start',
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 10,
    borderColor: 'black',
  },
  categoryTitle: {
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 10,
    marginHorizontal: 10,
    color: 'black',
  },
  categoryItem: {
    marginBottom: 10,
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#f0f0f0',
  },
  categoryItemInnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryItemText: {
    fontSize: 18,
    color: 'black',
  },
  logo: {
    resizeMode: 'contain',
    alignSelf: 'center',
    width: settings.CARD_WIDTH,
  },
  categoryItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    fontSize: 18,
    backgroundColor: 'white',
    borderRadius: 8,
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
