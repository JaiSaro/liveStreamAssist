import React from 'react';
import {ScrollView} from 'react-native';
import {Text, TextInput, Button} from 'react-native-paper';
import {PostApiMethod} from '../utils/AxiosHelper';
import AppSnackbar from '../components/AppSnackbar';

function LiveStreamPublishPage({navigation}: any): React.JSX.Element {
  const [snackDetails, setSnackDetails] = React.useState<{
    show: boolean;
    content: string;
  }>({show: false, content: ''});
  const [streamUrl, setStreamUrl] = React.useState('');
  const [streamId, setStreamId] = React.useState('');
  const [streamName, setStreamName] = React.useState('');
  const publishStream = React.useCallback(() => {
    PostApiMethod('request?_path=WebRTCAppEE/rest/v2/broadcasts/create', {
      hlsViewerCount: 0,
      dashViewerCount: 0,
      webRTCViewerCount: 0,
      rtmpViewerCount: 0,
      mp4Enabled: 0,
      playlistLoopEnabled: true,
      playListItemList: [],
      streamUrl: streamUrl,
      streamId: streamId,
      name: streamName,
      type: 'streamSource',
      publishType: 'WebRTC',
      status: 'broadcasting',
      playListStatus: 'broadcasting',
    })
      .then(response => {
        navigation.navigate('LiveStreamListPage', response.data);
      })
      .catch(function (error: any) {
        setSnackDetails({
          ...{
            show: true,
            content: 'Fail to create AntMedia live stream list',
          },
        });
        console.log(error.message);
      });
  }, [streamUrl, streamId, streamName, navigation]);

  return (
    <>
      <ScrollView style={{margin: 25}} showsHorizontalScrollIndicator={false}>
        <Text variant="headlineSmall">Publish Stream!</Text>
        <Text variant="labelLarge" style={{marginTop: 10, alignSelf: 'center'}}>
          Enter your RTSP link, Stream Id, Stream Name
        </Text>
        <TextInput
          style={{margin: 15}}
          label="rtsp://url"
          mode="outlined"
          onChangeText={text => setStreamUrl(text)}
        />
        <TextInput
          style={{margin: 15}}
          label="Stream Name"
          mode="outlined"
          onChangeText={text => setStreamName(text)}
        />
        <TextInput
          style={{margin: 15}}
          label="Stream ID"
          mode="outlined"
          onChangeText={text => setStreamId(text)}
        />
        <Button
          style={{margin: 15}}
          icon="send"
          mode="contained"
          onPress={publishStream}>
          Publish Stream
        </Button>
      </ScrollView>
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
    </>
  );
}

// const styles = StyleSheet.create({});

export default LiveStreamPublishPage;
