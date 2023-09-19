import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { settings } from '../../utils/settings';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeftIcon as ArrowLeftIconOutline } from 'react-native-heroicons/outline';
import LinearGradient from 'react-native-linear-gradient';

const MedicalUnits = () => {
  const navigation = useNavigation();

  const [medicalUnits, setMedicalUnits] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState([]);

  const toggleExpandCategory = categoryId => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  useEffect(() => {
    fetch('https://yp.uskudar.dev/api/menus/3/tr?token=1')
      .then(response => response.json())
      .then(data => {
        const menus = data.menus;
        const medicalCategory = menus.find(
          menu => menu.name === 'Tıbbi Birimler',
        );
        if (medicalCategory) {
          setMedicalUnits(medicalCategory.children || []);
        }
      })
      .catch(error => console.error(error));
  }, []);

  return (
    <View>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../../assets/photo/logo.png')}
          style={styles.logo}
        />
        <TouchableOpacity
          style={styles.menuIcon}
          onPress={() => navigation.goBack()}>
          <ArrowLeftIconOutline width={35}
            height={35}
            color="black" />
        </TouchableOpacity>
      </View>
      <ScrollView style={{ marginBottom: 50 }}>
        <View style={styles.mostReadHeaderContainer}>
          <LinearGradient
            colors={['rgba(64,183,176,1)', 'rgba(64,183,176,0.2)']}
            style={styles.rectangleContainer}>
            <Text style={styles.headerText}>Tıbbi Birimler</Text>
          </LinearGradient>
        </View>
        {medicalUnits.map(unit => (
          <View key={unit.id} style={styles.homeScreenCardContainer}>
            <View style={styles.categoryItem}>
              <TouchableOpacity onPress={() => toggleExpandCategory(unit.id)}>
                <View style={styles.categoryItemInnerContainer}>
                  <Text style={styles.categoryItemText}>{unit.name}</Text>
                  {unit.children && unit.children.length > 0 && (
                    <View name="angle-down" size={24} color="black" />
                  )}
                </View>
              </TouchableOpacity>
            </View>
            {expandedCategories.includes(unit.id) &&
              unit.children &&
              unit.children.map(child => (
                <TouchableOpacity
                  key={child.id}
                  style={{ marginLeft: 20 }}
                  onPress={() =>
                    navigation.navigate('ContentScreen', { slug: child.url })
                  }>
                  <Text style={styles.categoryItem}>{child.name}</Text>
                </TouchableOpacity>
              ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default MedicalUnits;

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
    marginBottom: 10,
    borderWidth: 0.3,
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#00000040',
    shadowOffset: { width: 0, height: 4 },
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
    color:"black",
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
    color:"black",
  },
  logo: {
    resizeMode: 'contain',
    alignSelf: 'center',
    width: 200,
    height: 100,
    marginTop: 30,
  },
  menuIcon: {
    position: 'absolute',
    left: 0,
    top: 60,
    left: 20,
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
    color:"black",
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
  },
});
