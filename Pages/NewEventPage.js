import * as React from 'react';
import { useState, useContext, useEffect } from 'react';
import { View, Text, Pressable, TextInput, FlatLis,ScrollView} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';

import { UserContext } from '../ContextAndConfig/UserContext.js';
import SearchUserPage from './Search.js';
import styles from '../style.js';
import {addEvent} from '../DataClass/event.js'
import { Namebox } from '../Component/NameBox.js';

const Stack = createNativeStackNavigator();

export default function Screen({ navigation }) {

    const user = useContext(UserContext);

    const [attenders, setAttenders] = useState([{
        name: user.user,
        email: user.email,
        uid: user.uid
      }]);

    const [pending, setPending] = useState([]);

    const [organizers, setorganizers] = useState([{
        name: user.user,
        email: user.email,
        uid: user.uid
    }]);

    return(
    <Stack.Navigator initialRouteName="New event page"
    screenOptions={{headerShown: false}}>
        <Stack.Screen name="New event page">
            {(props) => <NewEventPage {...props} 
                            attenders={attenders} 
                            setAttenders={setAttenders} 
                            organizers={organizers} 
                            setorganizers={setorganizers}
                            pending={pending}
                            setPending={setPending}/>}
        </Stack.Screen>
        <Stack.Screen name="Search User">
            {(props) => <SearchUserPage {...props} 
                            attenders={attenders} 
                            setAttenders={setAttenders} 
                            organizers={organizers} 
                            setorganizers={setorganizers} 
                            pending={pending}
                            setPending={setPending}/>}
        </Stack.Screen>
    </Stack.Navigator>);

}

export function NewEventPage({ navigation, attenders, setAttenders, organizers, setorganizers, pending, setPending}) {
    const user = useContext(UserContext);
    
    const insets = useSafeAreaInsets();
    const [focus, setFocus] = useState('');

    const [eventName, setEventName] = useState('');
    const [details, setDetails] = useState('');
    const [times, setTimes] = useState([]);

    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const [picking, setPicking] = useState(false);

    const handleSubmit = ()=>{
        //logAllData();
        if(eventName.trim() && times.length && attenders.length){
        addEvent(user, eventName, details, attenders, times, organizers, pending)
            .catch((e)=>{console.log(e)});
        navigation.goBack();
        }
    }
  
    const onChange = (event, selectedDate) => {
        if(event.type == 'set'){
            const currentDate = selectedDate;
            setShow(false);
            setDate(currentDate);
            if(mode == 'time'){
                setTimes(times.concat([currentDate]))
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

    const dateToString = (date) => {
        return(
            date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + '  ' +
            (date.getHours() < 10 ? '0' + date.getHours() :  date.getHours()) + ':' + 
            (date.getMinutes() < 10 ? '0' + date.getMinutes() :  date.getMinutes())
        );
    }

    useEffect(()=>{
        if(picking && show == false && mode == 'date'){
            showTimepicker();
        }
        else if(picking && show == false && mode == 'time'){
            setPicking(false);
        }
    })

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
            onChange={onChange}
            />
        )}

        <ScrollView style={{
                paddingTop: 30,
                paddingBottom: 0,
                paddingLeft: 30,
                paddingRight: 30
        }}>
            


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
            
            <Text style={styles.sectionTitle}>Propose dates</Text>
            
            <View id='propose_dates' style={[styles.outlineButtonCluster,{marginBottom:10}]}>
                
                {times.map((date, index) => (
                    <View style={[styles.outlineButton,{marginBottom:10}]} key={index}> 
                        
                        <Text style={{}}> 
                            {dateToString(date)}
                        </Text>
                        
                        <Pressable onPress={()=>{
                            setTimes(
                                times.slice(0, index)
                                .concat(
                                    times.slice(index+1)));
                        }}>

                            <Icon name="close" size={17} color="#333" style={{marginTop:2, marginLeft:3}}/>
                        </Pressable>

                    </View>
                ))}

                <Pressable 
                    style={styles.outlineButton}
                    onPress={()=>{showDatepicker()}}
                >
                    <Text style={[]}>
                        + Add new date
                    </Text>
                </Pressable>
            </View>

            <Text style={styles.sectionTitle}>Attendees</Text>

            <View id='attendees' style={[styles.outlineButtonCluster,{marginBottom:30}]}>
                {attenders.map((attendees, index) => (
                    <Namebox attendees={attendees} index={index} list={attenders} setList={setAttenders} key={index}></Namebox>
                ))}
                {pending.map((pendingUser, index) => (
                    <Namebox attendees={pendingUser} index={index} list={pending} setList={setPending} key={index} note={'(Pending)'}></Namebox>
                ))}
                
                <Pressable 
                    style={styles.outlineButton} 
                    onPress={()=>{ navigation.navigate('Search User') }}>
                    <Text style={{}}>
                        + Add attendees
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
                    <Text style={{fontWeight:500,fontSize:15.5,color:'#eee'}}>Add event</Text>
                </Pressable>
            </View>
            <View style={{height:100}}/>
        </ScrollView>
        </View>
    );
}