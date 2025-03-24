import { Link , useNavigation} from 'expo-router';
import { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground,Image, TextInput, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
export default function SetScreen() {
  const route = useRoute();
  const { email } = route.params;
  const navigation = useNavigation();
  const [password1,setPassword1]=useState('')
  const [password2,setPassword2]=useState('')
  const getPassword = ()=>{
    if (password1) {
     if (password1===password2) {
      axios.post('http://112.126.68.22:8080/user/register',{"email":email,"password":password1})
      .then((response) => {
        navigation.navigate('login')
      })
      .catch((error) => {
        console.log(error);
      });
    }else{
      alert('密码不一致')
    } 
    }else{
      alert('密码不能为空')
    }
    
  }
  return (
    <ImageBackground source={require('./img/bac.png')} style={{width:'100%',height:'100%'}}>
      
      <View style={{position:'absolute',marginTop:"20%",marginLeft:"12%"}}>
        {/* <Text style={{color:'white',fontSize:30}}>Hello!</Text>
        <Text style={{color:'white',fontSize:18}}>欢迎来到圈圈</Text> */}
      </View>

    <View style={styles.container}>

     <View>
      <Text style={{marginTop:'8%',left:'50%',marginLeft:-30,fontSize:18,fontFamily:'Source Han Sans-Bold',fontWeight:700}}>设置密码</Text>
     </View>
 

    <View style={{marginTop:"20%",marginLeft:"10%"}}>
    <View style={[styles.gray,{marginTop:'2%'}]}>
    <TextInput value={password1} style={{fontSize:12,fontFamily:'Source Han Sans-Bold',fontWeight:700,marginLeft:10,margin:'auto'}} onChangeText={setPassword1} placeholder='请输入新密码' placeholderTextColor={'#9A9898'}></TextInput>  
    </View> 
    </View>

    <View style={{marginTop:"10%",marginLeft:"10%"}}>
    <View style={[styles.gray,{marginTop:'2%'}]}>
    <TextInput value={password2} style={{fontSize:12,fontFamily:'Source Han Sans-Bold',fontWeight:700,marginLeft:10,margin:'auto'}} onChangeText={setPassword2} placeholder='再次输入新密码' placeholderTextColor={'#9A9898'}></TextInput>  
    </View> 
    </View>

    <View>
    <TouchableOpacity onPress={getPassword}>
    <LinearGradient
        colors={['#3083FE','#63A2FF','#A2C6FB']} 
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.login}>
          <Text style={{color:'white',textAlign:'center',margin:'auto',fontFamily:'Source Han Sans-Bold',fontWeight:700,fontSize:18}}>注册</Text>
      </LinearGradient>
    </TouchableOpacity>
    <Link style={{color:'gray',marginTop:20,left:'50%',marginLeft:-15,fontFamily:'Source Han Sans-Bold',fontWeight:700,fontSize:16}} href={'login'}>取消</Link>
    </View>   
    
    </View>  

    </ImageBackground>
    
  );
}

const styles = StyleSheet.create({
  container: {
    width:"84%",
    height:"60%",
    backgroundColor:'white',
    borderRadius:15,
    marginLeft:"8%",
    marginTop:"40%",
    elevation:8,
    shadowColor: '#000',
  },gray:{
    width:"90%",
    height:40,
    borderRadius:10,
    backgroundColor:'#E5E5E5',
    borderRadius:15
  },login:{
    width:"80%",
    height:40,
    borderRadius:15,
    backgroundColor:'blue',
    marginTop:"20%",
    marginLeft:"10%",
  }
});