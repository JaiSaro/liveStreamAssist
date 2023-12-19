import React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';

import LiveStreamViewerPage from './pages/LiveStreamViewerPage';
import LiveStreamPublishPage from './pages/LiveStreamPublishPage';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* <Stack.Screen name="Live Stream" component={LiveStreamViewerPage} /> */}
        <Stack.Screen name="Publish Stream" component={LiveStreamPublishPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
