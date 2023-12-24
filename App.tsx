import React from 'react';

import LiveStreamViewerPage from './pages/LiveStreamViewerPage';
import LiveStreamPublishPage from './pages/LiveStreamPublishPage';
import LiveStreamListPage from './pages/LiveStreamListPage';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
  Text,
} from 'react-native-paper';
import {PostApiMethod} from './utils/AxiosHelper';
import AppSnackbar from './components/AppSnackbar';

const Stack = createNativeStackNavigator();
const theme = {
  ...DefaultTheme,
};

function App(): React.JSX.Element {
  const [snackDetails, setSnackDetails] = React.useState<{
    show: boolean;
    content: string;
  }>({show: false, content: ''});

  const authenticateAntMedia = React.useCallback(() => {
    PostApiMethod('users/authenticate', {
      email: process.env.REACT_APP_USER_EMAIL,
      userType: process.env.REACT_APP_USER_TYPE_KEY,
      password: process.env.REACT_APP_HASH_KEY,
    })
      .then(function (response: any) {
        console.log(response.data);
        setSnackDetails({
          ...{
            show: true,
            content: 'Successfully authenticated with AntMedia',
          },
        });
      })
      .catch(function (error: any) {
        setSnackDetails({
          ...{
            show: true,
            content: 'Fail to authenticate with AntMedia',
          },
        });
        console.log(error.message);
      });
  }, []);

  React.useEffect(() => {
    authenticateAntMedia();
  }, [authenticateAntMedia]);

  return (
    <NavigationContainer>
      <PaperProvider theme={theme}>
        <Stack.Navigator initialRouteName="LiveStreamListPage">
          <Stack.Screen
            name="LiveStreamListPage"
            component={LiveStreamListPage}
            options={() => ({
              headerTitle: props => (
                <Text variant="labelLarge" {...props}>
                  Live Stream Assist
                </Text>
              ),
            })}
          />
          <Stack.Screen
            name="LiveStreamPublishPage"
            options={{title: 'New WebRTCAppEE Stream'}}
            component={LiveStreamPublishPage}
          />
          <Stack.Screen
            name="LiveStreamViewerPage"
            component={LiveStreamViewerPage}
          />
        </Stack.Navigator>
        <AppSnackbar
          showSnackBar={snackDetails.show}
          snackBarContent={snackDetails.content}
          dismissSnack={() => {
            setSnackDetails({
              ...{
                show: false,
                content: '',
              },
            });
          }}
        />
      </PaperProvider>
    </NavigationContainer>
  );
}

export default App;
