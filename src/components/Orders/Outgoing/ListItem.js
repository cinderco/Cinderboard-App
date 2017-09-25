import React, { Component } from 'react';
import { Text, TouchableHighlight, View, Image, Modal, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Icon, Button } from 'react-native-elements';
import moment from 'moment';
import { CardSection } from '../../common';
import OrderDetails from './OrderDetails';
import ModalScene from '../../ModalScene';
import { outgoingDelete, outgoingSave, orderUpdate, outgoingArchive, orderFetch } from '../../../actions';

class ListItem extends Component {
  state = {
    visible: false,
    isOpen: false,
    modalVisible: false
  }

  onListItemPress() {
    if (this.props.isOpen === false) {
      this.props.setModalVisible(true, this.props.order.uid);
    } else {
      this.props.setIsOpen(false);
      this.props.rowMap[`${this.props.secId}${this.props.rowId}`].closeRow();
    }
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  renderDate() {
    if (this.props.order.date === 'Unknown') {
      return (
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: '600' }}>
            ?
          </Text>
        </View>
      );
    } else {
      const date = new Date();
      const shortDate = date.toLocaleDateString();
      const orderDate = new Date(this.props.order.date);
      const shortOrderDate = orderDate.toLocaleDateString();
      const start = moment().startOf('week').format('x');
      const end = moment().endOf('week').format('x');
      const today = moment().format('x');
      const dateTwo = moment(this.props.order.date).format('x');
      const dateDay = moment(this.props.order.date).format('dddd');


      if (shortOrderDate === shortDate) {
        return (
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 12, color: 'blue' }}>
              Today
            </Text>
          </View>
        );
      } else if (dateTwo < today) {
        return (
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 12, color: 'red' }}>
              {shortOrderDate}
            </Text>
          </View>
        );
      } else if (dateTwo >= start && dateTwo <= end) {
        return (
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 12 }}>
              {dateDay}
            </Text>
          </View>
        );
      }
      return (
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <Text style={{ fontSize: 12 }}>
            {shortOrderDate}
          </Text>
        </View>
      );
    }
  }

  renderIcon() {
    if (this.props.order.other === 'Freight') {
      return (
        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start'}}>
          <View style={{ justifyContent: 'center' }}>
            <Icon
              name='package-variant-closed'
              type='material-community'
              color='black'
            />
            <Text>Freight</Text>
          </View>
        </View>
      );
    } else if (this.props.order.other === 'Delivery') {
      return (
        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
          <View style={{ justifyContent: 'center' }}>
            <Icon
              name='truck-delivery'
              type='material-community'
              color='black'
            />
            <Text>Delivery</Text>
          </View>
        </View>

      );
    } else if (this.props.order.other === 'Will Call') {
      return (
        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
          <View style={{ justifyContent: 'center' }}>
            <Icon
              name='walk'
              type='material-community'
              color='black'
            />
            <Text>Will Call</Text>
          </View>
        </View>

      );
    }
  }

  renderModal() {
    return (
      <ModalScene
        modalVisible={this.state.modalVisible}
        setModalVisible={this.setModalVisible.bind(this)}
        title={'Outgoing Order'}
      >
        <OrderDetails
          order={this.props.order}
          orderType={'outgoing'}
          navigation={this.props.navigation}
          logType={'outgoing_orders'}
          setModalVisible={this.setModalVisible.bind(this)}
          forceUpdate={this.props.forceUpdate}
        />
      </ModalScene>
    );
  }

  render() {
    const { companyName } = this.props.order;

    if (this.props.order.status === 'complete') {
      return (
        <View>
            <TouchableHighlight onPress={this.onListItemPress.bind(this)} style={{ flex: 1, justifyContent: 'space-between' }}>
              <View style={{ flex: 1, justifyContent: 'space-between' }}>
                <CardSection style={styles.titleStyleComplete}>
                    {this.renderIcon()}
                    <View style={{ justifyContent: 'center', alignItems: 'center', width: 210 }}>
                      <Text style={styles.textStyleComplete}>
                        {companyName}
                      </Text>
                      <Text>{this.props.order.type}</Text>
                    </View>
                    {this.renderDate()}
                </CardSection>
              </View>
            </TouchableHighlight>
            {this.renderModal()}
        </View>
      );
    } else if (this.props.order.status === 'ready') {
      return (
        <View>
            <TouchableHighlight onPress={this.onListItemPress.bind(this)} style={{ flex: 1, justifyContent: 'space-between' }}>
              <View>
                <CardSection style={styles.titleStyleReady}>
                    {this.renderIcon()}
                    <View style={{ justifyContent: 'center', alignItems: 'center', width: 210 }}>
                      <Text style={styles.textStyleComplete}>
                        {companyName}
                      </Text>
                      <Text>{this.props.order.type}</Text>
                    </View>
                    {this.renderDate()}
                </CardSection>
              </View>
            </TouchableHighlight>
            {this.renderModal()}
        </View>
      );
    } else if (this.props.order.status === 'processing') {
      return (
        <View>
            <TouchableHighlight onPress={this.onListItemPress.bind(this)} style={{ flex: 1, justifyContent: 'space-between' }}>
              <View>
                <CardSection style={styles.titleStyleProcessing}>
                    {this.renderIcon()}
                    <View style={{ justifyContent: 'center', alignItems: 'center', width: 210 }}>
                      <Text style={styles.textStyleComplete}>
                        {companyName}
                      </Text>
                      <Text>{this.props.order.type}</Text>
                    </View>
                    {this.renderDate()}
                </CardSection>
              </View>
            </TouchableHighlight>
            {this.renderModal()}
        </View>
      );
    }
    return (
      <View>
          <TouchableHighlight onPress={this.onListItemPress.bind(this)} style={{ flex: 1, justifyContent: 'space-between' }}>
            <View>
              <CardSection style={styles.titleStyle}>
                  {this.renderIcon()}
                  <View style={{ justifyContent: 'center', alignItems: 'center', width: 210 }}>
                    <Text style={styles.textStyleComplete}>
                      {companyName}
                    </Text>
                    <Text>{this.props.order.type}</Text>
                  </View>
                  {this.renderDate()}
              </CardSection>
            </View>
          </TouchableHighlight>

          {this.renderModal()}
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
  },
  titleStyleReady: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 15,
    paddingBottom: 15,
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4ff765',
  },
  textStyleReady: {
    fontSize: 18,
  },
  titleStyleComplete: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 15,
    paddingBottom: 15,
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0288D1'
  },
  titleStyleProcessing: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 15,
    paddingBottom: 15,
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF163'
  },
  textStyleComplete: {
    fontSize: 18,
    paddingBottom: 5,
    fontWeight: '600'
  },
  modalHeader: {
    height: 63,
    backgroundColor: 'black',
    position: 'relative',
    justifyContent: 'flex-end',
    flexDirection: 'column',
    paddingBottom: 10
  },
  backButton: {
    position: 'absolute',
    left: 10,
    bottom: 10,
    flexDirection: 'row',
    alignItems: 'center'
  }
};

export default connect(null, {
  outgoingDelete, outgoingSave, orderUpdate, outgoingArchive, orderFetch
})(ListItem);
