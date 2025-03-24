import { View, Text, StyleSheet, TextInput, Dimensions, ScrollView , Image} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { Post } from '../axios';
import { useRoute } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import myStory from '../datas';
const { width } = Dimensions.get('window');
const itemMargin = 0.01*width;
const itemVerticalMargin = '3%';

export default function HomeScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [datas,setDatas]=useState();
  const [message, setMessage] = useState([]);
  const [should, setShould] = useState(false);
  const [change,setChange]=useState(false)
  const search = route.params.search;

  const getlove=async(love , testid)=>{
      if (love) {
      const data1 = await Post('/test/unlovetest',{"testid":testid})
      console.log(data1);
      setChange(!change);
      }else{
      const data1 = await Post('/test/lovetest',{"testid":testid}) 
      console.log(data1);
      setChange(!change);
      }
    }
  const searchsheet = async (history) => {
    try {
      const response = await Post('/search/searchtest', {
        "testkey": history,
      });
      console.log(response.test);
      setDatas(response.test);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    searchsheet(search);
  }, []);
  useEffect(() => {
    if (datas) {
      const getByid=async(id1,id2,index)=>{
      const data =await Post('/user/getname',{"id":id1});
      const head = await Post('user/getuserphoto',{"id":id1})
      const datalove =await Post('test/showlovetest',{"testid":id2})
      console.log(datalove);
      if (datalove.message == "已经点过赞") {
        datas[index]={...datas[index],love:true,head:head.success}
      }else{
        datas[index]={...datas[index],love:false,head:head.success}
      }
      console.log(index);
      return data;
    }
    const getData = async()=>{
        const promises = datas.map((item, index) => getByid(item.Userid,item.Testid,index));
        const results = await Promise.all(promises);
        const combinedData = datas.map((item, index) => ({
          ...item,
          ...results[index]
        }));
        setMessage(combinedData);
        console.log(combinedData);
        console.log(results);
        setShould(true)
        console.log(datas);
    }
    getData();
    }
  }, [datas,change]);

  const [leftColumn, setLeftColumn] = useState();
  const [rightColumn, setRightColumn] = useState(); 
  useEffect(()=>{
    if (should) {
      const datas = message.map(item => ({
      ...item,
      height: Math.floor(Math.random() * 100) + 220, 
    }))    
    setLeftColumn(datas.filter((_, index) => index % 2 === 0));
    setRightColumn(datas.filter((_, index) => index % 2 !== 0)); 
    console.log(message);
    }
    },[message])
    const setsheet=(id)=>{
      myStory.data['sheet']=id;
      console.log(myStory.data['sheet']);
      toStart();
    }
    const toStart=()=>{
      navigation.navigate('sheet') 
    }
  const renderItem = (item,index) => (
      <View key={item.Testid} style={[styles.page, { height: item.height }]}>
        <TouchableOpacity /* onPress={()=>{setsheet(item.Testid)}} */>
        <Image source={{ uri: item.Imageurl }} style={[styles.image, { height: item.height - 80 }]} />
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{item.Testname}</Text>
          <View style={styles.authorContainer}>
            <View style={styles.avatar}>
              <Image source={{ uri: item.head }} style={{width:'100%',height:'100%'}} />
            </View>
            <View>
              <Text style={{fontSize:14,fontWeight:700,fontFamily:'Source Han Sans-Bold',color:'#3D3D3D'}}>{item.success}</Text>
                <Text style={{fontSize:10,fontWeight:700,fontFamily:'Source Han Sans-Bold',color:'#737576'}}>#{item.Circle}</Text>
            </View>
            <TouchableOpacity onPress={()=>getlove(item.love,item.Testid)} style={styles.likeButton}>
              <Image 
              source={item.love?require('../img/pic9.png'):require('../img/pic10.png')}
              style={{width:18,height:16,marginTop:'5%',marginRight:5}}
              /> 
              <Text style={{color: '#3D89FB'}}>{item.Good}</Text>
            </TouchableOpacity>
          </View>
        </View>  
        </TouchableOpacity>
      </View>
    );
if (leftColumn&&rightColumn) {
  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <View style={styles.inputContainer}>
          <FontAwesome onPress={() => navigation.navigate('index')} style={styles.searchIcon} size={20} name="search" />
          <TextInput
            style={styles.input}
            placeholderTextColor={'#3D89FB'}
            placeholder={search}
          />
        </View>
        <Text style={styles.cancelText} onPress={() => navigation.navigate('index')}>取消</Text>
      </View>

      <View style={styles.tabContainer}>
        <View style={[styles.tab, styles.activeTab]}><Text style={styles.activeTabText}>卷子</Text></View>
        <View style={styles.tab}><Text onPress={() => navigation.navigate('circle', { 'search': search })} style={styles.tabText}>圈子</Text></View>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.columnsContainer}>
          <View style={styles.column}>{leftColumn.map(renderItem)}</View>
          <View style={styles.column}>{rightColumn.map(renderItem)}</View>
        </View>
      </ScrollView>
    </View>
  );
}
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: '100%',
    width: '100%',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  inputContainer: {
    width: "80%",
    height: 40,
    marginLeft: "3%",
    elevation:10,
    backgroundColor:'white',
    borderRadius: 15,
    flexDirection: 'row',
  },
  searchIcon: {
    marginLeft:30,
    color:'#3D89FB',
    marginTop:8
  },
  input: {
    marginLeft: '5%',
    flex: 1,
    fontSize:16,
    fontFamily:'Source Han Sans-Bold',
    fontWeight:700,
    color: '#3D89FB',
    height:42
  },
  cancelText: {
    marginLeft: "5%",
    fontSize:16,
    fontFamily:'Source Han Sans-Bold',
    fontWeight:700,
  },
  tabContainer: {
    flexDirection: 'row',
    marginTop: '5%',
    elevation:2,
    backgroundColor:'white'
  },
  tab: {
    width: '50%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTab: {
    borderTopRightRadius: 15,
    backgroundColor: "#3D89FB",
  },
  tabText: {
    fontSize: 20,
    fontFamily:'Source Han Sans-Bold',
    fontWeight:700,
  },
  activeTabText: {
    fontSize: 20,
    color: 'white',
    fontFamily:'Source Han Sans-Bold',
    fontWeight:700,
  },
  scrollViewContent: {
    flexGrow: 1,
    marginTop:10
  },
  columnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: itemMargin,
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
    fontSize:14,
    fontFamily:'Source Han Sans-Bold',
    fontWeight:700,
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