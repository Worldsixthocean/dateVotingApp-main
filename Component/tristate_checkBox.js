import Icon from 'react-native-vector-icons/MaterialIcons';
import { View, Text, Button, Pressable } from 'react-native';

export default function TristateCheckBox({size = 23, color = "#333", check = false, indeterminate = false, 
    onPress = ()=>{}, onLongPress = ()=>{}, style = {}}){
return(
    <Pressable onPress={onPress} onLongPress={onLongPress} style = {style}>
        {check ?  <Icon name="check-box" size={size} color={color}/> : 
            indeterminate ? <Icon name="indeterminate-check-box" size={size} color={color}/> :
                <Icon name="check-box-outline-blank" size={size} color='#555'/>}
    </Pressable>
)}