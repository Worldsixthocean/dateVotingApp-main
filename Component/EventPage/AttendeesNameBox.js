import Chip from '../Chip.js';
import { Alert } from 'react-native';

export default function AttendeesNamebox({
    currentAttendee, index,
    removedAttenders, setRemovedAttenders, 
    times, setTimes,
    attendersList, setAttendersList}){
    const deleteAttendees = ()=>{
        //removedAttenders: just storing the userID
        if(!removedAttenders.includes(currentAttendee.uid)){
            setRemovedAttenders(removedAttenders.concat([currentAttendee.uid]));
        }

        setTimes(
            times.map((e)=>({
                date: e.date, 
                available: 
                    e.available.filter((e)=>(
                        e.uid != currentAttendee.uid)
                    ),
                maybe:
                    e.maybe.filter((e)=>(
                        e.uid != currentAttendee.uid)
                ),
            }))
        );

        setAttendersList(
            attendersList.slice(0, index)
            .concat(
                attendersList.slice(index+1)));
    }
    return(
        <Chip 
            content={currentAttendee.name || currentAttendee.email} 
            onPressCloseButton={()=>{
                Alert.alert('Delete Attendee?', 'All the proposed date he/she voted will be deleted.', [
                    {text: 'Cancel', onPress: () => {}, style: 'cancel'},
                    {text: 'OK', onPress: deleteAttendees},
                ]) 
            }}
        />
    )
}