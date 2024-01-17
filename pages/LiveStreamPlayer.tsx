import React, { useCallback, useRef, useState, useEffect } from "react";

import {
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  Text,
} from "react-native";
import { useAntMedia, rtc_view } from "@antmedia/react-native-ant-media";
import { PutApiMethod } from "../utils/AxiosHelper";
import AppSnackbar from "../components/AppSnackbar";

export default function LiveStreamPlayer({
  route,
  navigation,
}: any): React.JSX.Element {
  const paramsValue = route.params;
  const defaultStreamName = paramsValue?.streamId ? paramsValue?.streamId : "";
  const webSocketUrl =
    "wss://ams-11462.antmedia.cloud:5443/WebRTCAppEE/websocket";

  const streamNameRef = useRef<string>(defaultStreamName);
  const [remoteMedia, setRemoteStream] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [snackDetails, setSnackDetails] = React.useState<{
    show: boolean;
    content: string;
  }>({ show: false, content: "" });
  const [isRecording, setIsRecording] = React.useState<boolean>(false);

  React.useEffect(() => {
    console.log("paramsValue?.mp4Enabled>>>", paramsValue?.mp4Enabled);
    if (paramsValue?.mp4Enabled > 0) {
      console.log("coming here>>>>>>>");
      setIsRecording(true);
    }
  }, [paramsValue.mp4Enabled]);

  const adaptor = useAntMedia({
    url: webSocketUrl,
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

  // React.useEffect(() => {
  //   return () => {
  //     if (adaptor && streamNameRef?.current) {
  //       adaptor.stop(streamNameRef?.current);
  //     }
  //   };
  // }, [adaptor]);

  useEffect(() => {
    if (adaptor && Object.keys(adaptor.remoteStreams).length > 0) {
      for (let i in adaptor.remoteStreams) {
        let st =
          adaptor.remoteStreams[i] && "toURL" in adaptor.remoteStreams[i]
            ? adaptor.remoteStreams[i].toURL()
            : null;
        setRemoteStream(st || "");
        break;
      }
    }
  }, [adaptor]);

  const handlePlay = useCallback(() => {
    if (!adaptor) {
      return;
    }

    adaptor.play(streamNameRef.current);
  }, [adaptor]);

  const handleStop = useCallback(() => {
    if (!adaptor) {
      return;
    }
    adaptor.stop(streamNameRef.current);
  }, [adaptor]);

  const backToStreamListPage = useCallback(() => {
    if (adaptor) {
      adaptor.stop(streamNameRef.current);
    }
    navigation.navigate("LiveStreamListPage", {
      from: "liveStreamPlayer",
    });
  }, [navigation, adaptor]);

  const goToLiveStreamVideoList = useCallback(() => {
    if (adaptor) {
      adaptor.stop(streamNameRef.current);
    }
    navigation.navigate("LiveStreamVODListPage", {
      from: "liveStreamPlayer",
    });
  }, [navigation, adaptor]);

  const startStopMp4Recoding = useCallback(() => {
    PutApiMethod(
      `request?_path=WebRTCAppEE/rest/v2/broadcasts/${
        paramsValue?.streamId
      }/recording/${!isRecording}&recordType=mp4`,
      {}
    )
      .then((response) => {
        if (response?.data?.success) {
          setIsRecording(true);
          setSnackDetails({
            ...{
              show: true,
              content: "Mp4 Recording Started",
            },
          });
        } else {
          setSnackDetails({
            ...{
              show: true,
              content: response.data,
            },
          });
        }
      })
      .catch((error) => {
        console.log(error);
        setSnackDetails({
          ...{
            show: true,
            content: "Error in starting Mp4 Recording",
          },
        });
      });
  }, [paramsValue?.streamId, isRecording]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.box}>
        {!isPlaying ? (
          <>
            <TouchableOpacity onPress={handlePlay} style={styles.startButton}>
              <Text>Start Playing</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={goToLiveStreamVideoList}
              style={styles.startButton}
            >
              <Text>VoD List</Text>
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
            <TouchableOpacity
              onPress={backToStreamListPage}
              style={styles.button}
            >
              <Text>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={startStopMp4Recoding}
              style={styles.button}
            >
              <Text>{`${isRecording ? "Stop" : "Start"}  MP4 Recording`}</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    alignSelf: "center",
    width: "90%",
    height: "100%",
  },
  streamPlayer: {
    width: "100%",
    height: "80%",
    alignSelf: "center",
  },
  button: {
    alignItems: "center",
    backgroundColor: "#6750a4",
    padding: 10,
    paddingHorizontal: 20,
  },
  startButton: {
    alignItems: "center",
    backgroundColor: "#6750a4",
    padding: 10,
    top: 400,
  },
  heading: {
    alignSelf: "center",
  },
});
