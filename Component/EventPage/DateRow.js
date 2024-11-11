import * as React from 'react';
import { useContext } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';

import { UserContext } from '../../ContextAndConfig/UserContext.js';

import {userInList} from '../../DataClass/event.js'
import TristateCheckBox from '../tristate_checkBox.js';

import { eventPageToggle } from '../../Utils/eventPageToggle.js'

import Icon from 'react-native-vector-icons/MaterialIcons';

//A list of propose date for ppl to vote
function DateRow( {date, index, times, setTimes, showClose} ) {

    const user = useContext(UserContext);

    const toggle = (e, availableOrMaybe) => {eventPageToggle(e, index, times, setTimes, user, availableOrMaybe)};

    const isAvailable = userInList(times[index].available, user.uid);
    const isMaybe = userInList(times[index].maybe, user.uid);

    return (
        <>
            <View style={{flexDirection:'row', alignItems:'center', paddingBottom:8, paddingTop:3, justifyContent:'space-between'}}>
                <Pressable className='left' style={{flexDirection:'row', alignItems:'center'}}
                    onPress={()=>{toggle(!isAvailable && !isMaybe, true)}}
                    onLongPress={()=>{toggle(!isAvailable && !isMaybe, false)}}>
                    <TristateCheckBox
                        style={{alignSelf:'flex-start', paddingRight: 5}} color='#0065FF'
                        check={isAvailable}
                        indeterminate={isMaybe}
                    />
                    <Text style={{fontWeight:500, fontSize:16, paddingBottom:1}}>{date}</Text>
                </Pressable>
                
                {showClose && <Pressable className='right' onPress={()=>{
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

            <View id="show_voted" style={{paddingLeft:3}}>
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
        </>
    );

}

export default DateRow;