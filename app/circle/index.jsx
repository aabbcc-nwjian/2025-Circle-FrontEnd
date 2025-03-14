import { Redirect ,Link} from 'expo-router';
import { View, Text, StyleSheet, ScrollView ,Button,Alert,Image , Dimensions, TouchableOpacity} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import React,{ useState , useEffect } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import { Post , Get } from '../axios';
import { useNavigation } from 'expo-router';
const { width } = Dimensions.get('window');
const itemMargin = 0.01*width;
const itemVerticalMargin = '3%';

export default function Tab() {
  const navigation = useNavigation();

  const [imageUrl, setImageUrl] = useState(null);
  
  const [user, setUser] = useState('用户名');
  const [discription, setDiscription] = useState('简介');

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
        setShoulder(false);
        const getTest = async()=>{
          if (activeId===1) {
            const data = await Post('/test/recommenttest')
            console.log(data.test);
            setDatas(data.test);
          }else if (activeId===2) {
            const data = await Post('/test/hottest')
            console.log(data.test);
          }else if (activeId===3) {
            const data = await Post('/test/newtest')
            console.log(data.test);
          }
          setShoulder(true);
        }
        getTest();
      },[activeId])

  return (
    <View style={styles.container}>
    <Text style={{marginLeft:'5%',marginTop:'4%',position:'absolute'}} onPress={()=>{navigation.goBack()}}><FontAwesome size={35} name='angle-left'/></Text>
      <ScrollView>
      <View style={styles.box}>
        <TouchableOpacity onPress={null}>
         <View style={styles.head}>
         {imageUrl && (
        <Image source={{ uri: imageUrl }}/>
        )}
        </View> 
        </TouchableOpacity>
        

        <Text style={{textAlign:'center',marginTop:60}}>{user}</Text>
        <Text style={{textAlign:'center',marginTop:10}}>简介：{discription}<Text></Text></Text>

        <View style={{flexDirection:'row',top:30,left:10,}}>
        {tags.map((tags)=>(
          <View key={tags.id} style={[styles.message, getTagStyle(tags.id)]}>
            <Text onPress={() => handlePress(tags.id)} style={[styles.text,getTextStyle(tags.id)]}>{tags.text}</Text>
          </View>
        ))}
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
    borderWidth:1,
    position:'absolute',
    marginLeft:-50,
    marginTop:-50,
    left:'50%'
  },message:{
    marginLeft:10,
    width:65,
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
    marginLeft:40
  },
});