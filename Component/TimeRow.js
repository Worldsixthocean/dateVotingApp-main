import Icon from 'react-native-vector-icons/MaterialIcons';
import { View, Text, Button, Pressable } from 'react-native';
import styles from '../style.js';

export default function TimeRow({style = {}}){
return(
    <View style={[style]}>
        {Array(24).fill(0).map((d,i)=>
            <View key={i} style={{flex:1,alignSelf:'flex-end'}}>
                <Text style={{color:'#777'}}>{i < 10 ? '0' + i : i}</Text>
            </View>
        )}
    </View>
)}