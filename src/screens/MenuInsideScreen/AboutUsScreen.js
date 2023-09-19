import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import Header from '../../components/Header';
import {settings} from '../../utils/settings';
import {useNavigation} from '@react-navigation/native';
import {ArrowLeftIcon as ArrowLeftIconOutline} from 'react-native-heroicons/outline';
import LinearGradient from 'react-native-linear-gradient';

const AboutUsScreen = () => {
  const navigation = useNavigation();
  const animation = useRef(null);
  const [medicalUnits, setMedicalUnits] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState([]);

  const toggleExpandCategory = categoryId => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  const filteredMedicalUnits = medicalUnits.filter(
    unit => unit.url !== '/iletisim',
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://yp.uskudar.dev/api/menus/3/tr?token=1',
        );
        const data = await response.json();
        console.log('API RESPONSE:', data);
        const menus = data.menus;

        // "Tıbbi Birimler" kategorisini bulma:
        const medicalUnitsCategory = menus.find(
          menu => menu.name === 'Tıbbi Birimler',
        );
        console.log('MEDICAL UNITS CATEGORY:', medicalUnitsCategory);

        if (medicalUnitsCategory) {
          setMedicalUnits(medicalUnitsCategory.children || []);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <Header>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginHorizontal: 10,
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeftIconOutline width={35} height={35} color="black" />
        </TouchableOpacity>
        <Image
          source={require('../../../assets/photo/logo.png')}
          style={{...styles.logo, alignSelf: 'center'}}
        />
        <View />
      </View>
      <View style={{flex: 1}}>
        <ScrollView>
          <View style={styles.mostReadHeaderContainer}>
            <LinearGradient
              colors={['rgba(64,183,176,1)', 'rgba(64,183,176,0.2)']}
              style={styles.rectangleContainer}>
              <Text style={styles.headerText}>Hakkımızda</Text>
            </LinearGradient>
          </View>
          {medicalUnits
            .filter(unit => unit.url !== '/iletisim')
            .map(unit => (
              <View key={unit.id} style={styles.homeScreenCardContainer}>
                <View style={styles.categoryItem}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('ContentScreen', {slug: unit.url})
                    }>
                    <View style={styles.categoryItemInnerContainer}>
                      <Text style={styles.categoryItemText}>{unit.name}</Text>
                      {unit.children && unit.children.length > 0 && (
                        <TouchableOpacity
                          onPress={() =>
                            toggleExpandCategory(unit.id)
                          }></TouchableOpacity>
                      )}
                    </View>
                  </TouchableOpacity>
                </View>
                {expandedCategories.includes(unit.id) &&
                  unit.children &&
                  unit.children.map(child => (
                    <TouchableOpacity key={child.id} style={{marginLeft: 20}}>
                      <Text style={styles.categoryItem}>{child.name}</Text>
                    </TouchableOpacity>
                  ))}
              </View>
            ))}
        </ScrollView>
      </View>
    </Header>
  );
};

export default AboutUsScreen;

const styles = StyleSheet.create({
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
    borderWidth: 0.3,
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#00000040',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 4,
    justifyContent: 'flex-start',
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 10,
  },
  categoryTitle: {
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 10,
    marginHorizontal: 10,
    color: 'black', // Geçici olarak siyah renk ekleyerek deneyin.
  },
  categoryItem: {
    margin: 5,
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
    color: 'black', // Geçici olarak siyah renk ekleyerek deneyin.
  },
  logo: {
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 80,
    marginRight: 30,
    marginBottom: 20,
  },
  categoryItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    fontSize: 18,
    backgroundColor: 'white',
    borderRadius: 8,
    color: 'black', // Geçici olarak siyah renk ekleyerek deneyin.
  },
  mostReadHeaderContainer: {
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  rectangleContainer: {
    height: settings.CARD_WIDTH * 0.2,
    width: settings.CARD_WIDTH * 1.8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  unitItem: {
    marginBottom: 10,
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  unitItemText: {
    fontSize: 18,
    color: 'black', // Geçici olarak siyah renk ekleyerek deneyin.
  },
  childItemContainer: {
    marginLeft: 20,
    marginBottom: 10,
    padding: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  },
  childItemText: {
    fontSize: 16,
    color: 'black', // Geçici olarak siyah renk ekleyerek deneyin.
  },
  fullScreenContainer: {
    backgroundColor: 'white',
    alignItems: 'center',
  },
  fullScreenAnimation: {
    width: settings.CARD_WIDTH,
    height: settings.CARD_WIDTH,
  },
});
