import { Button, Image, ScrollView, StyleSheet, TextInput ,TouchableOpacity} from 'react-native';
import { View , Text ,Alert} from 'react-native';
import { useState , useEffect} from 'react';
import React from 'react';
import { useNavigation } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { launchImageLibrary } from 'react-native-image-picker';
import { Get, Post } from '../axios';
import myStory from '../datas';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
export default function SendPage() { 
  const navigation = useNavigation()
  const toAdd=()=>{
    /* if (sheetname&&imageUrl) {
    navigation.navigate('add')
    myStory.add['testname']=sheetname
    myStory.add['discirption']=discirption
    myStory.add['circle']=activetext
    myStory.add['image']=imageUrl
    }else{
      Alert.alert('请输入卷子名称并上传封面')
    } */
    navigation.navigate('add')
    myStory.add['testname']=sheetname
    myStory.add['discirption']=discirption
    myStory.add['circle']=activetext
    myStory.add['image']=imageUrl
  }  

  const [should1,setShould1]=useState(false)
  const [options,setOptions]=useState([])
    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const userData = await Get('/circle/selectcircle');
          options.push(...userData.circle);
          setActivetext(options[0].Name)
          console.log(userData.circle);
          
        } catch (error) {
          console.error(error);
        }
        setShould1(true)
      };
      fetchUserData();
    }, []);
  const [sheetname,setSheetname]=useState('')
  const [discirption,setDiscirption]=useState('')


  const [imageUrl, setImageUrl] = useState(null);
  const pickImage = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo' });
    if (result.assets?.[0]) {
      console.log(result.assets[0]);
      return result.assets[0];
    }
    return null;
  };
  
  // 获取上传凭证
  const getToken = async () => {
    try {
      const response = await Get('/user/uploadphoto'); // 替换为你的后端接口
      return response.success; // 假设返回的 token 在 response.data.token 中
    } catch (error) {
      console.error('获取 token 失败:', error);
      throw error;
    }
  };
  
  // 上传图片到七牛云
  const uploadToQiniu = async (image, token) => {
    const mimeType = image.type || 'image/png'; // 默认类型为 image/png
    const extension = image.uri.split('.').pop() || 'png'; // 默认扩展名为 png
    const generateShortKey = () => {
      const timestamp = Date.now().toString(36); // 时间戳转换为 36 进制
      const randomStr = Math.random().toString(36).substring(2, 6); // 生成 4 位随机字符
      return `img_${timestamp}_${randomStr}.png`; // 组合成更短的 key
    };
    const fileName = generateShortKey(); // 生成更短的 key
    console.log(fileName);

    let blob;
    if (image.uri.startsWith('data:')) {
      // 如果是 Base64 数据，解码为二进制
      const base64Data = image.uri.split(',')[1];
      const binaryString = atob(base64Data);
      const arrayBuffer = new ArrayBuffer(binaryString.length);
      const uint8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < binaryString.length; i++) {
        uint8Array[i] = binaryString.charCodeAt(i);
      }
      blob = new Blob([uint8Array], { type: mimeType });
    } else {
      // 如果是文件路径，直接使用 fetch 获取 Blob
      const response = await fetch(image.uri);
      blob = await response.blob();
    }
  
    const formData = new FormData();
    formData.append('file', blob, fileName); // 使用 Blob 对象
    formData.append('token', token);
    formData.append('key', fileName); // 使用唯一文件名作为 key
  
    try {
      const response = await axios.post('https://up-z2.qiniup.com', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('上传成功:', response.data);
      return response.data.key; // 返回文件的 key
    } catch (error) {
      console.error('上传失败:', error.response?.data || error.message);
      throw error;
    }
  };
  
  
  // 处理上传流程
  const handleUpload = async () => {
    try {
      const image = await pickImage();
      if (!image) return;
  
      const token = await getToken(); // 获取上传凭证
      const uploadedKey = await uploadToQiniu(image, token); // 上传图片
      const imageUrl = `https://mini-project.muxixyz.com/${uploadedKey}`; // 拼接完整 URL
  
      console.log('图片 URL:', imageUrl);
      setImageUrl(imageUrl); // 更新状态
    } catch (error) {
      console.error('上传流程失败:', error);  
    }
  };





    const [activeId, setActiveId] = useState(null)
    const [activetext,setActivetext]=useState('tag')    
    const handlePress = (id,text) => {
      setActiveId(id);
      setActivetext(text);
      setCircle(false);
    };
        
    const getTagStyle = (id) => {
      return activeId === id ? styles.activeTag : styles.inactiveTag;
    };
    const getTextStyle = (id) => {
      return activeId === id ? styles.activetext : styles.inactivetext
    }
    const [circle,setCircle]=useState(false)
        const getCircle=()=>{
        setCircle(true)
        }
        const unCircle=()=>{
            setCircle(false)
        }
  if (should1) {
  return (
    <View>
      <LinearGradient
      colors={['#3D89FB','#9EC5FE']} 
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
       style={{width:"100%",height:'100%',backgroundColor:'#3D89FB'}}
      >
    <View style={{height:80}}>
     <View style={styles.first}>
        <Text onPress={()=>{navigation.goBack()}}><FontAwesome color={'white'} size={35} name='angle-left'/></Text>
        <Text style={{fontSize:24,textAlign:'center',width:"40%",margin:'auto',fontFamily:'Source Han Sans-Bold',fontWeight:700,color:'white'}}>组卷</Text>
    </View>   
    </View>
    
    <View style={{width:'80%',height:'20%',marginLeft:'10%'}}>
      <TouchableOpacity onPress={handleUpload}>
      <View style={styles.second}>
        <Image source={{ uri: imageUrl }}
          style={{width:'100%',height:'100%'}}
          />
      </View>
      </TouchableOpacity>
      <Text style={{marginTop:10,fontSize:20,fontFamily:'Source Han Sans-Bold',fontWeight:700,color:'white',textAlign:'center'}}>封面</Text>
    </View>

    <View style={styles.third}>
      <TextInput value={sheetname} onChangeText={setSheetname} style={{marginLeft:5,fontSize:16,fontFamily:'Source Han Sans-Bold',fontWeight:700}} placeholder='请输入卷子名称'></TextInput>
    </View>
    <View style={styles.third}>
      <TextInput value={discirption} onChangeText={setDiscirption} style={{marginLeft:5,fontSize:16,fontFamily:'Source Han Sans-Bold',fontWeight:700}} placeholder='请输入卷子简介'></TextInput>
    </View>

    <View style={styles.third}>
         <Text style={{marginTop:8,marginLeft:10,fontSize:16,fontFamily:'Source Han Sans-Bold',fontWeight:700}}>选择圈子</Text>
         <View style={{marginLeft:80,position:'absolute',marginTop:12,height:20,backgroundColor:'#3D89FB',borderRadius:8,}}>
         <Text style={{marginLeft:8,fontSize:13,fontFamily:'Source Han Sans-Bold',fontWeight:700,color:'white',marginRight:8}}>{activetext}</Text>
         </View>
         <FontAwesome onPress={circle?unCircle:getCircle} size={28} name={circle?'angle-up':'angle-down'} style={{top:6,right:15,position:'absolute'}} />
        </View>
    
          {circle&&<View style={styles.end}>
                <View style={{flexDirection:'row',flexWrap:'wrap',marginBottom:20}}>
                {options.map((tag) => (
                <View key={tag.Id} style={[styles.tagContainer, getTagStyle(tag.Id)]}>
              <Text onPress={() => handlePress(tag.Id,tag.Name)} style={getTextStyle(tag.Id)}>{tag.Name}</Text>                
                </View>
              ))}      
                </View>
          </View>}
        
        <View style={styles.sure}><Text onPress={toAdd} style={{textAlign:'center',marginTop:8,color:'white',fontSize:26,fontFamily:'Source Han Sans-Bold',fontWeight:700}}>确认</Text></View>
        
      </LinearGradient>
    </View>
  );
}
}
const styles = StyleSheet.create({
    first:{
        flex:1,
        flexDirection:'row',
        justifyContent:'space-between',
        padding:25
    },second:{
      width:'45%',
      height:'90%',
      backgroundColor:'white',
      borderRadius:15,
      marginLeft:'27.5%',
      marginTop:10,
      elevation:10,
      overflow:'hidden'
    },third:{
      height:40,
      width:'70%',
      backgroundColor:'white',
      marginTop:40,
      marginLeft:'15%',
      borderRadius:10,
      elevation:10
    },end:{
        width:'70%',
        marginLeft:'15%',
        marginTop:-8,
        backgroundColor:'white',
        display:'flex',
        borderBottomLeftRadius:10,
        borderBottomRightRadius:10,
    }, tagContainer: {
        height:22,
        backgroundColor:'#3D89FB',
        borderRadius:8,
        marginTop:20,
        marginLeft:24,
      },
      inactiveTag: {
        backgroundColor:'white',
        elevation:1,
        borderRadius:10
      },
      activeTag: {
        backgroundColor: '#3D89FB',
        color: '#fff',
      },activetext:{
        textAlign:'center',
        color:'white',
        fontSize:13,fontFamily:'Source Han Sans-Bold',fontWeight:700,
        marginLeft:8,
        marginRight:8
      },inactivetext:{
        textAlign:'center',
        color:'#111313',
        fontSize:13,fontFamily:'Source Han Sans-Bold',fontWeight:700,
        marginLeft:8,
        marginRight:8
      },sure:{
        marginTop:50,
        marginLeft:'35%',
        width:'30%',
        height:55,
        elevation:5,
        borderRadius:15,
        backgroundColor:'#3083FE',
      }
})