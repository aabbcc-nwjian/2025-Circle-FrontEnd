import { Link } from 'expo-router';
import { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground,Image, TextInput } from 'react-native';

export default function SetScreen() {
  
  return (
    <ImageBackground source={require('./img/bac.png')} style={{width:'100%',height:'100%'}}>
      
      <View style={{position:'absolute',marginTop:80,marginLeft:50}}>
        <Text style={{color:'white',fontSize:30}}>Hello!</Text>
        <Text style={{color:'white',fontSize:18}}>欢迎来到圈圈</Text>
      </View>

    <View style={styles.container}>
    
    <View style={[styles.gray,{marginTop:100,marginLeft:25}]}></View>
    <View style={[styles.gray,{marginTop:180,marginLeft:25}]}></View>

     <View style={styles.line}></View>
     <View>
      <Text style={{marginTop:30,marginLeft:120}}>设置密码</Text>
     </View>
 

    <View style={{marginTop:16,marginLeft:30}}>
    <TextInput style={{marginTop:30}} placeholder='请输入新密码'></TextInput>
    </View>
    <View style={{marginTop:30,marginLeft:30}}>
    <TextInput style={{marginTop:10}} placeholder='再次输入新密码'></TextInput>
    </View>

    <View>
    <View style={styles.login}><Link style={{color:'white',textAlign:'center',marginTop:4}} href={'/'}>注册</Link></View>
    <Link style={{color:'gray',marginTop:30,marginLeft:133}} href={'/'}>取消</Link>
    </View>   
    
    </View>  

    </ImageBackground>
    
  );
}

const styles = StyleSheet.create({
  container: {
    width:300,
    height:432,
    backgroundColor:'white',
    borderRadius:10,
    marginLeft:45,
    marginTop:180,
  },gray:{
    width:250,
    height:30,
    borderRadius:10,
    backgroundColor:'#E5E5E5',
    position:'absolute',
  },line:{
    width:25,
    height:2,
    backgroundColor:'#3083FE',
    position:'absolute',
    marginTop:52,
    marginLeft:136
  },login:{
    width:250,
    height:30,
    borderRadius:10,
    backgroundColor:'blue',
    marginTop:50,
    marginLeft:22
  }
});