import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView ,TextInput, Button} from 'react-native';
import { useNavigation } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useState , useEffect} from 'react';
import { TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { OnePractice,MorePractice,JudgmentPractice } from '../sheet/questionstyle';
import { Post } from '../axios';
import { useRoute } from '@react-navigation/native';
import Loading from '../loading';
import { useCallback } from 'react';
export default function NextScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [should1,setShould1]=useState(false)
  const [should2,setShould2]=useState(false)
  const [should3,setShould3]=useState(false)
  const practiceid = route.params.practiceid;
  const id = Number(practiceid)
  const answer1 = route.params.answer1;
  const answer2 = route.params.answer2;

  const [all,setAll]=useState([])
  const [options,setOptions]=useState([])
  const [optionColors,setOptionColors]=useState(['white', 'white', 'white', 'white'])
  const [value,setValue]=useState('')
  const sendcomment=async()=>{
      const send=await Post('/practice/commentpractice',{
        "practiceid":id,
        "content":value
      })
      console.log(send);
      setValue('');
  }

  useEffect(() => {
    const getmessage=async()=>{
    const usedata1 = await Post('/practice/getcomment',{"practiceid":id})
    const usedata2 = await Post('/practice/getpractice',{"practiceid":id})
    const usedata3 = await Post('/practice/getoption',{"practiceid":id})
    console.log(usedata1.comment);
    console.log(usedata2.practice);
    console.log(usedata3.option);
    setComment(usedata1.comment)
    setAll(usedata2.practice)
    setStar(usedata2.practice.Difficulty);
    setLoves(usedata2.practice.Good)
    setOptions(usedata3.option)
    setShould1(true)
    }
    getmessage();
  },[])
  useEffect(() => {
    const updateOptionColors = () => {
      const newOptionColors = ['white', 'white', 'white', 'white'];
  
      const updateColor = (answer, color) => {
        if (all.Variety === '单选') {
          const index = ['A', 'B', 'C', 'D'].indexOf(answer);
          if (index !== -1) newOptionColors[index] = color;
        } else if (all.Variety === '多选') {
          ['A', 'B', 'C', 'D'].forEach((option, index) => {
            if (answer.includes(option)) newOptionColors[index] = color;
          });
        } else if (all.Variety === '判断题') {
          if (answer === 'true') newOptionColors[0] = color;
          else if (answer === 'false') newOptionColors[1] = color;
        }
      };
  
      updateColor(answer2, 'red');
      updateColor(answer1, 'green');

      setOptionColors(newOptionColors);
      setShould2(true);
    };
  
    if (should1) {
      updateOptionColors();
    }
  }, [should1, all.Variety, answer1, answer2]);
  
  const [zhanji,setZhanji]=useState({
      Peoplenum:0,
      Correctnum:0
    })
  const average = useCallback(() => {
      if (zhanji.Peoplenum === 0) return '0';
      return ((zhanji.Correctnum / zhanji.Peoplenum) * 100).toFixed(1);
    }, [zhanji.Correctnum, zhanji.Peoplenum]);
  const [username,setUsername]=useState()
  useEffect(()=>{
      const getmessage=async()=>{
        if (should1) {
        const usedata=await Post('/practice/getpracticesituation',{"practiceid":all.Practiceid})
        const user = await Post('user/getname',{"id":all.Userid})
        console.log(usedata);
        setZhanji(usedata.message)
        setUsername(user.success)
        }
      }
      getmessage();
    },[should1])

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
  const [star ,setStar] = useState(0)

  const [comment,setComment]=useState()
  const [comments,setComments]=useState([])

  useEffect(() => {
   const getusers=()=>{
    if (comment) {
      comment.map((item)=>{
      const getuser=async()=>{
        const user = await Post('user/getname',{"id":item.Userid})
        const head = await Post('user/getuserphoto',{"id":item.Userid})
        const res = {...item,username:user.success,head:head.success}
        console.log(res);
        comments.push(res)
      } 
      getuser()
    })
    }
   } 
   getusers();
  },[comment])

  const renderOption = (option, index) => (
    <View key={option.Option} style={[styles.choose, { backgroundColor: optionColors[index] }]}>
      <View style={styles.optionContent}>
        <Text>{option.Option}.</Text>
        <Text>{option.Content}</Text>
      </View>
    </View>
  );
  const renderOption0 = (option, index) => (
    <View key={option.Option} style={[styles.choose, { backgroundColor: optionColors[index] }]}>
      <View style={styles.optionContent}>
        <Text>{option.Option}.</Text>
        <Text>{option.Content}</Text>
      </View>
    </View>
  );

  const renderComment = ({ username, Content, date ,love,Commentid,head}) => (
    <View key={Commentid} style={styles.commentContainer}>
      <View style={styles.commentHeader}>
        <View style={styles.head}><Image source={{ uri: head }}/></View>
        <Text style={styles.username}>{username}</Text>
        <Text style={styles.score}>{love}</Text>
        <Image 
          source={require('../img/pic10.png')}
          style={{width:22,height:20,marginTop:16,marginLeft:5}}
          />  
      </View>
      <View style={styles.content}>
        <Text style={styles.contentText}>{Content}</Text>
      </View>
      <View style={styles.commentFooter}>
        <Text>{date}</Text>
        {/* <Text style={styles.reply}>回复</Text> */}
      </View>
    </View>
  );
  if (!should2 || !should1) {
    return <Loading/>
  }else{
    return (
    <View style={styles.container}>
      <View style={{flexDirection:'row'}}>
        <Text style={{marginLeft:'5%',marginTop:'4%',position:'absolute'}} onPress={()=>{navigation.navigate('(tabs)')}}><FontAwesome size={35} name='angle-left'/></Text>
        <Text style={{fontSize:18,textAlign:'center',width:"40%",marginLeft:'30%',marginTop:'5%'}}>练习场</Text>
        <View style={{marginTop:'5%',marginLeft:'5%',flexDirection:'row'}}>
          <TouchableOpacity onPress={clickLove}>
          <Image 
          source={love?require('../img/pic9.png'):require('../img/pic10.png')}
          style={{width:22,height:20,marginTop:'25%'}}
          />  
          </TouchableOpacity>
          <Text style={{fontSize:20,marginLeft:'10%'}}>{loves}</Text>
        </View>
      </View>

      <ScrollView>
        <View>
          <LinearGradient
          colors={['#3083FE','#63A2FF','#A2C6FB']} 
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.questions}>
            <Text style={{marginTop:10,marginLeft:'5%',marginRight:'5%'}}>
              {all.Content}
            </Text>
          </LinearGradient>
          <View style={styles.hard}>
          <Text>难度星数</Text>
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
          {all.Variety!=="判断题" && options.map(renderOption)}
          {all.Variety=="判断题" && options.map(renderOption0)}
        </View>

        <View style={styles.messageContainer}>
        <View style={styles.message}>
          <Text style={styles.messageTitle}>出题人</Text>
          <Text style={styles.messageSubtitle}>{username}</Text>
        </View>
        <View style={styles.message}>
          <Text style={styles.messageTitle}>答题总人数</Text>
          <Text style={styles.messageSubtitle}>{zhanji.Peoplenum}</Text>
        </View>
        <View style={styles.message}>
          <Text style={styles.messageTitle}>正确率</Text>
          <Text style={styles.messageSubtitle}>{average()}%</Text>
        </View>
        </View>

        <View>
          {comments.map(renderComment)}
        </View>   
      </ScrollView>

      <View style={{width:'100%',height:'10%'}}>
        <View style={{width:'75%',height:'50%',marginLeft:'5%',marginTop:'5%',backgroundColor:'#D8D8D8',borderRadius:20,position:'absolute'}}></View>
          <TextInput value={value} onChangeText={setValue} placeholder='理性发言，友善互动' style={{marginTop:'4%',marginLeft:'10%',fontSize:18,color:'#737576'}}></TextInput>
        <TouchableOpacity style={{width:'10%',marginLeft:'85%',position:'absolute',marginTop:'6%'}}>
        <Text onPress={sendcomment}>发布</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  }
  
}

const styles = StyleSheet.create({
  container: { 
    backgroundColor: 'white',
    height: '100%',
    width: '100%' 
  },
  header: { 
    flexDirection: 'row' 
  },
  backButton: { 
    marginLeft: '5%',
    marginTop: '4%',
    position: 'absolute' 
  },
  title: { 
    fontSize: 18,
    textAlign: 'center',
    width: "40%",
    marginLeft: '30%',
    marginTop: '5%' 
  },
  questions: { 
    width: '80%',
    height: 100,
    top: 50,
    borderRadius: 15,
    marginLeft: '10%' 
  },
  questionText: { 
    textAlign: 'center' 
  },
  hard: { 
    marginTop: 50,
    marginLeft: '50%' ,
    flexDirection: 'row'
  },
  choose: { 
    marginTop: 30,
    height: 60,
    elevation: 5,
    borderRadius: 10,
    marginLeft: '10%',
    width: '80%' 
  },
  optionContent: { 
    marginTop: 15,
    marginLeft: 20,
    flexDirection: 'row' 
  },
  messageContainer: { 
    marginTop: '10%',
    flexDirection: 'row',
    justifyContent: 'space-around' 
  },
  message: { 
    width: '33%',
    height: 80,
    backgroundColor: '#3083FE' 
  },
  messageTitle: { 
    textAlign: 'center',
    color: 'white',
    marginTop: 15,
    fontSize: 16 
  },
  messageSubtitle: { 
    textAlign: 'center',
    color: 'white',
    marginTop: 10,
    fontSize: 20 
  },
  commentContainer: { 
    marginLeft: '5%',
    width: '90%' 
  },
  commentHeader: { 
    flexDirection: 'row',
    position: 'absolute',
    marginTop: 20 
  },
  head: { 
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#D8D8D8',
    marginLeft: '5%' 
  },
  username: { 
    marginTop: 15,
    marginLeft: 10 ,
    width:'60%',
  },
  score: { 
    marginTop: 15,
    marginLeft:'3%' 
  },
  content: { 
    width: '80%',
    height: 70,
    backgroundColor: '#D8D8D8',
    marginTop: 80,
    marginLeft: '15%',
    borderRadius: 10 
  },
  contentText: { 
    marginTop:10,
    marginLeft:10
  },
  commentFooter: { 
    marginTop: 20,
    marginBottom: 50,
    flexDirection: 'row',
    marginLeft: '60%' 
  },
  reply: { 
    marginLeft: '20%' ,
    color:'#3083FE'
  },
});

