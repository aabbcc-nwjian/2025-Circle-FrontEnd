import { View, Text, StyleSheet, TextInput } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { useEffect , useState } from 'react';
import { Get , Post} from '../axios';
import { useRoute } from '@react-navigation/native';
import { ScrollView } from 'react-native';
export default function HomeScreen() {
  const navigation = useNavigation()
  const route = useRoute()
  const [circles,setCircles]=useState()
  const searchsheet = async(history)=>{
    const response = await Post('/search/searchcircle',{
      "testkey":history,
    })
    console.log(response.circle);
    setCircles(response.circle)
  } 
  const search = route.params.search
  useEffect(() => {
    searchsheet(search)
  },[search])
  const handleFollow=async(id)=>{
    const data = await Post('/circle/followcircle',{"circleid":id})
    console.log(data);
  }
  if (circles) {
  return (
    <View style={{backgroundColor:'white',height:'100%',width:'100%'}}>
        <View style={{flexDirection:'row'}}>
            <View style={styles.container}>
                <FontAwesome onPress={()=>{navigation.navigate('index')}} style={{marginTop:7,marginLeft:15,color:'#3D89FB'}} size={20} name="search" />
                <TextInput
                style={styles.input}
                placeholderTextColor={'#3D89FB'}
                placeholder='关键词'
                ></TextInput>
            </View>
            <Text style={{marginTop:30,marginLeft:"5%"}} onPress={()=>{navigation.navigate('index')}}>取消</Text>
        </View>

        <View style={{flexDirection:'row',marginTop:'5%'}}>
        <View style={[styles.head]}><Text onPress={()=>navigation.navigate('sheet',{'search':search})} style={{textAlign:'center',marginTop:15,fontSize:18}}>卷子</Text></View>
        <View style={[styles.head,{borderTopLeftRadius:15,backgroundColor:"#3D89FB"}]}><Text style={{textAlign:'center',marginTop:15,fontSize:18,color:'white'}}>圈子</Text></View>
        </View>
      <ScrollView style={styles.listContainer}>
        <View style={{borderTopWidth:1,marginTop:10,borderColor: '#E0E0E0'}}>
        {circles.map((circle) => (
          <View key={circle.Id} style={styles.circleItem}>
            <View style={styles.avatar} />
            <Text style={styles.circleName}>{circle.Name}</Text>
            <TouchableOpacity 
              style={styles.followButton} 
              onPress={() => handleFollow(circle.Id)}
            >
              <Text style={styles.followButtonText}>关注</Text>
            </TouchableOpacity>
          </View>
        ))}</View>
      </ScrollView>
    </View>
    
  );
}}

const styles = StyleSheet.create({
  container: {
    width:"80%",
    height:40,
    marginLeft:"3%",
    marginTop:20,
    borderWidth:1,
    borderRadius:10,
    flexDirection:'row'
  },input:{
    marginLeft:'10%'
  },historyItem: {
    height: 30,
    backgroundColor: '#F0F0F0',
    borderRadius: 15,
    marginRight: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
    justifyContent: 'center',
    },historyText: {
        fontSize: 12,
    },head:{
        width:'50%',
        height:60,
    },
    listContainer: {
      flex: 1,
    },
    circleItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      borderBottomWidth: 1,
      borderColor: '#E0E0E0',
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'gray',
      marginRight: 10,
    },
    circleName: {
      flex: 1,
      fontSize: 16,
    },
    followButton: {
      paddingHorizontal: 15,
      paddingVertical: 5,
      backgroundColor: 'white',
      borderRadius: 5,
      elevation: 3,
    },
    followButtonText: {
      color: '#3D89FB',
    },
});


