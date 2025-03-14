import { Button, Image, ScrollView, StyleSheet, TextInput ,TouchableOpacity} from 'react-native';
import { View , Text ,Alert} from 'react-native';
import { useState , useEffect} from 'react';
import { Post } from '../axios';
import myStory from '../datas';
import React from 'react';
export default function ChooseTf({start=false,optionid = null,onUpdate}) {

    const [inputText, setInputText] = useState('');
    const [analysisText, setAnalysisText] = useState('');
    const [selectedOption, setSelectedOption] = useState(null);
    const [star ,setStar] = useState()
    const [should,setShould]=useState(true)

    useEffect(() => {
      if (onUpdate) {
        onUpdate({ optionid });
        onUpdate({ start });
      }
    }, [optionid,start]);
    const id = optionid - 1;
    const [shouldRender1, setShouldRender1] = useState(false);
    const hide=()=>{
      setShould(false)
      myStory.questionstyle['question'][id]='删除'
    }


    useEffect(() => {
      if (star) {
        myStory.add['explain'][id]=analysisText 
        myStory.add['answer'][id]=selectedOption
        myStory.add['content'][id]=inputText
        myStory.add['difficulty'][id]=star
      }
      if (!star) {
        setInputText(myStory.add['content'][id])
        setSelectedOption(myStory.add['answer'][id])
        setAnalysisText(myStory.add['explain'][id])
        setStar(myStory.add['difficulty'][id])
        setShouldRender1(true);
      }
    },[inputText,analysisText,selectedOption,star])






    useEffect(() => {
      if (start) {
        addquestion()
      }
    }, [start]);

  const testid=myStory.add['testid']
  const [practiceid,setPracticeid]=useState()
  const addquestion = async () => {
    const data = await Post('/test/createquestion', {
      "testid": testid,
      "content": inputText, 
      "difficulty": String(star),
      "answer": selectedOption,
      "variety":"判断题",
      "explain":analysisText,
    })
    console.log(data);
    setPracticeid(data.id)
  }
  useEffect(() => {
    if (practiceid) {
    addoption('正确', 'true')
    addoption('错误', 'false')
    }
  },[practiceid])
  const addoption = async (content , option) => {
    const data = await Post('/test/createtestoption', {
      "practiceid": practiceid,
      "content": content,
      "option": option
    }) 
    console.log(data);
  }
if (should&&shouldRender1) {
  return (
    <View style={{marginTop:15}}>
      <View style={{height:15, backgroundColor:'white',width:'100%'}}>
        <Text onPress={hide} style={{marginLeft:'90%'}}>delete</Text>
      </View>
    <View style={{height:180, backgroundColor:'white'}}>
      <View style={style.inputContainer}>
        {!inputText && (
          <Text style={style.placeholder}>
            题目内容（文字）
          </Text>
        )}
        <TextInput 
          maxLength={50} 
          style={style.input}
          value={inputText}
          onChangeText={setInputText}
          multiline={true}
          textAlignVertical="top"
        />
      </View>   
    </View>

    <View style={{height:30,marginTop:1}}> 
        <Text style={{marginLeft:"90%",marginTop:5}}>答案</Text>
    </View>
    
      
  <View style={{width:'100%',backgroundColor:'white'}}>
  {['正确', '错误'].map((option) => (
    <View key={option} style={[style.choose, {marginTop:10,marginBottom:25}]}>
      <Text style={{marginTop:10,marginLeft:10,fontSize:20}}>{option}</Text>
      <TouchableOpacity 
        style={style.circle1} 
        onPress={() => setSelectedOption(option)}
      >
        {selectedOption === option && <View style={style.circle2}></View>}
      </TouchableOpacity>
    </View>
  ))}
</View>

  <View style={{height:50,backgroundColor:'white',marginTop:1,flexDirection:'row'}}>
      <Text style={{marginTop:15,marginLeft:'6%',fontSize:16}}>难度星数:</Text>
      <TouchableOpacity onPress={()=>setStar(1)}>
        <Image 
        source={star>=1?require('../img/pic18.png'):require('../img/pic19.png')}
        style={{width:15,height:15,marginTop:19,marginLeft:10}}
        />  
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>setStar(2)}>
        <Image 
        source={star>=2?require('../img/pic18.png'):require('../img/pic19.png')}
        style={{width:15,height:15,marginTop:19,marginLeft:2}}
        /> 
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>setStar(3)}>
        <Image 
        source={star>=3?require('../img/pic18.png'):require('../img/pic19.png')}
        style={{width:15,height:15,marginTop:19,marginLeft:2}}
        /> 
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>setStar(4)}>
        <Image 
        source={star>=4?require('../img/pic18.png'):require('../img/pic19.png')}
        style={{width:15,height:15,marginTop:19,marginLeft:2}}
        /> 
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>setStar(5)}>
        <Image 
        source={star>=5?require('../img/pic18.png'):require('../img/pic19.png')}
        style={{width:15,height:15,marginTop:19,marginLeft:2}}
        /> 
        </TouchableOpacity>
    </View>
  <View style={{height:50,backgroundColor:'white',marginTop:1,flexDirection:'row'}}>
    <Text style={{marginTop:15,marginLeft:'6%',fontSize:16}}>分值</Text>
    <View style={{marginTop:10,marginLeft:'55%',width:50,height:30,backgroundColor:'gray',borderRadius:5,}}></View>
    <TextInput maxLength={3} style={{position:'absolute',marginTop:6,marginLeft:265,color:'white'}}></TextInput>
    <Text style={{marginTop:15,marginLeft:10,fontSize:16,}}>分</Text>
  </View>

  <View style={{backgroundColor:'white', marginTop:1, paddingVertical: 15}}>
  <Text style={{marginLeft:'6%', fontSize:16}}>答案解析:</Text>
  <View style={{position: 'relative',marginLeft: 20,marginRight: 20,}}>
    {!analysisText && (
      <View style={style.analysisPlaceholder}>
        <Text style={{color: 'gray'}}>请输入...</Text>
      </View>
    )}
    <TextInput 
      maxLength={200} 
      style={style.analysisInput}
      multiline={true}
      textAlignVertical="top"
      value={analysisText}
      onChangeText={setAnalysisText}
    />
  </View>
  </View>
    </View>
  );
}
}
const style = StyleSheet.create({
    inputContainer: {
        marginLeft: '5%',
        marginRight: '5%',
        borderRadius: 10,
        height: 130,
        backgroundColor: '#3D89FB',
        position: 'relative',
        marginTop:30
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
        position:'absolute',
        marginTop:10,
        justifyContent: 'center',
        alignItems: 'center',
      },
      circle2:{
        width:24,
        height:24,
        borderRadius:12,
        backgroundColor:'#3D89FB',
      },
})