import React from "react";
import { Button, List, Text } from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";
import { GetApiMethod } from "../utils/AxiosHelper";
import AppSnackbar from "../components/AppSnackbar";
import { authenticateAntMediaAPI } from "../utils/AuthenticateHelper";

function LiveStreamVODListPage({ route, navigation }: any) {
  const routeParamsValue = route.params;
  const [streamVodList, setStreamVodList] = React.useState<Array<any>>([]);
  const [snackDetails, setSnackDetails] = React.useState<{
    show: boolean;
    content: string;
  }>({ show: false, content: "" });
  const isFocused = useIsFocused();

  const getStreamList = React.useCallback(() => {
    GetApiMethod(
      "request?_path=WebRTCAppEE/rest/v2/vods/list/0/10&sort_by=&order_by="
    )
      .then((response) => {
        if (response.data && response.data.length) {
          setStreamVodList(response.data);
        } else {
          setStreamVodList([]);
        }
      })
      .catch(function (error: any) {
        setSnackDetails({
          ...{
            show: true,
            content: "Fail to fetch AntMedia live stream list",
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
          console.log(error.message);
          setSnackDetails({
            ...{
              show: true,
              content: "Fail to authenticate with AntMedia",
            },
          });
          console.log(error.message);
        });
    }
  }, [isFocused]);

  React.useEffect(() => {
    if (
      routeParamsValue?.name &&
      routeParamsValue?.streamId &&
      routeParamsValue?.from &&
      routeParamsValue?.from === "deleteStream"
    ) {
      setSnackDetails({
        ...{
          show: true,
          content:
            "AntMedia live stream list created successfully - " +
            routeParamsValue.name +
            " (" +
            routeParamsValue.streamId +
            ")",
        },
      });
    }
    if (
      routeParamsValue?.from &&
      routeParamsValue?.from === "startstopBroadCast" &&
      routeParamsValue?.message === null &&
      routeParamsValue?.isStart
    ) {
      setSnackDetails({
        ...{
          show: true,
          content:
            "Broadcast started kindly refresh the stream list to get updated.",
        },
      });
    }
    if (
      routeParamsValue?.from &&
      routeParamsValue?.from === "addRTMPEndpoint"
    ) {
      setSnackDetails({
        ...{
          show: true,
          content: routeParamsValue?.message
            ? routeParamsValue?.message
            : "Added the rtmp endpoint to this broadcast",
        },
      });
    }
    getStreamList();
  }, [routeParamsValue, getStreamList]);

  return (
    <>
      <List.Section>
        <Button
          icon="refresh"
          style={{ marginHorizontal: 30 }}
          mode="text"
          onPress={() => getStreamList()}
        >
          Refresh List
        </Button>
        <List.Subheader>WebRTCAppEE Stream List</List.Subheader>
        {streamVodList && streamVodList.length ? (
          streamVodList.map((streamData, index) => (
            <List.Item
              key={"StreamId-" + streamData?.streamId + index}
              title={streamData?.name}
              style={{ marginLeft: 30 }}
              description={"Recorded Stream - " + streamData?.vodId}
              left={() => <List.Icon icon="video" />}
              // right={() => (
              //   <Text variant="bodySmall">{streamData?.vodName}</Text>
              // )}
              onPress={() => {
                navigation.navigate("VodPlayer", streamData);
              }}
            />
          ))
        ) : (
          <Text variant="titleMedium" style={{ margin: 120 }}>
            No Recorded VoD
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
              content: "",
            },
          });
        }}
      />
    </>
  );
}

export default LiveStreamVODListPage;
