import { Redirect ,Link} from 'expo-router';
import { View, Text, StyleSheet, ScrollView ,Button,Alert,Image , Dimensions, TouchableOpacity} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import React,{ useState , useEffect ,useRef,useCallback} from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import { Post,Get } from '../axios';
import { useNavigation } from 'expo-router';
import { useRoute } from '@react-navigation/native';
import myStory from '../datas';
const { width } = Dimensions.get('window');
const itemMargin = 0.01*width;
const itemVerticalMargin = '3%';

export default function Tab() {
  const navigation = useNavigation();
  const route = useRoute();
  const [imageUrl, setImageUrl] = useState(null);
  const [shoulder, setShoulder] = useState(false);
  const [leftColumn, setLeftColumn] = useState([]);
  const [rightColumn, setRightColumn] = useState([]);
  const [datas, setDatas] = useState([]);
  const circleid = myStory.data['circleId']
  const discription = myStory.data['discription']
  const [isLoading, setIsLoading] = useState(false);
  let follow = myStory.data['follow']
  const scrollViewRef = useRef(null);
  let page = 1;

  const handleFollow = async() => {
    try {
      const data = await Post('/circle/followcircle', {"circleid": circleid})
      if (data.message) {
        follow = '已关注';
      } else {
        console.error('关注失败:', data.message);
      }
    } catch (error) {
      console.error('关注请求出错:', error);
    }
  }
  
  const unFollow = async() => {
    try {
      const data = await Post('/circle/unfollowcircle', {"circleid": circleid})
      if (data.message) {
        follow = '未关注'
      } else {
        console.error('取消关注失败:', data.message);
      }
    } catch (error) {
      console.error('取消关注请求出错:', error);
    }
  }

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
    const tags = [
        {id:1,text:'推荐'},
        {id:2,text:'最热'},
        {id:3,text:'最新'},
    ]
    useEffect(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
      }
      page = 1;
      setDatas([]);
      loadMoreData();
      }, [activeId]);

    const loadMoreData = useCallback(async () => {  
        if (isLoading) return;
        setIsLoading(true);
        try {
          let newData;
          console.log(circleid);
          if (activeId===1) {
            newData = await Post('/test/recommenttest',{'circle':circleid,"page":page})
          }else if (activeId===2) {
            newData = await Post('/test/hottest',{'circle':circleid,"page":page})
          }else if (activeId===3) {
            newData = await Post('/test/newtest',{'circle':circleid,"page":page})
          }
          console.log(newData,page);
          setShoulder(true);
          if (newData && newData.test && newData.test.length > 0) {
            const processedData = await Promise.all(newData.test.map(async (item) => {
              const nameData = await Post('/user/getname', { "id": item.Userid });
              const headData = await Post('user/getuserphoto', { "id": item.Userid });
              const loveData = await Post('test/showlovetest', { "testid": item.Testid });
              return {
                ...item,
                success: nameData.success,
                head: headData.success,
                love: loveData.message === "已经点过赞",
                height: Math.floor(Math.random() * 100) + 220,
              };
            }));
            console.log(processedData);
            setDatas(prevDatas => [...prevDatas, ...processedData]);
            page++;
          }
        }catch (error) {
          console.error('Error loading more data:', error);
        } finally {
          setIsLoading(false);
        }
    }, [activeId, page, isLoading]);

    const handleScroll = (event) => {
      const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
      const paddingToBottom = 20;
      
      if (!isLoading &&
          contentOffset.y + layoutMeasurement.height >= 
          contentSize.height - paddingToBottom) {
        loadMoreData();
      }
    };
  

    useEffect(() => {
        const leftCol = datas.filter((_, index) => index % 2 === 0);
        const rightCol = datas.filter((_, index) => index % 2 !== 0);
        setLeftColumn(leftCol);
        setRightColumn(rightCol);    
      }, [datas]);

  const renderItem = (item, index) => (
    <View key={index} style={[styles.page, { height: item.height }]}>
      <TouchableOpacity onPress={() => setsheet(item.Testid)}>
        <Image source={{ uri: item.Imageurl }} style={[styles.image, { height: item.height - 80 }]} />
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{item.Testname}</Text>
          <View style={styles.authorContainer}>
            <View style={styles.avatar}>
              <Image source={{ uri: item.head }} style={{ width: '100%', height: '100%' }} />
            </View>
            <View>
              <Text style={{ fontSize: 14, fontWeight: '700', fontFamily: 'Source Han Sans-Bold', color: '#3D3D3D' }}>{item.success}</Text>
              <Text style={{ fontSize: 10, fontWeight: '700', fontFamily: 'Source Han Sans-Bold', color: '#737576' }}>#{item.Circle}</Text>
            </View>
            <TouchableOpacity onPress={() => getlove(item.love, item.Testid, index, item.Good)} style={styles.likeButton}>
              <Image 
                source={item.love ? require('../img/pic9.png') : require('../img/pic10.png')}
                style={{ width: 18, height: 16, marginTop: '5%', marginRight: 5 }}
              /> 
              <Text style={{ color: '#737576' ,fontFamily: 'Source Han Sans-Bold', fontWeight: '700'}}>{item.Good}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
  return (
    <View style={styles.container}>
    <Text style={{marginLeft:'5%',marginTop:'4%',position:'absolute'}} onPress={()=>{navigation.goBack()}}><FontAwesome color={'white'} size={35} name='angle-left'/></Text>
    {follow == "未关注"?
    <TouchableOpacity 
      style={styles.followButton} 
      onPress={() => handleFollow()}
    >
      <Text style={styles.followButtonText}>关注</Text>
    </TouchableOpacity>
    :
    <TouchableOpacity 
      style={styles.unfollow} 
      onPress={() => unFollow()}
    >
      <Text style={styles.unfollowButtonText}>取消关注</Text>
    </TouchableOpacity>
    }
      <ScrollView
      ref={scrollViewRef}
      contentContainerStyle={styles.scrollViewContent}
      onScroll={handleScroll}
      scrollEventThrottle={16} 
      >
      <View style={styles.box}>
        <TouchableOpacity onPress={null}>
         <View style={styles.head}>
         {imageUrl && (
        <Image source={{ uri: imageUrl }}/>
        )}
        </View> 
        </TouchableOpacity>
        

        <Text style={{textAlign:'center',marginTop:60,fontSize:24,fontWeight:700,fontFamily:"Source Han Sans-Bold"}}>{circleid}</Text>
        <Text style={{textAlign:'center',marginTop:10,fontSize:16,fontWeight:700,fontFamily:"Source Han Sans-Bold",color:'#777777'}}>简介：{discription}<Text></Text></Text>

        <View style={{flexDirection:'row',top:30,left:10,justifyContent:'space-around',borderBottomWidth:0.5,paddingBottom:10,borderColor:'gray'}}>
        {tags.map((tags)=>(
          <View key={tags.id} style={[styles.message, getTagStyle(tags.id)]}>
            <Text onPress={() => handlePress(tags.id)} style={[styles.text,getTextStyle(tags.id)]}>{tags.text}</Text>
          </View>
        ))}
        </View>
        <View style={styles.columnsContainer}>
          <View style={styles.column}>{leftColumn.map(renderItem)}</View>
          <View style={styles.column}>{rightColumn.map(renderItem)}</View>
        </View>
      </View>
      </ScrollView>
    </View>
  );    
    }
  

const styles = StyleSheet.create({
  container: {
    width:'100%',
    height:'100%',
    backgroundColor:'#3D89FB'
  },box:{
    height:'100%',
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
    position:'absolute',
    marginLeft:-50,
    marginTop:-50,
    left:'50%',
    elevation:2
  },message:{
    marginLeft:10,
    width:65,
    height:28,
    borderRadius:10,
  },text:{
    textAlign:'center',
    marginTop:2,fontSize:16,fontWeight:700,fontFamily:"Source Han Sans-Bold",
    margin:'auto'
  },
  inactiveTag: {
    backgroundColor:'white',
  },
  activeTag: {
    backgroundColor: '#3D89FB',
  },activetext:{
    color:'white'
  },inactivetext:{
    color:'#777777'
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
    width: '99%',
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: itemVerticalMargin,
    elevation:0.6,
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
    fontWeight: '700', fontFamily: 'Source Han Sans-Bold'
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
  },followButton: {
    position:'absolute',
    marginTop:'4%',
    marginLeft:'80%',
    width:60,
    height:30,
    backgroundColor:'white',
    borderRadius:15
  },
  followButtonText: {
    fontSize:18,
    fontWeight:700,
    fontFamily:"Source Han Sans-Bold",
    textAlign:'center',
    margin:'auto'
  },unfollow:{
    position:'absolute',
    marginTop:'4%',
    marginLeft:'75%',
    width:90,
    height:30,
    backgroundColor:'#FB5D5D',
    borderRadius:15
  },unfollowButtonText:{
    fontSize:18,
    fontWeight:700,
    fontFamily:"Source Han Sans-Bold",
    textAlign:'center',
    margin:'auto',
    color:'white'
  }
});