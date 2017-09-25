import _ from 'lodash';
import React, { Component } from 'react';
import { ScrollView, View, Text, TouchableWithoutFeedback, TouchableOpacity, Platform } from 'react-native';
import { connect } from 'react-redux';
import { ConfirmAlert, Spinner, CardSection } from '../../common';
import { orderUpdate, outgoingSave, outgoingDelete } from '../../../actions';
import OrderForm from '../OrderForm';
import OrderStatusButtons from '../OrderStatusButtons';

class OrderEdit extends Component {
  static navigationOptions = {
    title: 'Edit Order',
    tabBar: {
      visible: false
    },
    header: ({ navigate }) => {
      return {
        style: {
          marginTop: Platform.OS === 'android' ? 24 : 0,
          backgroundColor: 'black',
        },
        tintColor: 'white'
      }
    }
  };

  state = {
    hidden: true
  }

  componentWillMount() {
    const order = this.props.order;
    _.each(order, (value, prop) => {
      this.props.orderUpdate({ prop, value });
    });
  }

  onPressProcessing() {
    this.props.orderUpdate({ prop: 'status', value: 'processing' });
    this.setState({ hidden: true });
  }

  onPressReady() {
    this.props.orderUpdate({ prop: 'status', value: 'ready' });
    this.setState({ hidden: true });
  }

  onPressComplete() {
    this.props.orderUpdate({ prop: 'status', value: 'complete' });
    this.setState({ hidden: true });
  }

  onButtonPress() {
    const { params } = this.props.navigation.state;
    const order = this.props.order;
    const { companyName, type, other, uid, status } = this.props;
    const newDate = this.props.newDate.toString();
    const date = order.date.toString();
    const companyNameOld = order.companyName;
    const typeOld = order.type;
    const otherOld = order.other;
    const statusOld = order.status;
    const { createDate, createdBy } = order;

    const changedValues = _.differenceWith(
      [{ companyName }, { type }, { other }, { newDate }, { status }],
      [{ companyName: companyNameOld }, { type: typeOld }, { other: otherOld }, { newDate: date }, { status: statusOld }],
       _.isEqual);

    const changedValuesTwo = () => {
      const changedValuesArr = ['changed '];
      const date1 = new Date(date).toLocaleDateString();
      const date2 = new Date(newDate).toLocaleDateString();

      for (let i = 0; i < changedValues.length; i++) {
        if (Object.keys(changedValues[i])[0] === 'companyName') {
            changedValuesArr.push(`company name from ${companyNameOld} to ${companyName}, `);
        } else if (Object.keys(changedValues[i])[0] === 'type') {
            changedValuesArr.push(`order from ${typeOld} to ${type}, `);
        } else if (Object.keys(changedValues[i])[0] === 'other') {
            changedValuesArr.push(`order type from ${otherOld} to ${other}, `);
        } else if (Object.keys(changedValues[i])[0] === 'newDate') {
            changedValuesArr.push(`order ${otherOld} date from ${date1} to ${date2}`);
        } else if (Object.keys(changedValues[i])[0] === 'status') {
            changedValuesArr.push(`order status from ${statusOld} to ${status}`);
        }
      }

      return changedValuesArr;
    };

    const changed = changedValuesTwo();

    this.props.outgoingSave({
      companyName, type, newDate, other, status, uid, createDate, changed, createdBy
    });
  }

  render() {
    const order = this.props.order;
    const orderTypeTwo = this.props.orderTypeTwo;

    if (this.props.loading) {
      return <Spinner size="large" loadingMessage="Saving Changes"/>;
    }
    return (
      <View style={{ paddingTop: 15, backgroundColor: '#292d29' }}>
        <OrderForm orderTypeTwo={orderTypeTwo} order={order} edit={true} />

        <View style={styles.containerStyle}>
          <CardSection
            style={{
              justifyContent: 'center',
              borderBottomWidth: 1,
              marginTop: 15
            }}
          >
            <Text style={styles.labelStyle}>Order Status</Text>
          </CardSection>
          <TouchableWithoutFeedback onPress={() => this.setState({ hidden: false })}>
            <OrderStatusButtons
              {...this.props}
              hidden={this.state.hidden}
              onPressProcessing={this.onPressProcessing.bind(this)}
              onPressReady={this.onPressReady.bind(this)}
              onPressComplete={this.onPressComplete.bind(this)}
            />
          </TouchableWithoutFeedback>
        </View>

        <View style={{ paddingHorizontal: 20, flexDirection: 'row', marginVertical: 20 }}>
          <TouchableOpacity
            onPress={this.onButtonPress.bind(this)}
            style={{
              height: 50,
              flex: 1,
              alignSelf: 'stretch',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: 'red',
              borderRadius: 5
            }}
          >
            <Text>Save</Text>
          </TouchableOpacity>
            <ConfirmAlert message='Are you sure you want to delete this order?' order={order} />
        </View>

      </View>
    );
  }
}

const styles = {
  containerStyle: {
    flexDirection: 'column',
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: 'white',
    paddingBottom: 5
  },
  labelStyle: {
    color: '#DB2728',
    paddingBottom: 5,
    fontSize: 16
  }
};

const mapStateToProps = (state) => {
  const { companyName, type, other, uid, newDate, status, loading } = state.orderForm;

  return { companyName, type, other, uid, newDate, status, loading };
};

export default connect(mapStateToProps, {
  orderUpdate, outgoingSave, outgoingDelete
})(OrderEdit);
