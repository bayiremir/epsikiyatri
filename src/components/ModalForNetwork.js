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
} from 'react-native';

const ModalForNetwork = () => {
  const [isMenuOpen, setMenuOpen] = React.useState(false);
  const [modalVisible, setModalVisible] = useState(false);
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
  return (
    <View>
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

          <View style={styles.modalView} onStartShouldSetResponder={() => true}>
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
    </View>
  );
};

export default ModalForNetwork;

const styles = StyleSheet.create({});

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
