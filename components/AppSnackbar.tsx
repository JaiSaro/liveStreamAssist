import React from 'react';
import {Snackbar} from 'react-native-paper';

function AppSnackbar({
  showSnackBar,
  snackBarContent,
  dismissSnack,
}: {
  showSnackBar: boolean;
  snackBarContent: string;
  dismissSnack: () => void;
}): React.JSX.Element {
  const [showSnack, setShowSnack] = React.useState(false);

  React.useEffect(() => {
    setShowSnack(showSnackBar);
  }, [showSnackBar]);

  return (
    <Snackbar
      visible={showSnack}
      onDismiss={() => {
        setShowSnack(!showSnack);
        dismissSnack();
      }}
      action={{
        label: 'Dismiss',
        onPress: () => {
          // Do side magic
        },
      }}
      duration={Snackbar.DURATION_LONG}>
      {snackBarContent}
    </Snackbar>
  );
}

export default AppSnackbar;
