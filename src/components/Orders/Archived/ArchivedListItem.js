import React, { Component } from 'react';
import { Text, TouchableHighlight, View } from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import moment from 'moment';
import { CardSection } from '../../common';
import { incomingDelete, orderUpdate } from '../../../actions';
import ModalScene from '../../ModalScene';
import OrderDetails from '../Outgoing/OrderDetails';

class ArchivedListItem extends Component {
  state = {
    modalVisible: false
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  onListItemPress() {
    this.setModalVisible(!this.state.modalVisible);
  }

  renderOrderType() {
    if (this.props.order.orderType === 'outgoing') {
      return (
        <View style={{ flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{ paddingLeft: 5 }}>Out</Text>
        </View>
      );
    } else if (this.props.order.orderType === 'incoming') {
      return (
        <View style={{ flexDirection: 'row'}}>
          <Text>In</Text>
        </View>
      );
    }
  }

  renderDate() {
    const date = new Date();
    const shortDate = date.toLocaleDateString();
    const orderDate = new Date(this.props.order.archiveDate);
    const shortOrderDate = orderDate.toLocaleDateString();
    const start = moment().startOf('week').format('x');
    const end = moment().endOf('week').format('x');
    const today = moment().format('x');
    const dateTwo = moment(this.props.order.archiveDate).format('x');
    const dateDay = moment(this.props.order.archiveDate).format('ddd');

    if (shortOrderDate === shortDate) {
      return (
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <Text style={{ fontSize: 14, color: 'blue' }}>
            Today
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

  renderIcon() {
    if (this.props.order.other === 'Freight') {
      return (
        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
          <Icon
            name='package'
            type='octicon'
            color='black'
          />
        </View>
      );
    } else if (this.props.order.other === 'Delivery') {
      return (
        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
          <Icon
            name='truck-delivery'
            type='material-community'
            color='black'
          />
        </View>

      );
    } else if (this.props.order.other === 'Will Call') {
      return (
        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
          <Icon
            name='user'
            type='font-awesome'
            color='black'
          />
        </View>

      );
    }
  }

  render() {
    const { orderType, companyName } = this.props.order;
    const date = new Date(this.props.order.createDate);
    const stringDate = date.toLocaleDateString();

    if (this.props.order.orderType === 'outgoing') {
      return (
        <View>
            <TouchableHighlight onPress={this.onListItemPress.bind(this)} style={{ flex: 1, justifyContent: 'space-between' }}>
              <View>
                <CardSection style={styles.titleStyle}>
                    {this.renderIcon()}
                    <View style={{ justifyContent: 'center', alignItems: 'center', width: 210 }}>
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
              title={'Archived Outgoing'}
            >
              <OrderDetails
                order={this.props.order}
                orderType={'outgoing'}
                navigation={this.props.navigation}
                logType={'archived_orders'}
              />
            </ModalScene>
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
                  <View style={{ justifyContent: 'center', alignItems: 'center', width: 210 }}>
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
            title={'Archived Incoming'}
          >
            <OrderDetails
              order={this.props.order}
              navigation={this.props.navigation}
              logType={'archived_orders'}
              orderType={'incoming'}
              setModalVisible={this.setModalVisible.bind(this)}
            />
          </ModalScene>
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

export default connect(null, { incomingDelete, orderUpdate })(ArchivedListItem);
