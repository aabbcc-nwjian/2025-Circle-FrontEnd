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
      const datalove =await Post('test/showlovetest',{"testid":id2})
      console.log(datalove);
      if (datalove.message == "已经点过赞") {
        datas[index]={...datas[index],love:true}
      }else{
        datas[index]={...datas[index],love:false}
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
      message.map(item => ({
      ...item,
      height: Math.floor(Math.random() * 100) + 220, 
    }))    
    setLeftColumn(message.filter((_, index) => index % 2 === 0));
    setRightColumn(message.filter((_, index) => index % 2 !== 0)); 
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
        <Image source={{ uri: item.image }} style={[styles.image, { height: item.height - 80 }]} />
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{item.Testname}</Text>
          <View style={styles.authorContainer}>
            <View style={styles.avatar}></View>
            <View>
              <Text>{item.success}</Text>
              <Text>{item.Circle}</Text>
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
            placeholder='关键词'
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
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    marginLeft: 15,
    color: '#3D89FB',
  },
  input: {
    marginLeft: '10%',
    flex: 1,
  },
  cancelText: {
    marginLeft: "5%",
  },
  tabContainer: {
    flexDirection: 'row',
    marginTop: '5%',
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
    fontSize: 18,
  },
  activeTabText: {
    fontSize: 18,
    color: 'white',
  },
  scrollViewContent: {
    flexGrow: 1,
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