import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import OrderType from './OrderType';
import OrderForm from './OrderForm';
import IncomingOrderForm from './Incoming/IncomingOrderForm';

class NewOrder extends Component {
  state = {
    orderType: 'outgoing'
  }

  onPressOrderType(type) {
    this.setState({ orderType: type });
  }

  renderOrderForm() {
    if (this.state.orderType === 'outgoing') {
      return (
        <OrderForm setModalVisible={this.props.setModalVisible} />
      );
    } else if (this.state.orderType === 'incoming') {
      return (
        <IncomingOrderForm setModalVisible={this.props.setModalVisible} />
      );
    }
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <OrderType
          orderType={this.state.orderType}
          onPressOrderType={this.onPressOrderType.bind(this)}
        />
        {this.renderOrderForm()}
      </View>
    )
  }
}

export default NewOrder;
