import 'react-native-gesture-handler';

import * as React from 'react';
import { useEffect, useState} from 'react';

import { NavigationContainer, getFocusedRouteNameFromRoute  } from '@react-navigation/native';

import { SafeAreaProvider} from 'react-native-safe-area-context';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { navigationRef } from './ContextAndConfig/RootNavigation.js';

import { doc, getDoc, onSnapshot } from "firebase/firestore";

import HomeScreen from './Pages/HomeScreen.js';
import EventScreen from './Pages/EventScreen.js';
import DrawerContent from './Component/DrawerContent.js';
import LoginScreen from './Pages/Login.js';
import NotiScreen from './Pages/Noti.js'
import useAuth from './ContextAndConfig/AuthContext.js';
import {db} from './ContextAndConfig/firebaseConfig.js';

import { UserContext } from './ContextAndConfig/UserContext.js';


const Drawer = createDrawerNavigator();

function getHeaderTitle(route) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'List';
  switch (routeName) {
    case 'List':
      return 'Events';
    case 'New event':
      return 'New event';
    case 'Search User':
      return 'Search User';
  }
}

function App() {

  const {user} = useAuth();

  const [userDoc, setUserDoc] = useState();

  const fetchUser = async (docRef) => {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setUserDoc(docSnap.data());
    } else {
      console.log("No such document!");
    }
  }

  useEffect(()=>{

    let unsub = () => {};

    if(user){

      const docRef = doc(db, "users", user.uid);

      fetchUser(docRef).catch(
        (e)=>{console.log(e)}
      )

      unsub = onSnapshot(docRef, async() => {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserDoc(docSnap.data());
        } else {
          console.log("No such document!");     
      }});

    };

    return unsub;

  },[user]);

  if(user){    
    return (
      <UserContext.Provider value={userDoc}>
        <SafeAreaProvider>
          <NavigationContainer ref={navigationRef}>
            <Drawer.Navigator initialRouteName="Home" backBehavior='initialRoute'
              drawerContent={(props) => <DrawerContent{...props}/>}>

              <Drawer.Screen name="Home" component={HomeScreen}/>

              <Drawer.Screen 
                name="Events" 
                component={EventScreen} 
                options={({ route }) => ({
                  headerTitle: getHeaderTitle(route)})}
              />

              <Drawer.Screen name="Notification" component={NotiScreen}/>

              {/* <Drawer.Screen name="Test" component={TestScreen}/> */}

            </Drawer.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </UserContext.Provider>
    );
  }
  else{  
    return (
      <SafeAreaProvider>
        <NavigationContainer>
          <Drawer.Navigator id='Drawer.Navigator'
            initialRouteName="Login" 
            backBehavior='initialRoute'  
            screenOptions={{
              swipeEnabled: false,
              headerShown: false
            }}>
            <Drawer.Screen name="Login">
              {(props) => <LoginScreen {...props} type={'Login'}/>}
            </Drawer.Screen>
            <Drawer.Screen name="Register">
              {(props) => <LoginScreen {...props} type={'Register'}/>}
            </Drawer.Screen>
          </Drawer.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    );
  }

}

export default App;