import { Button, Image, ScrollView, StyleSheet, TextInput ,TouchableOpacity} from 'react-native';
import { View , Text ,Alert} from 'react-native';
import { useState , useEffect} from 'react';
import React from 'react';
import { Link, useNavigation ,useRouter} from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { Get, Post } from '../axios';
import myStory from '../datas';
export default function SendPage() { 
  const navigation = useNavigation()
  const router=useRouter()

  const [sheetname,setSheetname]=useState('')
  const [discirption,setDiscirption]=useState('')

  const createcircle=async()=>{
    const data = await Post('/circle/createcircle',{
      "name":sheetname,
      "discription":discirption,
      "imageurl":''
    })
    console.log(data);
    navigation.navigate('end')
  }

  return (
    <View style={{width:"100%",height:'100%',backgroundColor:'white'}}>

    <View style={{flexDirection:'row'}}>
      <Text style={{marginLeft:'5%',marginTop:'4%',position:'absolute'}} onPress={()=>{router.back()}}><FontAwesome size={35} name='angle-left'/></Text>
      <Text style={{fontSize:24,textAlign:'center',width:"40%",marginLeft:'30%',marginTop:'5%',fontWeight:700}}>创圈</Text>
      <View style={{marginTop:'5%',marginLeft:'5%',flexDirection:'row'}}>
      </View>
    </View>
    
    <View style={styles.third}>
      <Text style={{marginLeft:0,fontSize:20,fontWeight:700}}>圈子名称</Text>
      <View style={{width:'100%',height:30,backgroundColor:'#EFEFEF',borderRadius:10,marginTop:7}}>
      <TextInput value={sheetname} onChangeText={setSheetname} style={{marginLeft:5,fontSize:12,color:'#7F8182',marginTop:5}} placeholder='点击输入(不超过20字)'></TextInput>
      </View>
    </View>
    <View style={styles.third}>
      <Text style={{marginLeft:0,fontSize:20,fontWeight:700}}>圈子简介</Text>
      <View style={{width:'100%',height:100,backgroundColor:'#EFEFEF',borderRadius:10,marginTop:7}}>
      <TextInput value={discirption} onChangeText={setDiscirption} style={{marginLeft:5,fontSize:12,color:'#7F8182',height:90,textAlignVertical: 'top',padding: 10}}  numberOfLines={4} multiline={true} placeholder='点击输入(不超过20字)'></TextInput>
      </View>
    </View>
    <View style={styles.third}>
      <Text style={{marginLeft:0,fontSize:20,fontWeight:700}}>圈子封面</Text>
      <View style={{width:'20%',height:20,backgroundColor:'#7F8182',borderRadius:10,marginTop:7}}>
      <Text  onChangeText={setDiscirption} style={{marginLeft:10,fontSize:12,color:'white',marginTop:1,marginRight:10}}>点击选择</Text>
      </View>
    </View>

    <View style={styles.sure}><Text onPress={createcircle} style={{textAlign:'center',marginTop:10,color:'white'}}>确认</Text></View>
    <Link href={'/circle'}>圈子入口</Link>
    </View>
  );
}
const styles = StyleSheet.create({
    third:{
    width:'86%',
    backgroundColor:'white',
    marginTop:30,
    marginLeft:'7%',
    borderRadius:10
    },sure:{
    marginTop:'30%',
    marginLeft:'35%',
    width:'30%',
    height:40,
    elevation:5,
    borderRadius:10,
    backgroundColor:'blue',
    }
})