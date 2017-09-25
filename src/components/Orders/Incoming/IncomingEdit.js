import _ from 'lodash';
import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { Button, ConfirmAlert } from '../../common';
import { orderUpdate, incomingSave, incomingDelete } from '../../../actions';
import OrderForm from '../OrderForm';

class IncomingEdit extends Component {
  componentWillMount() {
    _.each(this.props.order, (value, prop) => {
      this.props.orderUpdate({ prop, value });
    });
  }

  onButtonPress() {
    const { type, newDate } = this.props;

    this.props.incomingSave({ type, newDate, uid: this.props.order.uid });
  }

  render() {
    if (this.props.loading) {
      return <Spinner size="large" loadingMessage="Saving Changes"/>;
    }
    return (
      <ScrollView style={{ marginTop: 65, marginBottom: 50 }}>
        <OrderForm {...this.props} />

        <Button onPress={this.onButtonPress.bind(this)}>
          Save Changes
        </Button>

        <ConfirmAlert message='Are you sure you want to delete this order?' {...this.props} />
      </ScrollView>
    );
  }
}

const mapStateToProps = (state) => {
  const { type, newDate, other, loading } = state.orderForm;

  return { type, newDate, other, loading };
};

export default connect(mapStateToProps, {
  orderUpdate, incomingSave, incomingDelete
})(IncomingEdit);
