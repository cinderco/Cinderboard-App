import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ListView, Text, View } from 'react-native';
import { archivedFetch } from '../../actions';
import OrderHistoryListItem from './OrderHistoryListItem';

class OrderHistory extends Component {
  static navigationOptions = {
    title: 'Order History',
    header: (navigation, defaultHeader) => ({
        ...defaultHeader,
        style: {
            backgroundColor: 'black'
        },
        title: 'Order History',
        tintColor: 'white'
    })
  };

  componentWillMount() {
    this.props.archivedFetch(null, null);

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

  render() {
    if (this.props.orders.length > 0) {
      return (
          <ListView
            dataSource={this.dataSource}
            renderRow={(rowData) =>
              <OrderHistoryListItem
                order={rowData}
              />}
            style={{ flex: 1, backgroundColor: 'white' }}
            removeClippedSubviews={false}
          />
      );
    }
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 18 }}>No Orders</Text>
      </View>
    );
  }
}

const mapStateToProps = state => {
  const unsortedOrders = _.map(state.archivedOrders.all_archived_list, (val, uid) => {
    return  { ...val, uid };
  });

  const orders = _.filter(unsortedOrders, order => {
    return order.companyName === state.orderForm.currentCompany;
  });

  const loading = state.archivedOrders.loading;

  return { orders, loading };
};

export default connect(mapStateToProps, { archivedFetch })(OrderHistory);
