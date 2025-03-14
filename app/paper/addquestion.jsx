import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import myStory from '../datas';
export default function AddQuestion() {
  const navigation = useNavigation()
  const addone=()=>{
    navigation.navigate('add')
    const id = myStory.add['maxid']+1
    myStory.questionstyle['question'].push({
      id:id,
      Variety:'单选'
    })
    myStory.add['content'].push(null)
    myStory.add['answer'].push(null)
    myStory.add['difficulty'].push(1)
    myStory.add['explain'].push(null)
    myStory.add['options'].push({A: '', B: '', C: '', D: ''})
    myStory.add['maxid']=id
  }
  const addmore=()=>{
    navigation.navigate('add') 
    const id = myStory.add['maxid']+1
    myStory.questionstyle['question'].push({
      id:id,
      Variety:'多选'
    })
    myStory.add['content'].push(null)
    myStory.add['answer'].push([])
    myStory.add['difficulty'].push(1)
    myStory.add['explain'].push(null)
    myStory.add['options'].push([])
    myStory.add['maxid']=id
  }
  const addchoose=()=>{
    navigation.navigate('add') 
    const id = myStory.add['maxid']+1
    myStory.questionstyle['question'].push({
      id:id,
      Variety:'判断题'
    })
    myStory.add['content'].push(null)
    myStory.add['answer'].push(null)
    myStory.add['difficulty'].push(1)
    myStory.add['explain'].push(null)
    myStory.add['options'].push([])
    myStory.add['maxid']=id
  }
  return (
    <View style={{backgroundColor:'white',height:'100%',width:'100%'}}>
      <View style={{margin:10,flexDirection:'row'}}>
      <Text onPress={()=>{navigation.goBack()}}><FontAwesome size={35} name='angle-left'/></Text>
      <Text style={{textAlign:'center',fontSize:14,left:'50%',marginLeft:-45}}>+ 添加题目</Text>
    </View>

      <View style={{flexDirection:'row',justifyContent:'space-around'}}>
        <Text>题型</Text>
        <Text onPress={() => navigation.navigate('stash')}>题库</Text>
      </View>
      <View style={{left:'25%',width:25,height:2,backgroundColor:"#3D89FB",marginLeft:-13}}></View>
      <TouchableOpacity 
        style={[styles.container,{marginTop:"30%"}]} 
        onPress={addone}
      >
        <Text style={{textAlign:'center',marginTop:13,fontSize:20}}>单选题</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.container,{marginTop:60}]} 
        onPress={addmore}
      >
        <Text style={{textAlign:'center',marginTop:13,fontSize:20}}>多选题</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.container,{marginTop:60}]} 
        onPress={addchoose}
      >
        <Text style={{textAlign:'center',marginTop:13,fontSize:20}}>判断题</Text>
      </TouchableOpacity>
      
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    width: 300,
    height: 55,
    backgroundColor: '#3D89FB',
    left:'50%',
    marginLeft: -150,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.75,
    shadowRadius: 3.84,
    elevation: 10,
  },
});


