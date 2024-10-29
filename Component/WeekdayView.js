import { View, Text, Button, Pressable } from 'react-native';
import * as dateHelper from '../DataClass/dateHelper.js'

export default function WeekDayView({date, style}){
return(
    <View style={[style,{alignItems:'center'}]}>
        <Text>{dateHelper.dayToString(date.getDay())}</Text>
        <Text>{date.getDate()}</Text>
    </View>
)}