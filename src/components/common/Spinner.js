import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

const Spinner = ({ size, loadingMessage }) => {
  const renderMessage = () => {
    if (loadingMessage) {
      return <Text style={{ marginTop: 15 }}>{loadingMessage}</Text>;
    }
    return (
      null
    );
  };

  return (
    <View style={styles.spinnerStyle}>
      <ActivityIndicator size={size || 'large'} />
      {renderMessage()}
    </View>
  );
};

const styles = {
  spinnerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
};

export { Spinner };
