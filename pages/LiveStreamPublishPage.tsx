import React from "react";
import { ScrollView, View } from "react-native";
import { Text, TextInput, Button, RadioButton } from "react-native-paper";
import { PostApiMethod } from "../utils/AxiosHelper";
import AppSnackbar from "../components/AppSnackbar";

function LiveStreamPublishPage({ navigation }: any): React.JSX.Element {
  const [snackDetails, setSnackDetails] = React.useState<{
    show: boolean;
    content: string;
  }>({ show: false, content: "" });
  const [streamUrl, setStreamUrl] = React.useState("");
  const [streamId, setStreamId] = React.useState("");
  const [streamName, setStreamName] = React.useState("");
  const [value, setValue] = React.useState("liveStream");
  const publishStream = React.useCallback(() => {
    PostApiMethod("request?_path=WebRTCAppEE/rest/v2/broadcasts/create", {
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
      type: value === "streamSource" ? "streamSource" : "liveStream",
      publishType: "WebRTC",
      status: "broadcasting",
      playListStatus: "broadcasting",
    })
      .then((response) => {
        navigation.navigate("LiveStreamListPage", response.data);
      })
      .catch(function (error: any) {
        setSnackDetails({
          ...{
            show: true,
            content: "Fail to create AntMedia live stream list",
          },
        });
        console.log(error.message);
      });
  }, [streamUrl, streamId, streamName, navigation, value]);

  return (
    <>
      <ScrollView style={{ margin: 25 }} showsHorizontalScrollIndicator={false}>
        <Text variant="headlineSmall">Create Stream!</Text>
        <Text
          variant="labelLarge"
          style={{ marginVertical: 25, alignSelf: "center" }}
        >
          Enter your {value === "streamSource" ? "RTSP link, " : ""}Stream Id,
          Stream Name
        </Text>
        <RadioButton.Group
          onValueChange={(newValue) => setValue(newValue)}
          value={value}
        >
          <View>
            <Text>Live Stream</Text>
            <RadioButton value="liveStream" />
          </View>
          <View>
            <Text>StreamSource</Text>
            <RadioButton value="streamSource" />
          </View>
        </RadioButton.Group>
        {value === "streamSource" && (
          <TextInput
            style={{ margin: 15 }}
            label="rtsp://url"
            mode="outlined"
            onChangeText={(text) => setStreamUrl(text)}
          />
        )}
        <TextInput
          style={{ margin: 15 }}
          label="Stream Name"
          mode="outlined"
          onChangeText={(text) => setStreamName(text)}
        />
        <TextInput
          style={{ margin: 15 }}
          label="Stream ID"
          mode="outlined"
          onChangeText={(text) => setStreamId(text)}
        />
        <Button
          style={{ margin: 15 }}
          icon="send"
          mode="contained"
          onPress={publishStream}
        >
          Create Stream
        </Button>
      </ScrollView>
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

// const styles = StyleSheet.create({});

export default LiveStreamPublishPage;
