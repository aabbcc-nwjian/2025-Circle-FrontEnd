import { Button, Image, ScrollView, StyleSheet, TextInput ,TouchableOpacity} from 'react-native';
import { View , Text ,Alert} from 'react-native';
import { useState , useEffect} from 'react';
import React from 'react';
import { navigate } from 'expo-router/build/global-state/routing';
import { useNavigation } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { Get, Post } from '../axios';
import { LinearGradient } from 'expo-linear-gradient';
export default function SendPage() {
  const navigation = useNavigation()
  const [tags,setTags]=useState()
  const [should,setShould]=useState(false)
  useEffect(() => {
        const fetchUserData = async () => {
          try {
            const userData = await Get('/circle/selectcircle');
            console.log(userData.circle);
            setTags(userData.circle)
            setShould(true)
          } catch (error) {
            console.error(error);
          }
        };
        fetchUserData();
      }, []);

    const [inputText, setInputText] = useState('');
    const [analysisText, setAnalysisText] = useState('');
    const [selectedOption, setSelectedOption] = useState(null);
    const [practiceid,setPracticeid]=useState()
    const send = async()=>{
      if (inputText&&selectedOption) {
        console.log(star,activetext,inputText,selectedOption,analysisText);
      const createpractice=await Post('/practice/createpractice',{
        "variety":"判断题",
        "difficulty":String(star),
        "circle":activetext,
        "imageurl":"",
        "content":inputText,
        "answer":selectedOption,
        "explain":analysisText
      })
      setPracticeid(createpractice.practiceid)
      console.log(createpractice);
      }else{
        alert('请完善题目信息')
      }
    }
    const clearInputs = () => {
      setInputText('');
      setAnalysisText('');
      setStar(1);
    };
    useEffect(() => {
      const sentoption=async()=>{
      if (practiceid) {
        const createoption1=await Post('/practice/createoption',{
        "practiceid":practiceid,
        "content":'正确',
        "option":'true'
      })
      const createoption2=await Post('/practice/createoption',{
        "practiceid":practiceid,
        "content":'错误',
        "option":'false'
      })
      clearInputs();
      console.log(createoption1,createoption2);
      }
    }
    sentoption()
    }, [practiceid])

  const [activeId, setActiveId] = useState(null)
  const [activetext,setActivetext]=useState('测试圈子')    
    const handlePress = (id,text) => {
        setActiveId(id);
        setActivetext(text)
        setCircle(false)
      };
    
    const getTagStyle = (id) => {
        return activeId === id ? style.activeTag : style.inactiveTag;
      };
    const getTextStyle = (id) => {
        return activeId === id ? style.activetext : style.inactivetext
      }
    


    const [circle,setCircle]=useState(false)
    const getCircle=()=>{
    setCircle(true)
    }
    const unCircle=()=>{
        setCircle(false)
    }

    
    const [star ,setStar] = useState(1)
  return (
    <>
    <View style={{height:75,backgroundColor:'white'}}>
     <View style={style.first}>
        <Text style={{height:40,marginTop:-10}} onPress={()=>{navigation.goBack()}}><FontAwesome size={40} name='angle-left'/></Text>
        <View style={{width:60,height:32,backgroundColor:'#3D89FB',borderRadius:8}}>
        <Text onPress={send} style={{margin:'auto',color:'white',textAlign:'center',fontSize:16,fontWeight:700,fontFamily:'Source Han Sans-Bold'}}>发布</Text>
        </View> 
    </View>   
    </View>

    <ScrollView>
    <View style={{height:150, backgroundColor:'white'}}>
      <View style={style.inputContainer}>
        {!inputText && (
          <Text style={style.placeholder}>
            题目内容
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

    <LinearGradient
        colors={['white','#A6CAFF','#5898F8']} 
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{height:30,marginTop:1}}>
                <Text style={{marginLeft:"85%",marginTop:5,fontSize:16,fontWeight:700,fontFamily:'Source Han Sans-Bold',color:'white'}}>答案</Text>
        </LinearGradient>
    
      
    <View style={{width:'100%',backgroundColor:'white'}}>
    <View style={[style.choose, {marginTop:10,marginBottom:25}]}>
      <Text style={{marginTop:10,marginLeft:20,fontSize:20,fontFamily:'Source Han Sans-Bold',fontWeight:700}}>正确</Text>
      <TouchableOpacity 
        style={style.circle1} 
        onPress={() => setSelectedOption('正确')}
      >
        {selectedOption === '正确' && <View style={style.circle2}></View>}
      </TouchableOpacity>
    </View>
    <View style={[style.choose, {marginTop:10,marginBottom:25}]}>
      <Text style={{marginTop:10,marginLeft:20,fontSize:20,fontFamily:'Source Han Sans-Bold',fontWeight:700}}>错误</Text>
      <TouchableOpacity 
        style={style.circle1} 
        onPress={() => setSelectedOption('错误')}
      >
        {selectedOption === '错误' && <View style={style.circle2}></View>}
      </TouchableOpacity>
    </View>
</View>


    <View style={{height:50,backgroundColor:'white',marginTop:1}}>
     <Text style={{marginTop:10,marginLeft:25,fontSize:20,fontFamily:'Source Han Sans-Bold',fontWeight:700}}>选择圈子</Text>
     <View style={{marginLeft:120,position:'absolute',marginTop:18,width:45,height:20,backgroundColor:'#3D89FB',borderRadius:8,}}>
     <Text style={{marginLeft:8,fontSize:13,color:'white'}}>{activetext}</Text>
     </View>
     <FontAwesome onPress={circle?unCircle:getCircle} size={28} name={circle?'angle-up':'angle-down'} style={{top:15,right:15,position:'absolute'}} />
    </View>

      {circle&&<View style={style.end}>
            <View style={{flexDirection:'row',flexWrap:'wrap',marginBottom:20}}>
            {tags.map((tag) => (
            <View key={tag.Id} style={[style.tagContainer, getTagStyle(tag.Id)]}>
          <Text onPress={() => handlePress(tag.Id,tag.Name)} style={getTextStyle(tag.Id)}>{tag.Name}</Text>                
            </View>
          ))}      
            </View>
      </View>}

    <View style={{height:50,backgroundColor:'white',marginTop:1,flexDirection:'row'}}>
     <Text style={{marginTop:10,marginLeft:25,fontSize:20,fontFamily:'Source Han Sans-Bold',fontWeight:700}}>难度星数:</Text>
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

    <View style={{backgroundColor:'white', marginTop:1, paddingVertical: 15}}>
  <Text style={{marginLeft:25,fontSize:20,fontFamily:'Source Han Sans-Bold',fontWeight:700,marginTop:-5}}>答案解析:</Text>
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


    </ScrollView>
    
    
    </>
  );
}
const style = StyleSheet.create({
    first:{
        flex:1,
        flexDirection:'row',
        justifyContent:'space-between',
        padding:25
    },third:{
        flex:1,
        flexDirection:'column',
        justifyContent:'space-evenly',
        textAlign:'center'
    },end:{
        width:'100%',
        backgroundColor:'white',
        display:'flex',
    }, tagContainer: {
        width:50,
        height:22,
        backgroundColor:'#3D89FB',
        borderRadius:8,
        marginTop:20,
        marginLeft:24,
      },
      inactiveTag: {
        backgroundColor:'white',
        elevation:1,
        borderRadius:10
      },
      activeTag: {
        backgroundColor: '#3D89FB',
        color: '#fff',
      },activetext:{
        textAlign:'center',
        color:'white'
      },inactivetext:{
        textAlign:'center',
        color:'#111313'
      },agree:{
        width:10,
        height:10,
        borderRadius:5,
        borderColor:'#000000',
        borderWidth:1,
        position:'absolute',
        marginLeft:360,
        marginTop:20
      },circle:{
        width:8,
        height:8,
        borderRadius:5,
        backgroundColor:'#D8D8D8',
      },inputContainer: {
        marginLeft: 20,
        marginRight: 20,
        borderRadius: 10,
        height: 130,
        backgroundColor: '#3D89FB',
        position: 'relative',
        elevation:10,
        fontSize:20,fontFamily:'Source Han Sans-Bold',fontWeight:700
      },
      input: {
        fontSize: 20,
        color: 'white',
        padding: 10,
        height:130,
        fontSize:20,fontFamily:'Source Han Sans-Bold',fontWeight:700
      },
      placeholder: {
        position: 'absolute',
        left: '50%',
        marginLeft:-40,
        top: 50, 
        fontSize: 20,
        color: '#FFFFFF',
        fontSize:20,fontFamily:'Source Han Sans-Bold',fontWeight:700
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
        height:180,
      },analysisPlaceholder: {
        position: 'absolute',
        left: '45%',
        top: 25, 
        fontSize: 20,
        color: 'rgba(255,255,255,0.7)',
      },circle1:{
        width:30,
        height:30,
        borderWidth:2,
        borderRadius:15,
        borderColor:'#3D3D3D',
        marginLeft:'110%',
        marginTop:10,
        justifyContent: 'center',
        alignItems: 'center',
        position:'absolute'
      },
      circle2:{
        width:23,
        height:23,
        borderRadius:12,
        backgroundColor:'#3D89FB',
      }, 
})