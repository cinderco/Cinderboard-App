import React, { Component } from 'react';
import { ScrollView, View } from 'react-native';
import { connect } from 'react-redux';
import { Button, Spinner } from '../../common';
import { orderUpdate, outgoingCreate, clearForm } from '../../../actions';
import OrderForm from '../OrderForm';
import OrderFormIncoming from '../OrderFormIncoming';
import OrderType from '../OrderType';

class OrderCreate extends Component {
  static navigationOptions = {
    title: 'New Order',
    header: (navigation, defaultHeader) => ({
        ...defaultHeader,
        style: {
            backgroundColor: 'black'
        },
        tintColor: 'white'
    }),
    tabBar: {
      visible: false
    }
  };

  state = {
    orderType: 'outgoing'
  }

  componentWillMount() {
    this.props.clearForm(this.props.orderType);
  }

  onPressOrderType(type) {
    this.setState({ orderType: type})
  }

  render() {
    if (this.props.loading) {
      return (
        <Spinner loadingMessage={'Creating Order'} />
      );
    } else if (this.state.orderType === 'outgoing') {
      return (
        <View
          style={{ backgroundColor: '#292d29', flex: 1 }}
        >
          <OrderType onPressOrderType={this.onPressOrderType.bind(this)} orderType={this.state.orderType} />
          <OrderForm {...this.props} navigation={this.props.navigation} />
        </View>
      );
    }
    return (
      <View
        style={{ backgroundColor: '#292d29', flex: 1 }}
      >
        <OrderType onPressOrderType={this.onPressOrderType.bind(this)} orderType={this.state.orderType} />
        <OrderFormIncoming {...this.props} navigation={this.props.navigation} />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const { companyName, type, newDate, other, orderType, loading } = state.orderForm;

  return { companyName, type, newDate, other, orderType, loading };
};

export default connect(mapStateToProps, {
  orderUpdate, outgoingCreate, clearForm
})(OrderCreate);
