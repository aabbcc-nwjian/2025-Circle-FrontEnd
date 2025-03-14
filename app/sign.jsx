import { Link } from 'expo-router';
import { View, Text, StyleSheet, ImageBackground,Image, TextInput } from 'react-native';
import { useState ,useEffect} from 'react';
import { TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from 'expo-router';
export default function SignScreen() { 
  const navigation = useNavigation();

  const [countdown, setCountdown] = useState(0);
  
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prevCountdown => prevCountdown - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleGetVerificationCode = () => {
    if (countdown === 0) {
      setCountdown(60);
      axios.post('http://112.126.68.22:8080/user/getcode',{"email":email})
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    }
  };
  const [email , setEmail] = useState('')
  const [code , setCode] = useState('')
  const sendCode = ()=>{
    axios.post('http://112.126.68.22:8080/user/checkcode',{"email":email,"code":code})
      .then((response) => {
        navigation.navigate('setcipher', { email: email })
        console.log(response);
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
          <Link style={{color:'#9A9898'}} href={'/'}>登录</Link>
          <View style={styles.line}></View>
          <Text>注册</Text>
        </View>
      </View>
      
      <View style={{marginTop:"15%",marginLeft:"10%"}}>
      <View style={[styles.gray,{marginTop:'12%'}]}></View>  
      <Text>邮箱</Text>
      <TextInput value={email} onChangeText={setEmail} style={{marginTop:"3%"}} placeholder='请输入邮箱'></TextInput>
      </View>

      <View style={{marginTop:"6%",marginLeft:"10%"}}>
      <View style={[styles.gray,{marginTop:'12%'}]}></View>  
      <Text>验证码</Text>
      <TextInput value={code} onChangeText={setCode} secureTextEntry style={{marginTop:"3%"}} placeholder='请输入验证码'></TextInput>
      <TouchableOpacity 
          onPress={handleGetVerificationCode}
          disabled={countdown > 0}
          style={{position:'absolute', marginTop:"13%", marginLeft:'60%'}}
        >
          <Text style={{color: countdown > 0 ? 'gray' : 'blue'}}>
            {countdown > 0 ? `${countdown}s后重试` : '获取验证码'}
          </Text>
      </TouchableOpacity>
      </View>
      
      <TouchableOpacity onPress={sendCode}>
      <View style={styles.login}><Text style={{color:'white',textAlign:'center',marginTop:4}}>确认</Text></View>
      </TouchableOpacity>
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
    marginTop:"20%",
    marginLeft:"10%",
  },gray:{
    width:'90%',
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
    marginLeft:"37%"
  },agree:{
    width:8,
    height:8,
    borderRadius:5,
    borderColor:'#000000',
    borderWidth:1,
    position:'absolute',
    marginLeft:28,
    marginTop:26
  },circle:{
    width:5,
    height:5,
    borderRadius:5,
    backgroundColor:'#5A9CFE',
    position:'absolute',
    marginLeft:29.5,
    marginTop:27.5
  }
});