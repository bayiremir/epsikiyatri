import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import Header from '../../components/Header';
import RenderHtml from 'react-native-render-html';
import {ArrowLeftIcon as ArrowLeftIconOutline} from 'react-native-heroicons/outline';

const BrainSignalScreen = () => {
  const navigation = useNavigation();
  const [content, setContent] = useState(null);
  const [newsContents, setNewsContents] = useState(null);

  useEffect(() => {
    const url =
      'https://yp.uskudar.dev/api/content/detail/3/psikiyatride-tedavi-yontemleri/tr?token=1';
    axios.get(url).then(response => {
      setContent(response.data.content);
      setNewsContents(response.data.content.contents);
    });
  }, []);
  const {width} = useWindowDimensions();
  return (
    <SafeAreaView>
      <ScrollView style={{backgroundColor: '#f0f0f0'}}>
        {content ? (
          <View>
            <Text
              style={{
                paddingTop: 20,
                fontSize: 20,
                fontWeight: 'bold',
                textAlign: 'center',
              }}>
              {content.title}
            </Text>
            <RenderHtml
              contentWidth={width}
              style={{fontSize: 20, fontWeight: '500'}}
              source={{html: content.post}}
            />
          </View>
        ) : (
          <Text>Loading Content...</Text>
        )}
        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
          {newsContents ? (
            newsContents.map((content, index) => (
              <TouchableOpacity
                key={index}
                style={styles.homeScreenCardContainer}
                onPress={() =>
                  navigation.navigate('ContentScreen', {slug: content.slug})
                }>
                <Image
                  source={{
                    uri:
                      content.image ||
                      'https://png.pngtree.com/png-vector/20190820/ourmid/pngtree-no-image-vector-illustration-isolated-png-image_1694547.jpg',
                  }}
                  style={{
                    width: '100%',
                    height: 100,
                    width: 200,
                    justifyContent: 'center',
                    borderRadius: 20,
                  }}
                />
                <Text
                  style={{
                    fontSize: 12,
                    textAlign: 'center',
                    fontWeight: '500',
                    marginTop: 10,
                  }}>
                  {content.title}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text>Loading News...</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BrainSignalScreen;

const styles = StyleSheet.create({
  homeScreenCardContainer: {
    borderWidth: 0.5,
    borderColor: '#f0f0f0',
    width: 200,
    height: 150,
    backgroundColor: 'white',
    borderRadius: 20,
    marginTop: 20,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#00000040',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 4,
    alignItems: 'center',
    margin: 5,
  },
});
