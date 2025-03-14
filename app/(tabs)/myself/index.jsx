import { Redirect ,Link} from 'expo-router';
import { View, Text, StyleSheet, ScrollView ,Button,Alert,Image , Dimensions, TouchableOpacity} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import React,{ useState , useEffect } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import { Get } from '../../axios';
import { Post } from '../../axios';
import Loading from '../../loading';
import myStory from '../../datas';
/* import * as qiniu from 'qiniu-js'; */
import * as ImagePicker from 'expo-image-picker';
import { TextInput } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { width } = Dimensions.get('window');
const itemMargin = 0.01*width;
const itemVerticalMargin = '3%';

export default function Tab() {
  const [imageUrl, setImageUrl] = useState(null);

  const handleUpload = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      const imgUrl=result.assets[0].uri;
      setImageUrl(imgUrl);
      try{
        const uploadToken=await getToken();
        const formData = new FormData();
        formData.append('token', uploadToken);
        formData.append('file', { uri: imgUrl, name: 'upload.jpg', type: 'image/jpeg' });        
        const resp=await fetch('https://upload-z2.qiniup.com',{
          method: 'POST',
          body: formData,
        })
        const responseData = await resp.json();
        
        const imageUrl=`http://mini-project.muxixyz.com/${responseData.key}`
        setImageUrl(imageUrl);
        
        console.log(imageUrl)
        console.log(user)
      }catch(error){
        console.error('上传失败', error);
      }
    } else {
      alert('您没有选择照片');
    }
  };
  const getToken = async () => {
    try {
      const response = await Get('/user/uploadphoto');
      return response.success;
    } catch (error) {
      console.error('获取 token 失败:', error);
      throw error;
    }
  };

  /* const pickImage = async () => {
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
    const mimeType = image.type || 'image/jpeg'; // 默认类型
    const extension = image.uri.split('.').pop() || 'jpg'; // 获取文件扩展名
    const fileName = image.fileName || `image_${Date.now()}.${extension}`;

    const observable = qiniu.upload(
      image.uri,
      fileName,
      token,
      { fname: fileName }, // 可选参数
      { customVars: { name: 'photo' } } // 自定义变量
    );

    return new Promise((resolve, reject) => {
      observable.subscribe({
        next: (response) => {
          console.log('上传进度:', response);
        },
        error: (err) => {
          console.error('上传失败:', err);
          reject(err);
        },
        complete: (response) => {
          console.log('上传完成:', response);
          resolve(response.key); // 返回文件的 key
        },
      });
    });
  };

  // 处理上传流程
  const handleUpload = async () => {
    try {
      const image = await pickImage();
      if (!image) return;

      const token = await getToken(); // 获取上传凭证
      const key = await uploadToQiniu(image, token); // 上传图片
      const imageUrl = `https://mini-project.muxixyz.com/${key}`; // 拼接完整 URL
      console.log('图片 URL:', imageUrl);
      setImageUrl(imageUrl); // 更新状态
    } catch (error) {
      console.error('上传流程失败:', error);
    }
  }; */


/*   const pickImage = async () => {
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
  const uploadToQiniu = async (image, token, key) => {
    // 默认文件类型为 .png
    const mimeType = image.type || 'image/png'; // 默认类型为 image/png
    const extension = image.uri.split('.').pop() || 'png'; // 默认扩展名为 png
    const fileName = key || `image_${Date.now()}.${extension}`; // 使用指定的 key 或生成默认文件名

    const formData = new FormData();
    formData.append('file', {
      uri: image.uri,
      type: mimeType,
      name: fileName,
    });
    formData.append('token', token);
    formData.append('key', fileName); // 指定 key 值

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

  // 检查文件类型
  const checkFileType = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const fileType = blob.type;
      console.log('文件类型:', fileType);

      if (!fileType.startsWith('image/')) {
        console.error('文件不是图片类型');
        return false;
      }
      return true;
    } catch (error) {
      console.error('文件类型检查失败:', error);
      return false;
    }
  };

  // 检查文件完整性
  const checkFileIntegrity = async (url, originalSize) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadedSize = blob.size;
      console.log('原始文件大小:', originalSize);
      console.log('下载文件大小:', downloadedSize);

      if (downloadedSize !== originalSize) {
        console.error('文件大小不一致，可能已损坏');
        return false;
      }
      return true;
    } catch (error) {
      console.error('文件完整性检查失败:', error);
      return false;
    }
  };

  // 检查图片预览
  const checkImagePreview = (url) => {
    return new Promise((resolve) => {
      Image.getSize(
        url,
        (width, height) => {
          console.log('图片加载成功，尺寸:', width, height);
          resolve(true);
        },
        (error) => {
          console.error('图片加载失败:', error);
          resolve(false);
        }
      );
    });
  };

  // 处理上传流程
  const handleUpload = async () => {
    try {
      const image = await pickImage();
      if (!image) return;

      const token = await getToken(); // 获取上传凭证
      const key = 'pictest1000000.png'; // 指定 key 值
      const uploadedKey = await uploadToQiniu(image, token, key); // 上传图片
      const imageUrl = `https://mini-project.muxixyz.com/${uploadedKey}`; // 拼接完整 URL

      console.log('图片 URL:', imageUrl);

      // 检查文件类型
      const isImage = await checkFileType(imageUrl);
      if (!isImage) {
        console.error('上传的文件不是图片类型');
        return;
      }

      // 检查文件完整性
      const originalSize = image.fileSize; // 原始文件大小
      const isIntegrity = await checkFileIntegrity(imageUrl, originalSize);
      if (!isIntegrity) {
        console.error('文件可能已损坏');
        return;
      }

      // 检查图片预览
      const isPreviewSuccess = await checkImagePreview(imageUrl);
      if (!isPreviewSuccess) {
        console.error('图片加载失败，可能已损坏');
        return;
      }

      setImageUrl(imageUrl); // 更新状态
    } catch (error) {
      console.error('上传流程失败:', error);
    }
  };
 */
  
  const [user, setUser] = useState('');
  const [discription, setDiscription] = useState('');
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState([]);
  const [data4, setData4] = useState([]);
  const [shouldRender1, setShouldRender1] = useState(false);
  const [shouldRender2, setShouldRender2] = useState(false);
  const [shouldRender3, setShouldRender3] = useState(false);
  const [shouldRender4, setShouldRender4] = useState(false);
  const [shouldRender5, setShouldRender5] = useState(false);
  const [shouldRender6, setShouldRender6] = useState(false);
  const [allp, setAllp] = useState();
  const [allc, setAllc] = useState();
  useEffect(() => {
    const getMypaper = async()=>{
      try {
        const userData = await Get('/user/mytest');
        const data = await Get('/user/alluserpractice');
        setAllp(data.success.Allpracticenum);
        setAllc(data.success.Allcorrectnum);
        setData1(userData.success);
        console.log(userData.success);
        console.log(data.success);
      } catch (error) {
        console.error(error);
      }
      setShouldRender1(true);
    }

    const getDopaper = async()=>{
      try {
        const userData = await Get('/user/mydotest');
        setData2(userData.success);
        console.log(userData.success);
        
      } catch (error) {
        console.error(error);
      }
      setShouldRender2(true);
    }

    const myPractice = async()=>{
      try {
        const userData = await Get('/user/mypractice');
        setData3(userData.success);
        console.log(userData.success);
      } catch (error) {
        console.error(error);
      }
      setShouldRender3(true);
    }

    const mydoPractice = async()=>{
      try {
        const userData = await Get('/user/mydopractice');
        setData4(userData.success);
        console.log(userData.success);
      } catch (error) {
        console.error(error);
      }
      setShouldRender4(true);
    }

    const fetchUserData = async () => {
      try {
        const userData = await Get('/user/myuser');
        setUser(userData.success.Name);
        setUservalue(userData.success.Name)
        setDiscription(userData.success.Discription);
        setDiscriptionvaule(userData.success.Discription)
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserData();
    getMypaper();
    getDopaper();
    myPractice();
    mydoPractice();
  }, []);

  const [dopractice, setDopractice] = useState([])
  useEffect(() => {
    const getDopracticeid = async () => {
      if (shouldRender4) {
        const getid = data4.map((item) => item.Practiceid);
        
        const promises = getid.map(id => getDopractice(id));
        const results = await Promise.all(promises);
        
        setDopractice(results);
        setShouldRender5(true);
      }
    }
    const getDopractice = async(id)=>{
      let res = []
        try {
        const userData1 = await Post('/practice/getoption',{"practiceid":id});
        const userData2 = await Post('/practice/getpractice',{"practiceid":id});
        
        res.push(userData1);
        res.push(userData2.practice.Content);
        if (userData2.practice.Variety == "判断题") {
          if (userData2.practice.Answer == "true") {
            res.push('正确')
          }else if (userData2.practice.Answer == "true"){
            res.push('错误')
          }
        }else{
          res.push(userData2.practice.Answer);
        }
        return res;
      } catch (error) {
        console.error(error);
      }
    }    
    getDopracticeid();
  },[data4])
  
  const [mypractice,setMypractice]=useState([])
  useEffect(() => {
    const getDopracticeid = async () => {
      if (shouldRender3) {
        const promises = data3.map(item => getDopractice(item.Practiceid,item.Content,item.Answer));
        const results = await Promise.all(promises);
        console.log(results);
        setMypractice(results);
        setShouldRender6(true);
      }
    }
    const getDopractice = async(id,content,answer)=>{
      let res = []
        try {
        const userData = await Post('/practice/getoption',{"practiceid":id});
        res.push(userData);
        res.push(content);
        res.push(answer);
        return res;
      } catch (error) {
        console.error(error);
      }
    }  
    getDopracticeid();
  },[data3])

  const zhanji = { total: allp, correct: allc };
  const average = ((zhanji.correct/zhanji.total)*100).toFixed(1);
  const tags = [
    {id:1,text:'练习过的题'},
    {id:2,text:'答过的卷'},
    {id:3,text:'我编的题'},
    {id:4,text:'我组的卷'},
]
const [activeId, setActiveId] = useState(1) 
const handlePress = (id) => {
  setActiveId(id);
};

const getTagStyle = (id) => {
  return activeId === id ? styles.activeTag : styles.inactiveTag;
};
const getTextStyle = (id) => {
  return activeId === id ? styles.activetext : styles.inactivetext
}


  const [leftColumn1, setLeftColumn1] = useState([]);
  const [rightColum1, setRightColumn1] = useState([]); 
  const [leftColumn2, setLeftColumn2] = useState([]);
  const [rightColumn2, setRightColumn2] = useState([]);

  const [dotests,setDotests]=useState()
  useEffect(() => {
    const getDopracticeid = async () => {
      if (shouldRender2) {
        const promises = data2.map(item => getDopractice(item.Userid,item.Testid));
        const results = await Promise.all(promises);
        console.log(results);
        setDotests(results)
      }
    }
    const getDopractice = async(user,test)=>{
        try {
        const userData1 = await Post('/user/getname',{"id":user})
        const userData2 = await Post('/test/gettest',{"testid":test});
        const datas = {...userData2.test,user:userData1.success}      
        return datas;
      } catch (error) {
        console.error(error);
      }
    }  
    getDopracticeid();
  },[data2])

  const [change,setChange]=useState(false)
  const [message1,setMessage1]=useState()
  const [message2,setMessage2]=useState()
  useEffect(() => {
      const getByid1=async(id,index)=>{
        const datalove =await Post('test/showlovetest',{"testid":id})
        if (datalove.message == "已经点过赞") {
          data1[index]={...data1[index],love:true}
        }else{
          data1[index]={...data1[index],love:false}
        }
      }
      const getByid2=async(id,index)=>{
        const datalove =await Post('test/showlovetest',{"testid":id})
        if (datalove.message == "已经点过赞") {
          dotests[index]={...dotests[index],love:true}
        }else{
          dotests[index]={...dotests[index],love:false}
        }
      }
      const getData = async()=>{
        if (data1&&dotests) {
        const promises1 = data1.map((item, index) => getByid1(item.Testid,index));
        const results1 = await Promise.all(promises1);
        setMessage1(results1);
        const promises2 = dotests.map((item, index) => getByid2(item.Testid,index));
        const results2 = await Promise.all(promises2);
        setMessage2(results2);
        }
      }
      getData();
    }, [data1,dotests,change]);
  useEffect(() => {
      if (data1&&dotests) {
        const dotest = dotests.map((item) => ({
        ...item,
        height: Math.floor(Math.random() * 100) + 220,
      }));

      setLeftColumn1(dotest.filter((_, index) => index % 2 === 0));
      setRightColumn1(dotest.filter((_, index) => index % 2 !== 0));

      const mytest = data1.map((item) => ({
        ...item,
        height: Math.floor(Math.random() * 100) + 220,
      }));
      setLeftColumn2(mytest.filter((_, index) => index % 2 === 0));
      setRightColumn2(mytest.filter((_, index) => index % 2!== 0));
      }
    }, [data1,dotests]);

    const setsheet=(id)=>{
      myStory.data['sheet']=id;
      console.log(myStory.data['sheet']);
      toStart();
    }
    const toStart=()=>{
      navigation.navigate('sheet') 
    }

  const renderItem = (item,index) => (
      <View key={index} style={[styles.page, { height: item.height }]}>
        <Image source={{ uri: item.Imageurl }} style={[styles.image, { height: item.height - 80 }]} />
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{item.Testname}</Text>
          <View style={styles.authorContainer}>
            <View style={styles.avatar}></View>
            <View>
              <Text>{item.user}</Text>
              <Text>{item.Circle}</Text>
            </View>
            <TouchableOpacity style={styles.likeButton}>
              <Image 
              source={('../../img/pic10.png')}
              style={{width:18,height:16,marginTop:'5%',marginRight:5}}
              /> 
              <Text style={{color: '#3D89FB'}}>{item.Good}</Text>
            </TouchableOpacity>
          </View>
        </View>  
      </View>
    );
  const renderItems = (item) => (
      <View key={item.Testid} style={[styles.page, { height: item.height }]}>
        <TouchableOpacity onPress={()=>{setsheet(item.Testid)}}>
        <Image source={{ uri: item.Imageurl }} style={[styles.image, { height: item.height - 80 }]} />
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{item.Testname}</Text>
          <View style={styles.authorContainer}>
            <View style={styles.avatar}></View>
            <View>
              <Text>{user}</Text>
              <Text>{item.Circle}</Text>
            </View>
            <TouchableOpacity style={styles.likeButton}>
            <Image 
              source={('../../img/pic10.png')}
              style={{width:18,height:16,marginTop:'5%',marginRight:5}}
              /> 
              <Text style={{color: '#3D89FB'}}>{item.Good}</Text>
            </TouchableOpacity>
          </View>
        </View>  
        </TouchableOpacity>
      </View>
    );


    const storeToken = async (token) => {
      try {
        await AsyncStorage.setItem('token', token);
      } catch (error) {
        console.log('Error storing token:', error);
      }
    };
    const [uservalue,setUservalue]=useState()
    const [changeuser,setChangeuser]=useState(false)
    const changeUser=async()=>{
      const data = await Post('/user/changeusername',{"newusername":uservalue})
      console.log(data);
      storeToken(data.success)
      setUser(uservalue);
      setChangeuser(false);
    }
    const [discriptionvaule,setDiscriptionvaule]=useState()
    const [changediscription,setChangediscription]=useState(false)
    const changeDiscription=async()=>{
      const data = await Post('/user/setdiscription',{"discription":discriptionvaule})
      console.log(data);
      setDiscription(discriptionvaule);
      setChangediscription(false);
    }
  if (!shouldRender1&&!shouldRender2&&!shouldRender6&&!shouldRender5) {
    return (
      <Loading/>
    );
  }else{
  return (
    <View style={styles.container}>
    <View style={{marginTop:'5%', marginLeft:'5%',width:30,height:30}}>
      <Link href="/setting">
      <Image 
      source={require('../../img/pic2.png')} 
      style={{width: '100%', height: '150%', resizeMode: 'contain',marginRight:200}}
    />
      </Link>
    </View>
      <ScrollView>
      <View style={styles.box}>
        <TouchableOpacity onPress={handleUpload}>
         <View style={styles.head}>
         {imageUrl && (
        <Image source={{ uri: imageUrl }}/>
        )}
        </View> 
        </TouchableOpacity>
        
        <View>
        {changeuser?
        <TextInput value={uservalue} onChangeText={setUservalue} style={{marginTop:60,width:'30%',marginLeft:'35%'}}></TextInput>
        :<Text style={{textAlign:'center',marginTop:60}}>{user}</Text>
        }
        {changeuser?
        <View style={{flexDirection:'row',position:'absolute',marginTop:62,width:'20%',marginLeft:'65%'}}>
        <Text onPress={changeUser} style={{fontSize:10}}>确定</Text>  
        <Text onPress={()=>setChangeuser(false)} style={{fontSize:10,marginLeft:20}}>取消</Text>  
        </View>
        :<Text onPress={()=>setChangeuser(true)} style={{position:'absolute',marginTop:62,marginLeft:'65%',fontSize:10}}>修改</Text>
        }
        </View>
        {changediscription?
        <TextInput value={discriptionvaule} onChangeText={setDiscriptionvaule} style={{marginTop:10,width:'50%',marginLeft:'25%'}} maxLength={20}></TextInput>
        :<Text style={{textAlign:'center',marginTop:10}}>简介：{discription}</Text>
        }
        {changediscription?
        <View style={{flexDirection:'row',position:'absolute',marginTop:90,width:'20%',marginLeft:'75%'}}>
        <Text onPress={changeDiscription} style={{fontSize:10}}>确定</Text>
        <Text onPress={()=>setChangediscription(false)} style={{fontSize:10,marginLeft:20}}>取消</Text>
        </View>
        :<Text onPress={()=>setChangediscription(true)} style={{position:'absolute',marginTop:90,marginLeft:'75%',fontSize:10}}>修改</Text>
        }

        <View style={{justifyContent:'space-evenly',flexDirection:'row',marginTop:20}}>
              <View style={[{margin:20}]}>
                  <Text style={{textAlign:'center'}}>{zhanji.total}</Text>
                  <Text style={{textAlign:'center',marginTop:10}}>总练习题数</Text>
              </View>
              <View style={[{margin:20}]}>
                  <Text style={{textAlign:'center'}}>{zhanji.correct}</Text>
                  <Text style={{textAlign:'center',marginTop:10}}>答对题数</Text>
              </View>
              <View style={[{margin:20}]}>
                  <Text style={{textAlign:'center'}}>{average}%</Text>
                  <Text style={{textAlign:'center',marginTop:10}}>正确率</Text>
              </View>
        </View>

        <View style={{flexDirection:'row',top:30,left:10,}}>
        {tags.map((tags)=>(
          <View key={tags.id} style={[styles.message, getTagStyle(tags.id)]}>
            <Text onPress={() => handlePress(tags.id)} style={[styles.text,getTextStyle(tags.id)]}>{tags.text}</Text>
          </View>
        ))}
        </View>
        
        {(activeId === 1)&& <View style={{marginTop:50,borderTopWidth:1}}>
        {dopractice.map((question, index) => (
        <View key={index} style={styles.questions}> 
          <View style={{marginLeft:'5%',marginBottom:10,marginRight:"5%"}}><Text>{question[1]}</Text></View>
          {question[0].option.map((option, optionIndex) => (
            <View key={optionIndex} style={styles.choose}>
              <Text>{option.Option}:   </Text>
              <Text>{option.Content}</Text>
            </View>
          ))}
          <View style={{marginLeft:'6%',marginBottom:10}}><Text>答案：{question[2]}</Text></View>
        </View>
      ))}
        </View>}

        {(activeId === 3)&& <View style={{marginTop:50,borderTopWidth:1}}>
        {mypractice.map((question, index) => (
        <View key={index} style={styles.questions}> 
          <View style={{marginLeft:'5%',marginBottom:10,marginRight:"5%"}}><Text>{question[1]}</Text></View>
          {question[0].option.map((option, optionIndex) => (
            <View key={optionIndex} style={styles.choose}>
              <Text>{option.Option}:   </Text>
              <Text>{option.Content}</Text>
            </View>
          ))}
          <View style={{marginLeft:'6%',marginBottom:10}}><Text>答案：{question[2]}</Text></View>
        </View>
      ))}
        </View>}
        
        {(activeId === 2) && 
        <View style={styles.columnsContainer}>
          <View style={styles.column}>{leftColumn1.map(renderItem)}</View>
          <View style={styles.column}>{rightColum1.map(renderItem)}</View>
        </View>}
        {(activeId === 4) && 
        <View style={styles.columnsContainer}>
          <View style={styles.column}>{leftColumn2.map(renderItems)}</View>
          <View style={styles.column}>{rightColumn2.map(renderItems)}</View>
        </View>} 
      </View>
      </ScrollView>
    </View>
  );    
    }
  
}

const styles = StyleSheet.create({
  container: {
    width:'100%',
    height:'100%',
    backgroundColor:'#3D89FB'
  },box:{
    width:'100%',
    marginTop:'30%',
    backgroundColor:'white',
    borderTopLeftRadius:20,
    borderTopRightRadius:20
  },head:{
    width:100,
    height:100,
    borderRadius:50,
    backgroundColor:'white',
    borderWidth:1,
    position:'absolute',
    marginLeft:-50,
    marginTop:-50,
    left:'50%'
  },message:{
    marginLeft:10,
    width:80,
    height:25,
    borderRadius:10
  },text:{
    textAlign:'center',
    marginTop:2
  },
  inactiveTag: {
    backgroundColor:'#D8D8D8',
  },
  activeTag: {
    backgroundColor: '#3D89FB',
  },activetext:{
    color:'white'
  },inactivetext:{
    color:'#111313'
  },choose:{
    flexDirection:'row',
    marginLeft:'5%',
    marginBottom:10
  },questions:{
    marginTop:10,
    borderBottomWidth:1
  },scrollViewContent: {
    flexGrow: 1,
  },
  columnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: itemMargin,
    marginTop:50
  },
  column: {
    width: (width - itemMargin * 3) / 2,
  },
  page: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: itemVerticalMargin,
  },
  image: {
    width: '100%',
    resizeMode: 'cover',
  },
  contentContainer: {
    height: 80,
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'gray',
    marginRight: 10,
  },
  likeButton: {
    paddingHorizontal: 10,
    marginLeft:'65%',
    position:'absolute',
    flexDirection:'row'
  },
});