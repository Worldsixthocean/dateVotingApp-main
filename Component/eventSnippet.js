import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, Pressable, Image} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { storage } from '../ContextAndConfig/firebaseConfig.js'
import { getDownloadURL, ref} from 'firebase/storage';

import importStyle from '../style.js'

export default function EventSnippet({ doc, index, navigation }) {

    const [imgState, setimgState] = useState();

    useEffect(() => {
        const func = async() => {
          const imgReference = ref(storage, 'event/'+ doc.id + '.' + doc.data().imageformat);
          await getDownloadURL(imgReference).then((x)=>{
            setimgState(x);
          }).catch(
            (error) => {
                switch (error.code) {
                    case 'storage/object-not-found':
                      setimgState(null);
                      break;
                }
            }
          );
        }

        func();
    
      });

    return(
        <Pressable 
            style={[importStyle.card,{marginBottom:10, padding:15, height:85}]} 
            key={index} 
            onPress={()=>{
            navigation.navigate('Event Page', {
                screen: 'Event page',  
                params: {eventID: doc.id}
            })}}>
                <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                    <View>
                        <Text style={{fontSize:22, fontWeight:600, marginBottom:5, color:'#333'}}>{doc.data().eventName}</Text>
                        <Text style={{fontSize:14, color:'#777'}}>{doc.data().description}</Text>
                    </View>
                    <Image style={{height:55, width:55, resizeMode:'cover'}} source={{uri:imgState}}/>
                </View>
      </Pressable>
    );
}
