import React from 'react';
import { View, Text, TouchableHighlight, Alert, Dimensions } from 'react-native';
import { Icon } from 'react-native-elements';

const { height, width } = Dimensions.get('window');

const ConfirmAlert = (props) => {
  const alertMessage = props.message;
  const uid = props.order.uid;

    if (props.order.orderType === 'outgoing') {
      return (
        <TouchableHighlight
              style={styles.wrapper}
              onPress={() => Alert.alert(
                'Delete',
                alertMessage,
                [
                  { text: 'Cancel', onPress: () => console.log('Canceled') },
                  { text: 'OK', onPress: () => props.outgoingDelete({ uid, setModalVisible: props.setModalVisible }) },
                ]
              )}
        >
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: 'red',
                borderRadius: 5,
                backgroundColor: 'red'
              }}
            >
              <Icon
                name='trash'
                type='font-awesome'
                color='white'
              />
          </View>
        </TouchableHighlight>
      );
    }
    return (
      <TouchableHighlight
            style={styles.wrapper}
            onPress={() => Alert.alert(
              'Delete',
              alertMessage,
              [
                { text: 'Cancel', onPress: () => console.log('Canceled') },
                { text: 'OK', onPress: () => props.incomingDelete({ uid, setModalVisible: props.setModalVisible }) },
              ]
            )}
      >
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 5,
              backgroundColor: 'red'
            }}
          >
            <Icon
              name='trash'
              type='font-awesome'
              color='white'
            />
        </View>
      </TouchableHighlight>
    );
};

const styles = {
  wrapper: {
    borderRadius: 5,
    marginBottom: 10,
    height: 40,
    width: (width - 20) / 3
  },
  button: {
    backgroundColor: '#eeeeee',
    padding: 10,
  },
  textStyle: {
    alignSelf: 'center',
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    paddingTop: 10,
    paddingBottom: 10
  },
  buttonStyle: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: 'red',
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 5,
    borderRadius: 5
  }
};

export { ConfirmAlert };
