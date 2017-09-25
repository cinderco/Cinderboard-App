import React from 'react';
import { Text, View, Modal } from 'react-native';
import { Button } from './Button';

const ConfirmModal = (props) => {
  return (
    <Modal
      visible={props.visible}
      transparent
      animationType="none"
      onRequestClose={() => {}}
    >
      <View style={styles.containerStyle}>
        <View style={styles.cardSectionStyle}>
          <View style={{ flex: 1, justifyContent: 'center', padding: 5 }}>
            <Text style={styles.textStyle}>{props.children}</Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Button onPress={props.onAccept}>{props.buttonText}</Button>
            <Button onPress={props.onDecline}>Cancel</Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = {
  cardSectionStyle: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: 300,
    height: 175,
    padding: 5,
    backgroundColor: '#fff',
    flexDirection: 'column',
    borderRadius: 5
  },
  textStyle: {
    flex: 1,
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 40,
    alignSelf: 'center'
  },
  containerStyle: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    position: 'relative',
    flex: 1,
    justifyContent: 'center'
  }
};

export { ConfirmModal };
