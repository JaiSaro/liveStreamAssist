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
  // Dialog,
  // Portal,
} from 'react-native-paper';
import {PostApiMethod} from './utils/AxiosHelper';
import AppSnackbar from './components/AppSnackbar';

// import {ScrollView} from 'react-native';

const Stack = createNativeStackNavigator();
const theme = {
  ...DefaultTheme,
};

function App(): React.JSX.Element {
  const [snackDetails, setSnackDetails] = React.useState<{
    show: boolean;
    content: string;
  }>({show: false, content: ''});
  // const [visible, setVisible] = React.useState(false);
  // const [errorMessage, setErrorMessage] = React.useState('');
  // const hideDialog = () => setVisible(false);

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
        // setErrorMessage(error.message);
        console.log(error.message);
        // setVisible(true);
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
        {/* <Portal>
          <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.ScrollArea>
              <ScrollView contentContainerStyle={{paddingHorizontal: 24}}>
                <Text>Email: {process.env.REACT_APP_USER_EMAIL}</Text>
                <Text>User Type: {process.env.REACT_APP_USER_TYPE_KEY}</Text>
                <Text>Password: {process.env.REACT_APP_HASH_KEY}</Text>
                <Text>Error Message: {errorMessage}</Text>
              </ScrollView>
            </Dialog.ScrollArea>
          </Dialog>
        </Portal> */}
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
