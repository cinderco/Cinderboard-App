import firebase from 'firebase';
import moment from 'moment';
import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ListView, Text, FlatList, View } from 'react-native';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import { outgoingFetch, outgoingDelete, showModalChange, setIsOpen } from '../../../actions';
import HiddenListItem from '../HiddenListItem';
import ListItem from './ListItem';
import OrderDetails from './OrderDetails';
import ModalScene from '../../ModalScene';

class OutgoingSeparate extends Component {
  state = {
    isOpen: false,
    modalVisible: false
  }

  componentWillMount() {
    this.createDataSource(this.props);
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
    if (order.status === 'complete') {
      return (
        <SwipeRow
          leftOpenValue={75}
          rightOpenValue={-150}
          recalculateHiddenLayout
        >
          <HiddenListItem
            order={order}
            secId={secId}
            rowId={rowId}
            rowMap={rowMap}
            width={75}
            height={80}
            navigation={this.props.navigation}
            orderType={'outgoing'}
          />
          <ListItem
            order={order}
            secId={secId}
            rowId={rowId}
            rowMap={rowMap}
            isOpen={isOpen}
            setIsOpen={this.setIsOpen.bind(this)}
            navigation={this.props.navigation}
            setModalVisible={this.setModalVisible.bind(this)}
          />
        </SwipeRow>
      );
    } else if (order.status === 'new') {
      return (
        <SwipeRow
          leftOpenValue={75}
          rightOpenValue={-150}
          recalculateHiddenLayout
        >
          <HiddenListItem
            order={order}
            secId={secId}
            rowId={rowId}
            rowMap={rowMap}
            width={75}
            height={80}
            navigation={this.props.navigation}
            orderType={'outgoing'}
          />
          <ListItem
            order={order}
            secId={secId}
            rowId={rowId}
            rowMap={rowMap}
            isOpen={isOpen}
            setIsOpen={this.setIsOpen.bind(this)}
            navigation={this.props.navigation}
            setModalVisible={this.setModalVisible.bind(this)}
          />
        </SwipeRow>
      );
    }
    return (
      <SwipeRow
        leftOpenValue={150}
        rightOpenValue={-150}
        recalculateHiddenLayout
      >
        <HiddenListItem
          order={order}
          secId={secId}
          rowId={rowId}
          rowMap={rowMap}
          height={80}
          width={75}
          navigation={this.props.navigation}
          orderType={'outgoing'}
        />
        <ListItem
          order={order}
          secId={secId}
          rowId={rowId}
          rowMap={rowMap}
          isOpen={isOpen}
          setIsOpen={this.setIsOpen.bind(this)}
          navigation={this.props.navigation}
          setModalVisible={this.setModalVisible.bind(this)}
        />
      </SwipeRow>
    );
  }

  renderRowTwo(order, secId, rowId, rowMap, isOpen) {
    if (order.status === 'complete') {
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
            width={75}
            navigation={this.props.navigation}
            orderType={'outgoing'}
          />
        <ListItem
          order={order}
          secId={secId}
          rowId={rowId}
          rowMap={rowMap}
          isOpen={isOpen}
          setIsOpen={this.setIsOpen.bind(this)}
          navigation={this.props.navigation}
          setModalVisible={this.setModalVisible.bind(this)}
        />
        </SwipeRow>
      );
    } else if (order.status === 'new') {
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
            width={75}
            navigation={this.props.navigation}
            orderType={'outgoing'}
          />
          <ListItem
            order={order}
            secId={secId}
            rowId={rowId}
            rowMap={rowMap}
            isOpen={isOpen}
            setIsOpen={this.setIsOpen.bind(this)}
            navigation={this.props.navigation}
            setModalVisible={this.setModalVisible.bind(this)}
          />
        </SwipeRow>
      );
    }
    return (
      <SwipeRow
        leftOpenValue={150}
        disableLeftSwipe
        recalculateHiddenLayout
      >
        <HiddenListItem
          order={order}
          secId={secId}
          rowId={rowId}
          rowMap={rowMap}
          height={80}
          width={75}
          navigation={this.props.navigation}
          orderType={'outgoing'}
        />
        <ListItem
          order={order}
          secId={secId}
          rowId={rowId}
          rowMap={rowMap}
          isOpen={isOpen}
          setIsOpen={this.setIsOpen.bind(this)}
          navigation={this.props.navigation}
          setModalVisible={this.setModalVisible.bind(this)}
        />
      </SwipeRow>
    );
  }

  render() {
    if (this.props.isAdmin === true) {
      return (
          <View style={{ flex: 1 }}>
            <SwipeListView
                dataSource={this.dataSource}
                renderRow={(order, secId, rowId, rowMap) => this.renderRow(order, secId, rowId, rowMap, this.state.isOpen)}
                style={{ flex: 1, backgroundColor: 'white' }}
                enableEmptySections
                onRowClose={() => this.setState({ isOpen: false })}
                onRowOpen={() => this.setState({ isOpen: true })}
                removeClippedSubviews={false}
                recalculateHiddenLayout
            />

            <ModalScene
              modalVisible={this.state.modalVisible}
              setModalVisible={this.setModalVisible.bind(this)}
              title={'Outgoing Order'}
            >
              <OrderDetails
                uid={this.state.uid}
                orderType={'outgoing'}
                navigation={this.props.navigation}
                logType={'outgoing_orders'}
                setModalVisible={this.setModalVisible.bind(this)}
                forceUpdate={this.props.forceUpdate}
              />
            </ModalScene>
          </View>

      );
    } else {
      return (
        <View style={{ flex: 1 }}>
          <SwipeListView
              dataSource={this.dataSource}
              renderRow={(order, secId, rowId, rowMap) => this.renderRowTwo(order, secId, rowId, rowMap, this.state.isOpen)}
              style={{ flex: 1, backgroundColor: 'white' }}
              enableEmptySections
              onRowClose={() => this.setState({ isOpen: false })}
              onRowOpen={() => this.setState({ isOpen: true })}
              removeClippedSubviews={false}
              recalculateHiddenLayout
          />

          <ModalScene
            modalVisible={this.state.modalVisible}
            setModalVisible={this.setModalVisible.bind(this)}
            title={'Outgoing Order'}
          >
            <OrderDetails
              uid={this.state.uid}
              orderType={'outgoing'}
              navigation={this.props.navigation}
              logType={'outgoing_orders'}
              setModalVisible={this.setModalVisible.bind(this)}
              forceUpdate={this.props.forceUpdate}
            />
          </ModalScene>
        </View>
      );
    }
  }
}

const mapStateToProps = state => {
  const unsortedOrders = _.map(state.orders.outgoing_list, (val, uid) => {
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

  const { loading } = state.orders;
  const scroll = state.orderForm.scroll;

  return { orders, loading, scroll };
};

export default connect(mapStateToProps, {
  outgoingFetch, outgoingDelete, showModalChange, setIsOpen
})(OutgoingSeparate);
