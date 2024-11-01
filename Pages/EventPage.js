import * as React from 'react';
import { useState, useContext, useEffect } from 'react';
import { View, Text, Pressable, TextInput, FlatList, ScrollView, Image} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import DateTimePicker from '@react-native-community/datetimepicker';

import { doc, getDoc, onSnapshot,Timestamp, toDate } from "firebase/firestore";

import { db, storage } from '../ContextAndConfig/firebaseConfig.js'
import { getDownloadURL, ref, uploadBytes  } from 'firebase/storage';

import { UserContext } from '../ContextAndConfig/UserContext.js';
import SearchUserPage from './Search.js';
import styles from '../style.js';
import {userInList, editEvent, uploadEventPic} from '../DataClass/event.js'
import DateRow from '../Component/DateRow.js';
import WeekView from '../Component/WeekView.js';
import * as dateHelper from '../DataClass/dateHelper.js'

import * as DocumentPicker from 'expo-document-picker';

const Stack = createNativeStackNavigator();

export default function Screen({ navigation }) {

    const user = useContext(UserContext);

    const [attenders, setAttenders] = useState([]);
    const [organizers, setorganizers] = useState([]);
    const [pending, setPending] = useState([]);

    //removedAttenders: just storing the userID
    const [removedAttenders, setRemovedAttenders] = useState([]);
    const [removedOrganizers, setRemovedOrganizers] = useState([]);
    const [removedPendings, setRemovedPendings] = useState([]);

    return(
    <Stack.Navigator initialRouteName="Event page"
    screenOptions={{headerShown: false}}>
        <Stack.Screen name="Event page">
            {(props) => <EventPage {...props} 
                            attenders={attenders} 
                            setAttenders={setAttenders} 
                            organizers={organizers} 
                            setorganizers={setorganizers}
                            removedAttenders={removedAttenders}
                            setRemovedAttenders={setRemovedAttenders}
                            removedOrganizers={removedOrganizers}
                            setRemovedOrganizers={setRemovedOrganizers}
                            removedPendings={removedPendings} 
                            setRemovedPendings={setRemovedPendings}
                            pending={pending}
                            setPending={setPending}/>}
        </Stack.Screen>
        <Stack.Screen name="Search User">
            {(props) => <SearchUserPage {...props} 
                            attenders={attenders} 
                            setAttenders={setAttenders} 
                            organizers={organizers} 
                            setorganizers={setorganizers}
                            removedAttenders={removedAttenders}
                            setRemovedAttenders={setRemovedAttenders}
                            pending={pending}
                            setPending={setPending}/>}
        </Stack.Screen>
    </Stack.Navigator>);

}

export function EventPage({ route, navigation, 
    attenders, setAttenders, 
    organizers, setorganizers, 
    removedAttenders, setRemovedAttenders,
    removedOrganizers, setRemovedOrganizers,
    removedPendings, setRemovedPendings,
    pending, setPending}) {

    const user = useContext(UserContext);
    
    const insets = useSafeAreaInsets();
    const [focus, setFocus] = useState('');

    const [imgState, setimgState] = useState();
    const [imgType, setimgType] = useState();
    const [imgChanged, setImgChanged] = useState(false);

    const [eventName, setEventName] = useState('');
    const [details, setDetails] = useState('');
    const [times, setTimes] = useState([]);

    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const [picking, setPicking] = useState(false);

    const [eventDoc, setEventDoc] = useState();

    const [shownDate, setShownDate] = useState(new Date());

    const handleSubmit = async ()=> {

        p1 = 0;

        if(eventName.trim() && times.length && attenders.length){
            if(imgChanged){
                if(imgState){
                    p1 = uploadEventPic(eventID, imgState, '.' + imgType);
                }    
            }
            editEvent(user, 
                eventID, 
                eventName, 
                details, 
                attenders, 
                times, 
                organizers, 
                removedAttenders, 
                removedOrganizers, 
                pending, 
                removedPendings, 
                imgType || ''
            )
            .catch((e)=>{console.log(e)});
            
            Promise.all([p1])
                .then(()=>navigation.goBack());
            
        }
    }

    const { eventID } = route.params;

    //get by event id
    const fetchEvent = async (docRef) => {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        let data = docSnap.data();
        setEventDoc(data);

        setEventName(data.eventName);
        setDetails(data.description);
        setTimes(data.dates);
        setAttenders(data.attendees);
        setorganizers(data.organizers);
        setPending(data.pending);
        setimgType(data.imageformat);

      } else {
        console.log("No such document!");
      }
    }
  
    //unsub function
    useEffect(()=>{
  
      let unsub = () => {};
  
      if(eventID){
  
        const docRef = doc(db, "events", eventID);
  
        fetchEvent(docRef).catch(
          (e)=>{console.log(e)}
        )
  
        unsub = onSnapshot(docRef, async() => {
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            let data = docSnap.data();
            setEventDoc(data);

            setEventName(data.eventName);
            setDetails(data.description);
            setTimes(data.dates);
            setAttenders(data.attendees);
            setorganizers(data.organizers);
            setPending(data.pending);
            setimgType(data.imageformat);
          } else {
            console.log("No such document!");     
        }});
  
      };
  
      return unsub;
  
    },[]);

    
    const isOrganizer = userInList(eventDoc?.organizers ,user.uid);
    //console.log(isOrganizer);

    //set the new proposed date and add it to the list of proposed time
    const onChange = (event, selectedDate) => {
        if(event.type == 'set'){
            const currentDate = selectedDate;
            setShow(false);
            setDate(currentDate);
            
            if(mode == 'time'){
                setTimes(times.concat([{
                    available: [], 
                    maybe: [],
                    date : Timestamp.fromDate(currentDate)
                }]));
            }
        }
        else if(event.type == 'dismissed'){
            setPicking(false);
            setShow(false);
        }

    };

    const showDatepicker = () => {
        setShow(true);
        setMode('date');
        setPicking('true');
    };
  
    const showTimepicker = () => {
        setShow(true);
        setMode('time');
    };

    const addNewPhoto = async ()=>{
        x = await DocumentPicker.getDocumentAsync({ type: 'image/*' });
        if(x.canceled == false){
        setimgState(x.assets[0].uri);
        setimgType(x.assets[0].mimeType.replace('image/',''));
        setImgChanged(true);
        }
        else{
        console.log('canceled');
        }
    }

    useEffect(()=>{
        if(picking && show == false && mode == 'date'){
            showTimepicker();
        }
        else if(picking && show == false && mode == 'time'){
            setPicking(false);
        }
    })

    //console.log(removedOrganizers);

    //find image after getting doc
    useEffect(() => {
        const func = async() => {
          //console.log('event/'+ eventID + '.' + imgType);
          const imgReference = ref(storage, 'event/'+ eventID + '.' + imgType);
          await getDownloadURL(imgReference).then((x)=>{
            setimgState(x);
          }).catch(
            (error) => {
                switch (error.code) {
                    case 'storage/object-not-found':
                      //console.log('this event not yet hv pic');
                      setimgState(null);
                      break;
                }
            }
          );
        }
        
        if (eventDoc && !imgState){ //if alread hv img chose from local dont run
          func();
        }
    
      },[imgType]);

    return (
        <View id="safe_area_with_header" style={{
        height:'100%', width:'100%',
        paddingLeft: insets.left, paddingRight: insets.right
        }}>

            {show && (
                <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={mode}
                is24Hour={true}
                onChange={onChange}/>
            )}

        {/* loading indicator */}
        {!eventDoc && (
            <View style={{
                position:'absolute', 
                zIndex: 2, 
                backgroundColor:'#000000aa', 
                height:'100%', 
                width:"100%",
                alignItems:'center',
                justifyContent:'center'
            }}
            >
                <MaterialIcon name="hourglass-empty" size={25} color="#fff" />
                <Text style={{color:"#fff"}}>Loading</Text>
            </View>
        )}
                
        <ScrollView style={{zIndex: 1}}>

            <View id="image">
                {imgState ? 
                    <View style={{height:300, width:'100%'}} >
                        <Image style={{height:'100%', width:'100%'}} source={{uri:imgState}}/>
                        <Pressable 
                            style={{position: 'absolute', top: 20, right: 20, height: 30, width: 30,
                                backgroundColor:'#00000044', borderRadius:20,  justifyContent:'center', alignItems:'center'}} 
                            onPress={addNewPhoto}
                        >
                            <MaterialCommunityIcons name="image-edit-outline" size={20} color="#fff" />
                        </Pressable>
                    </View> : 
                    (!!imgType == !!eventDoc ) ? //complicated logic
                        <View style={{width:'100%', alignItems:'center', paddingTop: 20}}>
                            <MaterialIcon name="hourglass-empty" size={25} color="#aaa" />
                            <Text style={{color:"#aaa"}}>Loading Image</Text>
                        </View> :
                    (
                        <Pressable style={{width:'100%', alignItems:'center', paddingTop: 20}}
                            onPress={addNewPhoto}
                        >
                            <MaterialIcon name="add-photo-alternate" size={25} color="#aaa" />
                            <Text style={{color:"#aaa"}}>Upload Image</Text>
                        </Pressable>
                    )
                }
            </View>

            <View style={{
                paddingTop: 20,
                paddingBottom: 0,
                paddingLeft: 23,
                paddingRight: 23}}>

            <View id='name_input' style={{marginBottom:10}}>
                <TextInput 
                    value={eventName} 
                    onChangeText={(value)=>{setEventName(value)}}
                    style={[
                        {fontWeight:'500', fontSize: 30}
                    ]}
                    placeholder='Event Name'
                />
            </View>

            <View id='details' style={{marginBottom:20}}>
                <TextInput 
                    value={details} 
                    onChangeText={(value)=>{setDetails(value)}}
                    style={[
                        styles.input, 
                        (focus == 'details' ? styles.focused : '')
                    ]}
                    placeholder='Description'
                    onFocus={() => setFocus('details')}
                    onBlur={() => setFocus('')}
                    multiline
                />
            </View>

            <Text style={styles.sectionTitle}>Organizer</Text>
            <Text style={{marginBottom:10}}>{organizers.map((organizer, index) => (organizer.name))}</Text>
            
            <Text style={styles.sectionTitle}>Attendees</Text>

            <View id='attendees' style={[styles.outlineButtonCluster,{marginBottom:10}]}>
                {attenders.map((attendees, index) => (
                    <View id='attendees_name' style={[styles.outlineButton,{marginBottom:10}]} key={index}> 
                        
                        <Text style={{}}> 
                            {attendees.name || attendees.email}
                        </Text>
                        
                        <Pressable onPress={()=>{
                            //removedAttenders: just storing the userID
                            if(!removedAttenders.includes(attendees.uid)){
                                setRemovedAttenders(removedAttenders.concat([attendees.uid]));
                            }

                            setTimes(
                                times.map((e)=>({
                                    date: e.date, 
                                    available: 
                                        e.available.filter((e)=>(
                                            e.uid != attendees.uid)
                                        )
                                }))
                            );

                            setAttenders(
                                attenders.slice(0, index)
                                .concat(
                                    attenders.slice(index+1)));
                        }}>

                            <MaterialIcon name="close" size={17} color="#333" style={{marginTop:2, marginLeft:3}}/>
                        </Pressable>

                    </View>
                ))}
                {pending.map((pendingUser, index) => (
                    <View id='pending_name' style={[styles.outlineButton,{marginBottom:10}]} key={index}> 
        
                        <Text style={{}}> 
                            {pendingUser.name || pendingUser.email} (pending)
                        </Text>
                        
                        <Pressable onPress={()=>{
                            //removedPendings: just storing the userID
                            if(!removedPendings.includes(pendingUser.uid)){
                                setRemovedPendings(removedPendings.concat([pendingUser.uid]));}

                            setPending(
                                pending.slice(0, index)
                                .concat(
                                    pending.slice(index+1)))
                        }}>

                            <MaterialIcon name="close" size={17} color="#333" style={{marginTop:2, marginLeft:3}}/>
                        </Pressable>

                    </View>
                ))}
                
                <Pressable 
                    style={styles.outlineButton} 
                    onPress={()=>{ navigation.navigate('Search User') }}>
                    <Text style={{}}>
                        + Add attendees
                    </Text>
                </Pressable>
            </View>

            <Text style={styles.sectionTitle}>Dates</Text>
            
            <View id='propose_dates' style={[{marginBottom:30}]}>

                <WeekView date={shownDate} 
                    onNextWeek={()=>{setShownDate(dateHelper.daysAfter(shownDate,7))}}
                    onLastWeek={()=>{setShownDate(dateHelper.daysBefore(shownDate,7))}}
                    events={times}
                    setTimes={setTimes}
                ></WeekView>

                <View style={{paddingTop:15}}/>

                {times.map((date, index) => {
                    //console.log(times);
                    return (
                    <View style={[{marginBottom:10}]} key={index}> 

                        <DateRow 
                            date={dateHelper.dateToString(date.date.toDate())} 
                            index={index} 
                            times={times} 
                            setTimes={setTimes}>
                        </DateRow>
                        
                    <View style={styles.seperator}/>
                    </View>
                )})}

                <Pressable 
                    style={styles.outlineButton}
                    onPress={()=>{showDatepicker()}}
                >
                    <Text style={[]}>
                        + Propose new date
                    </Text>
                </Pressable>
            </View>

            <View style={{alignItems:'flex-start'}}>
                <Pressable 
                    style={[
                        styles.popButton, {
                        paddingHorizontal:20,
                        backgroundColor:'#0065FF'
                    }]}
                    onPress={()=>{handleSubmit()}}>
                    <Text style={{fontWeight:500,fontSize:15.5,color:'#eee'}}>Save changes</Text>
                </Pressable>
            </View>
            <View style={{height:100}}/>
            </View>
        </ScrollView>
        </View>
    );
}