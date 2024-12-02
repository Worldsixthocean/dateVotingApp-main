import * as React from 'react';
import { useState, useContext, useEffect } from 'react';
import { View, Text, Pressable, TextInput, ScrollView, Image, Alert} from 'react-native';
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
import {userInList, editEvent, uploadEventPic, deleteEvent} from '../DataClass/event.js'
import DateRow from '../Component/EventPage/DateRow.js';
import WeekView from '../Component/EventPage/Weekview/WeekView.js';
import * as dateHelper from '../DataClass/dateHelper.js'

import * as DocumentPicker from 'expo-document-picker';
import AttendeesNamebox from '../Component/EventPage/AttendeesNameBox.js';
import PendingNameBox from '../Component/EventPage/PendingNameBox.js';
import TristateCheckBox from '../Component/tristate_checkBox.js';

const Stack = createNativeStackNavigator();

export default function Screen({route, navigation }) {

    const user = useContext(UserContext);

    const [attenders, setAttenders] = useState([]);
    const [organizers, setorganizers] = useState([]);
    const [pending, setPending] = useState([]);

    //removedAttenders: just storing the userID
    const [removedAttenders, setRemovedAttenders] = useState([]);
    const [removedOrganizers, setRemovedOrganizers] = useState([]);
    const [removedPendings, setRemovedPendings] = useState([]);

    const [eventOption, setEventOption] = useState({
        allowAddAttendees: false,
        allowRemoveAttendees: false,
        allowAddTime: false,
        allowRemoveTime: false,
        joinViaCode: false,
        joinViaEmail: false
    });

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
                            setPending={setPending}
                            eventOption={eventOption}
                            setEventOption={setEventOption}/>}
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
    pending, setPending, 
    eventOption, setEventOption}) {

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
                imgType || '',
                eventOption
            )
            .catch((e)=>{console.log(e)});
            
            Promise.all([p1])
                .then(()=>navigation.goBack());
            
        }
    }
    
    const { eventID } = route.params;

    const handleDelete = async ()=> {
        Alert.alert('Delete Event', 'All the votes on this date will be deleted.', [
            {text: 'Cancel',onPress: () => {},style: 'cancel'},
            {text: 'OK', onPress: () => {
                navigation.goBack();
                deleteEvent(eventID,attenders,organizers,pending,removedAttenders,removedOrganizers,removedPendings);
            }},
        ])
    }

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
        setEventOption(data.eventOption);

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
            setEventOption(data.eventOption);
          } else {
            console.log("No such document!");     
        }});
  
      };
  
      return unsub;
  
    },[]);

    
    const isOrganizer = userInList(eventDoc?.organizers ,user.uid);
    //console.log(eventOption);

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

    const maxVote=times.reduce( 
        (accumulator, currentValue) => 
            accumulator > (currentValue.available.length +  currentValue.maybe.length) ? 
            accumulator : (currentValue.available.length +  currentValue.maybe.length)
        , 0);

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
                    <AttendeesNamebox
                        currentAttendee={attendees} index={index}
                        removedAttenders={removedAttenders} setRemovedAttenders={setRemovedAttenders}
                        times={times} setTimes={setTimes}
                        attendersList={attenders} setAttendersList={setAttenders}
                        showClose={isOrganizer || eventOption.allowRemoveAttendees}
                        key={index}
                    />
                ))}

                {pending.map((pendingUser, index) => (
                    <PendingNameBox 
                        currentPending={pendingUser} index={index} 
                        removedPendings={removedPendings} setRemovedPendings={setRemovedPendings}
                        pendingList={pending} setPendingList={setPending}
                        showClose={isOrganizer || eventOption.allowRemoveAttendees} key={index}
                    />
                ))}
                
                {(isOrganizer || eventOption.allowAddAttendees) && <Pressable 
                    style={styles.outlineButton} 
                    onPress={()=>{ navigation.navigate('Search User',{eventID: eventID })}}>
                    <Text style={{}}>
                        + Add attendees
                    </Text>
                </Pressable>}
            </View>

            <Text style={styles.sectionTitle}>Dates</Text>
            
            <View id='propose_dates' style={[{marginBottom:30}]}>

                <WeekView date={shownDate} 
                    onNextWeek={()=>{setShownDate(dateHelper.daysAfter(shownDate,7))}}
                    onLastWeek={()=>{setShownDate(dateHelper.daysBefore(shownDate,7))}}
                    events={times}
                    setTimes={setTimes}
                />

                <View style={{paddingTop:15}}/>

                {times.map((date, index) => {
                    //console.log(times);
                    return (
                    <View style={[{marginBottom:10}]} key={index}> 

                        <DateRow 
                            date={date.date.toDate()} 
                            index={index} 
                            times={times} 
                            setTimes={setTimes}
                            showClose={isOrganizer || eventOption.allowRemoveTime}
                            maxVote={maxVote}>
                        </DateRow>
                        
                    <View style={styles.seperator}/>
                    </View>
                )})}

                {(isOrganizer||eventOption.allowAddTime) && <Pressable 
                    style={{backgroundColor:'#fff', elevation:2, padding:15, borderRadius:18}}
                    onPress={()=>{showDatepicker()}}
                >
                    <Text style={{fontSize:15,fontWeight:500}}>
                        +  Propose new date
                    </Text>
                </Pressable>}
            </View>

            {isOrganizer && <View id='Event_options' style={[{marginBottom:30}]}>
                <Text style={styles.sectionTitle}>Event Options</Text>
                <Text style={{marginBottom:4}}>Allow non-organizers to:</Text>

                <View style={[styles.rowAlignCenter,{marginBottom:5}]}>

                    <Pressable style={styles.rowAlignCenter}
                        onPress={()=>setEventOption({...eventOption, allowAddAttendees: !eventOption.allowAddAttendees})}>
                        <TristateCheckBox 
                            onPress={()=>setEventOption({...eventOption, allowAddAttendees: !eventOption.allowAddAttendees})}
                            color='#0065FF' check={eventOption.allowAddAttendees}/>
                        <Text style={{fontWeight:500, paddingHorizontal:5}}>Add</Text>
                    </Pressable>

                    <Pressable style={styles.rowAlignCenter}
                        onPress={()=>setEventOption({...eventOption, allowRemoveAttendees: !eventOption.allowRemoveAttendees})}>
                        <TristateCheckBox 
                            onPress={()=>setEventOption({...eventOption, allowRemoveAttendees: !eventOption.allowRemoveAttendees})}
                            color='#0065FF' check={eventOption.allowRemoveAttendees}/>
                        <Text style={{fontWeight:500, paddingLeft:5}}>Remove</Text>
                    </Pressable>

                    <Text> other attendees</Text>

                </View>

                <View style={[styles.rowAlignCenter,{marginBottom:9}]}>

                    <Pressable style={styles.rowAlignCenter}
                        onPress={()=>setEventOption({...eventOption, allowAddTime: !eventOption.allowAddTime})}> 
                        <TristateCheckBox 
                            onPress={()=>setEventOption({...eventOption, allowAddTime: !eventOption.allowAddTime})}
                            color='#0065FF' check={eventOption.allowAddTime}/>
                        <Text style={{fontWeight:500, paddingHorizontal:5}}>Add</Text>
                    </Pressable>

                    <Pressable style={styles.rowAlignCenter}
                        onPress={()=>setEventOption({...eventOption, allowRemoveTime: !eventOption.allowRemoveTime})}>
                        <TristateCheckBox 
                            onPress={()=>setEventOption({...eventOption, allowRemoveTime: !eventOption.allowRemoveTime})}
                            color='#0065FF' check={eventOption.allowRemoveTime}/>
                        <Text style={{fontWeight:500, paddingLeft:5}}>Remove</Text>
                        <Text> propose time</Text>
                    </Pressable>
                    
                </View>

                <Pressable style={[styles.rowAlignCenter,{marginBottom:5}]} 
                    onPress={()=>setEventOption({...eventOption, joinViaCode: !eventOption.joinViaCode})}>
                    <TristateCheckBox 
                        onPress={()=>setEventOption({...eventOption, joinViaCode: !eventOption.joinViaCode})}
                        color='#0065FF' check={eventOption.joinViaCode} />
                    <Text>Join via code without invitation</Text>
                </Pressable>
            </View>}

            <View style={{alignItems:'flex-start', flexDirection:'row', gap:10}}>
                <Pressable 
                    style={[
                        styles.popButton, {
                        paddingHorizontal:20,
                        backgroundColor:'#0065FF'
                    }]}
                    onPress={()=>{handleSubmit()}}>
                    <Text style={{fontWeight:500,fontSize:15.5,color:'#eee'}}>Save changes</Text>
                </Pressable>

                {isOrganizer && <Pressable 
                    style={[
                        styles.popButton, {
                        paddingHorizontal:20,
                        backgroundColor:'#dc3545'
                    }]}
                    onPress={()=>{handleDelete()}}>
                    <Text style={{fontWeight:500,fontSize:15.5,color:'#eee'}}>Delete Event</Text>
                </Pressable>}
            </View>
            <View style={{height:100}}/>
            </View>
        </ScrollView>
        </View>
    );
}