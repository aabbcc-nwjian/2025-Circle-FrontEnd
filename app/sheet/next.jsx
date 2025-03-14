import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { useState ,useEffect} from 'react';
import { OnePractice,MorePractice,JudgmentPractice} from './questionstyle';
import { useRoute } from '@react-navigation/native';
import { Post } from '../axios';
import myStory from '../datas';
import { useCallback } from 'react';
export default function Practice() {
  const [tests,setTests]=useState();
  const testname = myStory.data['testname'];
  const router = useRouter();
  const navigation = useNavigation()
  const route = useRoute();
  const toNext=()=>{
    record()
    checkanswer()
    dotext()
    if (count==tests.length - 1) {
      navigation.navigate('end')
    }else{
      setCount(count+1)
      setQuestionstyle(tests[count+1].Variety)
      setSelectedOption(null)
    }
    myStory.data['sheet']=testid
  }
  const testid = route.params.testid;
  const a="单选"
  const b="多选"
  const c="判断题"
  const [questionstyle,setQuestionstyle]=useState(a)

  const [count,setCount]=useState(0)
  const [right, setRight] = useState(0);

  const checkanswer = useCallback(() => {
    if (selectedOption === answer) {
      setRight(prevRight => prevRight + 1);
    }
  });
  useEffect(() => {
    console.log('Right answers:', right);
    myStory.data['right']=right;
  }, [right]);

  const record=()=>{
    const myanswer = selectedOption
    myStory.questions['questions'][count]=myanswer
    console.log(myStory.questions['questions']);
  }

  const dotext=async()=>{
    if (count==tests.length - 1) {
      const data = await Post('/test/getscore',{
        "testid":Number(testid),
        "correctnum":right,
        "time":10,
      })
      const record = await Post('/test/recordtesthistory',{
        "testid":Number(testid)
      })
      console.log(data);
    }
  }

  const [should1,setShould1]=useState(false);
  useEffect(()=>{
    const getsheet=async()=>{
      const data = await Post('/test/getquestion',{"testid":Number(testid)})
      console.log(data.question);
      setTests(data.question);
      setQuestionstyle(data.question[0].Variety)
    }
    
    getsheet();
  },[])
  const [answer,setAnswer]=useState();
  const [option,setOption]=useState();
  const getOptions=async(id)=>{
    const data = await Post('/test/gettestoption',{"practiceid":id})
    console.log(data.option);
    setOption(data.option)
    setShould1(true);
    setAnswer(tests[count].Answer)
  }
  useEffect(()=>{
    if (tests) {
      getOptions(tests[count].Questionid)
    }
  },[tests,count])

  useEffect(()=>{
    if (tests&&!myStory.questions['questions']) {
      myStory.questions['questions']=Array(tests.length);
      console.log(myStory.questions['questions']);
    }
  },[tests])

  const [selectedOption, setSelectedOption] = useState(null);
    
      const renderOption = (option) => (
        <View key={option.Option}>
          <TouchableOpacity 
            style={[
              styles.choose, 
              selectedOption === option.Option && styles.selectedChoose
            ]}
            onPress={() => setSelectedOption(option.Option)}
          >
            <View style={styles.optionContent}>
              <Text>{option.Option}.</Text>
              <Text>{option.Content}</Text>
            </View>                
          </TouchableOpacity>
        </View>
      );
    
  const [selectedOptions, setSelectedOptions] = useState([]);
    
      const toggleOption = (option) => {
        setSelectedOptions(prevOptions => {
          if (prevOptions.includes(option)) {
            return prevOptions.filter(item => item !== option);
          } else {
            return [...prevOptions, option];
          }
        });
      };
    
      const renderOption1 = (option) => (
        <View key={option.Option}>
          <TouchableOpacity 
            style={[
              styles.choose, 
              selectedOptions.includes(option.Option) && styles.selectedChoose
            ]}
            onPress={() => toggleOption(option.Option)}
          >
            <View style={styles.optionContent}>
              <Text>{option.Option}.</Text>
              <Text>{option.Content}</Text>
            </View>                
          </TouchableOpacity>
        </View>
      );  
      const renderOption2 = (option) => (
        <View key={option.Option}>
          <TouchableOpacity 
            style={[
              styles.choose, 
              selectedOption === option.Option && styles.selectedChoose
            ]}
            onPress={() => setSelectedOption(option.Option)}
          >
            <View style={styles.optionContent}>
              <Text>{option.Content}</Text>
            </View>                
          </TouchableOpacity>
        </View>
      );


    const back=()=>{
      if (count==0) {
        router.back() 
      }else{
        setCount(count-1)
        setQuestionstyle(tests[count-1].Variety)
        setSelectedOption(myStory.questions['questions'][count-1])
      }
      if (myStory.questions['questions'][count-1] == answer[count-1]) {
        setRight(prevRight => prevRight - 1);
      }
    }


  if (should1) {
    return (
    <View style={{backgroundColor:'white',height:'100%',width:'100%'}}>
      <View style={{margin:10,flexDirection:'row'}}>
        <Text onPress={back}>
          <FontAwesome size={35} name='angle-left'/>
        </Text>
        <Text style={{textAlign:'center',fontSize:18,marginLeft:'40%'}}>{testname}</Text>
      </View>

      <View>
        <View style={styles.questions}>
          <Text style={{marginTop:10,color:'white',marginLeft:10}}>{tests[count].Content}</Text>
        </View>
        <View style={styles.hard}><Text>{questionstyle}</Text></View>
        {questionstyle=="单选" && option.map(renderOption)}
        {questionstyle=="多选" && option.map(renderOption1)}
        {questionstyle=="判断题" && option.map(renderOption2)}
        <View style={styles.sure}><Text onPress={toNext} style={{textAlign:'center',marginTop:10,color:'white'}}>{count==tests.length-1 ? '提交' : '下一题'}</Text></View>
      </View>
    </View>
  );
  }
  
}

const styles = StyleSheet.create({
  questions:{
    width:'80%',
    height:100,
    backgroundColor:'#3083FE',
    top:50,
    left:'10%',
    borderRadius:15
  },
  hard:{
    marginTop:50,
    marginLeft:'75%'
  },sure:{
    marginTop:50,
    marginLeft:'35%',
    width:'30%',
    height:40,
    elevation:5,
    borderRadius:10,
    backgroundColor:'#3083FE',
  },choose: {
    marginTop: 30,
    marginLeft: '10%',
    width: '80%',
    height: 60,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  selectedChoose: {
    backgroundColor: '#3083FE',
  },
  optionContent: {
    marginTop: 15,
    marginLeft: 20,
    flexDirection: 'row',
  },
});
