import { View, Text, Pressable } from 'react-native';
import { useContext } from 'react';
import { UserContext } from '../ContextAndConfig/UserContext';
import { userInList } from '../DataClass/event.js'
import { eventPageToggle } from '../Utils/eventPageToggle.js'

export default function TimeSlot({event, index, times, setTimes, length, tableHeight}){

    const user = useContext(UserContext);

    const toggle = (e, availableOrMaybe) => {eventPageToggle(e, index, times, setTimes, user, availableOrMaybe)};

    const isAvailable = userInList(times[index].available, user.uid);
    const isMaybe = userInList(times[index].maybe, user.uid);

    return(<>
        <View style={{
            // formula: the minutes of the day / total minutes of the day * height of the table (scrolling part)
            height: ((event.date.getHours()*60 + event.date.getMinutes()) /1440 *tableHeight)
        }}/>

        <Pressable 
            onPress={()=>{toggle(!isAvailable && !isMaybe, true)}}
            onLongPress={()=>{toggle(!isAvailable && !isMaybe, false)}}
        >
            <View style={{
                backgroundColor:(
                    isAvailable ? '#0065FF': (
                        isMaybe ? '#FCBA03' : 
                                  '#FFF')), 
                borderRadius:6, alignItems:'center', paddingTop:3,
                height:(length / 1440 *700)
            }}>
                <Text 
                    style={{color:(isAvailable ? '#FFF': '#000')}} 
                    key={index}>
                    {event.date.getHours()}:{event.date.getMinutes()}
                </Text>
            </View>
        </Pressable>
    </>);
}