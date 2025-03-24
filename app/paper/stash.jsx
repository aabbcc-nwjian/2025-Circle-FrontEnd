import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import myStory from '../datas';
import { useState , useEffect } from 'react';
export default function HomeScreen() {
  const navigation = useNavigation()

  const [should,setShould]=useState(false)
  
  const [inputText, setInputText] = useState();
  const [selectedOption, setSelectedOption] = useState();
  const [options, setOptions] = useState({A: '', B: '', C: '', D: ''});
  const [questionstyle,setQuestionstyle]=useState()

  useEffect(() => {
    if (!questionstyle) {
      setInputText(myStory.add['content'])
      setSelectedOption(myStory.add['answer'])
      setOptions(myStory.add['options'])
      setQuestionstyle(myStory.questionstyle['question'])
      setShould(true)
    }
  },[questionstyle])
  
  
  if (should) {
  return (
    <View style={{backgroundColor:'white',height:'100%',width:'100%'}}>
      <View style={{margin:10,flexDirection:'row'}}>
      <Text onPress={()=>{navigation.goBack()}}><FontAwesome size={35} name='angle-left'/></Text>
      <Text style={{textAlign:'center',left:'50%',marginLeft:-45,fontFamily:'Source Han Sans-Bold',fontWeight:700,fontSize:24}}>添加题目</Text>
    </View>

      <View style={{flexDirection:'row',justifyContent:'space-around'}}>
        <Text style={{fontFamily:'Source Han Sans-Bold',fontWeight:700,fontSize:20,color:'#9A9898'}} onPress={() => navigation.navigate('addquestion')}>题型</Text>
        <Text style={{fontFamily:'Source Han Sans-Bold',fontWeight:700,fontSize:20}}>题库</Text>
      </View>
      <View style={{left:'75%',width:22,height:3,backgroundColor:"#3D89FB",marginLeft:-11,borderRadius:5}}></View>
      
      <View>
        {/* <View style={[styles.questions,{borderTopWidth:1}]}> 
            <View style={{marginLeft:25}}><Text>题目</Text></View>
            <View style={styles.choose}>
              <Text>A:   </Text>
              <Text>XXXXXXXXXXXXXX</Text>
            </View>
            <View style={styles.choose}>
              <Text>B:   </Text>
              <Text>XXXXXXXXXXXXXX</Text>
            </View>
            <View style={styles.choose}>
              <Text>C:   </Text>
              <Text>XXXXXXXXXXXXXX</Text>
            </View>
            <View style={styles.choose}>
              <Text>D:   </Text>
              <Text>XXXXXXXXXXXXXX</Text>
            </View>
            <View style={[styles.choose,{marginBottom:15}]}>
              <Text>答案：</Text>
              <Text>A</Text>
            </View>
        </View> */}
        
        <View style={{marginTop:10}}>
          {inputText.map((text, index) => {
            if (questionstyle[index].Variety === '单选') {
              return (
                <View key={index} style={[styles.questions]}> 
                  <View style={{marginLeft:25}}><Text style={{fontFamily:'Source Han Sans-Bold',fontWeight:700,fontSize:16}}>{text || "题目"}</Text></View>
                  {Object.entries(options[index]).map(([key, value]) => (
                    <View key={key} style={styles.choose}>
                      <Text style={{fontFamily:'Source Han Sans-Bold',fontWeight:700,fontSize:16}}>{key}:   </Text>
                      <Text style={{fontFamily:'Source Han Sans-Bold',fontWeight:700,fontSize:16}}>{value}</Text>
                    </View>
                  ))}
                  <View style={[styles.choose, {marginBottom:15}]}>
                    <Text style={{fontFamily:'Source Han Sans-Bold',fontWeight:700,fontSize:16}}>答案：</Text>
                    <Text style={{fontFamily:'Source Han Sans-Bold',fontWeight:700,fontSize:16}}>{selectedOption[index]}</Text>
                  </View>
                </View>
              );
            } else if (questionstyle[index].Variety === '多选') {
              return (
                <View key={index} style={[styles.questions]}> 
                  <View style={{marginLeft:25}}><Text style={{fontFamily:'Source Han Sans-Bold',fontWeight:700,fontSize:16}}>{text || "题目"}</Text></View>
                  {Object.entries(options[index]).map(([key, value]) => (
                    <View key={key} style={styles.choose}>
                      <Text style={{fontFamily:'Source Han Sans-Bold',fontWeight:700,fontSize:16}}>{key}:   </Text>
                      <Text style={{fontFamily:'Source Han Sans-Bold',fontWeight:700,fontSize:16}}>{value}</Text>
                    </View>
                  ))}
                  <View style={[styles.choose, {marginBottom:15}]}>
                    <Text style={{fontFamily:'Source Han Sans-Bold',fontWeight:700,fontSize:16}}>答案：</Text>
                    <Text style={{fontFamily:'Source Han Sans-Bold',fontWeight:700,fontSize:16}}>{selectedOption[index].join('')}</Text>
                  </View>
                </View>
              );
            } else if (questionstyle[index].Variety === '判断题') {
              return (
                <View key={index} style={[styles.questions]}> 
                  <View style={{marginLeft:25}}><Text style={{fontFamily:'Source Han Sans-Bold',fontWeight:700,fontSize:16}}>{text || "题目"}</Text></View>
                  <View style={styles.choose}>
                    <Text style={{fontFamily:'Source Han Sans-Bold',fontWeight:700,fontSize:16}}>正确</Text>
                  </View>
                  <View style={styles.choose}>
                    <Text style={{fontFamily:'Source Han Sans-Bold',fontWeight:700,fontSize:16}}>错误</Text>
                  </View>
                  <View style={[styles.choose, {marginBottom:15}]}>
                    <Text style={{fontFamily:'Source Han Sans-Bold',fontWeight:700,fontSize:16}}>答案：</Text>
                    <Text style={{fontFamily:'Source Han Sans-Bold',fontWeight:700,fontSize:16}}>{selectedOption[index]}</Text>
                  </View>
                </View>
              );
            }
            return null; // 如果没有匹配的题型，返回null
          })}
        </View>
      </View>
    </View>
    
  );
}
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
  },choose:{
    flexDirection:'row',
    marginLeft:20,
    marginTop:10
  },questions:{
    marginTop:10,
    borderBottomWidth:1,
  }
});


