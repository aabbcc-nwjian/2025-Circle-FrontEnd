import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { useState , useEffect} from 'react';
import { useRoute } from '@react-navigation/native';
import { Post } from '../axios';
import myStory from '../datas';
import { useCallback } from 'react';
const options = ['A', 'B', 'C', 'D'];
const judgmentoptions = ['A','B']
export default function Practice() {
  const testname = myStory.data['testname'];
  const router = useRouter();
  const navigation = useNavigation()
  const [should,setShould]=useState(true)
  const [count,setCount]=useState(0)
  const testid=myStory.data['testid'];
  const myanswer = myStory.questions['questions']
  const toNext=()=>{
    if (count==tests.length - 1) {
      navigation.navigate('end')
    }else{
      setCount(count+1)
      setQuestionstyle(tests[count+1].Variety)
    }
  }
  
  const renderOption = (option) => (
    <View key={option.Option}>
      <View 
        style={[
          styles.choose, 
          myanswer[count] === option.Option && styles.fault,
          answer === option.Option && styles.selectedChoose
        ]}
      >
        <View style={styles.optionContent}>
          <Text style={[styles.text,(myanswer[count] === option.Option || answer === option.Option) && styles.activetext]}>{option.Option}.</Text>
          <Text style={[styles.text,(myanswer[count] === option.Option || answer === option.Option) && styles.activetext]}>{option.Content}</Text>
        </View>                
      </View>
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
      <View 
        style={[
          styles.choose, 
          myanswer[count].includes(option.Option) && styles.fault,
          answer.split('').includes(option.Option) && styles.selectedChoose,
        ]}
      >
        <View style={styles.optionContent}>
          <Text style={[styles.text,(myanswer[count].includes(option.Option) || answer.split('').includes(option.Option)) && styles.activetext]}>{option.Option}.</Text>
          <Text style={[styles.text,(myanswer[count].includes(option.Option) || answer.split('').includes(option.Option)) && styles.activetext]}>{option.Content}</Text>
        </View>                
      </View>
    </View>
  );  
  const renderOption2 = (option) => (
    <View key={option.Option}>
      <View 
        style={[
          styles.choose, 
          myanswer[count] === option.Option && styles.fault,
          answer === option.Option && styles.selectedChoose
        ]}
      >
        <View style={styles.optionContent}>
          <Text style={[styles.text,(myanswer[count] === option.Option || answer === option.Option) && styles.activetext]}>{option.Content}</Text>
        </View>                
      </View>
    </View>
  );
  
  const a="单选题"
  const b="多选题"
  const c="判断题"
  const [questionstyle,setQuestionstyle]=useState(b)
  const [tests,setTests]=useState();
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
        console.log(myanswer);
        
        setOption(data.option)
        setAnswer(tests[count].Answer)
        setShould(true);
      }
      useEffect(()=>{
        if (tests) {
          getOptions(tests[count].Questionid)
        }
      },[tests,count])

      const back=()=>{
        if (count==0) {
          router.back() 
        }else{
          setCount(count-1)
          setQuestionstyle(tests[count-1].Variety)
        }
      }
if (should&&option&&tests) {
  return (
    <View style={{backgroundColor:'white',height:'100%',width:'100%'}}>
      <View style={{margin:10,flexDirection:'row'}}>
        <Text onPress={back}>
          <FontAwesome size={35} name='angle-left'/>
        </Text>
        <Text style={{marginLeft:'38%',fontSize:24,fontWeight: '700', fontFamily: 'Source Han Sans-Bold'}}>{testname}</Text>
        <Text style={{marginLeft:'20%',margin:'auto',fontSize:18,fontWeight: '700', fontFamily: 'Source Han Sans-Bold',color:'#737576'}}>{count+1}/{tests.length}</Text>
      </View>

      <View>
        <View style={styles.questions}>
          <Text style={{marginTop:10,marginLeft:10,fontWeight: '700', fontFamily: 'Source Han Sans-Bold',fontSize:18}}>{tests[count].Content}</Text>
        </View>
        <View style={styles.hard}><Text style={{fontWeight: '700', fontFamily: 'Source Han Sans-Bold',fontSize:14}}>{questionstyle}</Text></View>
        {questionstyle=="单选" && option.map(renderOption)}
        {questionstyle=="多选" && option.map(renderOption1)}
        {questionstyle=="判断题" && option.map(renderOption2)}
        <View style={styles.sure}><Text onPress={toNext} style={{textAlign:'center',marginTop:8,color:'white',fontWeight: '700', fontFamily: 'Source Han Sans-Bold',fontSize:16}}>{count==tests.length-1 ? '提交' : '下一题'}</Text></View>
      </View>
    </View>
  );
}
}
const styles = StyleSheet.create({
  questions:{
    width:'80%',
    height:100,
    backgroundColor:'white',
    top:30,
    left:'10%',
    borderRadius:15,
    elevation:5
  },
  hard:{
    marginTop:40,
    marginLeft:'75%'
  },
  choose:{
    marginTop:30,
    marginLeft:'10%',
    width:'80%',
    height:60,
    elevation:5,
    borderRadius:10,
    backgroundColor:'white',
  },
  selectedChoose: {
    backgroundColor: '#6DB775',
  },sure:{
    marginTop:50,
    marginLeft:'37%',
    width:'26%',
    height:40,
    elevation:5,
    borderRadius:10,
    backgroundColor:'#3083FE',
  },fault:{
    backgroundColor:'#FF6E6E'
  },optionContent: {
    marginTop: 15,
    marginLeft: 20,
    flexDirection: 'row',
  },text:{
    fontSize:18,
    fontWeight: '700', fontFamily: 'Source Han Sans-Bold',
  },activetext:{
    color:'white'
  }
});
