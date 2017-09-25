import moment from 'moment';
import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ListView, Text } from 'react-native';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import { outgoingFetch, outgoingDelete, showModalChange, setIsOpen } from '../../../actions';
import HiddenListItem from '../HiddenListItem';
import ListItem from './ListItem';

class OutgoingSeparateNonAdmin extends Component {
  static navigationOptions = {
    title: 'Ougoing Orders',
    header: (navigation, defaultHeader) => ({
        ...defaultHeader,
        style: {
            backgroundColor: 'black'
        },
        title: 'Outgoing Orders',
        tintColor: 'white'
    }),
    tabBar: {
      visible: false
    }
  };

  state = {
    isOpen: false
  }

  componentWillMount() {
    this.props.outgoingFetch();

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
          disableLeftSwipe
        >
          <HiddenListItem
            order={order}
            secId={secId}
            rowId={rowId}
            rowMap={rowMap}
            width={75}
            navigation={this.props.navigation}
          />
        <ListItem
          order={order}
          secId={secId}
          rowId={rowId}
          rowMap={rowMap}
          isOpen={isOpen}
          setIsOpen={this.setIsOpen.bind(this)}
          navigation={this.props.navigation}
        />
        </SwipeRow>
      );
    } else if (order.status === 'new') {
      return (
        <SwipeRow
          leftOpenValue={75}
          rightOpenValue={-150}
          disableLeftSwipe
        >
          <HiddenListItem
            order={order}
            secId={secId}
            rowId={rowId}
            rowMap={rowMap}
            width={75}
            navigation={this.props.navigation}
          />
          <ListItem
            order={order}
            secId={secId}
            rowId={rowId}
            rowMap={rowMap}
            isOpen={isOpen}
            setIsOpen={this.setIsOpen.bind(this)}
            navigation={this.props.navigation}
          />
        </SwipeRow>
      );
    }
    return (
      <SwipeRow
        leftOpenValue={150}
        rightOpenValue={-150}
        disableLeftSwipe
      >
        <HiddenListItem
          order={order}
          secId={secId}
          rowId={rowId}
          rowMap={rowMap}
          height={80}
          width={75}
          navigation={this.props.navigation}
        />
        <ListItem
          order={order}
          secId={secId}
          rowId={rowId}
          rowMap={rowMap}
          isOpen={isOpen}
          setIsOpen={this.setIsOpen.bind(this)}
          navigation={this.props.navigation}
        />
      </SwipeRow>
    );
  }

  render() {
    return (
        <SwipeListView
            dataSource={this.dataSource}
            renderRow={(order, secId, rowId, rowMap) => this.renderRow(order, secId, rowId, rowMap, this.state.isOpen)}
            style={{ flex: 1, backgroundColor: 'white' }}
            enableEmptySections
            onRowClose={() => this.setState({ isOpen: false })}
            onRowOpen={() => this.setState({ isOpen: true })}
        />
    );
  }
}

const mapStateToProps = state => {
  const unsortedOrders = _.map(state.orders.outgoing_list, (val, uid) => {
    return { ...val, uid };
  });


  const orders = unsortedOrders.sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const { loading } = state.orders;
  const scroll = state.orderForm.scroll;

  return { orders, loading, scroll };
};

export default connect(mapStateToProps, {
  outgoingFetch, outgoingDelete, showModalChange, setIsOpen
})(OutgoingSeparateNonAdmin);
