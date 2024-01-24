import React, { createContext, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  Image,
  TextInput,
  TouchableOpacity,
  Alert
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"; 


export default function LoginScreen() {
    const navigation = useNavigation();

const [email,setEmail] = useState('')
const [password,setPassword] = useState('')

const handleLogin = async () => {
   try {
    const data = {
        grant_type: 'password',
        client_secret: '0a40f69db4e5fd2f4ac65a090f31b823',
        client_id: 'e78869f77986684a',
        username: email,
        password: password
    }

    const response = await axios.post('https://soal.staging.id/oauth/token', data)
    // console.log(response.data)
    const access_token = response.data.access_token
    await AsyncStorage.setItem('access_token' , access_token)
    Alert.alert("Success Login")
    navigation.navigate('HomeStack');

   } catch (error) {
     console.error(error)
   }
}


  return (
    <>
      <View style={styles.AndroidSafeArea}>
        <Image
          source={require("../assets/logo-technopartner.png")}
          style={styles.image}
        />
        <View style={styles.ViewInput}>
            <Text style={styles.text}>Email</Text>
            <TextInput placeholder="Enter Email" value={email} onChangeText={text => setEmail(text)}  style={styles.input}/>
            <Text style={styles.text}>Password</Text>
            <TextInput placeholder="Enter Password" secureTextEntry={true} value={password} onChangeText={text => setPassword(text)} style={styles.input}/>
        </View>

        <TouchableOpacity onPress={handleLogin} style={{alignSelf:'center',elevation :5,backgroundColor:'white',paddingHorizontal:70,paddingVertical:14,borderRadius:10}}>
        <Text style={{fontSize:16,fontWeight:"bold"}}>Login</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  AndroidSafeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingHorizontal: 14,
    backgroundColor: "white",
  },
  image: {
    width: "70%",
    height: undefined,
    aspectRatio: 2,
    alignSelf: "center",
    marginTop: 100,
  },
  ViewInput:{
    marginVertical:50,
    display:'flex',
    alignItems :"center"
  },
  text:{
    fontSize :18,
  },
  input:{
    backgroundColor:"white",
    width :"60%",
    height : 40,
    borderRadius : 10,
    color : "black",
    elevation :5,
    paddingHorizontal :5,
    marginTop:10,
    marginBottom : 50
  }
});
