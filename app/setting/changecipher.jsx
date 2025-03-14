import { Link } from 'expo-router';
import { useState , useEffect} from 'react';
import { View, Text, StyleSheet, ImageBackground,Image, TextInput } from 'react-native';
import { useNavigation ,useRouter} from 'expo-router';
import { TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Post } from '../axios';
export default function ForgetScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const [email,setEmail]=useState('')
  const [password1,setPassword1]=useState('')
  const [password2,setPassword2]=useState('')
  const [code , setCode] = useState('')
  const getPassword = async () => {
    try {
      axios.post('http://112.126.68.22:8080/user/changepassword',{"email":email,"newpassword":password1})
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
      navigation.navigate('login');
    } catch (error) {
      console.error(error);
    }
  };
  const sendCode = ()=>{
    axios.post('http://112.126.68.22:8080/user/checkcode',{"email":email,"code":code})
      .then((response) => {
        getPassword()
      })
      .catch((error) => {
        console.log("验证码错误");
      });
  }

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
  const changePassword=()=>{
    if (password1===password2) {
      sendCode()
    }else{
      console.log('密码不一致');
    }
  }
  return (
    <ImageBackground style={{width:'100%',height:'100%',backgroundColor:'#3083FE'}}>

    <View style={styles.container}>

     <View style={styles.line}></View>
     <View>
      <Text style={{marginTop:'8%',left:'50%',marginLeft:-30}}>修改密码</Text>
     </View>
 

    <View style={{marginTop:'10%',marginLeft:'10%'}}>
    <View style={[styles.gray,{marginTop:'2%'}]}></View> 
    <TextInput value={email} onChangeText={setEmail} placeholder='请输入邮箱'></TextInput>
    </View>
    <View style={{marginTop:'10%',marginLeft:'10%'}}>
    <View style={[styles.gray,{marginTop:'2%'}]}></View> 
    <TextInput value={code} onChangeText={setCode} placeholder='请输入验证码'></TextInput>
    <TouchableOpacity 
        onPress={handleGetVerificationCode}
        disabled={countdown > 0}
        style={{position:'absolute', marginTop:"3%", marginLeft:'60%'}}
      >
        <Text style={{color: countdown > 0 ? 'gray' : 'blue'}}>
          {countdown > 0 ? `${countdown}s后重试` : '获取验证码'}
        </Text>
    </TouchableOpacity>
    </View>
    <View style={{marginTop:'10%',marginLeft:'10%'}}>
    <View style={[styles.gray,{marginTop:'2%'}]}></View>
    <TextInput value={password1} onChangeText={setPassword1}  placeholder='请输入新密码'></TextInput>
    </View>
    <View style={{marginTop:'10%',marginLeft:'10%'}}>
    <View style={[styles.gray,{marginTop:'2%'}]}></View>
    <TextInput value={password2} onChangeText={setPassword2}  placeholder='再次输入新密码'></TextInput>
    </View>

    <View>
    
    <View style={styles.login}><Text onPress={() => navigation.navigate('index')} style={{color:'white',textAlign:'center',marginTop:4}}>返回</Text></View>
    <TouchableOpacity onPress={changePassword}>
    <View style={styles.sure}><Text style={{color:'white',textAlign:'center',marginTop:4}}>确认</Text></View>
    </TouchableOpacity>
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
    marginTop:'16%',
    left:'50%',
    marginLeft:-12.5,
  },login:{
    width:'30%',
    height:30,
    borderRadius:10,
    backgroundColor:'blue',
    position:'absolute',
    marginTop:'18%',
    marginLeft:'10%'
  },sure:{
    width:'30%',
    height:30,
    borderRadius:10,
    backgroundColor:'blue',
    position:'absolute',
    marginTop:'18%',
    marginLeft:'60%'
  }
});