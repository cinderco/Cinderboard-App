import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ListView, View, Text, TouchableOpacity } from 'react-native';
import { StackNavigator, navigate } from 'react-navigation';
import { outgoingFetch, outgoingDelete, showModalChange } from '../../../actions';
import ListItem from './ListItem';
import OutgoingSeparateNonAdmin from './OutgoingSeparateNonAdmin';
import { Header, CardSection } from '../../common';

class OutgoingNonAdmin extends Component {
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

  renderRow(order) {
    return <ListItem order={order} />;
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View>
        <TouchableOpacity onPress={() => navigate('outgoing')}>
          <CardSection
            style={{
              justifyContent: 'center',
              borderBottomWidth: 1,
              paddingTop: 10,
              position: 'relative',
              backgroundColor: '#292d29'
            }}
          >
            <Text style={styles.labelStyle}>Outgoing</Text>
          </CardSection>
        </TouchableOpacity>

        <OutgoingSeparateNonAdmin
          marginTop={0}
          isAdmin={this.props.isAdmin}
          navigation={this.props.navigation}
        />
      </View>
    );
  }
}

const styles = {
  labelStyle: {
    color: '#DB2728',
    paddingBottom: 5,
    fontSize: 20
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
  outgoingFetch, outgoingDelete, showModalChange
})(OutgoingNonAdmin);
