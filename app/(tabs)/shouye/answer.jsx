import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { Post, Get } from '../../axios';
import Loading from '../../loading';
import myStory from '../../datas';
import { useNavigation } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { Shadow } from 'react-native-shadow-2';

const { width } = Dimensions.get('window');
const itemMargin = 0.01 * width;
const itemVerticalMargin = '3%';

export default function Find() {
  const navigation = useNavigation();
  const [activeNav, setActiveNav] = useState('recommend');
  const [leftColumn, setLeftColumn] = useState([]);
  const [rightColumn, setRightColumn] = useState([]);
  const [datas, setDatas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef(null);
  let page = 1;

  const navItems = [
    { id: 'recommend', title: '推荐' },
    { id: 'favor', title: '最热' },
    { id: 'new', title: '最新' },
    { id: 'follow', title: '关注' },
  ];

  const getlove = async (love, testid, indexs, good) => {
    if (love) {
      const data1 = await Post('/test/unlovetest', { "testid": testid });
      console.log(data1);
      setDatas(prevDatas => {
        const newDatas = [...prevDatas];
        newDatas[indexs].love = false;
        newDatas[indexs].Good = good - 1;
        return newDatas;
      });
    } else {
      const data1 = await Post('/test/lovetest', { "testid": testid });
      console.log(data1);
      setDatas(prevDatas => {
        const newDatas = [...prevDatas];
        newDatas[indexs].love = true;
        newDatas[indexs].Good = good + 1;
        return newDatas;
      });
    }
  };

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
    }
    page = 1;
    setDatas([]);
    loadMoreData();
    }, [activeNav]);

  const loadMoreData = useCallback(async () => {  
    if (isLoading) return;
    setIsLoading(true);
    try {
      let newData;
      if (activeNav === 'recommend') {
        newData = await Post('/test/recommenttest', { page: page });
      } else if (activeNav === 'favor') {
        newData = await Post('/test/hottest', { page: page });
      } else if (activeNav === 'new') {
        newData = await Post('/test/newtest', { page: page });
      } else if (activeNav === 'follow') {
        newData = await Get('/test/followcircletest', { page: page });
      }
      console.log(newData,page);
      
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
        setDatas(prevDatas => [...prevDatas, ...processedData]);
        page++;
      }
    } catch (error) {
      console.error('Error loading more data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [activeNav, page, isLoading]);

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

  const setsheet = (id) => {
    myStory.data['sheet'] = id;
    console.log(myStory.data['sheet']);
    navigation.navigate('sheet');
  };

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
                source={item.love ? require('../../img/pic9.png') : require('../../img/pic10.png')}
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
      <Shadow distance={2}style={styles.navBar}>
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
      </Shadow>
      
      <ScrollView 
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollViewContent}
        onScroll={handleScroll}
        scrollEventThrottle={16} // 提高滚动事件的精度
      >
        <View style={styles.columnsContainer}>
          <View style={styles.column}>{leftColumn.map(renderItem)}</View>
          <View style={styles.column}>{rightColumn.map(renderItem)}</View>
        </View>
        {isLoading && <Loading />}
      </ScrollView>
    </View>
  );  
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width:'100%',
    height:'100%',
    backgroundColor: 'white'
  },
  navBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 40,
    backgroundColor: 'white',
  },
  navItem: {
    paddingHorizontal: 15,
    paddingVertical: 3,
  },
  activeNavItem: {
    backgroundColor: '#3D89FB',
    borderRadius: 12,
  },
  navText: {
    fontSize: 14,
    color: 'black',
    marginBottom:2,
    fontWeight:700,
    fontFamily:'Source Han Sans-Bold'
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
    marginTop:10,
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
  },
});
