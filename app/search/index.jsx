import { View, Text, StyleSheet, TextInput } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Link, useNavigation } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { useEffect , useState } from 'react';
import { Get , Post} from '../axios';
export default function HomeScreen() {
  const navigation = useNavigation()
  const [history,setHistory]=useState()
  const [value,setValue]=useState('')
  const [should,setShould]=useState(false)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await Get('/search/searchhistory');
        console.log(userData.history);
        setHistory(userData.history)
        setShould(true)
      } catch (error) {
        console.error(error);
      }
    }; 
    fetchUserData();
  },[])
  const dehistory = async()=>{
    const response = await Get('/search/deletehistory')
    console.log(response);
    setHistory([])
  }

 const enter=(search)=>{
  if (search.length !== 0) {
    navigation.navigate('sheet',{'search':search})
  }else{
    alert('搜索不能为空')
  }
 }

 const render=(data)=>(
  <View key={data.Id}>
    <TouchableOpacity onPress={()=>enter(data.SearchKey)} style={styles.historyItem}>
    <Text style={styles.historyText}>{data.SearchKey}</Text>
    </TouchableOpacity>
  </View>
 )
 if (history) {
  return (
    <View style={{backgroundColor:'white',height:'100%',width:'100%'}}>
        <View style={{flexDirection:'row'}}>
            <View style={styles.container}>
                <FontAwesome onPress={()=> enter(value)} style={{marginTop:8,marginLeft:30,color:'#3D89FB'}} size={20} name="search" />
                <TextInput
                value={value}
                onChangeText={setValue}
                style={styles.input}
                placeholderTextColor={'#3D89FB'}
                placeholder='输入关键词搜索卷子/圈子'
                ></TextInput>
            </View>
            <Link href={'shouye'} style={{marginTop:30,marginLeft:"3%",fontSize:16,fontFamily:'Source Han Sans-Bold',fontWeight:700}}>取消</Link>
        </View>

        <View style={{marginTop:20}}>
            <View style={{flexDirection:'row',justifyContent:'space-between',paddingLeft:'5%',paddingRight:'5%'}}>
            <Text style={{fontSize:14,fontFamily:'Source Han Sans-Bold',fontWeight:700}}>历史搜索</Text>
            <Text onPress={dehistory} style={{fontSize:14,fontFamily:'Source Han Sans-Bold',fontWeight:700}}>全部清除</Text>    
            </View>
            
            <View style={{flexDirection:'row',marginTop:10,marginLeft:"5%",marginRight:"5%",flexWrap:'wrap'}}>

            {history.map(render)}
            </View>  
        </View>  
    </View>
    
  );
 }
}

const styles = StyleSheet.create({
  container: {
    width:"80%",
    height:40,
    marginLeft:"3%",
    marginTop:20,
    borderRadius:15,
    flexDirection:'row',
    elevation:10,
    backgroundColor:'white',
  },input:{
    marginLeft:'5%',
    fontSize:16,
    fontFamily:'Source Han Sans-Bold',
    fontWeight:700,
    color:'#3D89FB',
    height:42
  },historyItem: {
    height: 23,
    backgroundColor: '#D8D8D8',
    borderRadius: 15,
    marginRight: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
    justifyContent: 'center',
},
historyText: {
    fontSize: 12,
    fontWeight:700,
    fontFamily:'Source Han Sans-Bold',
}
});


