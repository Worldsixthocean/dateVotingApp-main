import * as React from 'react';
import { useContext, useState,useEffect } from 'react';
import { View, Text, Pressable, Button } from 'react-native';
import { documentId, query, collection, where, getDocs, or} from "firebase/firestore";


import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Icon from 'react-native-vector-icons/MaterialIcons';

import { UserContext } from '../ContextAndConfig/UserContext';
import { db } from '../ContextAndConfig/firebaseConfig.js'
import importStyle from '../style.js'


function Screen({ navigation }) {
  
  const insets = useSafeAreaInsets();
  const user = useContext(UserContext);

  const [eventList, setEventList] = useState([]);

  const fetchEvents = async (eventLength, organizeLength) => {
    if(eventLength || organizeLength ){
      let q;
      if(eventLength){
        if(organizeLength){
          q = query(collection(db, "events"),
            or(where(documentId(), "in" , user.events),
            where(documentId(), "in" , user.organize)))
        }
        else{
          q = query(collection(db, "events"),
            where(documentId(), "in" , user.events))
        }
      }
      else{
        q = query(collection(db, "events"),
          where(documentId(), "in" , user.organize))
      }
      const querySnapshot = await getDocs(q);
      setEventList(querySnapshot.docs);
    }
    else{
      setEventList([]);
    }
    return () => {};
  }

  useEffect(()=>{
      fetchEvents(user.events.length, user.organize.length).catch(
      (e)=>{console.log(e)})
  },[user])

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

        {eventList.map((doc, index) => (
          <Pressable 
            style={[importStyle.card,{marginBottom:10, padding:15}]} 
            key={index} 
            onPress={()=>{
              navigation.navigate('Event Page', {
                screen: 'Event page',  
                params: {eventID: doc.id}
              })}}>
            <Text style={{fontSize:22, fontWeight:600, marginBottom:5, color:'#333'}}>{doc.data().eventName}</Text>
            <Text style={{fontSize:14, color:'#777'}}>{doc.data().description}</Text>
          </Pressable>
        ))}

      </View>

      <Pressable style={[
        importStyle.popButton, {
        position: 'absolute', bottom: 30, right: 30,
        height: 65, width: 150,
        backgroundColor:'#1363ff'
      }]}
      onPress={()=>{
        navigation.navigate('New event')
      }}>
        <Icon name="add" size={25} color="#fff" />
        <Text style={{fontWeight:600, fontSize:15.5, paddingRight:5, color:"#fff"}}>New event</Text>
      </Pressable>

    </View>
  );
}

export default Screen;