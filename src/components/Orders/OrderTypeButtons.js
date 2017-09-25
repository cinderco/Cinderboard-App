import React, { Component } from 'react';
import { Text, View, TextInput, Dimensions } from 'react-native';
import OrderTypeButton from './OrderTypeButton';
import OrderTypeButtonSelected from './OrderTypeButtonSelected';

const { height, width } = Dimensions.get('window');

class OrderTypeButtons extends Component {
  render() {
    const style = `input${this.props.error}`;

    if (this.props.otherBlah === 'Freight') {
      return (
        <View style={styles.containerStyle}>
          <OrderTypeButtonSelected
            onPress={this.props.onPressFreight.bind(this)}
            icon={'package'}
            source={'octicon'}
          >
            Freight
          </OrderTypeButtonSelected>

          <OrderTypeButton
            onPress={this.props.onPressDelivery.bind(this)}
            icon={'truck'}
            source={'font-awesome'}
          >
            Delivery
          </OrderTypeButton>

          <OrderTypeButton
            onPress={this.props.onPressWillCall.bind(this)}
            icon={'user'}
            source={'font-awesome'}
          >
            Will Call
          </OrderTypeButton>
        </View>
      );
    } else if (this.props.otherBlah === 'Delivery') {
      return (
        <View style={styles.containerStyle}>
          <OrderTypeButton
            onPress={this.props.onPressFreight.bind(this)}
            icon={'package'}
            source={'octicon'}
          >
            Freight
          </OrderTypeButton>

          <OrderTypeButtonSelected
            onPress={this.props.onPressDelivery.bind(this)}
            icon={'truck'}
            source={'font-awesome'}
          >
            Delivery
          </OrderTypeButtonSelected>

          <OrderTypeButton
            onPress={this.props.onPressWillCall.bind(this)}
            icon={'user'}
            source={'font-awesome'}
          >
            Will Call
          </OrderTypeButton>
        </View>
      );
    } else if (this.props.otherBlah === 'Will Call') {
      return (
        <View style={styles.containerStyle}>
          <OrderTypeButton
            onPress={this.props.onPressFreight.bind(this)}
            icon={'package'}
            source={'octicon'}
          >
            Freight
          </OrderTypeButton>

          <OrderTypeButton
            onPress={this.props.onPressDelivery.bind(this)}
            icon={'truck'}
            source={'font-awesome'}
          >
            Delivery
          </OrderTypeButton>

          <OrderTypeButtonSelected
            onPress={this.props.onPressWillCall.bind(this)}
            icon={'user'}
            source={'font-awesome'}
          >
            Will Call
          </OrderTypeButtonSelected>
        </View>
      );
    }
      return (
        <View style={styles.containerStyle}>
          <OrderTypeButton
            onPress={this.props.onPressFreight.bind(this)}
            icon={'package'}
            source={'octicon'}
          >
            Freight
          </OrderTypeButton>

          <OrderTypeButton
            onPress={this.props.onPressDelivery.bind(this)}
            icon={'truck'}
            source={'font-awesome'}
          >
            Delivery
          </OrderTypeButton>

          <OrderTypeButton
            onPress={this.props.onPressWillCall.bind(this)}
            icon={'user'}
            source={'font-awesome'}
          >
            Will Call
          </OrderTypeButton>
        </View>
      );
  }
}

const styles = {
  containerStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    alignSelf: 'center',
    paddingVertical: 15
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 10,
    height: 50,
    backgroundColor: 'white'
  },
  inputError: {
    flex: 1,
    fontSize: 16,
    padding: 10,
    borderWidth: 1,
    height: 50,
    borderRadius: 5,
    borderColor: 'red',
    backgroundColor: 'white'
  }
};

export default OrderTypeButtons;
