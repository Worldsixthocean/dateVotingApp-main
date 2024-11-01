import * as React from 'react';
import { useContext, useState,useEffect } from 'react';
import { View, Text, Pressable, Button } from 'react-native';
import { documentId, query, collection, where, getDocs, or} from "firebase/firestore";


import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Icon from 'react-native-vector-icons/MaterialIcons';

import { UserContext } from '../ContextAndConfig/UserContext';
import { db } from '../ContextAndConfig/firebaseConfig.js'

import importStyle from '../style.js'

import EventSnippet from '../Component/eventSnippet.js';

import { ScrollView } from 'react-native-gesture-handler';


function Screen({ navigation }) {
  
  const insets = useSafeAreaInsets();
  const user = useContext(UserContext);

  const [refresh, setRefresh] = useState(false);

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

  useEffect(()=>{
    setRefresh(false);
  },[refresh])

  // React.useEffect(() => {
  //   const unsubscribe = navigation.addListener('focus', () => {
  //     console.log("welcome back");
  //   });

  //   return unsubscribe;
  // }, [navigation]);


  return (
    <View id="safe_area_with_header" style={{
      height:'100%', width:'100%',
      paddingLeft: insets.left, paddingRight: insets.right
    }}>
      {!refresh ? (
        eventList.length != 0 ?
          <ScrollView><View style={{
                paddingTop: 18,
                paddingBottom: 0,
                paddingLeft: 18,
                paddingRight: 18
          }}>

            {
              eventList.map((doc, index) => (
                <EventSnippet doc={doc} index={index} navigation={navigation} key={index}/>
              ))
            }

          </View></ScrollView>
        :
          <View style={{alignItems:'center', justifyContent:'center', height:'100%'}}>
              <Icon name="browser-not-supported" size={50} color="#777" />
              <Text style={{paddingTop:8, color:"#777"}}>No events</Text>
          </View>
        )
      :
      <View style={{alignItems:'center', justifyContent:'center', height:'100%'}}>
        <Icon name="refresh" size={50} color="#777" />
        <Text style={{paddingTop:8, color:"#777"}}>Refreshing</Text>
      </View>
      }

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

      <Pressable style={[
        importStyle.popButton, {
        position: 'absolute', bottom: 30, left: 30,
        height: 65, width: 65
      }]}
      onPress={()=>{
        setRefresh(true)
      }}>
        <Icon name="refresh" size={25} />
      </Pressable>

    </View>
  );
}

export default Screen;