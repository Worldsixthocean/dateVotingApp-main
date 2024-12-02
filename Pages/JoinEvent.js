import { View ,Text, Pressable, TextInput, ScrollView, Alert,TouchableOpacity,Button} from 'react-native';
import { useState, useEffect, useContext } from 'react';
import importStyle from '../style.js';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';

import { joinEvent } from '../DataClass/event.js';

import { UserContext } from '../ContextAndConfig/UserContext.js';

const Stack = createNativeStackNavigator();


export default function JoinEvent({ navigation }) {
    return (
        <Stack.Navigator initialRouteName="List"
          screenOptions={{headerShown: false}}>
          <Stack.Screen name="JoinHome" component={JoinHome} />
          <Stack.Screen name="JoinQR" component={JoinQR}/>
        </Stack.Navigator>
      );
}

function JoinHome({ navigation }) {
    const user = useContext(UserContext);
    const [eventQuery, setEventQuery] = useState(false);
    return(<ScrollView>
        <View style={{height:'100vh',padding:25, gap:25}}>
            <Pressable style={[importStyle.card,{padding:15}]}
                onPress={()=>{
                navigation.navigate('Notification')
            }}>
                <Text style={{fontWeight:700, fontSize:25}}>Join Via Invitation</Text>
                <Text>Go to notification panel to look for invitation.</Text>
            </Pressable>
            <View style={[importStyle.card,{padding:15, alignItems:'flex-start'}]}>
                <Text style={{fontWeight:700, fontSize:25}}>Join Via Code</Text>
                <Text style={{marginBottom:15}}>Enter the event ID to join an event.</Text>
                <View 
                    style={{ backgroundColor:"#dfdfdf", padding:10, borderRadius:13, width:'100%',
                    flexDirection:'row', alignItems:'center', marginBottom:15}}>
                    <TextInput 
                        value={eventQuery} 
                        onChangeText={(value)=>{setEventQuery(value)}}
                        style={{fontSize:15, width:'100%'}}
                        placeholder='Event ID'
                    />                   
                </View>
                <Pressable 
                    style={[
                        styles.popButton, {
                        backgroundColor:'#0065FF'
                    }]}
                    onPress={()=>{
                        joinEvent(eventQuery,user.uid)
                        .then(()=>{
                            navigation.navigate('Events', {screen: 'List'});
                        })
                        .catch( (e) =>
                            Alert.alert('Something\'s wrong.', e.message , [
                            {text: 'OK', onPress: () => {}}])
                        )
                    }}>
                    <Text style={{fontWeight:500,fontSize:15.5,color:'#eee'}}>Join event</Text>
                </Pressable>
            </View>
            <Pressable style={[importStyle.card,{padding:15}]}
                onPress={()=>{
                navigation.navigate('JoinQR')
            }}>
                <Text style={{fontWeight:700, fontSize:25}}>Join Via QR Code</Text>
                <Text>Simply scanning QR code to join the event(permisssion reqired).</Text>
            </Pressable>

        </View>
        </ScrollView>
    )

}

function JoinQR({ navigation }) {
    const user = useContext(UserContext);
    const [scanned, setScanned] = useState(false);
    const [permission, requestPermission] = useCameraPermissions();
  
    if (!permission) {
      return <View />;
    }
  
    if (!permission.granted) {
      return (
        <View>
          <Text>We need your permission to show the camera</Text>
          <Button onPress={requestPermission} title="grant permission" />
        </View>
      );
    }
  
    return (
      <View style={{width:'100%', height:'100%'}}>
        <CameraView style={{flex: 1}}
            barcodeScannerSettings={{barcodeTypes: ["qr"]}}
            onBarcodeScanned={(result)=>{
                if(!scanned){
                    console.log('scanned')
                    setScanned(true)
                    
                    joinEvent(result.data,user.uid)
                    .then(()=>{
                        navigation.navigate('Events', {screen: 'List'});
                    })
                    .catch( (e) =>
                        Alert.alert('Something\'s wrong.', e.message , [
                        {text: 'OK', onPress: () => {setScanned(false)}}])
                )}

            }}
        >
          <View style={{flex: 1}}>
              <Text style={{color:'#fff'}}> </Text>
          </View>
        </CameraView>
      </View>
    );
  
}