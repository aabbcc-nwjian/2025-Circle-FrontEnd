import { View, Text ,StyleSheet,Image} from 'react-native';
import { Link, useNavigation } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import myStory from '../datas';
import { useEffect ,useState} from 'react';
import { Post } from '../axios';
import Loading from '../loading';
import { useRoute } from '@react-navigation/native';

export default function Practice() {
  const navigation = useNavigation()
  const route = useRoute();
  const toStart=()=>{
    navigation.navigate('next',{"testid":sheetid})
  }
  const [should,setShould]=useState(false);
  const sheetid=myStory.data['sheet'];
  const [tests,setTests]=useState();
  useEffect(()=>{
    const getsheet=async()=>{
      console.log(sheetid);
      const data = await Post('/test/gettest',{"testid":sheetid})
      console.log(data.test);
      setTests(data.test);
    }
    if (sheetid) {
    getsheet();
    setShould(true);
    }
  },[])
  const [users,setUsers]=useState()
  const [questions,setQuestions]=useState()
  useEffect(()=>{
    if (tests) {
      const getname=async(id)=>{
      const data1 = await Post('/user/getname',{"id":tests.Userid})
      const data2 = await Post('/test/getquestion',{"testid":sheetid})
      /* const data3 = await Post('/test/gettestoption',{"practiceid":}) */
      console.log(data2.question);
      setUsers(data1.success);
      setQuestions(data2.question);
      myStory.data['testname']=tests.Testname;
    }
    getname();
    }
  },[tests])
  const [one,setOne]=useState(0)
  const [more,setMore]=useState(0)
  const [judge,setJudge]=useState(0)
  useEffect(()=>{
    if (questions) {
     const getoption=async()=>{
      let a=0;
      let b=0;
      let c=0;
      for (let i = 0; i < questions.length; i++) {
        if (questions[i].Variety=="单选") {
          a++
        }else if (questions[i].Variety=="多选") {
          b++ 
        }else if (questions[i].Variety=="判断题") {
          c++
        }
      }
      setOne(a)
      setMore(b)
      setJudge(c)
    } 
    getoption()
    }
  },[questions])
  const [love,setLove]=useState(false)
  const [loves, setLoves] = useState(0);
  const clickLove = ()=>{
    setLove(!love)
    if(love){
    setLoves(e => e - 1);
    }else{
    setLoves(e => e + 1);
    }
  }
  if (!should) {
    return (
      <Loading />
    )
  }else if (tests&&questions){
    return (
    <View style={{backgroundColor:'white',height:'100%',width:'100%'}}>
    <View style={styles.line}>
      <Text style={{marginTop:10,marginLeft:20,width:80}} onPress={()=>{navigation.navigate('(tabs)')}}><FontAwesome size={40} name='angle-left'/></Text>
    </View>

    <View style={{marginTop:'5%',marginLeft:'8%'}}>
    <View style={styles.picture}></View>
    <View style={{position:'absolute',marginLeft:150}}>
    <Text style={{fontSize:25,fontWeight:'bold'}}>{tests.Testname}</Text>
    <Text style={{fontSize:18,marginTop:5}}>{users}</Text>
    <Text style={{fontSize:16,marginTop:5}}>难度星数：</Text>
    <Text style={{fontSize:16,marginTop:5}}>#{tests.Circle}</Text>
    <Text style={{fontSize:16,marginTop:5}}>{tests.Discription}</Text>
    </View>
    <View style={{position:'absolute',marginLeft:280,marginTop:50}}>
      <TouchableOpacity onPress={clickLove}>
      <Image 
      source={love?require('../img/pic9.png'):require('../img/pic10.png')}
      style={{width:45,height:41,marginTop:'10%',marginLeft:'20%'}}
      />  
      <Text style={{textAlign:'center',marginLeft:10}}>{tests.Good}</Text>
      </TouchableOpacity>
    </View>
    </View>


    <View style={styles.box1}>
      <Text style={{fontSize:25,fontWeight:'bold',marginLeft:'10%',marginTop:15}}>题型介绍</Text>
      <View style={styles.box2}>
        <Text style={{fontSize:18,marginTop:15,marginLeft:15,fontWeight:'bold'}}>ALL 总分</Text>
        <Text style={{fontSize:18,marginTop:18,marginLeft:150,fontWeight:'bold'}}>{questions.length*10}</Text>
      </View>
      <View style={styles.box3}>
      <View>
        <Text style={[styles.questions,{fontSize:22}]}>类型</Text>
      </View>
      <View style={{flexDirection:'row',justifyContent:'space-between'}}>
        <Text style={styles.questions}>单选题</Text>
        <Text style={styles.score}>{one*10}</Text>
      </View>
      <View style={{flexDirection:'row',justifyContent:'space-between'}}><Text style={styles.questions}>多选题</Text><Text style={styles.score}>{more}</Text></View>
      <View style={{flexDirection:'row',justifyContent:'space-between'}}><Text style={styles.questions}>判断题</Text><Text style={styles.score}>{judge}</Text></View>
      </View>
    </View>


    <View style={{marginLeft:'20%',marginTop:20,width:'60%'}}><Text style={{fontSize:25,textAlign:'center'}} onPress={toStart}>开始</Text></View>
    </View>
  );
  }
  
}
const styles = StyleSheet.create({
  line: {
    borderBottomWidth:1,
    borderColor:'gray'
  },picture:{
    width:140,
    height:140,
    backgroundColor:'gray',
    borderRadius:15,
  },box1:{
    width:'80%',
    height:430,
    backgroundColor:'#3D89FB',
    borderRadius:15,
    marginTop:20,
    marginLeft:'10%'
  },box2:{
    width:'90%',
    height:60,
    backgroundColor:'white',
    borderRadius:10,
    marginTop:15,
    marginLeft:'5%',
    flexDirection:'row'
  },box3:{
    width:'90%',
    height:265,
    backgroundColor:'blue',
    borderRadius:13,
    marginTop:15,
    marginLeft:'5%'
  },questions:{
    color:'white',
    marginTop:20,
    marginLeft:80,
    fontSize:16
  },score:{
    color:'white',
    marginTop:20,
    marginRight:15,
    fontSize:16
  }
})