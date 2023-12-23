import React from 'react';
import {View} from 'react-native';
import {
  Text,
  Divider,
  Chip,
  TextInput,
  Button,
  Snackbar,
} from 'react-native-paper';

function LiveStreamPublishPage(): React.JSX.Element {
  const [isWebRTCStream, setIsWebRTCStream] = React.useState(false);
  const [isYouTubeStream, setIsYoutubeStream] = React.useState(false);
  const [showSnack, setShowSnack] = React.useState(false);

  const publishStream = React.useCallback(() => {}, []);

  return (
    <>
      <View style={{margin: 20}}>
        <Text variant="headlineSmall">Publish Stream!</Text>
        <Text variant="labelLarge">
          Enter your rtsp link and choose the viewer option.
        </Text>
        <Divider />
        <View>
          <Chip
            onPress={() => {
              setIsWebRTCStream(!isWebRTCStream);
            }}
            style={{marginRight: 8}}
            selected={isWebRTCStream}>
            Webrtc Stream
          </Chip>
          <Chip
            onPress={() => {
              setIsYoutubeStream(!isYouTubeStream);
            }}
            style={{marginRight: 8}}
            selected={isYouTubeStream}>
            Youtube Live
          </Chip>
        </View>
        <Divider />
        <TextInput style={{margin: 15}} label="rtsp://link" mode="outlined" />
        <Button
          style={{margin: 15}}
          icon="send"
          mode="contained"
          onPress={publishStream}>
          Publish Stream
        </Button>
      </View>
      <Snackbar
        visible={showSnack}
        onDismiss={() => {
          setShowSnack(!showSnack);
        }}
        action={{
          label: 'Dismiss',
          onPress: () => {
            // Do side magic
          },
        }}
        duration={Snackbar.DURATION_LONG}>
        Stream Started to Publish!
      </Snackbar>
    </>
  );
}

// const styles = StyleSheet.create({});

export default LiveStreamPublishPage;
