import { View, Text ,StyleSheet, ScrollView} from 'react-native';
import { Link, useNavigation } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { Image } from 'react-native';
import { useState ,useEffect} from 'react';
import { TextInput } from 'react-native';
import myStory from '../datas';
import { Get, Post } from '../axios';
import Loading from '../loading';
import { LinearGradient } from 'expo-linear-gradient';
export default function Practice() {
  const navigation = useNavigation()
  const toReport=()=>{
    navigation.navigate('report')
  }

  const sendcomment=async()=>{
    if (value) {
      const send=await Post('/test/commenttest',{
          "testid":sheetid,
          "content":value
        })
        console.log(send);
        setValue('');
    }else{
      alert('请输入评论内容' )
    }
    }

  const [should,setShould]=useState(false);
  const sheetid=myStory.data['sheet'];
  myStory.data['testid']=sheetid;
  const [tests,setTests]=useState();
  const rignt = myStory.data['right'];
  const [top,setTop]=useState();
  const [myid,setMyid]=useState()
  useEffect(()=>{
    const getsheet=async()=>{
      const data = await Post('/test/gettest',{"testid":sheetid})
      const showtop = await Post('/test/showtop',{"testid":sheetid})
      const user = await Get('/user/myuser')
      console.log(user.success);
      console.log(data.test);
      console.log(showtop.top);
      setTests(data.test);
      setTop(showtop.top);
      setMyid(user.success.Id)
    }
    getsheet();
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
    }
    getname();
    }
  },[tests])
 
  const [comment,setcomment]=useState();
  const [comments,setComments]=useState([])
  useEffect(()=>{
    const getcomment=async()=>{
      const data = await Post('/test/gettestcomment',{"testid":sheetid})
      console.log(data.comment);
      setcomment(data.comment);
    }
    getcomment();
  },[sheetid])
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
        setShould(true);
      })
      }
     } 
     getusers();
    },[comment])
    
    const [showtop,setShowtop]=useState('未上榜')
    const getranking =()=>{
      for (let i = 0; i < top.length; i++) {
        if (top[i].Userid==myid) {
          setShowtop(i+1)
          break
        }
      }
    }
    useEffect(() => {
      if (top) {
        getranking()
      }
    },[top])

    const renderComment = ({ username, Content, date ,love,Commentid,head}) => (
        <View key={Commentid} style={styles.commentContainer}>
          <View style={styles.commentHeader}>
            <View style={styles.head}><Image source={{ uri: head }}/></View>
            <Text style={styles.username}>{username}</Text>
            <Text style={styles.scorelove}>{love}</Text>
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

  const right = myStory.data['right'];
  const [value,setValue]=useState('')
  const [love,setLove]=useState(false)
  const [loves, setLoves] = useState(30);
  const clickLove = ()=>{
    setLove(!love)
    if(love){
    setLoves(e => e - 1);
    }else{
    setLoves(e => e + 1);
    }
  }
  const [star ,setStar] = useState(4)
  if (!tests || !should) {
    return (
      <Loading/>
    )
  }else{
  return (
    <View style={{backgroundColor:'white',height:'100%',width:'100%'}}>
    <View style={styles.line}>
      <Text style={{marginTop:10,marginLeft:20,width:80}} onPress={()=>{navigation.navigate('index')}}><FontAwesome size={40} name='angle-left'/></Text>
    </View>

    <ScrollView>
    <View style={{marginTop:'5%',marginLeft:'8%'}}>
    <View style={styles.picture}></View>
    <View style={{position:'absolute',marginLeft:150}}>
    <Text style={{fontSize:25,fontWeight:'bold',fontWeight: '700', fontFamily: 'Source Han Sans-Bold'}}>{tests.Testname}</Text>
    <Text style={{fontSize:18,marginTop:5,fontWeight: '700', fontFamily: 'Source Han Sans-Bold'}}>{users}</Text>
    <View style={{flexDirection:'row',fontWeight: '700', fontFamily: 'Source Han Sans-Bold'}}>
    <Text style={{fontSize:16,marginTop:5,fontWeight: '700', fontFamily: 'Source Han Sans-Bold'}}>难度星数：</Text>
    {/* <Image 
      source={star>=1?require('../img/pic18.png'):require('../img/pic19.png')}
      style={{width:15,height:15,marginTop:9}}
      />  
      <Image 
      source={star>=2?require('../img/pic18.png'):require('../img/pic19.png')}
      style={{width:15,height:15,marginTop:9,marginLeft:2}}
      /> 
      <Image 
      source={star>=3?require('../img/pic18.png'):require('../img/pic19.png')}
      style={{width:15,height:15,marginTop:9,marginLeft:2}}
      /> 
      <Image 
      source={star>=4?require('../img/pic18.png'):require('../img/pic19.png')}
      style={{width:15,height:15,marginTop:9,marginLeft:2}}
      /> 
      <Image 
      source={star>=5?require('../img/pic18.png'):require('../img/pic19.png')}
      style={{width:15,height:15,marginTop:9,marginLeft:2}}
      />  */}
    </View>
    <Text style={{fontSize:16,marginTop:5,fontWeight: '700', fontFamily: 'Source Han Sans-Bold'}}>#{tests.Circle}</Text>
    <Text style={{fontSize:16,marginTop:5,fontWeight: '700', fontFamily: 'Source Han Sans-Bold'}}>{tests.Discription}</Text>
    </View>
    <View style={{position:'absolute',marginLeft:280,marginTop:50}}>
      <TouchableOpacity onPress={clickLove}>
      <Image 
      source={love?require('../img/pic9.png'):require('../img/pic10.png')}
      style={{width:45,height:41,marginTop:'10%',marginLeft:'20%'}}
      />  
      <Text style={{textAlign:'center',marginLeft:10,color:'#3D89FB',fontSize:20}}>{tests.Good}</Text>
      </TouchableOpacity>
    </View>
    </View>


    <View style={styles.box1}>
    <LinearGradient 
    colors={['#A5C9FF','#E1ECFD']} 
    start={{ x: 0, y: 0 }}
    end={{ x: 0, y: 1 }}
    style={{width:'100%',height:'100%'}}
    >
      <View style={{backgroundColor:'#F2F6FD',width:'30%',height:"25%",borderRadius:10,marginLeft:"35%",marginTop:20,elevation:3}}>
        <Text style={{fontSize:50,color:'#3D89FB',textAlign:'center',margin:'auto',fontWeight: '700', fontFamily: 'Source Han Sans-Bold'}}>{right*10}</Text>
      </View>
      <View style={[styles.box2,{backgroundColor:'#F2F6FD',elevation:3}]}>
        <Image 
        source={require('../img/pic14.png')}
        style={{width:35,height:30,marginTop:'5%',marginLeft:'8%'}}
        /> 
      <Text style={{marginTop:15,fontSize:20,marginLeft:'5%',fontWeight: '700', fontFamily: 'Source Han Sans-Bold'}}>排名</Text>
      <Text style={{marginTop:15,fontSize:20,marginLeft:'35%',fontWeight: '700', fontFamily: 'Source Han Sans-Bold'}}>{showtop}</Text>
      </View>
      <View style={[styles.box2,{backgroundColor:'#9AC2FE',elevation:3}]}>
      <Image 
        source={require('../img/pic15.png')}
        style={{width:33,height:33,marginTop:'5%',marginLeft:'8%'}}
        /> 
      <Text style={{marginTop:15,fontSize:20,marginLeft:'5%',color:'white',fontWeight: '700', fontFamily: 'Source Han Sans-Bold'}}>用时</Text>
      <Text style={{marginTop:15,fontSize:20,marginLeft:'30%',color:'white',fontWeight: '700', fontFamily: 'Source Han Sans-Bold'}}>22:22</Text>
      </View>
      <View style={[styles.box2,{backgroundColor:'#6CA6FD',elevation:3}]}>
      <Image 
        source={require('../img/pic16.png')}
        style={{width:33,height:33,marginTop:'5%',marginLeft:'8%'}}
        /> 
      <Text style={{marginTop:15,fontSize:20,marginLeft:'5%',color:'white',fontWeight: '700', fontFamily: 'Source Han Sans-Bold'}}>详情</Text>
      <Text onPress={toReport} style={{marginTop:18,fontSize:17,marginLeft:'20%',color:'white',fontWeight: '700', fontFamily: 'Source Han Sans-Bold'}}>点击查看报告</Text>
      </View>
    </LinearGradient> 
    </View>
      <View style={{marginLeft:25,marginRight:25}}>

      {/* <View style={{flexDirection:'row',position:'absolute',marginTop:20}}>
      <View style={styles.head}><Image></Image></View>
      <Text style={{marginTop:20,marginLeft:20}}>用户名</Text>
      </View>

      <View style={{flexDirection:'row',position:'absolute',marginTop:40,marginLeft:'75%'}}>
        <Text>{loves}</Text>
        <TouchableOpacity onPress={clickLove}>
        <Image 
        source={love?require('../img/pic9.png'):require('../img/pic10.png')}
        style={{width:22,height:20,marginTop:'5%',marginLeft:5}}
        />  
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={{textAlign:'center'}}>内容</Text>
      </View> 
      <View style={{marginTop:20,marginBottom:50,flexDirection:'row',marginLeft:'60%'}}>
        <Text>2025.2.4</Text>
        <Text style={{marginLeft:30}}>回复</Text>
      </View> */} 
      {comments.map(renderComment)}
      </View>

    </ScrollView>
    <View style={{width:'100%',height:'10%'}}>
      <View style={{width:'70%',height:'60%',marginLeft:'5%',marginTop:'5%',backgroundColor:'#D8D8D8',borderRadius:15,position:'absolute'}}></View>
        <TextInput value={value} onChangeText={setValue} placeholder='理性发言，友善互动' style={{marginTop:'5%',marginLeft:'10%',fontSize:18,color:'#737576',fontWeight: '700', fontFamily: 'Source Han Sans-Bold'}}></TextInput>
      <TouchableOpacity style={{width:'18%',marginLeft:'78%',position:'absolute',marginTop:'6%',height:'55%',backgroundColor:'#3083FE',elevation:0.5,borderRadius:15}}>
      <Text style={{fontWeight: '700', fontFamily: 'Source Han Sans-Bold',fontSize:18,color:'white',margin:'auto'}} onPress={sendcomment}>发送</Text>
      </TouchableOpacity>
    </View>
    </View>
  );
}
}
const styles = StyleSheet.create({
  line: {
    borderBottomWidth:0.5,
    borderColor:'gray'
  },picture:{
    width:140,
    height:140,
    backgroundColor:'#D8D8D8',
    borderRadius:15,
  },box1:{
    width:'80%',
    height:360,
    backgroundColor:'#3D89FB',
    borderRadius:15,
    marginTop:20,
    marginLeft:'10%',
    overflow:'hidden',
    elevation:2
  },score:{
    width:'30%',
    height:'20%',
    borderRadius:10,
    backgroundColor:'white',
  },box2:{
    width:'90%',
    height:60,
    backgroundColor:'white',
    borderRadius:10,
    marginTop:15,
    marginLeft:'5%',
    flexDirection:'row'
  },head:{
    width:50,
    height:50,
    borderRadius:25,
    backgroundColor:'#D8D8D8',
    marginTop:5,
  },content:{
    width:'80%',
    height:70,
    backgroundColor:'#D8D8D8',
    marginTop:80,
    marginLeft:'10%',
    borderRadius:10,
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
    fontFamily:'Source Han Sans-Bold',
    fontWeight:700,
    fontSize:18
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
    borderRadius: 10 ,
  },
  contentText: { 
    marginTop:10,
    marginLeft:10,
    fontFamily:'Source Han Sans-Bold',
    fontWeight:700,
    fontSize:16
  },
  commentFooter: { 
    marginTop: 20,
    marginBottom: 50,
    flexDirection: 'row',
    marginLeft: '60%' 
  },
  reply: { 
    marginLeft: '15%' ,
    color:'#3083FE'
  },
})