import { View, Text, Pressable} from 'react-native';
import styles from '../style.js';

import Icon from 'react-native-vector-icons/MaterialIcons';

export function Namebox({attendees, index, list, setList, note}){
    return(
        <View style={[styles.outlineButton,{marginBottom:10}]}> 
                            
        <Text style={{}}> 
            {attendees.name || attendees.email} {note}
        </Text>
        
        <Pressable onPress={()=>{
            setList(
                list.slice(0, index)
                .concat(
                    list.slice(index+1)));
        }}>

            <Icon name="close" size={17} color="#333" style={{marginTop:2, marginLeft:3}}/>
        </Pressable>

        </View>
    )
}