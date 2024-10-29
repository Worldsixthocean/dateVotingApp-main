import * as React from 'react';
import ListScreen from './ListPage.js';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { navigationRef } from '../ContextAndConfig/RootNavigation';

import newEventScreen from './NewEventPage.js'
import EventPage from './EventPage.js';

const Stack = createNativeStackNavigator();

export default function EventScreen() {
    
    return (
      <Stack.Navigator initialRouteName="List"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="List" component={ListScreen} />
        <Stack.Screen name="New event" component={newEventScreen}/>
        <Stack.Screen name="Event Page" component={EventPage}/>
      </Stack.Navigator>
    );
}