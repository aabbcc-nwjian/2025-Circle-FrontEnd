import { View, Text, StyleSheet, TextInput } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { TouchableOpacity ,Image} from 'react-native';
import { useEffect , useState } from 'react';
import { Get,Post } from '../../axios';
import { useRoute } from '@react-navigation/native';
import { ScrollView } from 'react-native';
import myStory from '../../datas';
export default function HomeScreen() {
  const navigation = useNavigation()
  const route = useRoute()
  const [follow,setFollow]=useState([])
  const [circles,setCircles]=useState()
  const searchsheet = async()=>{
    const response = await Get('/circle/selectcircle')
    const followPromises = response.circle.map((circle)=>{
      return getFollow(circle.Id)
    })
    const followData = await Promise.all(followPromises)
    setFollow(prevFollow => [...prevFollow, ...followData])
    console.log(response.circle);
    setCircles(response.circle)
  } 
  const getFollow=async(id)=>{
    const data = await Post('/circle/showfollowcircle',{"circleid":id})
    return data.message
  }
  useEffect(() => {
    searchsheet()
  },[])
  const handleFollow = async(id, index) => {
  try {
    const data = await Post('/circle/followcircle', {"circleid": id})
    if (data.message) {
      setFollow(prevFollow => {
        const newFollow = [...prevFollow];
        newFollow[index] = '已关注';
        return newFollow;
      });
    } else {
      console.error('关注失败:', data.message);
    }
  } catch (error) {
    console.error('关注请求出错:', error);
  }
}

const unFollow = async(id, index) => {
  try {
    const data = await Post('/circle/unfollowcircle', {"circleid": id})
    if (data.message) {
      setFollow(prevFollow => {
        const newFollow = [...prevFollow];
        newFollow[index] = '未关注';
        return newFollow;
      });
    } else {
      console.error('取消关注失败:', data.message);
    }
  } catch (error) {
    console.error('取消关注请求出错:', error);
  }
}
  useEffect(() => {
    console.log(follow); 
  },[])

  const handleCirclePress = (circleId,discription,follow) => {
    myStory.data['circleId'] = circleId
    myStory.data['discription'] = discription
    myStory.data['follow'] = follow
    console.log(myStory.data['circleId']);
    navigation.navigate('Circle') 
  }
  if (circles) {
  return (
    <View style={{backgroundColor:'white',height:'100%',width:'100%'}}>
      <ScrollView style={styles.listContainer}>
        <View>
        {circles.map((circle,index) => (
          <View key={circle.Id} style={styles.circleItem}>
            <TouchableOpacity onPress={()=>handleCirclePress(circle.Name,circle.Discription,follow[index])} style={{flexDirection: 'row'}}>
            <View style={styles.avatar}>
             <Image source={{ uri: circle.Imageurl }} style={{ width: '100%', height: '100%' }} />
            </View>
            <Text style={styles.circleName}>{circle.Name}</Text>  
            </TouchableOpacity>
            {follow[index] == "未关注"?
            <TouchableOpacity 
              style={styles.followButton} 
              onPress={() => handleFollow(circle.Id,index)}
            >
              <Text style={styles.followButtonText}>关注</Text>
            </TouchableOpacity>
            :
            <TouchableOpacity 
              style={styles.unfollow} 
              onPress={() => unFollow(circle.Id,index)}
            >
              <Text style={styles.followButtonText}>取消关注</Text>
            </TouchableOpacity>
            }
            
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
    elevation:10,
    backgroundColor:'white',
    borderRadius:15,
    flexDirection:'row'
  },input:{
    marginLeft: '5%',
    flex: 1,
    fontSize:16,
    fontFamily:'Source Han Sans-Bold',
    fontWeight:700,
    color: '#3D89FB',
    height:42
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
      backgroundColor: '#D8D8D8',
      marginRight: 10,
    },
    circleName: {
      flex: 1,
      fontSize: 18,
      fontFamily:'Source Han Sans-Bold',
      fontWeight:700,
      margin:'auto'
    },
    followButton: {
      paddingHorizontal: 15,
      paddingVertical: 5,
      backgroundColor: '#3D89FB',
      borderRadius: 10,
      elevation: 3,
      left:'-20%',
      marginLeft:-5
    },
    followButtonText: {
      color: 'white',
    },tabText: {
      fontSize: 20,
      fontFamily:'Source Han Sans-Bold',
      fontWeight:700,
      textAlign:'center',
      margin:'auto'
    },
    activeTabText: {
      fontSize: 20,
      color: 'white',
      fontFamily:'Source Han Sans-Bold',
      fontWeight:700,
      textAlign:'center',
      margin:'auto'
    },unfollow:{
      paddingHorizontal: 15,
      paddingVertical: 5,
      backgroundColor: '#FB5D5D',
      borderRadius: 10,
      elevation: 3,
      left:'-20%',
      marginLeft:-18
    }
});