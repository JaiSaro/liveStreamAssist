import React from 'react';

import LiveStreamViewerPage from './pages/LiveStreamViewerPage';
import LiveStreamPublishPage from './pages/LiveStreamPublishPage';

import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {MD3LightTheme as DefaultTheme, PaperProvider} from 'react-native-paper';
import {PostApiMethod} from './utils/AxiosHelper';
import {USER_EMAIL, HASH_KEY, USER_TYPE_KEY} from 'react-native-dotenv';

const Tab = createMaterialBottomTabNavigator();
const theme = {
  ...DefaultTheme,
};

function App(): React.JSX.Element {
  const authenticateAntMedia = React.useCallback(() => {
    PostApiMethod('users/authenticate', {
      email: USER_EMAIL,
      userType: USER_TYPE_KEY,
      password: HASH_KEY,
    })
      .then(function (response: any) {
        console.log(response);
      })
      .catch(function (error: any) {
        console.log(error);
      });
  }, []);

  React.useEffect(() => {
    authenticateAntMedia();
  }, [authenticateAntMedia]);

  return (
    <NavigationContainer>
      <PaperProvider theme={theme}>
        <Tab.Navigator>
          <Tab.Screen
            name="Live Stream"
            component={LiveStreamViewerPage}
            options={{
              tabBarLabel: 'Live Stream',
              tabBarIcon: () => (
                <MaterialCommunityIcons name="play" size={26} />
              ),
            }}
          />
          <Tab.Screen
            name="Publish Stream"
            component={LiveStreamPublishPage}
            options={{
              tabBarLabel: 'Publish Stream',
              tabBarIcon: () => (
                <MaterialCommunityIcons name="publish" size={26} />
              ),
            }}
          />
        </Tab.Navigator>
      </PaperProvider>
    </NavigationContainer>
  );
}

export default App;
