import Chip from '../Chip.js';
import { Alert } from 'react-native';

export default function PendingNameBox({
    currentPending, index, 
    removedPendings, setRemovedPendings,
    pendingList, setPendingList
}){
    const deletePending = ()=>{
        //removedPendings: just storing the userID
        if(!removedPendings.includes(currentPending.uid)){
            setRemovedPendings(removedPendings.concat([currentPending.uid]));}

        setPendingList(
            pendingList.slice(0, index)
            .concat(
                pendingList.slice(index+1)))
    }
    return(
        <Chip 
            content={(currentPending.name || currentPending.email) + ' (Pending)'} 
            onPressCloseButton={()=>{
                    Alert.alert('Cancel invitation?', 'Do you want to cancel the event invitaion?', [
                        {text: 'Cancel', onPress: () => {}, style: 'cancel'},
                        {text: 'OK', onPress: deletePending},
                    ])
            }}
        />
    )
}