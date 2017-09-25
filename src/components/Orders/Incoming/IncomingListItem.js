import React, { Component } from 'react';
import { Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import moment from 'moment';
import { CardSection, ConfirmModal } from '../../common';
import { incomingDelete, orderUpdate } from '../../../actions';
import ModalScene from '../../ModalScene';
import OrderDetails from '../Outgoing/OrderDetails';

class IncomingListItem extends Component {
  state = {
    swipeable: null,
    visible: false,
    isOpen: false,
    modalVisible: false
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  onListItemPress() {
    if (this.props.isOpen === false) {
      this.props.setModalVisible(true, this.props.order.uid);
    } else {
      this.props.setIsOpen(false);
      this.props.rowMap[`${this.props.secId}${this.props.rowId}`].closeRow();
    }
  }

  onDecline() {
    this.setState({
      visible: false
    });
  }

  onAccept() {
    const uid = this.props.order.uid;

    this.props.incomingDelete({ uid });
    this.setState({
      visible: false,
      isOpen: false
    });
  }

  makeModalVisible() {
    this.setState({
      visible: true
    });
  }

  renderDate() {
    if (this.props.order.date === 'Unknown') {
      return (
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: '600' }}>
            ?
          </Text>
        </View>
      )
    } else {
      const date = new Date();
      const shortDate = date.toLocaleDateString();
      const orderDate = new Date(this.props.order.date);
      const shortOrderDate = orderDate.toLocaleDateString();
      const start = moment().startOf('week').format('x');
      const end = moment().endOf('week').format('x');
      const today = moment().format('x');
      const dateTwo = moment(this.props.order.date).format('x');
      const dateDay = moment(this.props.order.date).format('ddd');

      if (shortOrderDate === shortDate) {
        return (
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 14, color: 'blue' }}>
              Today
            </Text>
          </View>
        );
      } else if (dateTwo < today) {
        return (
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 14, color: 'red' }}>
              {shortOrderDate}
            </Text>
          </View>
        );
      } else if (dateTwo >= start && dateTwo <= end) {
        return (
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 14 }}>
              {dateDay}
            </Text>
          </View>
        );
      }
      return (
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <Text style={{ fontSize: 14 }}>
            {shortOrderDate}
          </Text>
        </View>
      );
    }
  }

  renderButton() {
    return (
      [<TouchableOpacity
        onPress={() => this.makeModalVisible()}
      >
        <View
          style={{
            height: 60,
            backgroundColor: 'red',
            justifyContent: 'flex-start',
            flexDirection: 'row',
            paddingLeft: 30
          }}
        >
            <Icon
              name='trash'
              type='font-awesome'
              color='white'
            />
        </View>
      </TouchableOpacity>]
    );
  }

  render() {
    const { type, companyName, status } = this.props.order;

    if (status === 'Received') {
      return (
        <View>
            <TouchableHighlight onPress={this.onListItemPress.bind(this)} style={{ flex: 1, justifyContent: 'space-between' }}>
              <View>
                <CardSection style={[styles.titleStyle, { backgroundColor: '#0288D1' }]}>
                  <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                    <Text>Incoming</Text>
                    <Icon
                      name='long-arrow-right'
                      type='font-awesome'
                    />
                  </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center', width: 210, alignSelf: 'center' }}>
                      <Text style={styles.textStyle}>
                        {companyName}
                      </Text>
                      <Text>{this.props.order.type}</Text>
                    </View>
                    {this.renderDate()}
                </CardSection>
              </View>
            </TouchableHighlight>

            <ModalScene
              modalVisible={this.state.modalVisible}
              setModalVisible={this.setModalVisible.bind(this)}
              title={'Incoming Order'}
            >
              <OrderDetails
                order={this.props.order}
                orderType={'incoming'}
                navigation={this.props.navigation}
                logType={'incoming_orders'}
                setModalVisible={this.setModalVisible.bind(this)}
              />
            </ModalScene>

            <ConfirmModal
              visible={this.state.visible}
              onAccept={this.onAccept.bind(this)}
              onDecline={this.onDecline.bind(this)}
              buttonText='Delete'
            >
              Are you sure you want to delete this order?
            </ConfirmModal>
        </View>
      );
    }
    return (
      <View>
          <TouchableHighlight onPress={this.onListItemPress.bind(this)} style={{ flex: 1, justifyContent: 'space-between' }}>
            <View>
              <CardSection style={styles.titleStyle}>
                <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                  <Text>Incoming</Text>
                  <Icon
                    name='long-arrow-right'
                    type='font-awesome'
                  />
                </View>
                  <View style={{ justifyContent: 'center', alignItems: 'center', width: 210, alignSelf: 'center' }}>
                    <Text style={styles.textStyle}>
                      {companyName}
                    </Text>
                    <Text>{this.props.order.type}</Text>
                  </View>
                  {this.renderDate()}
              </CardSection>
            </View>
          </TouchableHighlight>

          <ConfirmModal
            visible={this.state.visible}
            onAccept={this.onAccept.bind(this)}
            onDecline={this.onDecline.bind(this)}
            buttonText='Delete'
          >
            Are you sure you want to delete this order?
          </ConfirmModal>
      </View>
    );
  }
}

const styles = {
  titleStyle: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 15,
    paddingBottom: 15,
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textStyle: {
    fontSize: 18,
    paddingBottom: 5,
    fontWeight: '600'
  }
};

export default connect(null, { incomingDelete, orderUpdate })(IncomingListItem);
