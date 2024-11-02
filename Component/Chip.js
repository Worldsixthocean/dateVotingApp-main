import { View, Text, Pressable} from 'react-native';
import styles from '../style.js';

import Icon from 'react-native-vector-icons/MaterialIcons';

export default function Chip({content, onPressCloseButton}){
    return(
        <View style={[styles.outlineButton,{marginBottom:10}]}> 
                            
        <Text style={{}}> 
            {content}
        </Text>
        
        {onPressCloseButton &&
        <Pressable onPress={onPressCloseButton}>
            <Icon name="close" size={17} color="#333" style={{marginTop:2, marginLeft:3}}/>
        </Pressable>}

        </View>
    )
}