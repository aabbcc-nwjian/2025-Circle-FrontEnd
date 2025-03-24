import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { TouchableOpacity } from 'react-native';
export default function HomeScreen() {
  const navigation = useNavigation()
  return (
    <View style={{backgroundColor:'#3D89FB',height:'100%',width:'100%'}}>
      <View style={{margin:10,flexDirection:'row'}}>
      <Text onPress={()=>{navigation.goBack()}}><FontAwesome size={35} color={'white'} name='angle-left'/></Text>
      </View>

      <View style={{width:'60%',height:'20%',marginLeft:'10%',marginTop:40}}>
      <Text style={{color:'white',fontSize:20,marginLeft:10,marginTop:20,fontFamily:'Source Han Sans-Bold',fontWeight:700}}>选择一种</Text>
        <View style={{flexDirection:'row'}}>
        <View>
        <Text style={{color:'white',fontSize:48,marginLeft:6,fontFamily:'Source Han Sans-Bold',fontWeight:700,marginTop:-10}}>题</Text>
        <Text style={{color:'white',fontSize:48,marginLeft:6,fontFamily:'Source Han Sans-Bold',fontWeight:700,marginTop:-15}}>型</Text>
        </View>
        
        <View>
        <Text style={{color:'white',fontSize:24,marginLeft:0,fontFamily:'Source Han Sans-Bold',fontWeight:700,marginTop:-2}}>开始你的</Text>
        <Text style={{color:'white',fontSize:44,marginLeft:0,fontFamily:'Source Han Sans-Bold',fontWeight:700,marginTop:-10}}>编题</Text>
        <Text style={{color:'white',fontSize:24,marginLeft:6,fontFamily:'Source Han Sans-Bold',fontWeight:700,marginTop:-10}}>之      旅</Text>
        </View>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.container} 
        onPress={() => navigation.navigate('one')}
      >
        <Text style={{textAlign:'center',margin:'auto',fontSize:20,fontFamily:'Source Han Sans-Bold',fontWeight:700}}>单选题</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.container}  
        onPress={() => navigation.navigate('more')}
      >
        <Text style={{textAlign:'center',margin:'auto',fontSize:20,fontFamily:'Source Han Sans-Bold',fontWeight:700}}>多选题</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.container}  
        onPress={() => navigation.navigate('choose')}
      >
        <Text style={{textAlign:'center',margin:'auto',fontSize:20,fontFamily:'Source Han Sans-Bold',fontWeight:700}}>判断题</Text>
      </TouchableOpacity>
      
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    width: '80%',
    height: 55,
    backgroundColor: 'white',
    marginLeft: '10%',
    borderRadius: 10,
    shadowColor: "#000",
    marginTop:'8%',
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.75,
    shadowRadius: 3.84,
    elevation: 10,
  },
});


