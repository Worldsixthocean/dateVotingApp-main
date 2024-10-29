import * as React from 'react';
import { useContext } from 'react';
import { View, Text } from 'react-native';

import { UserContext } from '../ContextAndConfig/UserContext';

import {userInList} from '../DataClass/event.js'
import TristateCheckBox from '../Component/tristate_checkBox.js';

import { eventPageToggle } from '../Utils/eventPageToggle.js'

//A list of propose date for ppl to vote
function DateRow( {date, index, times, setTimes} ) {

    const user = useContext(UserContext);

    const toggle = (e, availableOrMaybe) => {eventPageToggle(e, index, times, setTimes, user, availableOrMaybe)};

    const isAvailable = userInList(times[index].available, user.uid);
    const isMaybe = userInList(times[index].maybe, user.uid);

    return (
        <>
            <View style={{flexDirection:'row', alignItems:'center', paddingVertical:8}}>
                <Text style={{paddingRight: 5}}>{date}</Text>
                <TristateCheckBox
                    style={{alignSelf:'flex-start'}} color='#0065FF'
                    onPress={()=>{toggle(!isAvailable && !isMaybe, true)}}
                    onLongPress={()=>{toggle(!isAvailable && !isMaybe, false)}}
                    check={isAvailable}
                    indeterminate={isMaybe}
                />
                <Text style={{paddingLeft: 10}}>No. of people: {times[index].available.length}</Text>
            </View>
            {times[index].available.map((attendees, index) => (
                <View style={[styles.outlineButton,{marginBottom:10}]} key={index}> 
                    
                    <Text style={{}}> 
                        {attendees.name || attendees.email}
                    </Text>

                </View>
            ))}
            <Text style={{paddingBottom:8}}>Maybe: {times[index].maybe.length}</Text>
            {times[index].maybe.map((maybePerson, index) => (
                <View style={[styles.outlineButton,{marginBottom:10}]} key={index}> 
                    
                    <Text style={{}}> 
                        {maybePerson.name || maybePerson.email}
                    </Text>

                </View>
            ))}
        </>
    );

}

export default DateRow;