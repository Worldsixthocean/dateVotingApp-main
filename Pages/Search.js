import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import { View, Text, Pressable, TextInput, Animated, TouchableOpacity} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Icon from 'react-native-vector-icons/MaterialIcons';

import { collection, query, where, getDocs, or, doc, getDoc } from "firebase/firestore";
import {db} from '../ContextAndConfig/firebaseConfig.js';
import { UserContext } from '../ContextAndConfig/UserContext.js';

import importStyle from '../style.js'

import { DefaultTheme } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import QRCode from 'react-native-qrcode-svg';

import * as Clipboard from 'expo-clipboard';

const Tab = createMaterialTopTabNavigator();

//https://reactnavigation.org/docs/6.x/material-top-tab-navigator#tabbar
function MyTabBar({ state, navigation }) {
  return (
    <View style={{ flexDirection: 'row', height:50 }}>
      {state.routes.map((route, index) => {
        const label = route.name;
        const isFocused = state.index === index;
        const onPress = () => {
            navigation.navigate(route.name, route.params);
        };

        return (
          <Pressable key={index}
            onPress={onPress}
            style={{ flex: 1, 
              backgroundColor:isFocused ? '#f8f8f8' : '#fafafa', 
              borderBottomColor: isFocused ? DefaultTheme.colors.primary : '#ddd',
              borderBottomWidth:4,
              alignItems:'center',
              justifyContent:'center'
            }}
          >
            <Text style={{color: isFocused ? DefaultTheme.colors.primary : '#777'}}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function Screen({route, navigation, 
  attenders, setAttenders, 
  pending, setPending,
  organizers, setorganizers,
  removedAttenders, setRemovedAttenders
}) {
  return (
    <Tab.Navigator tabBar={props => <MyTabBar {...props} />}>
      <Tab.Screen name="Join by invitation">
        {(props) => <Search {...props} 
                              attenders={attenders} 
                              setAttenders={setAttenders} 
                              organizers={organizers} 
                              setorganizers={setorganizers}
                              removedAttenders={removedAttenders}
                              setRemovedAttenders={setRemovedAttenders}
                              pending={pending}
                              setPending={setPending}/>}
      </Tab.Screen>
      <Tab.Screen name="Join by Code">
        {(props) => <MessagesScreen eventID={route.params.eventID} newEvent={route.params.newEvent}/>}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

function MessagesScreen({eventID, newEvent}) {
  const [enableCode, setEnableCode] = useState(false);
  useEffect( ()=>  {
    if (eventID){
    async function fetchJoinViaCode(){
    const docRef = doc(db, "events", eventID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      let data = docSnap.data();
      setEnableCode(data.eventOption.joinViaCode);
    } else {
      console.log("No such document!");
    }}
    fetchJoinViaCode();}
})
  return (
    <View style={{ flex: 1, padding:30, alignItems:'center' }}>
      {enableCode ? <>
        <Text style={{fontWeight:500, fontSize:22, marginBottom:15}}>Join Via Code</Text>
        <Text style={{marginBottom:5}}>Enter this code in 'Join Event' to add attendees:</Text>
        <Pressable 
          style={{ backgroundColor:"#dfdfdf", padding:10, marginBottom:15, borderRadius:13, width:'100%',
            flexDirection:'row', alignItems:'center'}}
          onPress={ async()=>{await Clipboard.setStringAsync(eventID)}}>
          <Text style={{fontWeight:500, fontSize:17, flex:1, textAlign:'center'}}>{eventID}</Text>
          <Icon name="content-copy" size={20} color="#888"/>
        </Pressable>
        <Text style={{marginBottom:15}}>Or, simply scan this QR Code in the "Join Event" Page:</Text>

        <View style={{backgroundColor:'#fff', elevation:2, padding:20, borderRadius:18}}>
          <QRCode size={125} value={eventID}/>
        </View>
      </>
      : newEvent ? 
      <Text style={{color:'#777'}}>You can enable join by code after creating a new event.</Text>
      : 
      <Text style={{color:'#777'}}>You need to enable 'Joining via code' and save the event in order to join by code.</Text>}
    </View>
  );
}


function Search({ navigation, 
  attenders, setAttenders, 
  pending, setPending,
  organizers, setorganizers,
  removedAttenders, setRemovedAttenders
}) {

  const user = useContext(UserContext);
  
  const insets = useSafeAreaInsets();
  const [searchMethod,setSearchMethod] = useState('email');
  const [userQuery,setUserQuery] = useState('');
  const [queryResult,setqueryResult] = useState([]);

  const fetchUsers = async () => {
    if(userQuery){
      const q = query(collection(db, "users"),
        where(searchMethod, ">=" , userQuery.trim()),
        where(searchMethod, "<=" , userQuery.trim() + '\uf8ff'));
      const querySnapshot = await getDocs(q);
      setqueryResult(querySnapshot.docs);
    }
    else{setqueryResult([]);}
    return () => {};
  }

  useEffect(()=>{
    fetchUsers().catch(
      (e)=>{console.log(e)});    
  },[userQuery,searchMethod]);

  const attenderIDs = attenders.map((x)=> x.uid);
  const pendingIDs = pending.map((x)=> x.uid);

  return (
    <View id="safe_area_with_header" style={{
      height:'100%', width:'100%',
      paddingLeft: insets.left, paddingRight: insets.right
    }}>
      <View style={{
            paddingTop: 18,
            paddingBottom: 0,
            paddingLeft: 18,
            paddingRight: 18
      }}>
        <Text style={{marginLeft:4,marginBottom:7,color:'#666'}}>Invitaion will be sent after changes is saved.</Text>

        <View style={[importStyle.inputBox,{marginBottom:18}]}>
          <TextInput 
            value={userQuery} 
            onChangeText={(value)=>{setUserQuery(value)}}
            style={{fontSize:15}}
            placeholder='Search for users...'
          />
        </View>

        <View style={{flexDirection:'row', marginBottom:10}}>   

          <Pressable style={[
              importStyle.outlineButton, 
              searchMethod == 'email' && {backgroundColor: '#e6e6e6'}]} 
            onPress={()=>{setSearchMethod('email')}}>
            <Text style={{}}> By email </Text>
          </Pressable>

          <Pressable style={[
            importStyle.outlineButton,
            searchMethod == 'user' && {backgroundColor: '#e6e6e6'}]}  
            onPress={()=>{setSearchMethod('user')}}>
            <Text style={{}}> By name </Text>
          </Pressable>

        </View>

        {queryResult?.map((doc, index) => (
          <Pressable 
            style={[importStyle.searchResult]} 
            key={index}
            disabled={attenderIDs.includes(doc.id) || pendingIDs.includes(doc.id)}
            onPress={()=>{
              if(doc.id == user.uid){
                setAttenders(attenders.concat([{
                name: doc.data().user,
                email: doc.data().email,
                uid: doc.id
                }]));
              }
              else{
                setPending(pending.concat([{
                  name: doc.data().user,
                  email: doc.data().email,
                  uid: doc.id
                }]))
              }
              navigation.goBack();
          }}>
            <Text style={[{fontSize:20 , fontWeight:'500', marginBottom:2 },
              attenderIDs.includes(doc.id) || pendingIDs.includes(doc.id) ? 
              {color:'#777'} : {color:'#333'}]}>
                {doc.data().user}
            </Text>
            <Text style={{color:'#777'}}>
              {attenderIDs.includes(doc.id) || pendingIDs.includes(doc.id) ? 
                "User already added" : doc.data().email}
            </Text>
          </Pressable>
        ))}

      </View>
    </View>
  );
}

export default Screen;