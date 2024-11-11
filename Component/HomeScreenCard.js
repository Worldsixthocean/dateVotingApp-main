import * as React from 'react';
import { View, Text, Pressable, TextInput, FlatList, ScrollView, Image, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import * as RootNavigation from '../ContextAndConfig/RootNavigation';

import { CommonActions } from '@react-navigation/native';

export default function HomeScreenCard({ }) {

    return(
        <View style={{flexDirection:"row"}}>
            <Pressable style={homeScreenCardStyles.iconColumn}>
                <Icon name="add" size={50} color="#333" 
                    onPress={()=>{
                        RootNavigation.navigate('Events', {screen: 'List'});
                        RootNavigation.navigate('Events', {screen: 'New event'});
                    }}/>
                <Text style={homeScreenCardStyles.iconColumnText}>New Event</Text>
            </Pressable>
            <Pressable style={homeScreenCardStyles.iconColumn}>
                <Icon name="playlist-add" size={50} color="#333"
                onPress={()=>{
                    RootNavigation.navigate('Join')
                }}
                />
                <Text style={homeScreenCardStyles.iconColumnText}>Join Event</Text>
            </Pressable>
            <Pressable style={homeScreenCardStyles.iconColumn}>
                <Icon name="list-alt" size={50} color="#333"
                    onPress={()=>{
                        RootNavigation.navigate('Events', {screen: 'List'})
                    }}/>
                <Text style={homeScreenCardStyles.iconColumnText}>Event List</Text>
            </Pressable>
            <Pressable style={homeScreenCardStyles.iconColumn}
                onPress={()=>{
                    RootNavigation.navigate('Notification')
                }}>
                <Icon name="notifications" size={50} color="#333" />
                <Text style={homeScreenCardStyles.iconColumnText}>Notifications</Text>
            </Pressable>
        </View>
    );
}

homeScreenCardStyles = StyleSheet.create({
    iconColumn:{
        flex:1, flexDirection:"column", alignItems:'center', padding:10
    },
    iconColumnText:{
        fontWeight:'500', fontSize:12, textAlign:'center', paddingTop:5
    }

})