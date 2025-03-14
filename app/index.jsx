import { View, Text , StyleSheet, Image} from "react-native";
import { useState , useEffect } from "react";
import { useNavigation } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function Loading(){
  const [token, setToken] = useState(null);
  const [should,setShould]=useState(false)
  const navigation = useNavigation();
  const nav1=()=>{
    navigation.navigate('(tabs)')
  }
  const nav2=()=>{
    navigation.navigate('login') 
  }
  useEffect(() => {
    const getToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        setToken(storedToken);
      } catch (error) {
        console.log("Error retrieving token:", error);
      }
    };
    getToken();
    setShould(true)
  }, []);
  useEffect(() => {
    if(should){
      const checkToken =  () => {
      if (token!=='null') {
        nav1();
      }else {
        nav2();
      }
    }
    const start=()=>{
      setTimeout(() => {
        checkToken();
      }, 1000);
    }
    start();
    return () => {
      clearTimeout(start);
    };
    }
  }, [token]);
    return(
      <View style={{width:"100%",height:'100%',backgroundColor:"#3D89FB"}}>
            <Image 
              source={require('./img/pic20.png')} 
              style={{width: '40%', resizeMode: 'contain',marginTop:'30%',marginLeft:'30%'}}
            />
      </View>
    )
}
const styles = StyleSheet.create({
    
})