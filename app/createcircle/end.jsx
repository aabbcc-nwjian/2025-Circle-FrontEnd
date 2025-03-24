import { View, Text , StyleSheet} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
export default function End(){
    const navigation=useNavigation()
    return(
        <View style={{width:'100%',height:"100%",backgroundColor:'#3D89FB'}}>
        <Text style={{marginLeft:'5%',marginTop:'4%',position:'absolute'}} onPress={()=>{navigation.navigate('(tabs)')}}><FontAwesome size={35} name='angle-left'/></Text>
        <Text style={styles.container}>待审核</Text>
        </View>
    )
}
const styles = StyleSheet.create({
    container:{
        fontSize:20,
        marginTop:'50%',
        textAlign:'center',
        color:'white',
        fontFamily:'Source Han Sans-Bold',fontWeight:700
    }
})