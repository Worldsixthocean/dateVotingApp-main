
import { View, Text, Pressable, ScrollView } from 'react-native';
import * as dateHelper from '../DataClass/dateHelper.js'
import WeekDayView from './WeekdayView.js';
import Icon from 'react-native-vector-icons/MaterialIcons';
import TimeRow from './TimeRow.js';

//import { toDate } from 'firebase/firestore'; 

import { sameDateOrEariler } from '../DataClass/dateHelper.js';
import { leadingZeros } from '../Utils/type.js';
import TimeSlot from './TimeSlot.js';

export default function WeekView({date = new Date(), events = [], Duration = 15, onNextWeek = ()=>{}, onLastWeek = ()=>{}, setTimes = ()=>{}}){

    
    let DayOfWeek = date.getDay();
    startDate = dateHelper.daysBefore(date, DayOfWeek);
    let week = [];
    for(i = 0 ; i < 7; i++){
        week.push(dateHelper.daysAfter(startDate, i));
    } 

    //filteredEvents do 3 things: 
    //filter proposed time to week
    //convert firebase timestamp to date
    //mark index of the original array
    let filteredEvents =[[],[],[],[],[],[],[]];
    events?.forEach((c,i)=>{ 

        let cDate = c.date.toDate(); //where does toDate come from???
        // faster if comparing directly rather then filter??? filtering weeks 
        if(sameDateOrEariler( week[0], cDate) && sameDateOrEariler( cDate, week[6])){
            //chack same date
            for(k = 0 ; k < 7; k++){
                if(dateHelper.sameDate(week[k],cDate)){
                    //convert to Date
                    filteredEvents[k].push({available:c.available, date:c.date.toDate(), index:i})
                }
            }
        }
    });

    let tableHeight = 700;

    return(
        <View style={{backgroundColor:'#ddd', height:300, borderRadius:20, padding:15}}>

            <View style={{flexDirection:'row',paddingBottom:13}}>
                <Pressable style={{marginTop:5}} onPress={onLastWeek}><Icon name="keyboard-arrow-left" size={23}/></Pressable>
                {week.map((d,i)=><WeekDayView date={d} key={i} style={{flex:1}}/>)}
                <Pressable style={{marginTop:5}} onPress={onNextWeek}><Icon name="keyboard-arrow-right" size={23}/></Pressable>
            </View>

            <ScrollView style={{flex:1}} nestedScrollEnabled={true} contentOffset={{x: 0, y: 9 / 24 * tableHeight}}>
                <View style={{height:tableHeight, flexDirection:'row'}}>
                    <HorizontalLines/>{/* absolute */}
                    <TimeRow style={{width:23}}></TimeRow>
                    <View style={{flex:1}}>
                        <TimeSlotColumns filteredEvents={filteredEvents} week={week} length={60} tableHeight={tableHeight}
                        times={events} setTimes={setTimes}/>
                    </View>
                    <View style={{width:23}}></View>
                </View>
            </ScrollView>

        </View>
)}

function HorizontalLines(){
    return(
        <View style={{position:'absolute',height:'100%', width:'100%',paddingHorizontal:30}}>
            {Array(24).fill(0).map((d,i)=>
                <View key={i} style={{flex:1, borderTopColor:'#777',borderTopWidth:1}}><Text></Text></View>
            )}
        </View>  
    )
}

function TimeSlotColumns({filteredEvents, week, length = 60, tableHeight, times = [], setTimes = ()=>{}}){

    return(
    <View style={{flex:1, flexDirection:'row'}}>
        {filteredEvents.map((events, index)=>(
            <TimeSlotColumn events={events} key={index} tableHeight={tableHeight} length={length} times={times} setTimes={setTimes}/>
        ))}
    </View>
    );
}

function TimeSlotColumn({events, tableHeight, length = 60, times = [], setTimes = ()=>{}}){
    //events?.forEach((e)=>{console.log(e)});

    return(
        <View style={{flex:1}}>
            {events.map((event, index)=>(
            <View style={{position:'absolute', height:'100%', width:'100%'}} key={index}>
                <TimeSlot event={event} index={event.index} times={times} setTimes={setTimes} length={length} tableHeight={tableHeight}></TimeSlot>
                
            </View>
            ))}
        </View>
    )
}