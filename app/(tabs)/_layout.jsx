import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useState } from 'react';

const { width, height } = Dimensions.get('window');
const BOTTOM_BAR_HEIGHT = height * 0.07;

export default function TabLayout() {
  const [add, setAdd] = useState(false)
  const getAdd = () => {
    setAdd(true)
  }
  const hideAdd = () => {
    setAdd(false)
  }
  return (
    <>
    <Tabs 
      screenOptions={{
        tabBarActiveTintColor: '#111313',
        tabBarStyle: {
          display: 'flex',
          height: BOTTOM_BAR_HEIGHT,
        }
      }}
    >
      <Tabs.Screen
        name="shouye"
        options={{
          title:'首页',
          headerShown:false,
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarIcon: ({ color }) => <FontAwesome size={28} color={color} />,
        }}
      />

      <Tabs.Screen
        name="myself"
        options={{
          title: '我的',
          headerShown:false,
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarIcon: ({ color }) => <FontAwesome size={28} color={color} />,
        }}
      />
    </Tabs>
    <View style={styles.addButtonContainer}>
      <View style={styles.addButtonWrapper}>
        <FontAwesome onPress={add ? hideAdd : getAdd} size={28} name='plus-square' color='#3D89FB'/>
      </View> 
    </View>

    {add &&
    <View style={styles.addMenuContainer}>
      <View style={[styles.addMenuItem,{borderBottomWidth: 0.5}]}><Link style={styles.addMenuLink} href={'/createcircle'}>创圈</Link></View>
      <View style={[styles.addMenuItem,{borderBottomWidth: 0.5}]}><Link style={styles.addMenuLink} href={'/inscribe'}>编题</Link></View>
      <View style={styles.addMenuItem}><Link style={styles.addMenuLink} href={'/paper'}>组卷</Link></View>
    </View>
    }
    </>
  );
}

const styles = StyleSheet.create({
  tabBarLabel: {
    fontSize: 16,
    fontFamily: 'Source Han Sans-Bold',
    position: 'absolute',
    top: '50%',
    marginTop: -8,
  },
  addButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    marginLeft: '-10%',
    width: '20%',
    height: BOTTOM_BAR_HEIGHT,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  addButtonWrapper: {
    alignItems: 'center',
  },
  addMenuContainer: {
    position: 'absolute',
    bottom: BOTTOM_BAR_HEIGHT,
    left: '40%',
    width: '20%',
    backgroundColor: 'white',
    borderColor: 'white',
    borderTopLeftRadius:5,
    borderTopRightRadius:5,
    borderBottomWidth:0,
    shadowColor: "#000000",
    elevation: 1,
  },
  addMenuItem: {
    borderColor: 'gray',
    paddingVertical: '5%',
  },
  addMenuLink: {
    textAlign: 'center',
  }
});
