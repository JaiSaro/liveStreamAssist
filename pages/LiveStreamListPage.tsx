import React from 'react';
import {Button, List} from 'react-native-paper';
import {GetApiMethod} from '../utils/AxiosHelper';
import AppSnackbar from '../components/AppSnackbar';

function LiveStreamListPage({navigation}: any) {
  const [streamList, setStreamList] = React.useState<Array<any>>([]);
  const [snackDetails, setSnackDetails] = React.useState<{
    show: boolean;
    content: string;
  }>({show: false, content: ''});

  const getStreamList = React.useCallback(() => {
    GetApiMethod('request?_path=WebRTCAppEE/rest/v2/broadcasts/list/0/10')
      .then(response => {
        if (response.data && response.data.length) {
          setStreamList(response.data);
        } else {
          setStreamList([]);
        }
      })
      .catch(function (error: any) {
        setSnackDetails({
          ...{
            show: true,
            content: 'Fail to fetch AntMedia live stream list',
          },
        });
        console.log(error.message);
      });
  }, []);

  React.useEffect(() => {
    getStreamList();
  }, [getStreamList]);
  return (
    <>
      <Button
        icon="publish"
        mode="contained-tonal"
        style={{marginHorizontal: 30, marginVertical: 20}}
        onPress={() => navigation.navigate('LiveStreamPublishPage')}>
        New Live Stream
      </Button>

      <List.Section>
        <List.Subheader>WebRTCAppEE Stream List</List.Subheader>
        {streamList.map(streamData => (
          <List.Item
            key={'StreamId-' + streamData.streamId}
            title={streamData.name}
            style={{marginLeft: 30}}
            description={'StreamId: ' + streamData.streamId}
            left={() => <List.Icon icon="video" />}
            onPress={() =>
              navigation.navigate('LiveStreamViewerPage', streamData)
            }
          />
        ))}
      </List.Section>
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

export default LiveStreamListPage;
