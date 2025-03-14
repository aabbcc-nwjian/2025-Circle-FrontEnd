import { Button, Image, ScrollView, StyleSheet, TextInput ,TouchableOpacity} from 'react-native';
import { View , Text ,Alert} from 'react-native';
import { useState , useEffect} from 'react';
import React from 'react';
import { useNavigation } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { Get, Post } from '../axios';
import myStory from '../datas';
export default function SendPage() { 
  const navigation = useNavigation()
  const toAdd=()=>{
    navigation.navigate('add')
    myStory.add['testname']=sheetname
    myStory.add['discirption']=discirption
    myStory.add['circle']=activetext
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
    <View style={{width:"100%",height:'100%',backgroundColor:'#3D89FB'}}>

    <View style={{height:80}}>
     <View style={styles.first}>
        <Text onPress={()=>{navigation.goBack()}}><FontAwesome color={'white'} size={35} name='angle-left'/></Text>
    </View>   
    </View>
    
    <View style={{width:'80%',height:'20%',marginLeft:'10%'}}>
      <View style={styles.second}></View>
      <Text style={{marginTop:10,fontSize:16,color:'white',textAlign:'center'}}>封面</Text>
    </View>

    <View style={styles.third}>
      <TextInput value={sheetname} onChangeText={setSheetname} style={{marginLeft:5,fontSize:14}} placeholder='请输入卷子名称'></TextInput>
    </View>
    <View style={styles.third}>
      <TextInput value={discirption} onChangeText={setDiscirption} style={{marginLeft:5,fontSize:14}} placeholder='请输入卷子简介'></TextInput>
    </View>

    <View style={styles.third}>
         <Text style={{marginTop:8,marginLeft:25,fontSize:16}}>选择圈子</Text>
         <View style={{marginLeft:100,position:'absolute',marginTop:10,height:20,backgroundColor:'#3D89FB',borderRadius:8,}}>
         <Text style={{marginLeft:8,fontSize:13,color:'white',marginRight:8}}>{activetext}</Text>
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
        
        <View style={styles.sure}><Text onPress={toAdd} style={{textAlign:'center',marginTop:10,color:'white'}}>确认</Text></View>
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
      marginTop:10
    },third:{
      height:40,
      width:'70%',
      backgroundColor:'white',
      marginTop:40,
      marginLeft:'15%',
      borderRadius:10
    },end:{
        width:'70%',
        marginLeft:'15%',
        marginTop:-10,
        backgroundColor:'white',
        display:'flex',
        borderBottomLeftRadius:10,
        borderBottomRightRadius:10
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
        color:'white'
      },inactivetext:{
        textAlign:'center',
        color:'#111313'
      },sure:{
        marginTop:50,
        marginLeft:'35%',
        width:'30%',
        height:40,
        elevation:5,
        borderRadius:10,
        backgroundColor:'blue',
      }
})