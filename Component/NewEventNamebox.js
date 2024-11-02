import Chip from './Chip.js';

export function NewEventNamebox({attendees, index, list, setList, note}){
    const deleteAttendees = ()=>{
        setList(
            list.slice(0, index)
            .concat(
                list.slice(index+1)));
    }
    return(
        <Chip content={attendees.name || attendees.email + ' ' + note} onPressCloseButton={deleteAttendees}/>
    )
}