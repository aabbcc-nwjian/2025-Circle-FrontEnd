import { View, Text ,StyleSheet,Image,TouchableOpacity} from 'react-native';
import { Link, useNavigation} from 'expo-router';
import { useRoute } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { useState ,useEffect,useCallback,useRef} from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Post } from '../axios';
import myStory from '../datas';
import Loading from '../loading';
export default function Practice() {
  const navigation = useNavigation()
  const route = useRoute();

  const [should1,setShould1]=useState(false)
  const [should2,setShould2]=useState(false)

  const timeRef = useRef(0);
  const time = timeRef.current;
  const [timeing,setTimeing]=useState(true)
  /* useEffect(() => {
    if (timeing) {
      const timer = setInterval(() => {
      timeRef.current += 1;
      console.log(timeRef.current);
    }, 1000);
    }
  }, []);  */

  const checkanswer=()=>{
    if (questionstyle=="多选") {
      const res = selectedOptions.join('');
      if (res==answer) {
        return 'true';
      } else {
        return 'false';
      }
    }else{
      if (selectedOption==answer) {
        return 'true';
      } else {
        return 'false';
      }
    }
  }
  const sendanswer=async()=>{
    if (selectedOption) {
      setTimeing(false)
    const data=await Post('/practice/checkanswer',{
      "practiceid":practiceid,
      "circle":circle,
      "answer":checkanswer(),
      "time":time
    })
    console.log(circle)
    handleOptionPress()
    }else{
      alert('请选择答案')
    }
  }
  const handleOptionPress = () => {
    const answers = answer.split('');
    if (selectedOption) {
      navigation.navigate('next',{
      practiceid:practiceid,
      answer1:answer,
      answer2:selectedOption
    });
    }
    if (selectedOptions) {
      navigation.navigate('next',{
      practiceid:practiceid,
      answer1:answer,
      answer2:questionstyle=="多选"?selectedOptions:selectedOption
      });
    }
  }
  
  const a="单选"
  const b="多选"
  const c="判断题"
  const [questionstyle,setQuestionstyle]=useState(a)

  const [love,setLove]=useState(false)
  const [loves, setLoves] = useState(0);

  const clicklove=async()=>{
    const data = await Post('/practice/lovepractice',{"practiceid":practiceid})
    console.log(data);
  }
  const deletelove = async () => {
    const data = await Post('/practice/unlovepractice',{"practiceid":practiceid})
    console.log(data); 
  }

  const clickLove = ()=>{
    if(love){
    deletelove()
    setLoves(e => e - 1);
    setLove(false)
    }else{
    clicklove()
    setLoves(e => e + 1);
    setLove(true)
    }
  }
  const [practiceid,setPracticeid]=useState()
  useEffect(()=>{
    if (practiceid) {
     const iflove=async()=>{
      const data = await Post('/practice/showlovepractice',{"practiceid":practiceid})
      console.log(data,practiceid);
      if (data.message=='已经点过赞') {
        setLove(true)
      } else {
        setLove(false)
      }
    }
    iflove() 
    }
  },[practiceid])

  const [message,setMessage]=useState()
  const [content,setContent]=useState("")
  const [star ,setStar] = useState(0)
  const [answer,setAnswer]=useState([])
  const circle = myStory.data['circle']
  useEffect(() => {
    const fetchPracticeData = async () => {
      try {
        const response = await Post('/practice/getpractice', { "circle": circle });
        console.log(response.practice);
        setMessage(response.practice);
        setStar(response.practice.Difficulty);
        setLoves(response.practice.Good)
        setContent(response.practice.Content)
        setQuestionstyle(response.practice.Variety)
        setPracticeid(response.practice.Practiceid)
        setAnswer(response.practice.Answer)
        setShould1(true)
      } catch (err) {
        console.error("Error fetching practice data:", err);
      }
    };

    fetchPracticeData();
  }, []);
  const [option,setOption]=useState();
  useEffect(() => {
    const fetchCommentData = async () => {
      if (should1) {
        try {
        const response = await Post('/practice/getoption', { "practiceid": practiceid });
        console.log(response);
        setOption(response.option)
        setShould2(true)
      } catch (err) {
        console.error("Error fetching comment data:", err);
      }
      }
    };
    fetchCommentData();
  },[should1])



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
            <Text style={{fontSize:18,fontFamily:'Source Han Sans-Bold',fontWeight:700}}>{option.Option}.</Text>
            <Text style={{fontSize:18,fontFamily:'Source Han Sans-Bold',fontWeight:700}}>{option.Content}</Text>
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
            <Text style={{fontSize:18,fontFamily:'Source Han Sans-Bold',fontWeight:700}}>{option.Option}.</Text>
            <Text style={{fontSize:18,fontFamily:'Source Han Sans-Bold',fontWeight:700}}>{option.Content}</Text>
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
            <Text style={{fontSize:18,fontFamily:'Source Han Sans-Bold',fontWeight:700}}>{option.Content}</Text>
          </View>                
        </TouchableOpacity>
      </View>
    );

  if (!should2) {
    return <Loading/>
  }else{
    return (
    <View style={{backgroundColor:'white',height:'100%',width:'100%'}}>
    <View style={{flexDirection:'row',marginTop:'5%'}}>
      <Text style={{marginLeft:'5%',margin:'auto',position:'absolute'}} onPress={()=>{navigation.goBack()}}><FontAwesome size={35} name='angle-left'/></Text>
      <Text style={{fontSize:24,textAlign:'center',width:"40%",margin:'auto',fontFamily:'Source Han Sans-Bold',fontWeight:700}}>练习场</Text>
      <View style={{margin:'auto',marginLeft:'5%',flexDirection:'row'}}>
        <TouchableOpacity onPress={clickLove}>
        <Image 
        source={love?require('../img/pic9.png'):require('../img/pic10.png')}
        style={{width:23,height:21,marginTop:'25%'}}
        />  
        </TouchableOpacity>
        <Text style={{fontSize:20,marginLeft:'10%'}}>{loves}</Text>
      </View>
    </View>
    <View>
        <LinearGradient
        colors={['#3083FE','#63A2FF','#A2C6FB']} 
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.questions}>
            <Text style={{marginTop:10,marginLeft:'5%',marginRight:'5%',fontFamily:'Source Han Sans-Bold',fontWeight:700,color:'white',fontSize:16}}>{content}</Text>
        </LinearGradient>
        <View style={styles.hard}>
          <Text style={{fontSize:14,fontFamily:'Source Han Sans-Bold',fontWeight:700}}>难度星数</Text>
          <Image 
          source={star>=1?require('../img/pic18.png'):require('../img/pic19.png')}
          style={{width:15,height:15,marginTop:3,marginLeft:10}}
          />  
          <Image 
          source={star>=2?require('../img/pic18.png'):require('../img/pic19.png')}
          style={{width:15,height:15,marginTop:3,marginLeft:2}}
          /> 
          <Image 
          source={star>=3?require('../img/pic18.png'):require('../img/pic19.png')}
          style={{width:15,height:15,marginTop:3,marginLeft:2}}
          /> 
          <Image 
          source={star>=4?require('../img/pic18.png'):require('../img/pic19.png')}
          style={{width:15,height:15,marginTop:3,marginLeft:2}}
          /> 
          <Image 
          source={star>=5?require('../img/pic18.png'):require('../img/pic19.png')}
          style={{width:15,height:15,marginTop:3,marginLeft:2}}
          /> 
        </View>
        {questionstyle=="单选" && option.map(renderOption)}
        {questionstyle=="多选" && option.map(renderOption1)}
        {questionstyle=="判断题" && option.map(renderOption2)}
        <View style={styles.sure}><Text onPress={sendanswer} style={{textAlign:'center',marginTop:8,fontFamily:'Source Han Sans-Bold',fontWeight:700,color:'white',fontSize:16}}>确定</Text></View>
    </View>
    </View>
  );
  }
}
const styles = StyleSheet.create({
  questions:{
    width:'80%',
    height:100,
    top:50,
    borderRadius:15,
    marginLeft:'10%'
  },hard:{
    marginTop:50,
    marginLeft:'50%',
    flexDirection:'row'
  },choose:{
    marginTop:30,
    height:60,
    elevation:5,
    borderRadius:10,
    backgroundColor:'white',
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
})