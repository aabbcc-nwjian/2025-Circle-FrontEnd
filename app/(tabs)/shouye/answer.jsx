import { linkTo } from 'expo-router/build/global-state/routing';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { Post , Get} from '../../axios';
import Loading from '../../loading';
import myStory from '../../datas';
import { useNavigation } from 'expo-router';
const { width } = Dimensions.get('window');
const itemMargin = 0.01*width;
const itemVerticalMargin = '3%';

export default function Find() {
  const navigation = useNavigation()
  const [activeNav, setActiveNav] = useState('recommend');
  const [leftColumn, setLeftColumn] = useState([]);
  const [rightColumn, setRightColumn] = useState([]); 
  const navItems = [
    { id: 'recommend', title: '推荐' },
    { id: 'favor', title: '最热' },
    { id: 'new', title: '最新' },
    { id: 'follow', title: '关注' },
  ];
  const [datas,setDatas]=useState([]);
  const [message,setMessage]=useState([]);
  const [shoulder,setShoulder]=useState(false)
  const [should1,setShould1]=useState(false)
  const [change,setChange]=useState(false)
  const getlove=async(love , testid)=>{
    if (love) {
    const data1 = await Post('/test/unlovetest',{"testid":testid})
    console.log(data1);
    /* datas[index]={...datas[index],love:false} */
    setChange(!change);
    }else{
    const data1 = await Post('/test/lovetest',{"testid":testid}) 
    console.log(data1);
    /* datas[index]={...datas[index],love:true} */
    setChange(!change);
    }
  }
  useEffect(() => {
    setShoulder(false);
    const getTest = async()=>{
      if (activeNav==='recommend') {
        const data = await Post('/test/recommenttest')
        console.log(data.test);
        setDatas(data.test);
      }else if (activeNav==='favor') {
        const data = await Post('/test/hottest')
        console.log(data.test);
      }else if (activeNav==='new') {
        const data = await Post('/test/newtest')
        console.log(data.test);
      }
      else if (activeNav==='follow') {
        const data = await Get('/test/followcircletest')
        console.log(data.test);
      }
      setShoulder(true);
    }
    getTest();
  },[activeNav])
  useEffect(() => {
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
      if (shoulder) {
        const promises = datas.map((item, index) => getByid(item.Userid,item.Testid,index));
        const results = await Promise.all(promises);
        const combinedData = datas.map((item, index) => ({
          ...item,
          ...results[index]
        }));
        setMessage(combinedData);
        console.log(combinedData);
        console.log(results);
        setShould1(true)
        console.log(datas);
      }
    }
    getData();
  }, [shoulder,datas,change]);
  useEffect(() => {
    if (should1) {
    message.map(item => ({
      ...item,
      height: Math.floor(Math.random() * 100) + 220, 
    }))    
    setLeftColumn(message.filter((_, index) => index % 2 === 0));
    setRightColumn(message.filter((_, index) => index % 2 !== 0));  
    }
  },[message,should1])
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
      <TouchableOpacity onPress={()=>{setsheet(item.Testid)}}>
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
            source={item.love?require('../../img/pic9.png'):require('../../img/pic10.png')}
            style={{width:18,height:16,marginTop:'5%',marginRight:5}}
            /> 
            <Text style={{color: '#3D89FB'}}>{item.Good}</Text>
          </TouchableOpacity>
        </View>
      </View>  
      </TouchableOpacity>
    </View>
  );
  if (!shoulder) {
  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        {navItems.map(({ id, title }) => (
          <TouchableOpacity
            key={id}
            style={[styles.navItem, activeNav === id && styles.activeNavItem]}
            onPress={() => setActiveNav(id)}
          >
            <Text style={[styles.navText, activeNav === id && styles.activeNavText]}>
              {title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <Loading />
    </View>
  )
  }else{
  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        {navItems.map(({ id, title }) => (
          <TouchableOpacity
            key={id}
            style={[styles.navItem, activeNav === id && styles.activeNavItem]}
            onPress={() => setActiveNav(id)}
          >
            <Text style={[styles.navText, activeNav === id && styles.activeNavText]}>
              {title}
            </Text>
          </TouchableOpacity>
        ))}
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
    flex: 1,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 36,
    backgroundColor: 'white',
  },
  navItem: {
    paddingHorizontal: 15,
    paddingVertical: 2,
  },
  activeNavItem: {
    backgroundColor: '#3D89FB',
    borderRadius: 15,
  },
  navText: {
    fontSize: 16,
    color: 'black',
  },
  activeNavText: {
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
