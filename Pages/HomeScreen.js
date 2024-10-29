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

  const [imgState, setimgState] = useState();
  
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

  React.useEffect(() => {
    const func = async() => {
      const imgReference = ref(storage, 'Coffee.png');
      await getDownloadURL(imgReference).then((x)=>{
        setimgState(x);
      });
    }
    
    if (imgState == undefined){
      func();
    }

  },[]);

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

            {/* <Button title={'Doc Pick upload'}
              onPress={async ()=>{
                x = await DocumentPicker.getDocumentAsync({ type: 'image/*' });
                if(x.canceled == false){
                  const response = await fetch(x.assets[0].uri);
                  const blob = await response.blob();
                  const mountainsRef = ref(storage, 'mountains.jpg');
                  uploadBytes(mountainsRef, blob).then((snapshot) => {
                    console.log('Uploaded a blob or file!');
                  });
                }
                else{
                  console.log(x.canceled);
                }
            }}/>

            <View style={{marginVertical:5}}/>

            <Button title={'Doc Pick local'}
              onPress={async ()=>{
                x = await DocumentPicker.getDocumentAsync({ type: 'image/*' });
                if(x.canceled == false){
                  setimgState(x.assets[0].uri);
                }
                else{
                  console.log(x.canceled);
                }
            }}/>
          <View style={{height:250, width:'100%', marginTop:50}}>
            <ScrollView scrollEnabled={false}>
              <Image style={{height:300, width:'100%'}}source={{uri:imgState}}/>
            </ScrollView>
          </View> */}
        </View>
      </View>
    </View>
  );
}

export default HomeScreen;