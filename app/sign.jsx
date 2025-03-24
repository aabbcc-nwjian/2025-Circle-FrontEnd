import { Link } from 'expo-router';
import { View, Text, StyleSheet, ImageBackground,Image, TextInput } from 'react-native';
import { useState ,useEffect} from 'react';
import { TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
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
    if (email) {
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
    }else{
      alert('请输入邮箱')
    }
    
  };
  const [email , setEmail] = useState('')
  const [code , setCode] = useState('')
  const sendCode = ()=>{
    if (code) {
     axios.post('http://112.126.68.22:8080/user/checkcode',{"email":email,"code":code})
      .then((response) => {
        navigation.navigate('setcipher', { email: email })
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
        alert('验证码错误')
      }); 
    }else{
      alert('请输入验证码')
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
        <View style={styles.box}>
          <Link style={{color:'#9A9898',fontSize:16,fontFamily:'Source Han Sans-Bold',fontWeight:700}} href={'login'}>登录</Link>
          <View style={styles.line}></View>
          <Text style={{fontSize:16,fontFamily:'Source Han Sans-Bold',fontWeight:700}}>注册</Text>
        </View>
      </View>
      
      <View style={{marginTop:"15%",marginLeft:"10%"}}>
      <Text style={{fontSize:16,fontFamily:'Source Han Sans-Bold',fontWeight:700}}>邮箱</Text>
      <View style={[styles.gray,{marginTop:'4%'}]}>
       <TextInput value={email} onChangeText={setEmail} style={{fontSize:12,fontFamily:'Source Han Sans-Bold',fontWeight:700,marginLeft:10,margin:'auto'}} placeholderTextColor={'#9A9898'} placeholder='请输入邮箱' ></TextInput> 
      </View> 
      </View>

      <View style={{marginTop:"4%",marginLeft:"10%"}}> 
      <Text style={{fontSize:16,fontFamily:'Source Han Sans-Bold',fontWeight:700}}>验证码</Text>
      <View style={[styles.gray,{marginTop:'4%',flexDirection:'row'}]}>
      <TextInput value={code} onChangeText={setCode} secureTextEntry style={{fontSize:12,fontFamily:'Source Han Sans-Bold',fontWeight:700,marginLeft:10,margin:'auto'}} placeholder='请输入验证码' placeholderTextColor={'#9A9898'}></TextInput>
      <TouchableOpacity 
          onPress={handleGetVerificationCode}
          disabled={countdown > 0}
          style={{marginLeft:'25%',margin:'auto'}}
        >
          <Text style={{color: countdown > 0 ? 'gray' : '#3083FE',fontSize:12,fontFamily:'Source Han Sans-Bold',fontWeight:700}}>
            {countdown > 0 ? `${countdown}s后重试` : '获取验证码'}
          </Text>
      </TouchableOpacity>
      </View> 
      </View>
      
      <TouchableOpacity onPress={sendCode}>
      <LinearGradient
        colors={['#3083FE','#63A2FF','#A2C6FB']} 
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.login}>
          <Text style={{color:'white',textAlign:'center',margin:'auto',fontFamily:'Source Han Sans-Bold',fontWeight:700,fontSize:18}}>确认</Text>
      </LinearGradient>
      </TouchableOpacity>

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
    marginTop:"20%",
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
    marginLeft:'39%',
    borderRadius:10
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