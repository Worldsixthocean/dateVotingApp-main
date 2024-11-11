import * as React from 'react';
import { useContext } from 'react';
import {View, Text, Image, Pressable} from 'react-native';
import {DrawerItemList } from '@react-navigation/drawer';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import { UserContext } from '../ContextAndConfig/UserContext';

import { auth } from '../ContextAndConfig/firebaseConfig.js';
import { signOut } from 'firebase/auth';
import default_avatar from '../assets/default_avatar.png';
import Icon from 'react-native-vector-icons/MaterialIcons';

import logo from '../assets/logo.png'

import styles from '../style.js';

function Drawer( props ) {

    const user = useContext(UserContext);
    const insets = useSafeAreaInsets();

    drawerTopPadding = insets.top > 5 ? insets.top : 5;

    return(
            <View style={{paddingTop: drawerTopPadding, height:'100%'}}>
                <Image source={logo} style={{margin:15, height:100,width:200, resizeMode:'contain'}}></Image>
                <DrawerItemList {...props} />
                <View style={{flex:1}}></View>
                <View style={{flexDirection:'row', paddingStart:20, paddingBottom:30, paddingEnd:7, alignItems:'center'}}>
                    <Image source={default_avatar} style={styles.avatar}></Image>
                    <Text style={{paddingLeft:12,fontSize:15, flex:1}} >{user ? user.user:''}</Text>
                    <Pressable 
                        style={styles.outlineButton}
                        onPress={()=>{
                            try{
                            signOut(auth);
                            }
                            catch(err){
                            console.log(err.message);
                            }
                        }}
                    >
                        <Icon name="logout" style={{paddingEnd:4}} size={20} color="#333" />
                        <Text>Logout</Text>
                    </Pressable>
                </View>
            </View>
    );
}

export default Drawer;