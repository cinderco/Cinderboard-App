import moment from 'moment';
import React from 'react';
import { View, Text } from 'react-native';

const Message = (props) => {
  const date = moment(props.date).format('llll');

  if (props.position === 'right') {
    return (
      <View>
        <Text style={styles.textNameRight}>{props.name}</Text>
        <View style={[styles.containerStyleRight, props.style]}>
          <Text style={styles.textStyleRight}>{props.children}</Text>
        </View>
      </View>
    );
  }
  return (
    <View>
      <Text style={styles.textNameLeft}>{props.name}</Text>
      <View style={[styles.containerStyleLeft, props.style]}>
        <Text style={styles.textStyleLeft}>{props.children}</Text>
      </View>
    </View>
  );
};

const styles = {
  containerStyleLeft: {
    paddingHorizontal: 18,
    paddingVertical: 5,
    backgroundColor: '#E6E5EB',
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    maxWidth: 300,
    justifyContent: 'center',
    marginBottom: 25,
    borderRadius: 20
  },
  textStyleLeft: {
    color: 'black',
    fontSize: 16
  },
  containerStyleRight: {
    paddingHorizontal: 18,
    paddingVertical: 5,
    backgroundColor: '#147CFA',
    alignItems: 'center',
    alignSelf: 'flex-end',
    flexDirection: 'row',
    maxWidth: 300,
    justifyContent: 'center',
    marginBottom: 25,
    borderRadius: 20,
    flexDirection: 'column'
  },
  textStyleRight: {
    color: 'white',
    fontSize: 16
  },
  textNameRight: {
    alignSelf: 'flex-end',
    fontSize: 12
  },
  textDate: {
    alignSelf: 'center',
    fontSize: 12
  },
  textNameLeft: {
    alignSelf: 'flex-start'
  }
};

export { Message };
