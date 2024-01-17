import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import Video from 'react-native-video';
import Clipboard from '@react-native-clipboard/clipboard';

function VodPlayer({ route, navigation }: any) {
  const routeParamsValue: any = route.params;
  console.log(routeParamsValue.streamId);
  const videoRef = React.useRef<any>(null);

  const copyToClipboard = (vodName: string) => {
    Clipboard.setString(
      `https://ams-11462.antmedia.cloud:5443/WebRTCAppEE/play.html?id=streams/${vodName}`
    );
  };
  return (
    <>
      <Text
        variant="titleMedium"
        style={styles.titleText}
      >{`Recorded Stream - ${routeParamsValue?.vodId}`}</Text>
      <Text
        variant="titleMedium"
        style={styles.titleText}
      >{`Stream ID - ${routeParamsValue?.streamId}`}</Text>
      <Video
        // Can be a URL or a local file.
        source={{
          uri: `https://ams-11462.antmedia.cloud:5443/WebRTCAppEE/play.html?id=streams/${routeParamsValue.vodName}`,
          type: 'mp4',
          headers: {
            range: 'bytes=0-',
          },
        }}
        // Store reference
        ref={videoRef}
        // Callback when remote video is buffering
        onBuffer={() => {
          console.log('On Buffer');
        }}
        // Callback when video cannot be loaded
        onError={(error) => {
          console.log('On Error', error);
        }}
        style={styles.backgroundVideo}
      />
      {/* <TouchableOpacity
        onPress={() => copyToClipboard(routeParamsValue.vodName)}
      >
        <Text>Click here to copy to Clipboard</Text>
      </TouchableOpacity> */}
      <Button
        style={{ marginHorizontal: 30 }}
        mode="text"
        onPress={() => copyToClipboard(routeParamsValue.vodName)}
      >
        Click here to copy video URL to clipboard
      </Button>
    </>
  );
}

// Later on in your styles..
var styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    paddingBottom: 30,
  },
  titleText: {
    paddingBottom: 50,
    paddingHorizontal: 10,
  },
  copiedText: {
    marginTop: 10,
    color: 'red',
  },
});

export default VodPlayer;
