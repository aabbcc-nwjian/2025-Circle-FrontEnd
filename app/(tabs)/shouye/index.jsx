import { useEffect ,useState} from 'react';
import { Button, Image, ScrollView, StyleSheet, TextInput , TouchableOpacity,FlatList} from 'react-native';
import { View , Text ,Alert} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { useNavigation } from 'expo-router';
import { Get, Post } from '../../axios';
import myStory from '../../datas';
import { useCallback } from 'react';
export default function Follow() {

  const navigation = useNavigation();
  const handlePress = () => {
    navigation.navigate('practice');
    myStory.data['circle']=show;
  };

  const [should,setShould]=useState(false)

  const [show,setShow]=useState("")
  const [zhanji,setZhanji]=useState({
    Practicenum:0,
    Correctnum:0
  })
  const average = useCallback(() => {
    if (zhanji.Practicenum === 0) return '0.0';
    return ((zhanji.Correctnum / zhanji.Practicenum) * 100).toFixed(1);
  }, [zhanji.Correctnum, zhanji.Practicenum]);
  
  const [more,setMore]=useState(false)
  const getMore=()=>{
    setMore(true)
  }
  const unMore=()=>{
    setMore(false)
  }
  const [options,setOptions]=useState([])
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await Get('/circle/selectcircle');
        options.push(...userData.circle);
        setShow(options[0].Name)
      } catch (error) {
        console.error(error);
      }
      setShould(true)
    };
    fetchUserData();
  }, []);
  useEffect(()=>{
    const getmessage=async()=>{
      const usedata=await Post('/practice/getuserpractice',{"circle":show})
      console.log(usedata);
      setZhanji(usedata.userpractice)
    }
    getmessage();
  },[show])
  
  const getShow=(e)=>{
    setShow(e)
    setMore(false)
  }
  const renderItem = ({ item, index }) => (
    <TouchableOpacity 
      onPress={() => getShow(item.Name)}
      style={[
        styles.item, 
        index === 0 && styles.firstItem
      ]}
    >
      <Text style={styles.itemText}>{item.Name}</Text>
    </TouchableOpacity>
  );
  return (
    <View style={{width:'100%',height:'100%',backgroundColor:'#BBD4FE'}}>
    
    <View>
    <View style={styles.choose}><Text style={{marginTop:10,marginLeft:20}}>{show}</Text><FontAwesome onPress={more?unMore:getMore} size={28} name={'angle-down'} style={{top:8,right:10,position:'absolute'}} /></View>
    {more && (
          <View style={styles.more}>
            <FlatList
              data={options}
              renderItem={renderItem}
              keyExtractor={item => item.Id.toString()}
            />
          </View>
        )}
    </View>
  
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePress}>
        <Image 
      source={require('../../img/pic5.png')} 
      style={{width: '100%', height: '50%', resizeMode: 'contain',marginTop:'10%'}}
    />
      <Text style={{textAlign:'center',marginTop:'5%',fontSize:20,color:'white',fontSize:33}}>练习</Text>
      </TouchableOpacity>
    </View>

    <View style={{justifyContent:'space-evenly',marginTop:'5%'}}>
      <View style={[styles.box,{backgroundColor:'white'}]}>
      <Image 
      source={require('../../img/pic6.png')} 
      style={{width: '10%', height: '60%', resizeMode: 'contain',marginTop:'3%',marginLeft:'6%'}}
      />
      <Text style={{marginTop:12,marginLeft:'10%',fontSize:20,fontWeight:700,width:'50%'}}>总练习题数</Text>
      <Text style={{marginTop:14,fontSize:20,fontWeight:700}}>{zhanji.Practicenum}</Text>
      </View>
      <View style={[styles.box,{backgroundColor:'#94BFFE'}]}>
      <Image 
      source={require('../../img/pic7.png')} 
      style={{width: '10%', height: '60%', resizeMode: 'contain',marginTop:'3%',marginLeft:'6%'}}
      />
      <Text style={{marginTop:12,marginLeft:'10%',fontSize:20,fontWeight:700,width:'50%',color:'white'}}>答对题数</Text>
      <Text style={{marginTop:14,fontSize:20,fontWeight:700,color:'white'}}>{zhanji.Correctnum}</Text>
      </View>
      <View style={[styles.box,{backgroundColor:'#5F9EFB'}]}>
      <Image 
      source={require('../../img/pic8.png')} 
      style={{width: '10%', height: '60%', resizeMode: 'contain',marginTop:'3%',marginLeft:'6%'}}
      />
      <Text style={{marginTop:12,marginLeft:'10%',fontSize:20,fontWeight:700,width:'50%',color:'white'}}>正确率</Text>
      <Text style={{marginTop:14,fontSize:20,fontWeight:700,color:'white'}}>{`${average()}%`}</Text>
      </View>
    </View>
      

    </View>
  );
}
const styles = StyleSheet.create({
  container:{
  marginTop:'10%',
  marginLeft:'27.5%',
  width:'45%',
  height:'25%',
  backgroundColor:'#3083FE',
  borderRadius:20
  },box:{
  width:'80%',
  height:55,
  backgroundColor:'white',
  borderRadius:15,
  marginLeft:'10%',
  marginTop:"10%",
  flexDirection:'row'
  },choose:{
  width:120,
  height:40,
  backgroundColor:'white',
  borderRadius:20,
  marginTop:20,
  marginLeft:'5%',
  zIndex:2
  },more:{
  width:120,
  height:150,
  backgroundColor:'white',
  borderBottomLeftRadius:20,
  borderBottomRightRadius:20,
  marginLeft:'5%',
  position:'absolute',
  marginTop:40,
  zIndex:1
  },item: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  itemText: {
    fontSize: 16,
  },firstItem: {
    marginTop: 20,
  },
})