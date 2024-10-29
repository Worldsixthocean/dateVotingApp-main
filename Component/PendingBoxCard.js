import { View, Text, Pressable, Image} from 'react-native';
import { useState, useEffect, useContext } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { StyleSheet } from 'react-native';

import { db} from '../ContextAndConfig/firebaseConfig.js'

import styles from '../style.js';

import default_avatar from '../assets/default_avatar.png';
import { UserContext } from '../ContextAndConfig/UserContext.js';
import { cancelInvitation, confirmInvitation } from '../DataClass/event.js';

export default function PendingBox({ navigation, type, eventID, invite }) {

    const user = useContext(UserContext);

    const [eventName, setEventName] = useState('');
    const [userName, setUserName] = useState('');

    const fetchEvent = async (id) => {
        const docRef = doc(db, "events", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setEventName(docSnap.data().eventName);
        } else {
          console.log("No such document!");
        }
    }

    const fetchUser = async (id) => {
        const docRef = doc(db, "users", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setUserName(docSnap.data().user);
        } else {
          console.log("No such document!");
        }
    }

    useEffect(()=>{
        fetchEvent(eventID).catch(
            (e)=>{console.log(e)})
        fetchUser(invite).catch(
            (e)=>{console.log(e)})
    },[])

    return(
        <View style={notiBoxStyles.notiBox}>
            <View style={notiBoxStyles.row}>
                <Image source={default_avatar} style={[styles.avatar,{marginRight:10}]}></Image>
                <View style={{flex:1, flexDirection:'row', flexWrap:'wrap'}}>
                    <Text style={[notiBoxStyles.text, {fontWeight: 600}]}>{userName}</Text>

                    <Text style={[notiBoxStyles.text]}> has invited you to join an event: </Text>

                    <Text style={[notiBoxStyles.text, {fontWeight: 600}]}>{eventName}</Text>
                </View>
            </View>

            <View style={[notiBoxStyles.row, notiBoxStyles.justify_end]}>

                <Pressable style={[notiBoxStyles.button]}
                     onPress={()=>{ cancelInvitation(eventID, user.uid)}}>
                    <Text style={[notiBoxStyles.buttonText]}>Cancel</Text>
                </Pressable>

                <Pressable style={[notiBoxStyles.button,{marginLeft:10}, notiBoxStyles.blueButton]}
                    onPress={()=>{ confirmInvitation(eventID, user.uid)}}>
                    <Text style={[notiBoxStyles.buttonText,notiBoxStyles.textWhite]}>Confirm</Text>
                </Pressable>

            </View>
        </View>
    );
}

notiBoxStyles = StyleSheet.create({
    notiBox:{
        padding:20
    },
    row:{
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 14
    },
    justify_end:{
        justifyContent:'flex-end'
    },
    button:{
        paddingHorizontal:20,
        paddingVertical:5,
        height:40,
        borderRadius:20,
        flexDirection: 'row',
        alignItems: 'center',
        borderColor:'#333',
        borderWidth:1
    },
    buttonText:{
        fontWeight:600,
        fontSize:15
    },
    text:{
        fontSize:15
    },
    textWhite:{
        color:'#fff'
    },
    blueButton:{
        backgroundColor:'#0065FF',
        borderWidth:0,
        elevation:5
    }
})