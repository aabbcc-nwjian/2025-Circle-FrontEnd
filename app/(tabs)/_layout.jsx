import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useState } from 'react';
import { Shadow } from 'react-native-shadow-2';
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
    fontSize: 18,
    fontFamily: 'Source Han Sans-Bold',
    fontWeight:700,
    position: 'absolute',
    top: '50%',
    marginTop: -8,
  },
  addButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    marginLeft: '-12%',
    width: '24%',
    backgroundColor: 'white',
    height: BOTTOM_BAR_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex:1
  },
  addButtonWrapper: {
    alignItems: 'center',
  },
  addMenuContainer: {
    position: 'absolute',
    bottom: BOTTOM_BAR_HEIGHT,
    marginBottom:1,
    left: '40%',
    width: '20%',
    backgroundColor: 'white',
    borderColor: 'white',
    borderTopLeftRadius:10,
    borderTopRightRadius:10,
    elevation: 5,
  },
  addMenuItem: {
    borderColor: 'gray',
    paddingVertical: '5%',
  },
  addMenuLink: {
    textAlign: 'center',
    fontSize:14,
    fontWeight:700,
    fontFamily:'Source Han Sans-Bold',
    color:'#3D3D3D'
  }
});
