import _ from 'lodash';
import firebase from 'firebase';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Icon } from 'react-native-elements';
import { StackNavigator, TabNavigator } from 'react-navigation';
import { ScrollView, View, Text, AsyncStorage, StatusBar, Platform, TouchableOpacity } from 'react-native';
import { outgoingFetch, incomingFetch, orderDelete, showModalChange, fetchMessagesUnread } from '../../../actions';
import IncomingList from '../Incoming/IncomingList';
import OutgoingNonAdmin from './OutgoingNonAdmin';
import { Spinner } from '../../common';

class OrderListNonAdmin extends Component {
  static navigationOptions = {
    title: 'All Orders',
    header: ({ navigate }) => {
      return {
        right: (
          <Button
            title='New'
            icon={{name: 'plus', type: 'font-awesome', size: 20}}
            onPress={() => navigate('newOrder')}
            backgroundColor="rgba(0,0,0,0)"
            color="white"
            buttonStyle={{ justifyContent: 'flex-end' }}
          />
        ),
        left: (
          <Button
            icon={{name: 'bars', type: 'font-awesome', size: 20}}
            onPress={() => navigate('DrawerOpen')}
            backgroundColor="rgba(0,0,0,0)"
            color="white"
          />
        ),
        style: {
          marginTop: Platform.OS === 'android' ? 24 : 0,
          backgroundColor: 'black',
        },
        tintColor: 'white'
      };
    },
    tabBarLabel: 'Home',
    tabBarIcon: ({ tintColor }) => (
      <Icon
        name='home'
        type='font-awesome'
        color={tintColor}
      />
    ),
    drawer: () => ({
      label: 'All Orders',
    }),
  };

  state = {
    scroll: true,
    isAdmin: false
  }

  componentWillMount() {
    this.props.outgoingFetch();
  }

  setScrollFalse() {
    this.setState({
      scroll: false
    });
  }

  setScrollTrue() {
    this.setState({
      scroll: true
    });
  }

  render() {
    const { navigate } = this.props.navigation;

    if (this.props.loading) {
      return <Spinner size="large" loadingMessage="Loading Orders"/>;
    } else if (this.props.ordersOutgoing.length === 0 || this.props.ordersIncoming.length === 0) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 18 }}>No Orders</Text>
        </View>
      );
    }
    return (
      <View style={{ flex: 1 }}>
        <StatusBar
          barStyle="light-content"
        />
        <ScrollView
          style={{ flex: 1 }}
          scrollEnabled={this.state.scroll}
        >
          <OutgoingNonAdmin
            setScrollFalse={this.setScrollFalse.bind(this)}
            setScrollTrue={this.setScrollTrue.bind(this)}
            isAdmin={this.props.isAdmin}
            navigation={this.props.navigation}
          />
          <IncomingList
            setScrollFalse={this.setScrollFalse.bind(this)}
            setScrollTrue={this.setScrollTrue.bind(this)}
            isAdmin={this.props.isAdmin}
            navigation={this.props.navigation}
          />
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => {
  const loading = state.orders.loading;
  const scroll = state.orderForm.scroll;

  const ordersOutgoing = _.map(state.orders.outgoing_list, (val, uid) => {
    return { ...val, uid };
  });

  const ordersIncoming = _.map(state.orders.outgoing_list, (val, uid) => {
    return { ...val, uid };
  });

  return { loading, scroll, ordersOutgoing, ordersIncoming };
};

export default connect(mapStateToProps, {
  outgoingFetch, incomingFetch, orderDelete, showModalChange, fetchMessagesUnread
})(OrderListNonAdmin);
