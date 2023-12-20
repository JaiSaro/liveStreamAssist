import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import LiveStreamViewerPage from './pages/LiveStreamViewerPage';
import LiveStreamPublishPage from './pages/LiveStreamPublishPage';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{headerShown: false}}>
        <Tab.Screen
          name="Live Stream"
          component={LiveStreamViewerPage}
          options={{
            tabBarLabel: 'Live Stream',
            tabBarIcon: ({color}) => (
              <MaterialCommunityIcons name="play" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen name="Publish Stream" component={LiveStreamPublishPage} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
