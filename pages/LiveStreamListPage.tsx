import React from 'react';
import {Button, List, Text} from 'react-native-paper';
import {GetApiMethod} from '../utils/AxiosHelper';
import AppSnackbar from '../components/AppSnackbar';

function LiveStreamListPage({route, navigation}: any) {
  const routeParamsValue = route.params;
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
    if (routeParamsValue?.name && routeParamsValue?.streamId) {
      setSnackDetails({
        ...{
          show: true,
          content:
            'AntMedia live stream list created successfully - ' +
            routeParamsValue.name +
            ' (' +
            routeParamsValue.streamId +
            ')',
        },
      });
    }
    getStreamList();
  }, [routeParamsValue, getStreamList]);

  return (
    <>
      <Button
        icon="publish"
        mode="contained-tonal"
        style={{marginHorizontal: 30, marginVertical: 20}}
        onPress={() => navigation.navigate('LiveStreamPublishPage')}>
        New Live Stream
      </Button>
      {streamList && streamList.length ? (
        <List.Section>
          <List.Subheader>WebRTCAppEE Stream List</List.Subheader>
          {streamList.map(streamData => (
            <List.Item
              key={'StreamId-' + streamData?.streamId}
              title={streamData?.name}
              style={{marginLeft: 30}}
              description={'StreamId: ' + streamData?.streamId}
              left={() => <List.Icon icon="video" />}
              right={() => (
                <>
                  <Text variant="bodySmall">
                    Status:{' '}
                    {streamData?.status === 'broadcasting'
                      ? 'Broadcasting'
                      : 'Offline'}
                  </Text>
                </>
              )}
              onPress={() =>
                navigation.navigate('LiveStreamViewerPage', streamData)
              }
            />
          ))}
        </List.Section>
      ) : (
        <Text variant="titleMedium" style={{margin: 120}}>
          No Live Stream
        </Text>
      )}
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
