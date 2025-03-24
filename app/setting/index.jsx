import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { Post , Get} from '../axios';
import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function Tab() {
  const navigation = useNavigation()
  const router = useRouter();
  const toCipher=()=>{
    navigation.navigate('changecipher')
  }
  const token = AsyncStorage.getItem('token');
  const delelogin = async()=>{
    const data = await Get('/user/logout');
    console.log(data);
    AsyncStorage.setItem('token', null);
    navigation.navigate('login')
  }
  return (
    <View style={{}}>
      <Text style={{margin:10}} onPress={() => router.push('/myself')}><FontAwesome size={30} name='angle-left'/></Text>

      <View style={{marginTop:15,marginLeft:10}}>
        <Text>账号与安全</Text>
        <View style={styles.text1}>
          <Text onPress={toCipher} style={{textAlign:'center'}}>设置密码</Text>
          <FontAwesome style={styles.first} size={20} name='angle-right'/>
        </View>
        <View style={styles.text1}>
          <Text>绑定手机</Text>
          <FontAwesome style={styles.first} size={20} name='angle-right'/>
        </View>
        <View style={styles.text1}>
          <Text>绑定QQ</Text>
          <FontAwesome style={styles.first} size={20} name='angle-right'/>
        </View>
        <View style={styles.text1}>
          <Text>绑定微信</Text>
          <FontAwesome style={styles.first} size={20} name='angle-right'/>
        </View>
      </View>
      
      <View style={{marginTop:15,marginLeft:10}}>
      <Text>消息通知</Text>
      <View style={styles.text2}>
        <Text>私信消息通知</Text>

      </View>
      <View style={styles.text2}>
        <Text>赞和收藏通知</Text>

      </View>
      <View style={styles.text2}>
        <Text>评论通知</Text>

      </View>
      <View style={styles.text2}>
        <Text>关注通知</Text>

      </View>
      </View>

      <View style={{marginTop:15,marginLeft:10}}>
        <Text>隐私设置</Text>
        <View style={styles.text3}>
        <Text>隐藏关注列表</Text>

        </View>
        <View style={styles.text3}>
        <Text>隐藏粉丝列表</Text>

        </View>
        <View style={styles.text3}>
        <Text>隐藏我的收藏</Text>

        </View>
        <View style={styles.text3}>
        <Text>隐藏我答过的卷子</Text>

        </View>
        <View style={styles.text3}>
        <Text>隐藏我组的卷子</Text>

        </View>
      </View>

      <View style={{marginTop:10,marginLeft:150}}>
        <View><Text onPress={delelogin}>切换账号</Text></View>
        <View><Text onPress={delelogin}>退出登录</Text></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  first:{
    position:'absolute',marginLeft:350
  },text1:{
    height:40,
    width:'97%',
    borderWidth:1,
    borderColor:'black'
  },text2:{
    height:40,
    width:'97%',
    borderWidth:1,
    borderColor:'black'
  },text3:{
    height:40,
    width:'97%',
    borderWidth:1,
    borderColor:'black'
  }
});