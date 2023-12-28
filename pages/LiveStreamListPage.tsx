import React from 'react';
import {Button, List, Text} from 'react-native-paper';
import {useIsFocused} from '@react-navigation/native';
import {GetApiMethod} from '../utils/AxiosHelper';
import AppSnackbar from '../components/AppSnackbar';
import {authenticateAntMediaAPI} from '../utils/AuthenticateHelper';

function LiveStreamListPage({route, navigation}: any) {
  const routeParamsValue = route.params;
  const [streamList, setStreamList] = React.useState<Array<any>>([]);
  const [snackDetails, setSnackDetails] = React.useState<{
    show: boolean;
    content: string;
  }>({show: false, content: ''});
  const isFocused = useIsFocused();

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
    if (isFocused) {
      authenticateAntMediaAPI()
        .then(function (response: any) {
          console.log(response.data);
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
    }
  }, [isFocused]);

  React.useEffect(() => {
    console.log('routeParamsValue>>>', routeParamsValue);
    if (
      routeParamsValue?.name &&
      routeParamsValue?.streamId &&
      routeParamsValue?.from &&
      routeParamsValue?.from === 'deleteStream'
    ) {
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
    if (
      routeParamsValue?.from &&
      routeParamsValue?.from === 'startstopBroadCast' &&
      routeParamsValue?.message === null &&
      routeParamsValue?.isStart
    ) {
      setSnackDetails({
        ...{
          show: true,
          content:
            'Broadcast started kindly refresh the stream list to get updated.',
        },
      });
    }
    if (
      routeParamsValue?.from &&
      routeParamsValue?.from === 'addRTMPEndpoint'
    ) {
      setSnackDetails({
        ...{
          show: true,
          content: routeParamsValue?.message
            ? routeParamsValue?.message
            : 'Added the rtmp endpoint to this broadcast',
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

      <List.Section>
        <Button
          icon="refresh"
          style={{marginHorizontal: 30}}
          mode="text"
          onPress={() => getStreamList()}>
          Refresh List
        </Button>
        <List.Subheader>WebRTCAppEE Stream List</List.Subheader>
        {streamList && streamList.length ? (
          streamList.map(streamData => (
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
          ))
        ) : (
          <Text variant="titleMedium" style={{margin: 120}}>
            No Live Stream
          </Text>
        )}
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
