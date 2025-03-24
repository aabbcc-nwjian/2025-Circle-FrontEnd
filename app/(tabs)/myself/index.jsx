import { Redirect ,Link} from 'expo-router';
import { View, Text, StyleSheet, ScrollView ,Button,Alert,Image , Dimensions, TouchableOpacity,TextInput, ImageBackground} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import React,{ useState , useEffect , useCallback,useRef} from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import { Get } from '../../axios';
import { Post } from '../../axios';
import Loading from '../../loading';
import myStory from '../../datas';
import { debounce } from 'lodash';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
const { width } = Dimensions.get('window');
const itemMargin = 0.01*width;
const itemVerticalMargin = '3%';

export default function Tab() {
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
      sethead(imageUrl);
    } catch (error) {
      console.error('上传流程失败:', error);  
    }
  };
  const sethead=async(image)=>{
   const data = await Post('/user/setphoto',{"imageurl":image}); 
   console.log(data);
  }

  const scrollViewRef = useRef(null);
  const [user, setUser] = useState('');
  const [discription, setDiscription] = useState('');
  const [data1, setData1] = useState([]);//我编的卷
  const [data2, setData2] = useState([]);//我做的卷
  const [data3, setData3] = useState([]);//我编的题
  const [data4, setData4] = useState([]);//我做的题
  const [should,setShould] = useState(false)
  const [shouldRender1, setShouldRender1] = useState(false);
  const [shouldRender2, setShouldRender2] = useState(false);
  const [shouldRender3, setShouldRender3] = useState(false);
  const [shouldRender4, setShouldRender4] = useState(false);
  const [shouldRender5, setShouldRender5] = useState(false);
  const [shouldRender6, setShouldRender6] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [allp, setAllp] = useState();
  const [allc, setAllc] = useState();

  //获取用户信息
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await Get('/user/myuser');
        console.log(userData.success);
        setImageUrl(userData.success.Imageurl)
        setUser(userData.success.Name);
        setUservalue(userData.success.Name)
        setDiscription(userData.success.Discription);
        setDiscriptionvaule(userData.success.Discription)
        const data = await Get('/user/alluserpractice');
        setAllp(data.success.Allpracticenum);
        setAllc(data.success.Allcorrectnum);
        console.log(data.success);
        setShould(true);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserData();
  }, []);

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

  const [page, setPage] = useState(1);
  const getMypaper = async()=>{
    try {
      const userData = await Post('/user/mytest', { "page": page });
      setData1(userData.success);
      console.log(userData.success);
      setPage(prevPage => prevPage + 1);
    } catch (error) {
      console.error(error);
    }
    setShouldRender1(true);
  }

  const getDopaper = async()=>{
    try {
      const userData = await Post('/user/mydotest', { "page": page });
      setData2(userData.success);
      console.log(userData.success);
      setPage(prevPage => prevPage + 1);
    } catch (error) {
      console.error(error);
    }
    setShouldRender2(true);
  }

  const myPractice = async()=>{
    try {
      const userData = await Post('/user/mypractice', { "page": page });
      setData3(userData.success);
      console.log(userData.success,page);
      setPage(prevPage => prevPage + 1);
    } catch (error) {
      console.error(error);
    }
    setShouldRender3(true);
  }

  const mydoPractice = async()=>{
    try {
      const userData = await Post('/user/mydopractice', { "page": page });
      setData4(userData.success);
      console.log(userData.success,page);
      setPage(prevPage => prevPage + 1);
    } catch (error) {
      console.error(error);
    }
    setShouldRender4(true);
  }

  const loadMoreData = useCallback(async () => {  
    if (isLoading) return;
    setIsLoading(true);
    try{
    if (activeId == 1) {
      await mydoPractice();
    }else if (activeId == 2) {
      await getDopaper();
    }else if (activeId == 3) {
      await myPractice();
    }else if (activeId == 4) {
      await getMypaper();
    }
  } catch (error) {
    console.error('Error loading more data:', error);
  } finally {
    setIsLoading(false);
  }
  }, [activeId, isLoading, page])
  useEffect(()=>{
    if (activeId == 1) {
      setPage(1);
      mydoPractice();
    }else if (activeId == 2) {
      setPage(1);
      getDopaper();
    }else if (activeId == 3) {
      setPage(1);
      myPractice();
    }else if (activeId == 4) {
      setPage(1);
      getMypaper();
    }
  },[activeId])


  const debouncedLoadMore = useCallback(
    debounce(() => {
      if (!isLoading) {
        loadMoreData();
      }
    }, 300),
    [loadMoreData, isLoading]
  );
  
  const handleScroll = (event) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const paddingToBottom = 20;
    
    if (contentOffset.y + layoutMeasurement.height >= 
        contentSize.height - paddingToBottom) {
      debouncedLoadMore();
    }
  };

  //获取做过的练习具体信息
  const [dopractice, setDopractice] = useState([])
  useEffect(() => {
    const getDopracticeid = async () => {
      if (shouldRender4) {
        const getid = data4.map((item) => item.Practiceid);
        const promises = getid.map(id => getDopractice(id));
        const results = await Promise.all(promises);
        
        setDopractice(prevPractice => [...prevPractice, ...results]);
        setShouldRender5(true);
      }
    }
    const getDopractice = async(id)=>{
      let res = []
        try {
        const userData1 = await Post('/practice/getoption',{"practiceid":id});
        const userData2 = await Post('/practice/getpractice',{"practiceid":id});
        console.log(userData1);
        console.log(userData2);   
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
  
  //获取我编的题具体信息
  const [mypractice,setMypractice]=useState([])
  useEffect(() => {
    const getDopracticeid = async () => {
      if (shouldRender3) {
        try {
          const promises = data3.map(item => getDopractice(item.Practiceid, item.Content, item.Answer));
          const results = await Promise.all(promises);
          console.log(results);
          setMypractice(prevPractice => [...prevPractice, ...results]);
          setShouldRender6(true);
        } catch (error) {
          console.error('Error in getDopracticeid:', error);
        }
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
  },[data3,shouldRender3])
  //计算正确率
  const zhanji = { total: allp, correct: allc };
  const [average, setAverage] = useState('0.0')
    useEffect(() => {
      if (allc&&allp) {
        const res = ((zhanji.correct/zhanji.total)*100).toFixed(1)
        setAverage(res)
      }
    },[allp, allc])

  const [leftColumn1, setLeftColumn1] = useState([]);
  const [rightColum1, setRightColumn1] = useState([]); 
  const [leftColumn2, setLeftColumn2] = useState([]);
  const [rightColumn2, setRightColumn2] = useState([]);
  
  // 获取我做的卷的信息
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
        const head = await Post('user/getuserphoto',{"id":user})
        const userData2 = await Post('/test/gettest',{"testid":test});
        const datas = {...userData2.test,user:userData1.success,head:head.success}      
        return datas;
      } catch (error) {
        console.error(error);
      }
    }  
    getDopracticeid();
  },[data2])

  // 获取点赞
  const [message1,setMessage1]=useState()
  const [message2,setMessage2]=useState()
  useEffect(() => {
      const getByid1=async(id,index)=>{
        const datalove =await Post('test/showlovetest',{"testid":id})
        console.log(datalove,id);
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
        if (dotests) {
        const promises2 = dotests.map((item, index) => getByid2(item.Testid,index));
        const results2 = await Promise.all(promises2);
        setMessage2(results2);
        }
        if (data1) {
        const promises1 = data1.map((item, index) => getByid1(item.Testid,index));
        const results1 = await Promise.all(promises1);
        setMessage1(results1);
        console.log(data1);
        }
      }
      getData();
    }, [data1,dotests]);

  const [completedata,setCompletedata]=useState([])
  const [completedatas,setCompletedatas]=useState([])
  useEffect(() => {
   console.log(message1);
   
      if (message2) {
        const dotest = dotests.map((item) => ({
        ...item,
        height: Math.floor(Math.random() * 100) + 220,
      }));
    console.log(dotest);
    setCompletedata(prevDatas => [...prevDatas, ...dotest])
    }

    if (message1) {
     const mytest = data1.map((item) => ({
      ...item,
      height: Math.floor(Math.random() * 100) + 220,
    }));
    console.log(mytest);
    setCompletedatas(prevDatas => [...prevDatas, ...mytest]) 
    }
      
    }, [message1,message2]);

    const setsheet=(id)=>{
      myStory.data['sheet']=id;
      console.log(myStory.data['sheet']);
      navigation.navigate('sheet') 
    }
    useEffect(() => {
      setLeftColumn1(completedata.filter((_, index) => index % 2 === 0));
      setRightColumn1(completedata.filter((_, index) => index % 2 !== 0));
    }, [completedata])
    useEffect(() => {
      setLeftColumn2(completedatas.filter((_, index) => index % 2 === 0));
      setRightColumn2(completedatas.filter((_, index) => index % 2!== 0));
    }, [completedatas])

  const renderItem = (item,index) => (
      <View key={index} style={[styles.page, { height: item.height }]}>
        <TouchableOpacity onPress={()=>{setsheet(item.Testid)}}>
        <Image source={{ uri: item.Imageurl }} style={[styles.image, { height: item.height - 80 }]} />
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{item.Testname}</Text>
          <View style={styles.authorContainer}>
            <View style={styles.avatar}>
              <Image source={{ uri: item.head}} style={{width:'100%',height:'100%'}} />
            </View>
            <View>
            <Text style={{fontSize:14,fontWeight:700,fontFamily:'Source Han Sans-Bold',color:'#3D3D3D'}}>{item.user}</Text>
            <Text style={{fontSize:10,fontWeight:700,fontFamily:'Source Han Sans-Bold',color:'#737576'}}>#{item.Circle}</Text>
            </View>
            <TouchableOpacity style={styles.likeButton}>
              <Image 
              source={require('../../img/pic10.png')} 
              style={{width:18,height:16,marginTop:'5%',marginRight:5}}
              /> 
              <Text style={{color: '#3D89FB'}}>{item.Good}</Text>
            </TouchableOpacity>
          </View>
        </View> 
        </TouchableOpacity> 
      </View>
    );
  const renderItems = (item) => (
      <View key={item.Testid} style={[styles.page, { height: item.height }]}>
        <TouchableOpacity onPress={()=>{setsheet(item.Testid)}}>
        <Image source={{ uri: item.Imageurl }} style={[styles.image, { height: item.height - 80 }]} />
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{item.Testname}</Text>
          <View style={styles.authorContainer}>
            <View style={styles.avatar}>
              <Image source={{ uri: imageUrl }} style={{width:'100%',height:'100%'}} />
            </View>
            <View>
              <Text style={{fontSize:14,fontWeight:700,fontFamily:'Source Han Sans-Bold',color:'#3D3D3D'}}>{user}</Text>
              <Text style={{fontSize:10,fontWeight:700,fontFamily:'Source Han Sans-Bold',color:'#737576'}}>#{item.Circle}</Text>
            </View>
            <TouchableOpacity style={styles.likeButton}>
            <Image 
              source={require('../../img/pic10.png')} 
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
  if (!should) {
    return (
      <Loading/>
    );
  }else{
  return (
    <LinearGradient 
    colors={['#3083FE','#63A2FF','#A2C6FB']} 
    start={{ x: 0, y: 0 }}
    end={{ x: 0, y: 1 }}
    style={styles.container}>
    <View style={{marginTop:'3%', marginLeft:'3%',width:30,height:30,marginBottom:'2%'}}>
      <Link href="/setting">
      <Image 
      source={require('../../img/pic2.png')} 
      style={{width: '100%', height: '150%', resizeMode: 'contain',marginRight:200}}
     />
      </Link>
    </View>
      <ScrollView
      ref={scrollViewRef}
      scrollEventThrottle={16}
      onScroll={handleScroll}
      >
      <ImageBackground  source={require('../../img/bac2.png')} style={{width:'100%',height:'100%'}}>  
        <TouchableOpacity onPress={handleUpload}>
         <View style={styles.head}>
         {imageUrl && (
        <Image source={{ uri: imageUrl }}
        style={{width:'100%',height:'100%'}}
        />
        )}
        </View> 
        </TouchableOpacity>
        
        {changeuser?
        <TextInput value={uservalue} onChangeText={setUservalue} style={{marginTop:50,width:'60%',marginLeft:'20%',fontSize:24,fontWeight:700,fontFamily:"Source Han Sans-Bold"}}></TextInput>
        :<Text style={{textAlign:'center',marginTop:80,fontSize:24,fontWeight:700,fontFamily:"Source Han Sans-Bold"}}>{user}</Text>
        }
        {changeuser?
        <View style={{flexDirection:'row',position:'absolute',width:'20%',marginTop:80,marginLeft:'70%'}}>
        <Text onPress={changeUser} style={{fontSize:10}}>确定</Text>  
        <Text onPress={()=>setChangeuser(false)} style={{fontSize:10,marginLeft:20}}>取消</Text>  
        </View>
        :<Text onPress={()=>setChangeuser(true)} style={{position:'absolute',marginTop:80,marginLeft:'70%',fontSize:10}}>修改</Text>
        }
        {changediscription?
        <TextInput value={discriptionvaule} onChangeText={setDiscriptionvaule} style={{width:'50%',marginLeft:'25%',fontSize:16,fontWeight:500,fontFamily:"Source Han Sans-Bold"}} maxLength={20}></TextInput>
        :<Text style={{textAlign:'center',marginTop:10,fontSize:16,fontWeight:500,fontFamily:"Source Han Sans-Bold",color:'#777777'}}>简介：{discription}</Text>
        }
        {changediscription?
        <View style={{flexDirection:'row',position:'absolute',width:'20%',marginTop:110,marginLeft:'75%'}}>
        <Text onPress={changeDiscription} style={{fontSize:10}}>确定</Text>
        <Text onPress={()=>setChangediscription(false)} style={{fontSize:10,marginLeft:20}}>取消</Text>
        </View>
        :<Text onPress={()=>setChangediscription(true)} style={{position:'absolute',marginTop:110,marginLeft:'75%',fontSize:10}}>修改</Text>
        }

        <View style={{justifyContent:'space-evenly',flexDirection:'row',marginTop:5}}>
              <View style={[{margin:20}]}>
                  <Text style={{textAlign:'center',fontSize:20,fontWeight:700,fontFamily:"Source Han Sans-Bold"}}>{zhanji.total}</Text>
                  <Text style={{textAlign:'center',marginTop:10,fontSize:14,fontWeight:700,fontFamily:"Source Han Sans-Bold",color:'#777777'}}>总练习题数</Text>
              </View>
              <View style={[{margin:20}]}>
                  <Text style={{textAlign:'center',fontSize:20,fontWeight:700,fontFamily:"Source Han Sans-Bold"}}>{zhanji.correct}</Text>
                  <Text style={{textAlign:'center',marginTop:10,fontSize:14,fontWeight:700,fontFamily:"Source Han Sans-Bold",color:'#777777'}}>答对题数</Text>
              </View>
              <View style={[{margin:20}]}>
                  <Text style={{textAlign:'center',fontSize:20,fontWeight:700,fontFamily:"Source Han Sans-Bold"}}>{average}%</Text>
                  <Text style={{textAlign:'center',marginTop:10,fontSize:14,fontWeight:700,fontFamily:"Source Han Sans-Bold",color:'#777777'}}>正确率</Text>
              </View>
        </View>

        <View style={{flexDirection:'row',top:10,left:10,}}>
        {tags.map((tags)=>(
          <View key={tags.id} style={[styles.message, getTagStyle(tags.id)]}>
            <Text onPress={() => handlePress(tags.id)} style={[styles.text,getTextStyle(tags.id)]}>{tags.text}</Text>
          </View>
        ))}
        </View>
        
        {(activeId === 1) && <View style={{marginTop:30,borderTopWidth:0.5,borderColor:'#D8D8D8'}}>
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

        {(activeId === 3 && shouldRender6)&& <View style={{marginTop:30,borderTopWidth:0.5,borderColor:'#D8D8D8'}}>
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
      </ImageBackground>  
      </ScrollView>
    </LinearGradient>
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
    borderWidth:0,
    position:'absolute',
    marginLeft:-50,
    marginTop:0,
    left:'50%',
    elevation:10,
    overflow:'hidden'
  },message:{
    marginLeft:10,
    width:80,
    height:25,
    borderRadius:10
  },text:{
    textAlign:'center',
    marginTop:2,
    fontSize:14,
    fontWeight:700,
    fontFamily:"Source Han Sans-Bold",
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
    borderBottomWidth:0.5,
    borderColor:'#D8D8D8'
  },scrollViewContent: {
    flexGrow: 1,
  },
  columnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: itemMargin,
    marginTop:30
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
    overflow:'hidden'
  },
  likeButton: {
    paddingHorizontal: 10,
    marginLeft:'65%',
    position:'absolute',
    flexDirection:'row'
  },
});