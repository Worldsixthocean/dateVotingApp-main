import * as React from 'react';
import { useContext } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';

import { UserContext } from '../../ContextAndConfig/UserContext.js';

import {userInList} from '../../DataClass/event.js'
import TristateCheckBox from '../tristate_checkBox.js';

import { eventPageToggle } from '../../Utils/eventPageToggle.js'

import { dayToString, monthToString } from '../../DataClass/dateHelper.js';

import Icon from 'react-native-vector-icons/MaterialIcons';

//A list of propose date for ppl to vote
function DateRow( {date, index, times, setTimes, showClose, maxVote} ) {

    const user = useContext(UserContext);

    const toggle = (e, availableOrMaybe) => {eventPageToggle(e, index, times, setTimes, user, availableOrMaybe)};

    const isAvailable = userInList(times[index].available, user.uid);
    const isMaybe = userInList(times[index].maybe, user.uid);

    const percentageMaybe = maxVote && 
        Math.round(((times[index].available.length + times[index].maybe.length) / maxVote)*100) +'%';
    
    const percentageAva = (times[index].available.length + times[index].maybe.length) && 
        Math.round((times[index].available.length / (times[index].available.length + times[index].maybe.length))*100)+'%';

    return (
        <View style={{flexDirection:'row'}}>
            <View style={{flexDirection:'row', alignItems:'center', paddingBottom:8, paddingTop:3, justifyContent:'space-between'}}>
                <TristateCheckBox
                        style={{paddingRight: 15}} color='#0065FF'
                        check={isAvailable}
                        indeterminate={isMaybe}
                        onPress={()=>{toggle(!isAvailable && !isMaybe, true)}}
                        onLongPress={()=>{toggle(!isAvailable && !isMaybe, false)}}
                />
                <Pressable className='left' style={{alignItems:'center', paddingRight:19}}
                    onPress={()=>{toggle(!isAvailable && !isMaybe, true)}}
                    onLongPress={()=>{toggle(!isAvailable && !isMaybe, false)}}>
                    <Text style={{fontWeight:400, fontSize:16, paddingBottom:1, color:'#777'}}>{dayToString(date.getDay())}</Text>
                    <Text style={{fontWeight:500, fontSize:30, paddingBottom:1,  color:'#333'}}>{date.getDate()}</Text>
                    <Text style={{fontWeight:400, fontSize:16, paddingBottom:10,  color:'#777'}}>{monthToString(date.getMonth())}</Text>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Icon name='access-time' size={23} color="#333" style={{paddingEnd:4}}/>
                        <Text style={{fontWeight:500, fontSize:16, paddingBottom:1, color:'#333'}}>
                            {(date.getHours() < 10 ? '0' + date.getHours() :  date.getHours()) + ':' + 
                            (date.getMinutes() < 10 ? '0' + date.getMinutes() :  date.getMinutes())}</Text>
                    </View>
                </Pressable>

            </View>
            <View id="show_voted" style={{paddingLeft:3, flex:1}}>
        
                <View style={{flexDirection:'row', alignItems:'center', paddingBottom:7, height:34}}>
                    <View style={{backgroundColor:'#ddd',height:'100%', flex:1, marginRight:5, borderRadius:8}}>
                        <View style={{backgroundColor:'#FCBA03', width:percentageMaybe, height:'100%', borderRadius:8, flexDirection:'row', alignItems:'center'}}>
                            <View style={{backgroundColor:'#0065FF', width:percentageAva, height:'100%', borderRadius:8, flexDirection:'row', alignItems:'center'}}>
                                {times[index].available.length ? <Text style={{color:'#fff',marginHorizontal:8}}>{times[index].available.length}</Text> : <></>}
                            </View>
                            {times[index].maybe.length ? <Text style={{color:'#333',marginHorizontal:8}}>{times[index].maybe.length}</Text> : <></>}
                        </View>
                    </View>
                    {showClose && <Pressable className='right' style={{paddingTop:3}} onPress={()=>{
                        Alert.alert('Delete proposed time?', 'All the votes on this date will be deleted.', [
                            {text: 'Cancel',onPress: () => {},style: 'cancel'},
                            {text: 'OK', onPress: () => 
                                setTimes(
                                    times.slice(0, index).concat(times.slice(index+1))
                                )
                            },
                        ])

                    }}>
                        <Icon name="close" size={23} color="#333"/>
                    </Pressable>}
                </View>

                <Text style={{paddingBottom:8}}>{times[index].available.length} are available at that time:</Text>
                {times[index].available.map((attendees, index) => (
                    <View style={[styles.outlineButton,{marginBottom:10}]} key={index}> 
                        
                        <Text style={{}}> 
                            {attendees.name || attendees.email}
                        </Text>

                    </View>
                ))}

                <View className='gap' style={[{marginBottom:3}]}/> 

                <Text style={{paddingBottom:8}}>{times[index].maybe.length} could free their time if needed:</Text>
                {times[index].maybe.map((maybePerson, index) => (
                    <View style={[styles.outlineButton,{marginBottom:10}]} key={index}> 
                        
                        <Text style={{}}> 
                            {maybePerson.name || maybePerson.email}
                        </Text>

                    </View>
                ))}
                <View className='gap' style={[{marginBottom:6}]}/>
            </View>
        </View>
    );

}

export default DateRow;