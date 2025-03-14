import { FontAwesome } from '@expo/vector-icons';
import { Link, Tabs } from 'expo-router';
import { View , Text} from 'react-native';
import { Image } from 'react-native';
export default function TabLayout() {
  return (
    <>
    <Tabs screenOptions={{ tabBarActiveTintColor: '#111313' ,tabBarPosition:'top',animation:'shift',}}>
      <Tabs.Screen
        name="index"
        options={{
          title: '练习',headerShown:false,tabBarLabelStyle:{fontSize:19, fontFamily:'Source Han Sans-Bold',position:'absolute',marginTop:5,right:'20%'},
          tabBarIcon: ({ color }) => <FontAwesome size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="answer"
        options={{
          title: '答卷',headerShown:false,tabBarLabelStyle:{fontSize:19, fontFamily:'Source Han Sans-Bold',position:'absolute',marginTop:5,left:'20%'},
          tabBarIcon: ({ color }) => <FontAwesome size={28}  color={color} />,
        }}
      />
    </Tabs>
{/*     <View style={{position:'absolute',width:'20%',height:48,backgroundColor:'white'}}><Link style={{marginTop:10,marginLeft:'40%',}} href={'/setting'}><FontAwesome size={25} name="bars" /></Link></View>
 */}    <View style={{position:'absolute',width:'20%',height:48,backgroundColor:'white',right:0}}><Link style={{marginTop:10,marginLeft:'20%',}} href={'/search'}>
      <Image 
          source={require('../../img/pic1.png')} 
          style={{width: '80%', height: '80%', resizeMode: 'contain',marginRight:200}}
        /></Link>
    </View>
    </>
  );
}