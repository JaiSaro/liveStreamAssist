import React, { useCallback, useRef, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useAntMedia, rtc_view } from "@antmedia/react-native-ant-media";
import { Button, List, Portal, Text, TextInput } from "react-native-paper";
import { DeleteApiMethod, PostApiMethod } from "../utils/AxiosHelper";
import AppSnackbar from "../components/AppSnackbar";

function LiveStreamViewerPage({ route, navigation }: any): React.JSX.Element {
  const paramsValue = route.params;
  var defaultStreamName = paramsValue?.streamId ? paramsValue?.streamId : "";

  const streamNameRef = useRef<string>(defaultStreamName);
  const [remoteMedia, setRemoteStream] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [snackDetails, setSnackDetails] = React.useState<{
    show: boolean;
    content: string;
  }>({ show: false, content: "" });
  const [visible, setVisible] = React.useState(false);
  const [youTubeLiveUrl, setYouTubeLiveUrl] = React.useState("");
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  React.useEffect(() => {
    console.log("paramsValue>>>", paramsValue);
  }, [paramsValue]);

  const deleteStream = React.useCallback(() => {
    if (paramsValue?.streamId) {
      DeleteApiMethod(
        "request?_path=WebRTCAppEE/rest/v2/broadcasts/" + paramsValue?.streamId
      )
        .then((response) => {
          navigation.navigate("LiveStreamListPage", {
            from: "deleteStream",
            ...response.data,
          });
        })
        .catch(function (error: any) {
          setSnackDetails({
            ...{
              show: true,
              content: `Fail to delete ${paramsValue?.streamId} - live stream`,
            },
          });
          console.log(error.message);
        });
    }
  }, [paramsValue, navigation]);

  const startStopBroadCast = React.useCallback(
    (isStart = true) => {
      if (
        !isStart &&
        paramsValue?.endPointList &&
        paramsValue?.endPointList.length
      ) {
        setSnackDetails({
          ...{
            show: true,
            content: "Before Stopping Stream, stop YouTube Live.",
          },
        });
        return;
      }
      if (paramsValue?.streamId) {
        PostApiMethod(
          `request?_path=WebRTCAppEE/rest/v2/broadcasts/${
            paramsValue?.streamId
          }/${isStart ? "start" : "stop"}`,
          {}
        )
          .then((response) => {
            if (response?.data) {
              console.log(response.data);
              if (response?.data?.success) {
                navigation.navigate("LiveStreamListPage", {
                  from: "startstopBroadCast",
                  isStart: isStart,
                  ...response.data,
                });
              } else {
                setSnackDetails({
                  ...{
                    show: true,
                    content: response?.data?.message
                      ? response?.data?.message
                      : "Error in broadcasting",
                  },
                });
              }
            }
          })
          .catch(function (error: any) {
            setSnackDetails({
              ...{
                show: true,
                content: `Fail to ${isStart ? "start" : "stop"} ${
                  paramsValue?.streamId
                } - broadcast`,
              },
            });
            console.log(error.message);
          });
      }
    },
    [paramsValue, navigation]
  );

  const addRTMPEndpoint = React.useCallback(() => {
    if (paramsValue?.streamId) {
      PostApiMethod(
        `request?_path=WebRTCAppEE/rest/v2/broadcasts/${paramsValue?.streamId}/rtmp-endpoint`,
        { rtmpUrl: youTubeLiveUrl }
      )
        .then((response) => {
          if (response?.data) {
            if (response?.data?.success) {
              navigation.navigate("LiveStreamListPage", {
                from: "addRTMPEndpoint",
                ...response.data,
              });
            } else {
              setSnackDetails({
                ...{
                  show: true,
                  content: response?.data?.message
                    ? "Error: " + response?.data?.message
                    : "Error in adding rtmp endpoint",
                },
              });
            }
          }
          hideModal();
        })
        .catch(function (error: any) {
          setSnackDetails({
            ...{
              show: true,
              content: "Error in adding rtmp endpoint",
            },
          });
          console.log(error.message);
        });
    }
  }, [navigation, paramsValue?.streamId, youTubeLiveUrl]);

  const removeRTMPEndpoint = React.useCallback(
    (endpoint: any) => {
      if (paramsValue?.streamId && endpoint?.endpointServiceId) {
        DeleteApiMethod(
          `request?_path=WebRTCAppEE/rest/v2/broadcasts/${paramsValue?.streamId}/rtmp-endpoint&endpointServiceId=${endpoint.endpointServiceId}`
        )
          .then((response) => {
            if (response?.data) {
              if (response?.data?.success) {
                navigation.navigate("LiveStreamListPage", {
                  from: "addRTMPEndpoint",
                  ...response.data,
                });
              } else {
                setSnackDetails({
                  ...{
                    show: true,
                    content: response?.data?.message
                      ? "Error: " + response?.data?.message
                      : "Error in adding rtmp endpoint",
                  },
                });
              }
            }
            hideModal();
          })
          .catch(function (error: any) {
            setSnackDetails({
              ...{
                show: true,
                content: "Error in adding rtmp endpoint",
              },
            });
            console.log(error.message);
          });
      }
    },
    [navigation, paramsValue?.streamId]
  );

  const adaptor = useAntMedia({
    url: process.env.REACT_APP_WEBSOCKET_URL
      ? process.env.REACT_APP_WEBSOCKET_URL
      : "",
    mediaConstraints: {
      audio: true,
      video: {
        width: 640,
        height: 480,
        frameRate: 30,
        facingMode: "front",
      },
    },
    callback(command: any) {
      switch (command) {
        case "pong":
          break;
        case "play_started":
          console.log("play_started");
          setIsPlaying(true);
          break;
        case "play_finished":
          console.log("play_finished");
          //InCallManager.stop();
          setIsPlaying(false);
          setRemoteStream("");
          break;
        default:
          console.log(command);
          break;
      }
    },
    callbackError: (err: any, data: any) => {
      console.error("callbackError", err, data);
    },
    peer_connection_config: {
      iceServers: [
        {
          url: "stun:stun.l.google.com:19302",
        },
      ],
    },
    debug: true,
  });

  useEffect(() => {
    console.log("adaptor>>>", adaptor.remoteStreams);
    if (adaptor && Object.keys(adaptor.remoteStreams).length > 0) {
      for (let i in adaptor.remoteStreams) {
        let st =
          adaptor.remoteStreams[i] && "toURL" in adaptor.remoteStreams[i]
            ? adaptor.remoteStreams[i].toURL()
            : null;
        console.log("st>>>>>>>>", st);
        break;
      }
    }
  }, [adaptor]);

  const handlePlay = useCallback(() => {
    if (!adaptor) {
      return;
    }
    console.log(streamNameRef.current);
    adaptor.play(streamNameRef.current);
  }, [adaptor]);

  const handleStop = useCallback(() => {
    if (!adaptor) {
      return;
    }
    adaptor.stop(streamNameRef.current);
  }, [adaptor]);

  return (
    <SafeAreaView style={styles.container}>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          animationType="slide"
          style={{ margin: 20 }}
        >
          <View
            style={{
              height: "80%",
              marginTop: "auto",
            }}
          >
            <Text
              variant="titleLarge"
              style={{ alignSelf: "center", paddingHorizontal: 20 }}
            >
              Add RTMP Endpoint
            </Text>
            <TextInput
              style={{ margin: 15 }}
              label="YouTube Live Url"
              mode="outlined"
              onChangeText={(text) => setYouTubeLiveUrl(text)}
            />
            <List.Section>
              <List.Subheader>RTMP Endpoint List</List.Subheader>
              {paramsValue?.endPointList && paramsValue?.endPointList.length
                ? paramsValue?.endPointList.map((endpoint: any) => (
                    <>
                      <List.Item
                        key={"StreamId-" + endpoint?.endpointServiceId}
                        title={endpoint?.rtmpUrl}
                        description={
                          "ServiceId: " + endpoint?.endpointServiceId
                        }
                        right={() => (
                          <>
                            <Text variant="bodySmall">
                              Status:{" "}
                              {endpoint?.status === "broadcasting"
                                ? "Broadcasting"
                                : "Offline"}
                            </Text>
                          </>
                        )}
                      />
                      <Button
                        icon="delete"
                        mode="text"
                        onPress={() => removeRTMPEndpoint(endpoint)}
                      />
                    </>
                  ))
                : null}
            </List.Section>
            <Button icon="plus" mode="text" onPress={() => addRTMPEndpoint()}>
              Add RTMP Endpoint
            </Button>
            <Button icon="close" mode="text" onPress={() => hideModal()}>
              Close
            </Button>
          </View>
        </Modal>
      </Portal>
      <View style={styles.box}>
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 30,
            paddingTop: 10,
          }}
        >
          <Button icon="delete" mode="text" onPress={() => deleteStream()}>
            Delete
          </Button>
          <Button
            icon={paramsValue?.status === "broadcasting" ? "stop" : "play"}
            mode="text"
            onPress={() =>
              paramsValue?.status === "broadcasting"
                ? startStopBroadCast(false)
                : startStopBroadCast()
            }
          >
            {paramsValue?.status === "broadcasting"
              ? "Stop Broadcast"
              : "Start Broadcast"}
          </Button>
        </View>
        {paramsValue?.status === "broadcasting" && (
          <Button
            icon="youtube"
            mode="text"
            onPress={() => {
              if (paramsValue?.status === "broadcasting") {
                showModal();
              } else {
                setSnackDetails({
                  ...{
                    show: true,
                    content:
                      "Before Starting Youtube Stream, kindly broadcast first.",
                  },
                });
              }
            }}
          >
            {paramsValue?.endPointList && paramsValue?.endPointList.length
              ? "YouTube Live List"
              : "Start YouTube Live"}
          </Button>
        )}

        {paramsValue?.name && paramsValue?.streamId && paramsValue?.status ? (
          <>
            <Text variant="titleLarge" style={styles.heading}>
              {paramsValue?.name}
            </Text>
            <Text variant="titleMedium" style={styles.heading}>
              StreamId: {paramsValue?.streamId}
            </Text>
            <Text variant="titleSmall" style={styles.heading}>
              Status:{" "}
              {paramsValue?.status === "broadcasting"
                ? "Broadcasting"
                : "Offline"}
            </Text>
          </>
        ) : null}
        {!isPlaying ? (
          <>
            <TouchableOpacity onPress={handlePlay} style={styles.startButton}>
              <Text>Start Playing</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {remoteMedia ? (
              <>{rtc_view(remoteMedia, styles.streamPlayer)}</>
            ) : (
              <></>
            )}
            <TouchableOpacity onPress={handleStop} style={styles.button}>
              <Text>Stop Playing</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
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
    </SafeAreaView>
  );
}

export default LiveStreamViewerPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    alignSelf: "center",
    width: "80%",
    height: "100%",
  },
  streamPlayer: {
    width: "100%",
    height: "80%",
    alignSelf: "center",
  },
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
  },
  startButton: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
    top: 400,
  },
  heading: {
    alignSelf: "center",
  },
});
