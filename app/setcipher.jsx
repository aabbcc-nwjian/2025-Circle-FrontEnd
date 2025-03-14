import { Link , useNavigation} from 'expo-router';
import { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground,Image, TextInput, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
export default function SetScreen() {
  const route = useRoute();
  const { email } = route.params;
  const navigation = useNavigation();
  const [password1,setPassword1]=useState('')
  const [password2,setPassword2]=useState('')
  const getPassword = ()=>{
    if (password1===password2) {
      axios.post('http://112.126.68.22:8080/user/register',{"email":email,"password":password1})
      .then((response) => {
        navigation.navigate('login')
      })
      .catch((error) => {
        console.log(error);
      });
    }else{
      console.log('密码不一致');
    }
  }
  return (
    <ImageBackground source={require('./img/bac.png')} style={{width:'100%',height:'100%'}}>
      
      <View style={{position:'absolute',marginTop:"20%",marginLeft:"12%"}}>
        <Text style={{color:'white',fontSize:30}}>Hello!</Text>
        <Text style={{color:'white',fontSize:18}}>欢迎来到圈圈</Text>
      </View>

    <View style={styles.container}>

     <View style={styles.line}></View>
     <View>
      <Text style={{marginTop:'8%',left:'50%',marginLeft:-30}}>设置密码</Text>
     </View>
 

    <View style={{marginTop:"20%",marginLeft:"10%"}}>
    <View style={[styles.gray,{marginTop:'2%'}]}></View> 
    <TextInput value={password1} onChangeText={setPassword1} placeholder='请输入新密码'></TextInput>
    </View>
    <View style={{marginTop:"10%",marginLeft:"10%"}}>
    <View style={[styles.gray,{marginTop:'2%'}]}></View> 
    <TextInput value={password2} onChangeText={setPassword2} placeholder='再次输入新密码'></TextInput>
    </View>

    <View>
    <TouchableOpacity onPress={getPassword}>
    <View style={styles.login}><Text style={{color:'white',textAlign:'center',marginTop:4}}>注册</Text></View>
    </TouchableOpacity>
    <Link style={{color:'gray',marginTop:30,left:'50%',marginLeft:-13}} href={'/'}>取消</Link>
    </View>   
    
    </View>  

    </ImageBackground>
    
  );
}

const styles = StyleSheet.create({
  container: {
    width:"80%",
    height:"60%",
    backgroundColor:'white',
    borderRadius:10,
    marginLeft:"10%",
    marginTop:"45%",
  },gray:{
    width:'90%',
    height:30,
    borderRadius:10,
    backgroundColor:'#E5E5E5',
    position:'absolute',
  },line:{
    width:25,
    height:2,
    backgroundColor:'#3083FE',
    position:'absolute',
    marginTop:'15%',
    left:'50%',
    marginLeft:-12.5,
  },login:{
    width:"80%",
    height:30,
    borderRadius:10,
    backgroundColor:'blue',
    marginTop:"20%",
    marginLeft:"10%",
  }
});