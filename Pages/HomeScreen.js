import * as React from 'react';
import { useContext, useState } from 'react';
import { View, Text, Button, Image, ScrollView } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';

import { LinearGradient } from 'expo-linear-gradient';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { storage } from '../ContextAndConfig/firebaseConfig.js';
import { UserContext } from '../ContextAndConfig/UserContext.js';
import PendingBox from '../Component/PendingBox.js'
import importStyle from '../style.js';

import { getDownloadURL, ref, uploadBytes  } from 'firebase/storage';

import * as DocumentPicker from 'expo-document-picker';
import HomeScreenCard from '../Component/HomeScreenCard.js';

function HomeScreen({ navigation }) {
  
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();

  const user = useContext(UserContext);

  let cardContent;
  if(user && user?.pending && user?.pending?.length != 0){
    cardContent = <PendingBox eventID={user.pending.at(-1).eventID} invite={user.pending.at(-1).invite} bounded={true}/>;
  }
  else{
    cardContent = <HomeScreenCard/>
  }

  React.useEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerStyle: {backgroundColor:'transparent'},
      headerBackVisible: false,
      headerTintColor: '#fff'
    });
  });
  
  return (
    <View>
      <View id="full_screen" style={{height:'100%', width:'100%'}}>
        <View id="top_area" style={{
            height:"40%"
        }}>
          <LinearGradient
            colors={['#3169d5', '#7d57c8']}
            style={{
              width:'100%',
              height:'100%'
          }}>
            <View id="card_safe_area"
              style={{
              paddingTop: headerHeight + 3,
              paddingBottom: 18,
              paddingLeft: insets.left + 18,
              paddingRight: insets.right + 18,
              width:'100%',
              height:'100%',
              justifyContent:'center'
              }}
            >
              <View id="top_card" style={[importStyle.card, {justifyContent:'center', height:150}]}>
                  {cardContent}
              </View>
            </View>
          </LinearGradient>
        </View>

        <View id="bottom_area" style={{
            paddingTop: 18,
            paddingBottom: 0,
            paddingLeft: insets.left + 18,
            paddingRight: insets.right+ 18
        }}>

            <View style={{marginVertical:5}}/>
        </View>
      </View>
    </View>
  );
}

export default HomeScreen;