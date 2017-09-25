import React, { Component } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';

const OrderType = (props) => {
      if (props.orderType === 'outgoing') {
        return (
            <View style={styles.containerStyle}>
              <TouchableOpacity onPress={() => props.onPressOrderType('outgoing')} style={styles.buttonStyle}>
                <Text style={styles.textStyle}>
                  Outgoing
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => props.onPressOrderType('incoming')} style={styles.buttonStyleUnselected}>
                <Text style={styles.textStyleUnselected}>
                  Incoming
                </Text>
              </TouchableOpacity>
            </View>
        );
      }
      return (
          <View style={styles.containerStyle}>
            <TouchableOpacity onPress={() => props.onPressOrderType('outgoing')} style={styles.buttonStyleUnselected}>
              <Text style={styles.textStyleUnselected}>
                Outgoing
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => props.onPressOrderType('incoming')} style={styles.buttonStyle}>
              <Text style={styles.textStyle}>
                Incoming
              </Text>
            </TouchableOpacity>
          </View>
      );
}

const styles = {
  containerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textStyle: {
    alignSelf: 'center',
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    paddingTop: 10,
    paddingBottom: 10
  },
  textStyleUnselected: {
    alignSelf: 'center',
    color: '#ddd',
    fontSize: 16,
    fontWeight: '600',
    paddingTop: 10,
    paddingBottom: 10
  },
  buttonStyle: {
    flex: 1,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DB2728',
  },
  buttonStyleUnselected: {
    flex: 1,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
};

export default OrderType;
