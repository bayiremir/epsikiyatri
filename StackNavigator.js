import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Dimensions, Text, View, StyleSheet} from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import MenuScreen from './src/screens/MenuScreen';
import YazarScreen from './src/screens/YazarScreen';
import CategoryScreen from './src/screens/CategoryScreen';
import YazarDetailsScreen from './src/screens/DetailsScreen/YazarDetailsScreen';
import ContentScreen from './src/screens/HomeScreenDetailPage/ContentScreen';
import MedicalUnits from './src/screens/MenuInsideScreen/MedicalUnits';
import AboutUsScreen from './src/screens/MenuInsideScreen/AboutUsScreen';
import GeneticCounseling from './src/screens/MenuInsideScreen/GeneticCounseling';
import BrainSignalScreen from './src/screens/MenuInsideScreen/BrainSignalScreen';
import OurPublications from './src/screens/MenuInsideScreen/OurPublications';
import SocialProjectScreen from './src/screens/MenuInsideScreen/SocialProjectScreen';
import CornerWriterScreen from './src/screens/MenuInsideScreen/CornerWriterScreen';
import ContentInside from './src/screens/HomeScreenDetailPage/ContentInside';
import ContactUsScreen from './src/screens/MenuInsideScreen/ContactUsScreen';
import QuizScreen from './src/screens/MenuInsideScreen/QuizScreen';
import {
  HomeIcon as HomeIconOutline,
  DocumentTextIcon as DocumentTextOutline,
  UserIcon as UserIconOutline,
  GlobeAltIcon as GlobeAltIconOutline,
} from 'react-native-heroicons/outline';
import {
  HomeIcon as HomeIconSolidOutline,
  DocumentTextIcon as DocumentTextIconSolidOutline,
  UserIcon as UserIconSolidOutline,
  GlobeAltIcon as GlobeAltIconSolidOutline,
} from 'react-native-heroicons/solid';
import NotificationScreen from './src/screens/DetailsScreen/NotificationScreen';
import CategoryCloud from './src/screens/MenuInsideScreen/CategoryCloud';
import NotificationSettings from './src/screens/MenuInsideScreen/NotificationSettings';

function BottomTabs() {
  const Tab = createBottomTabNavigator();

  const {width, height} = Dimensions.get('window');
  const isTablet = width / height < 0.6;
  const tabletPadding = isTablet ? 0 : 15; // Örnek olarak 20 değerini atadım.

  const styles = StyleSheet.create({
    tabBarLabelStyle: {
      fontSize: 13,
      padding: tabletPadding,
    },
  });

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: 'white',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            elevation: 3,
            borderTopWidth: 0,
          },
        }}>
        <Tab.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{
            headerShown: false,
            tabBarLabel: ({focused}) => (
              <Text
                style={[
                  styles.tabBarLabelStyle,
                  {color: focused ? 'black' : 'gray'},
                ]}>
                Ana Sayfa
              </Text>
            ),
            tabBarIcon: ({focused}) =>
              focused ? (
                <HomeIconSolidOutline width={24} height={24} color="black" />
              ) : (
                <HomeIconOutline width={24} height={24} color="gray" />
              ),
          }}
        />
        <Tab.Screen
          name="Category"
          component={CategoryScreen}
          options={{
            headerShown: false,
            tabBarLabel: ({focused}) => (
              <Text
                style={[
                  styles.tabBarLabelStyle,
                  {color: focused ? 'black' : 'gray'},
                ]}>
                Kategori
              </Text>
            ),
            tabBarIcon: ({focused}) =>
              focused ? (
                <DocumentTextIconSolidOutline
                  width={24}
                  height={24}
                  color="black"
                />
              ) : (
                <DocumentTextOutline width={24} height={24} color="gray" />
              ),
          }}
        />

        <Tab.Screen
          name="Yazarlar"
          component={YazarScreen}
          options={{
            headerShown: false,
            tabBarLabel: ({focused}) => (
              <Text
                style={[
                  styles.tabBarLabelStyle,
                  {color: focused ? 'black' : 'gray'},
                ]}>
                Yazarlar
              </Text>
            ),
            tabBarIcon: ({focused}) =>
              focused ? (
                <UserIconSolidOutline width={24} height={24} color="black" />
              ) : (
                <UserIconOutline width={24} height={24} color="gray" />
              ),
          }}
        />

        <Tab.Screen
          name="MenuScreen"
          component={MenuScreen}
          options={{
            headerShown: false,
            tabBarLabel: ({focused}) => (
              <Text
                style={[
                  styles.tabBarLabelStyle,
                  {color: focused ? 'black' : 'gray'},
                ]}>
                Web Sitesi
              </Text>
            ),
            tabBarIcon: ({focused}) =>
              focused ? (
                <GlobeAltIconSolidOutline
                  width={24}
                  height={24}
                  color="black"
                />
              ) : (
                <GlobeAltIconOutline width={24} height={24} color="gray" />
              ),
          }}
        />
      </Tab.Navigator>
    </>
  );
}

const Stack = createNativeStackNavigator();

function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={BottomTabs}
          useLayoutEffect
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="YazarDetail"
          component={YazarDetailsScreen}
          options={{title: 'Yazar Ayrıntıları', headerShown: false}}
        />
        <Stack.Screen
          name="MedicalUnits"
          component={MedicalUnits}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ContentScreen"
          component={ContentScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AboutUsScreen"
          component={AboutUsScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="GeneticCounseling"
          component={GeneticCounseling}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="BrainSignalScreen"
          component={BrainSignalScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="OurPublications"
          component={OurPublications}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SocialProjectScreen"
          component={SocialProjectScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CornerWriterScreen"
          component={CornerWriterScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ContentInside"
          component={ContentInside}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ContactUsScreen"
          component={ContactUsScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="QuizScreen"
          component={QuizScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="NotificationScreen"
          component={NotificationScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CategoryCloud"
          component={CategoryCloud}
          options={{headerShown: false}}
        />
         <Stack.Screen
          name="NotificationSettings"
          component={NotificationSettings}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;
