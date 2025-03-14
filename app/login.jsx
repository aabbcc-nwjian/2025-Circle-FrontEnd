import { Link,useNavigation} from 'expo-router';
import { useState , useEffect} from 'react';
import { View, Text, StyleSheet, ImageBackground,Image, TextInput, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function LoginScreen() {
  const navigation = useNavigation();
  const successLogin = ()=>{
    navigation.navigate('(tabs)')
  }
  const [agree,setAgree]=useState(false)
  const getAgree = ()=>{
    setAgree(true)
  }
  const disAgree = ()=>{
    setAgree(false)
  }
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const storeToken = async (token) => {
    try {
      await AsyncStorage.setItem('token', token);
    } catch (error) {
      console.log('Error storing token:', error);
    }
  };
  const login = ()=>{
    axios.post('http://112.126.68.22:8080/user/login',{"email":email,"password":password})
    .then((response) => {
      storeToken(response.data.success)
      successLogin();
    })
    .catch((error) => {
      console.log(error);
    });
  }
  return (
    <ImageBackground source={require('./img/bac.png')} style={{width:'100%',height:'100%'}}>
      
      <View style={{position:'absolute',marginTop:"20%",marginLeft:"12%"}}>
        <Text style={{color:'white',fontSize:30}}>Hello!</Text>
        <Text style={{color:'white',fontSize:18}}>欢迎来到圈圈</Text>
      </View>



      <View style={styles.container}>
      <View>
        <View style={styles.box}>
          <Text>登录</Text>
          <View style={styles.line}></View>
          <Link style={{color:'#9A9898'}} href={'/sign'}>注册</Link>
        </View>
      </View>
      

      <View style={{marginTop:"15%",marginLeft:"10%"}}>
      <View style={[styles.gray,{marginTop:'12%'}]}></View>  
      <Text>邮箱</Text>
      <TextInput value={email} onChangeText={setEmail} style={{marginTop:"3%"}} placeholder='请输入邮箱'></TextInput>
      </View>

      <View style={{marginTop:"6%",marginLeft:"10%"}}>
      <View style={[styles.gray,{marginTop:'12%'}]}></View>
      <Text>密码</Text>
      <TextInput value={password} onChangeText={setPassword} style={{marginTop:"3%"}} placeholder='请输入密码'></TextInput>
      </View>
      <Link href={'/forget'} style={{marginLeft:'75%',fontSize:12,marginTop:'5%',color:'gray'}}>忘记密码</Link>
      
      <TouchableOpacity onPress={login}>
      <View style={styles.login}><Text style={{color:'white',textAlign:'center',marginTop:4}}>登录</Text></View>
      </TouchableOpacity>
      

      <View>
      <View style={styles.agree}><Text onPress={agree?disAgree:getAgree}></Text>
      {agree&&<View style={styles.circle}><Text onPress={agree?disAgree:getAgree}></Text></View>}
      </View>
      <Text style={{fontSize:12,marginLeft:"14%",marginTop:20}}>已阅读并同意《用户协议》＆《隐私政策》</Text>
      </View>
      <Link href={'/(tabs)/shouye'}>开发者入口</Link>
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
  },login:{
    width:"80%",
    height:30,
    borderRadius:10,
    backgroundColor:'blue',
    marginTop:"10%",
    marginLeft:"10%",
  },gray:{
    width:"90%",
    height:30,
    borderRadius:10,
    backgroundColor:'#E5E5E5',
    position:'absolute',
  },box:{
    flexDirection:'row',
    justifyContent:'space-evenly',
    marginTop:'8%',
    width:"100%"
  },line:{
    width:25,
    height:2,
    backgroundColor:'#3083FE',
    position:'absolute',
    marginTop:"7%",
    marginLeft:1
  },agree:{
    width:8,
    height:8,
    borderRadius:5,
    borderColor:'#000000',
    borderWidth:1,
    position:'absolute',
    marginLeft:"10%",
    marginTop:26
  },circle:{
    width:5,
    height:5,
    borderRadius:5,
    backgroundColor:'#5A9CFE',
    position:'absolute',
    marginLeft:0.6,
    marginTop:0.6
  }
});