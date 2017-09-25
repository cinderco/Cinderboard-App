import React, { Component } from 'react';
import { Text, View, TouchableHighlight } from 'react-native';
import { Icon, Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { CardSection } from '../common';
import ModalScene from '../ModalScene';
import OrderDetails from '../Orders/Outgoing/OrderDetails';

class OrderHistoryListItem extends Component {
  state = {
    modalVisible: false
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  onListItemPress() {
    this.setModalVisible({ modalVisible: !this.state.modalVisible});
  }

  renderIcon() {
    if (this.props.order.other === 'Freight') {
      return (
        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
          <Text>Outgoing</Text>
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
    const { type } = this.props.order;
    const date = new Date(this.props.order.date);
    const shortDate = date.toLocaleDateString();
    const { orderType, companyName } = this.props.order;
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
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                      <Text style={{ fontSize: 12 }}>
                        {stringDate}
                      </Text>
                    </View>
                </CardSection>
              </View>
            </TouchableHighlight>

            <ModalScene
              modalVisible={this.state.modalVisible}
              setModalVisible={this.setModalVisible.bind(this)}
              title={'Order'}
            >
              <OrderDetails
                order={this.props.order}
                orderType={'outgoing'}
                navigation={this.props.navigation}
                logType={'order_history'}
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
                  <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: 12 }}>
                      {stringDate}
                    </Text>
                  </View>
              </CardSection>
            </View>
          </TouchableHighlight>

          <ModalScene
            modalVisible={this.state.modalVisible}
            setModalVisible={this.setModalVisible.bind(this)}
            title={'Order'}
          >
            <OrderDetails
              order={this.props.order}
              navigation={this.props.navigation}
              logType={'order_history'}
              orderType={'incoming'}
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

export default connect(null)(OrderHistoryListItem);
