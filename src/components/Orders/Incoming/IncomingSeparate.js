import firebase from 'firebase';
import moment from 'moment';
import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ListView, Text, View } from 'react-native';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import { incomingFetch } from '../../../actions';
import HiddenListItem from '../HiddenListItem';
import IncomingListItem from './IncomingListItem';
import ModalScene from '../../ModalScene';
import OrderDetails from '../Outgoing/OrderDetails';

class IncomingSeparate extends Component {
  static navigationOptions = {
    title: 'Ougoing Orders',
    header: (navigation, defaultHeader) => ({
        ...defaultHeader,
        style: {
            backgroundColor: 'black'
        },
        title: 'Incoming Orders',
        tintColor: 'white'
    }),
    tabBar: {
      visible: false
    }
  };

  state = {
    isAdmin: false,
    isOpen: false,
    modalVisible: false
  }

  componentWillMount() {
    this.props.incomingFetch();
    this.createDataSource(this.props);
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        firebase.database().ref(`/users/${user.uid}`)
          .once('value', snapshot => {
            this.setState({ isAdmin: snapshot.val().isAdmin })
          });
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    this.createDataSource(nextProps);
  }

  createDataSource({ orders }) {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.dataSource = ds.cloneWithRows(orders);
  }

  setIsOpen(bool) {
    this.setState({ isOpen: bool});
  }

  setModalVisible(bool, uid) {
    this.setState({ modalVisible: bool, uid: uid });
  }

  renderDate(order) {
    const date = new Date();
    const shortDate = date.toLocaleDateString();
    const orderDate = new Date(order.date);
    const shortOrderDate = orderDate.toLocaleDateString();
    const start = moment().startOf('week').format('x');
    const end = moment().endOf('week').format('x');
    const today = moment().format('x');
    const dateTwo = moment(this.props.order.date).format('x');
    const dateDay = moment(this.props.order.date).format('dddd');


    if (shortOrderDate === shortDate) {
      return (
        <Text style={{ fontSize: 14, color: 'blue' }}>
          Today
        </Text>
      );
    } else if (dateTwo < today) {
      if (dateTwo >= start && dateTwo <= end) {
        return (
          <Text style={{ fontSize: 14, color: 'red' }}>
            {dateDay}
          </Text>
        );
      }
      return (
        <Text style={{ fontSize: 14, color: 'red' }}>
          {shortOrderDate}
        </Text>
      );
    }
    return (
      <Text style={{ fontSize: 14 }}>
        {shortOrderDate}
      </Text>
    );
  }

  renderRow(order, secId, rowId, rowMap, isOpen) {
      return (
        <SwipeRow
          rightOpenValue={-150}
          leftOpenValue={75}
          recalculateHiddenLayout
        >
          <HiddenListItem
            order={order}
            secId={secId}
            rowId={rowId}
            rowMap={rowMap}
            width={75}
            orderType={'incoming'}
          />
          <IncomingListItem
            order={order}
            secId={secId}
            rowId={rowId}
            rowMap={rowMap}
            isOpen={isOpen}
            setIsOpen={this.setIsOpen.bind(this)}
            setModalVisible={this.setModalVisible.bind(this)}
          />
        </SwipeRow>
      );
  }

  renderRowTwo(order, secId, rowId, rowMap, isOpen) {
      return (
        <SwipeRow
          leftOpenValue={75}
          disableLeftSwipe
          recalculateHiddenLayout
        >
          <HiddenListItem
            order={order}
            secId={secId}
            rowId={rowId}
            rowMap={rowMap}
            height={60}
            width={62.5}
          />
          <IncomingListItem
            order={order}
            secId={secId}
            rowId={rowId}
            rowMap={rowMap}
            isOpen={isOpen}
            setIsOpen={this.setIsOpen.bind(this)}
            setModalVisible={this.setModalVisible.bind(this)}
          />
        </SwipeRow>
      );
  }

  render() {
    if (this.props.orders.length === 0) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 150
          }}
        >
          <Text style={{ fontSize: 18 }}>No Incoming Orders</Text>
        </View>
      );
    }
    if (this.state.isAdmin === true) {
      return (
        <View style={{ flex: 1 }}>
          <SwipeListView
              dataSource={this.dataSource}
              renderRow={(order, secId, rowId, rowMap) => this.renderRow(order, secId, rowId, rowMap, this.state.isOpen)}
              style={{ flex: 1, backgroundColor: 'white' }}
              onRowClose={() => this.setState({ isOpen: false })}
              onRowOpen={() => this.setState({ isOpen: true })}
              removeClippedSubviews={false}
              recalculateHiddenLayout
          />

          <ModalScene
            modalVisible={this.state.modalVisible}
            setModalVisible={this.setModalVisible.bind(this)}
            title={'Incoming Order'}
          >
            <OrderDetails
              uid={this.state.uid}
              orderType={'incoming'}
              navigation={this.props.navigation}
              logType={'incoming_orders'}
              setModalVisible={this.setModalVisible.bind(this)}
            />
          </ModalScene>
        </View>
      );
    }
    return (
      <View style={{ flex: 1 }}>
        <SwipeListView
            dataSource={this.dataSource}
            renderRow={(order, secId, rowId, rowMap) => this.renderRowTwo(order, secId, rowId, rowMap, this.state.isOpen)}
            style={{ flex: 1, backgroundColor: 'white' }}
            onRowClose={() => this.setState({ isOpen: false })}
            onRowOpen={() => this.setState({ isOpen: true })}
            removeClippedSubviews={false}
            recalculateHiddenLayout
        />

        <ModalScene
          modalVisible={this.state.modalVisible}
          setModalVisible={this.setModalVisible.bind(this)}
          title={'Incoming Order'}
        >
          <OrderDetails
            uid={this.state.uid}
            orderType={'incoming'}
            navigation={this.props.navigation}
            logType={'incoming_orders'}
            setModalVisible={this.setModalVisible.bind(this)}
          />
        </ModalScene>
      </View>
    );
  }
}

const mapStateToProps = state => {
  const unsortedOrders = _.map(state.incomingOrders.incoming_list, (val, uid) => {
    return { ...val, uid };
  });

  const orders = unsortedOrders.sort((a, b) => {
    if (a.date === 'Unknown' && b.date !== 'Unknown') {
      const stringToNumber = 3002085600000;

      return stringToNumber - new Date(b.date).getTime();
    } else if (a.date === 'Unknown' && b.date === 'Unknown') {
      const stringToNumberA = 3002085600000;
      const stringToNumberB = 3002085600000;

      return stringToNumberA - stringToNumberB;
    } else if (a.date !== 'Unknown' && b.date === 'Unknown') {
      const stringToNumber = 3002085600000;

      return new Date(a.date).getTime() - stringToNumber;
    } else {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
  });

  return { orders };
};

export default connect(mapStateToProps, {
  incomingFetch
})(IncomingSeparate);
