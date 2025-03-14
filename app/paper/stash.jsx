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
      <Text style={{textAlign:'center',fontSize:14,left:'50%',marginLeft:-45}}>+ 添加题目</Text>
    </View>

      <View style={{flexDirection:'row',justifyContent:'space-around'}}>
        <Text onPress={() => navigation.navigate('addquestion')}>题型</Text>
        <Text>题库</Text>
      </View>
      <View style={{left:'75%',width:25,height:2,backgroundColor:"#3D89FB",marginLeft:-13}}></View>
      
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
        
        <View style={{borderTopWidth: 1,marginTop:10}}>
          {inputText.map((text, index) => {
            if (questionstyle[index].Variety === '单选') {
              return (
                <View key={index} style={[styles.questions]}> 
                  <View style={{marginLeft:25}}><Text>{text || "题目"}</Text></View>
                  {Object.entries(options[index]).map(([key, value]) => (
                    <View key={key} style={styles.choose}>
                      <Text>{key}:   </Text>
                      <Text>{value}</Text>
                    </View>
                  ))}
                  <View style={[styles.choose, {marginBottom:15}]}>
                    <Text>答案：</Text>
                    <Text>{selectedOption[index]}</Text>
                  </View>
                </View>
              );
            } else if (questionstyle[index].Variety === '多选') {
              return (
                <View key={index} style={[styles.questions]}> 
                  <View style={{marginLeft:25}}><Text>{text || "题目"}</Text></View>
                  {Object.entries(options[index]).map(([key, value]) => (
                    <View key={key} style={styles.choose}>
                      <Text>{key}:   </Text>
                      <Text>{value}</Text>
                    </View>
                  ))}
                  <View style={[styles.choose, {marginBottom:15}]}>
                    <Text>答案：</Text>
                    <Text>{selectedOption[index].join('')}</Text>
                  </View>
                </View>
              );
            } else if (questionstyle[index].Variety === '判断题') {
              return (
                <View key={index} style={[styles.questions]}> 
                  <View style={{marginLeft:25}}><Text>{text || "题目"}</Text></View>
                  <View style={styles.choose}>
                    <Text>正确</Text>
                  </View>
                  <View style={styles.choose}>
                    <Text>错误</Text>
                  </View>
                  <View style={[styles.choose, {marginBottom:15}]}>
                    <Text>答案：</Text>
                    <Text>{selectedOption[index]}</Text>
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


