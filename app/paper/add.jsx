import { Button, Image, ScrollView, StyleSheet, TextInput ,TouchableOpacity} from 'react-native';
import { View , Text ,Alert} from 'react-native';
import React from 'react';
import { useNavigation } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import ChooseOne from './one';
import ChooseMore from './more';
import ChooseTf from './choose';
import { useRoute } from '@react-navigation/native';
import { Post } from '../axios';
import myStory from '../datas';
import { Get } from '../axios';
import { useState, useEffect } from'react';
import AddQuestion from './addquestion';
export default function SendPage() {
  const navigation = useNavigation()
  const route = useRoute();
  const [should , setShould]=useState(false)
  const testname = myStory.add['testname']
  const discirption = myStory.add['discirption']
  const circle = myStory.add['circle']
  const imageUrl = myStory.add['image']

  const createcontent = myStory.add['content']
  const createdifficulty = myStory.add['difficulty']
  const createanswer = myStory.add['answer']
  const createexplain = myStory.add['explain']
  const createoptions = myStory.add['options']
  
  const [add,setAdd]=useState(false)
  const questionstyle=myStory.questionstyle['question']
  useEffect(() => {
    if (!questionstyle) {
      myStory.questionstyle['question']=[]
    }if (!myStory.add['maxid']) {
      myStory.add['maxid']=0
    }

    if (!createcontent) {
      myStory.add['content']=[]
    }if (!createanswer) {
      myStory.add['answer']=[] 
    }if (!createdifficulty) {
      myStory.add['difficulty']=[] 
    }if (!createexplain) {
      myStory.add['explain']=[] 
    }if (!createoptions) {
      myStory.add['options']=[] 
    }

    setShould(true)
    console.log(questionstyle);
  },[])


  const [testid,setTestid]=useState()
  const creattest=async()=>{
    const data = await Post('/test/createtest',{
      "testname":testname,
      "discription":discirption,
      "circle":circle,
      "imageurl":imageUrl})
    console.log(data); 
    myStory.add['testid']=data.id
    setTestid(data.id)
  }

  const [start,setStart]=useState(false)
  const satrtcreate=()=>{
    creattest()
  }
  useEffect(() => {
    if(testid){
      setStart(true)
    }
  },[testid])

  if (should) {
  if (add) {
    return <AddQuestion></AddQuestion>
  }else{
   return (
    <>
    <View style={{height:80,backgroundColor:'white'}}>
     <View style={styles.first}>
        <Text onPress={()=>{navigation.goBack()}}><FontAwesome size={35} name='angle-left'/></Text>
        <View style={{width:60,height:32,backgroundColor:'#3D89FB',borderRadius:10,}}>
        <Text onPress={satrtcreate} style={{color:'white',textAlign:'center',fontFamily:'Source Han Sans-Bold',fontWeight:700,fontSize:16,marginTop:4}}>发布</Text> 
        </View>
    </View>
    </View>

  <ScrollView>
  <View style={{height:30,backgroundColor:'white',position:'absolute',width:'100%'}}></View>
 
 {questionstyle.length === 0 && 
 <Text style={{textAlign:'center',fontFamily:'Source Han Sans-Bold',fontWeight:700,fontSize:20,marginTop:'65%'}}>这里还没有题目</Text>
 }

  {questionstyle.map(item => {
  switch(item.Variety) {
    case '单选':
      return <ChooseOne key={item.id} 
      start = {start}
      optionid={item.id}
      onUpdate={(updatedData) => {
        console.log('题目数据已更新:', updatedData);
      }}
      />;
    case '多选':
      return <ChooseMore key={item.id}
      start = {start}
      optionid={item.id}
      onUpdate={(updatedData) => {
        console.log('题目数据已更新:', updatedData);
      }} 
      />;
    case '判断题':
      return <ChooseTf key={item.id}
      start = {start}
      optionid={item.id}
      onUpdate={(updatedData) => {
        console.log('题目数据已更新:', updatedData);
      }}
      />;
    default:
      return null;
  }
})}
  
  
  </ScrollView>
  <View style={{height:80,position:'absolute',bottom:5,left:'15%',right:'15%'}}>
   <View style={styles.add}>
    <View style={{width:25,height:25,marginTop:19,marginLeft:70}}>
    <Image 
    source={require('../img/pic22.png')} 
    style={{width: '100%', height: '100%'}}
    />  
    </View>
   
    <Text onPress={() => navigation.navigate('addquestion')} style={{margin:'auto',fontFamily:'Source Han Sans-Bold',fontWeight:700,fontSize:24,marginLeft:8}}>添加题目</Text>
   </View> 
  </View>
    </>
  ); 
  }
}
}
const styles = StyleSheet.create({
    first:{
        flex:1,
        flexDirection:'row',
        justifyContent:'space-between',
        padding:25,
    },inputContainer: {
        marginLeft: '5%',
        marginRight: '5%',
        borderRadius: 10,
        height: 130,
        backgroundColor: '#3D89FB',
        position: 'relative',
      },
      input: {
        fontSize: 20,
        color: 'white',
        padding: 10,
        height:130,
      },
      placeholder: {
        position: 'absolute',
        left: 100,
        top: 50, 
        fontSize: 20,
        color: 'rgba(255,255,255,0.7)',
      },choose:{
        flexDirection:'row',
        marginLeft:'5%',
        width:'75%',
        height:50,
        backgroundColor:'white',
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
         width: 2,
         height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },analysisInput: {
        fontSize: 20,
        padding: 10,
        height:80,
      },analysisPlaceholder: {
        position: 'absolute',
        left: '40%',
        top: 25, 
        fontSize: 20,
        color: 'rgba(255,255,255,0.7)',
      },circle1:{
        width:30,
        height:30,
        borderWidth:1,
        borderRadius:15,
        borderColor:'#3D89FB',
        marginLeft:'110%',
        marginTop:10,
        justifyContent: 'center',
        alignItems: 'center',
        position:'absolute',
      },
      circle2:{
        width:24,
        height:24,
        borderRadius:12,
        backgroundColor:'#3D89FB',
      },add:{
        borderRadius: 15,
        height: 60,
        backgroundColor: 'white',
        width:'100%',
        flexDirection:'row',
        elevation:5
      }
})