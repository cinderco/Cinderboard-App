import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { Spinner } from '../../common';
import { orderUpdate, incomingCreate, clearForm } from '../../../actions';
import OrderForm from '../OrderForm';

class IncomingCreate extends Component {
  componentWillMount() {
    this.props.clearForm(this.props.orderType);
  }

  onButtonPress() {
    const { type, newDate } = this.props;

    this.props.incomingCreate({ type, newDate });
  }

  render() {
    if (this.props.loading) {
      return (
        <Spinner loadingMessage={'Creating Order'} />
      );
    }
    return (
      <ScrollView style={{ marginTop: 64, paddingTop: 30 }}>
          <OrderForm {...this.props} />
      </ScrollView>
    );
  }
}

const mapStateToProps = (state) => {
  const { companyName, type, newDate, orderType, loading } = state.orderForm;

  return { companyName, type, newDate, orderType, loading };
};

export default connect(mapStateToProps, {
  orderUpdate, incomingCreate, clearForm
})(IncomingCreate);
