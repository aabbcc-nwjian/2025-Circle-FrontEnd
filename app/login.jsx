import { Link,useNavigation} from 'expo-router';
import { useState , useEffect} from 'react';
import { View, Text, StyleSheet, ImageBackground,Image, TextInput, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from 'expo-linear-gradient';
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
    if (email&&password) {
     axios.post('http://112.126.68.22:8080/user/login',{"email":email,"password":password})
    .then((response) => {
      storeToken(response.data.success)
      successLogin();
    })
    .catch((error) => {
      console.log(error);
      alert('邮箱或密码错误');
    }); 
    }else{
      alert('请输入邮箱和密码')
    }
  }
  return (
    <ImageBackground source={require('./img/bac.png')} style={{width:'100%',height:'100%'}}>
      
      <View style={{position:'absolute',marginTop:"18%",left:"7%",marginLeft:5}}>
        <Text style={{color:'white',fontSize:30,fontFamily:'Source Han Sans-Bold',fontWeight:700}}>Hello!</Text>
        <Text style={{color:'white',fontSize:18,fontFamily:'Source Han Sans-Bold',fontWeight:700}}>欢迎来到圈圈</Text>
      </View>



      <View style={styles.container}>
      <View>
        <View style={styles.box}>
          <Text style={{fontSize:16,fontFamily:'Source Han Sans-Bold',fontWeight:700}}>登录</Text>
          <View style={styles.line}></View>
          <Link style={{color:'#9A9898',fontSize:16,fontFamily:'Source Han Sans-Bold',fontWeight:700}} href={'/sign'}>注册</Link>
        </View>
      </View>
      

      <View style={{marginTop:"15%",marginLeft:"10%"}}>  
      <Text style={{fontSize:16,fontFamily:'Source Han Sans-Bold',fontWeight:700}}>邮箱</Text>
      <View style={[styles.gray,{marginTop:'4%'}]}>
      <TextInput value={email} onChangeText={setEmail} style={{fontSize:12,fontFamily:'Source Han Sans-Bold',fontWeight:700,marginLeft:10,margin:'auto'}} placeholder='请输入邮箱' placeholderTextColor={'#9A9898'}></TextInput>  
      </View>
      </View>

      <View style={{marginTop:"4%",marginLeft:"10%"}}>
      <Text style={{fontSize:16,fontFamily:'Source Han Sans-Bold',fontWeight:700}}>密码</Text>
      <View style={[styles.gray,{marginTop:'4%'}]}>
       <TextInput value={password} onChangeText={setPassword} style={{fontSize:12,fontFamily:'Source Han Sans-Bold',fontWeight:700,marginLeft:10,margin:'auto'}} placeholder='请输入密码' placeholderTextColor={'#9A9898'}></TextInput> 
      </View>
      </View>
      <Link href={'/forget'} style={{marginLeft:'73%',fontFamily:'Source Han Sans-Bold',fontWeight:700,fontSize:12,marginTop:5,color:'#3083FE'}}>忘记密码</Link>
      
      <TouchableOpacity onPress={login}>
        <LinearGradient
          colors={['#3083FE','#63A2FF','#A2C6FB']} 
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.login}>
            <Text style={{color:'white',textAlign:'center',margin:'auto',fontFamily:'Source Han Sans-Bold',fontWeight:700,fontSize:18}}>登录</Text>
        </LinearGradient>
      </TouchableOpacity>
      

      <View>
      <View style={styles.agree}><Text onPress={agree?disAgree:getAgree}></Text>
      {agree&&<View style={styles.circle}><Text onPress={agree?disAgree:getAgree}></Text></View>}
      </View>
      <Text style={{fontSize:12,marginLeft:"18%",marginTop:20,fontFamily:'Source Han Sans-Bold',fontWeight:700}}>已阅读并同意《用户协议》＆《隐私政策》</Text>
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
  },login:{
    width:"80%",
    height:40,
    borderRadius:15,
    backgroundColor:'blue',
    marginTop:"13%",
    marginLeft:"10%",
  },gray:{
    width:"90%",
    height:40,
    borderRadius:10,
    backgroundColor:'#E5E5E5',
    borderRadius:15
  },box:{
    flexDirection:'row',
    justifyContent:'space-evenly',
    marginTop:'8%',
    width:"100%"
  },line:{
    width:15,
    height:3,
    backgroundColor:'#3083FE',
    position:'absolute',
    marginTop:"7%",
    marginLeft:6,
    borderRadius:10
  },agree:{
    width:8,
    height:8,
    borderRadius:5,
    borderColor:'#000000',
    borderWidth:1,
    position:'absolute',
    marginLeft:"13%",
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