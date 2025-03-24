import { Link , useNavigation} from 'expo-router';
import { useState ,useEffect} from 'react';
import { View, Text, StyleSheet, ImageBackground,Image, TextInput } from 'react-native';
import { TouchableOpacity } from 'react-native';
import axios from 'axios';
export default function ForgetScreen() {
  const navigation = useNavigation();
  const [email,setEmail]=useState('')
  const [password1,setPassword1]=useState('')
  const [password2,setPassword2]=useState('')
  const [code , setCode] = useState('')
  const getPassword = ()=>{
      axios.post('http://112.126.68.22:8080/user/changepassword',{"email":email,"newpassword":password1})
      .then((response) => {
        navigation.navigate('login')
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const sendCode = ()=>{
    if (code) {
    axios.post('http://112.126.68.22:8080/user/checkcode',{"email":email,"code":code})
      .then((response) => {
        getPassword()
      })
      .catch((error) => {
        console.log(error);
        alert('验证码错误')
      });  
    }else{
      alert('验证码不能为空')
    }
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
      console.log('邮箱不能为空');
    }
  };
  const changePassword=()=>{
    if (password1===password2) {
      sendCode()
    }else{
      console.log('密码不一致');
      alert('密码不一致')
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
      <Text style={{marginTop:'8%',left:'50%',marginLeft:-30,fontSize:18,fontFamily:'Source Han Sans-Bold',fontWeight:700}}>重置密码</Text>
     </View>
 

    <View style={{marginTop:'10%',marginLeft:'10%'}}>
    <View style={[styles.gray,{marginTop:'2%'}]}>
    <TextInput style={{fontSize:12,fontFamily:'Source Han Sans-Bold',fontWeight:700,marginLeft:10,margin:'auto'}} value={email} onChangeText={setEmail} placeholder='请输入邮箱' placeholderTextColor={'#9A9898'}></TextInput>  
    </View> 
    </View>
    <View style={{marginTop:'6%',marginLeft:'10%'}}>
    <View style={[styles.gray,{marginTop:'2%',flexDirection:'row'}]}>
    <TextInput value={code} style={{fontSize:12,fontFamily:'Source Han Sans-Bold',fontWeight:700,marginLeft:10,margin:'auto'}} onChangeText={setCode} placeholder='请输入验证码' placeholderTextColor={'#9A9898'}></TextInput>
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
    <View style={{marginTop:'6%',marginLeft:'10%'}}>
    <View style={[styles.gray,{marginTop:'2%'}]}>
    <TextInput style={{fontSize:12,fontFamily:'Source Han Sans-Bold',fontWeight:700,marginLeft:10,margin:'auto'}} value={password1} onChangeText={setPassword1} placeholder='请输入新密码' placeholderTextColor={'#9A9898'}></TextInput>  
    </View> 
    </View>
    <View style={{marginTop:'6%',marginLeft:'10%'}}>
    <View style={[styles.gray,{marginTop:'2%'}]}>
    <TextInput style={{fontSize:12,fontFamily:'Source Han Sans-Bold',fontWeight:700,marginLeft:10,margin:'auto'}} value={password2} onChangeText={setPassword2} placeholder='再次输入新密码' placeholderTextColor={'#9A9898'}></TextInput>  
    </View> 
    </View>

    <View>
    <View style={styles.login}><Text onPress={()=>navigation.navigate('login')} style={{color:'white',textAlign:'center',margin:'auto',fontSize:16,fontFamily:'Source Han Sans-Bold',fontWeight:700}}>返回登录</Text></View>

    <TouchableOpacity onPress={changePassword}>
    <View style={styles.sure}><Text style={{color:'white',textAlign:'center',margin:'auto',fontSize:16,fontFamily:'Source Han Sans-Bold',fontWeight:700}}>确认</Text></View>
    </TouchableOpacity>
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
    width:'35%',
    height:40,
    borderRadius:15,
    backgroundColor:'#3083FE',
    position:'absolute',
    marginTop:'13%',
    marginLeft:'10%'
  },sure:{
    width:'35%',
    height:40,
    borderRadius:15,
    backgroundColor:'#3083FE',
    position:'absolute',
    marginTop:'13%',
    marginLeft:'55%'
  }
});