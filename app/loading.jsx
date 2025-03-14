import { View, Text , StyleSheet,Image} from "react-native";
export default function Loading(){
    return(
        <View style={{width:'100%',height:'100%',backgroundColor:'white'}}>
            <Image 
              source={require('./img/pic21.png')} 
              style={{width: '40%', resizeMode: 'contain',marginTop:'30%',marginLeft:'30%'}}
            />
            {/* <Text style={styles.container}>加载中...</Text> */}
        </View>
    )
}
const styles = StyleSheet.create({
    container:{
        fontSize:20,
        textAlign:'center'
    }
})