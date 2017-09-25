import Expo, { Notifications } from 'expo';
import _ from 'lodash';
import firebase from 'firebase';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Icon } from 'react-native-elements';
import Badge from 'react-native-smart-badge';
import { StackNavigator, TabNavigatorm, NavigationActions } from 'react-navigation';
import { ScrollView, View, Text, AsyncStorage, StatusBar, Platform, TouchableOpacity, Modal, TouchableHighlight, Alert, RefreshControl } from 'react-native';
import { outgoingFetch, incomingFetch, orderDelete, showModalChange, fetchMessagesUnread } from '../../../actions';
import IncomingSeparate from '../Incoming/IncomingSeparate';
import OutgoingSeparate from './OutgoingSeparate';
import OrderDetails from './OrderDetails';
import OrderForm from '../OrderForm';
import NewOrder from '../NewOrder';
import { Spinner, CardSection, SceneHeader } from '../../common';
import ModalScene from '../../ModalScene';
import registerForNotifications from '../../../services/push_notifications';

class OrderList extends Component {
  static navigationOptions = {
    title: 'All Orders',
    headerVisible: false,
    tabBarLabel: 'Orders',
    tabBarIcon: ({ tintColor }) => (
      <Icon
        name='home'
        type='font-awesome'
        color={tintColor}
      />
    ),
  };

  state = {
    isAdmin: false,
    modalVisible: false,
    modalVisibleTwo: false,
    modalVisibleNewOrder: false,
    outgoingOrders: [],
    incomingOrders: [],
    refreshing: false
  }

  componentWillMount() {
    this.props.outgoingFetch()
    this.props.incomingFetch();
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        firebase.database().ref(`/users/${user.uid}`)
          .once('value', snapshot => {
              registerForNotifications({ uid: user.uid });

              Notifications.addListener((notification) => {
                  const { data: { text, route, content, from }, origin } = notification;

                  console.log('ROUTE', text);

                  if (origin === 'received' && text) {
                    Alert.alert(
                      from,
                      text,
                      [{ text: 'Ok' }]
                    );
                  } else if (origin === 'selected' && text) {
                    this.props.navigation.navigate(`${route}`, { content: content});
                  }
              });

              this.setState({ isAdmin: snapshot.val().isAdmin, loggedIn: true })
          });
      } else {
        this.setState({ loggedIn: false });
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      outgoingOrders: nextProps.outgoingOrders,
      incomingOrders: nextProps.incomingOrders
    });
  }

  setModalVisible(visible, type) {
    if (type === 'one') {
      this.setState({ modalVisible: visible });
    } else if (type === 'two') {
      this.setState({ modalVisibleTwo: visible });
    } else if (type === 'three') {
      this.setState({ modalVisibleNewOrder: visible });
    }
  }

  rightButtonPress() {
    this.setState({
      modalVisibleNewOrder: true
    });
  }

  renderHeader() {
    if (this.state.isAdmin) {
      return (
        <SceneHeader
          title={'All Orders'}
          rightButtonPress={this.rightButtonPress.bind(this)}
          navigation={this.props.navigation}
        />
      );
    } else {
      return (
        <SceneHeader
          title={'All Orders'}
          rightButtonPress={false}
          navigation={this.props.navigation}
        />
      );
    }
  }

  render() {
    if (this.state.incomingOrders.length === 0 && this.state.outgoingOrders.length === 0) {
      return (
        <View style={{ flex: 1 }}>
          <StatusBar
            barStyle="light-content"
          />

          {this.renderHeader()}

          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 18 }}>No Orders</Text>
          </View>
          <ModalScene
            modalVisible={this.state.modalVisibleNewOrder}
            setModalVisible={this.setModalVisible.bind(this)}
            type={'three'}
            title={'New Order'}
          >
            <NewOrder setModalVisible={this.setModalVisible.bind(this)} />
          </ModalScene>
        </View>
      );
    }
    return (
      <View style={{ flex: 1 }}>
        <StatusBar
          barStyle="light-content"
        />

        {this.renderHeader()}

        <ScrollView
          style={{ flex: 1 }}
        >

        <TouchableOpacity onPress={() => this.setModalVisible(!this.state.modalVisible, 'one')}>
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

        <OutgoingSeparate
          navigation={this.props.navigation}
          isAdmin={this.state.isAdmin}
        />

          <TouchableOpacity onPress={() => this.setModalVisible(!this.state.modalVisible, 'two')}>
            <CardSection
              style={{
                justifyContent: 'center',
                borderBottomWidth: 1,
                paddingTop: 10,
                position: 'relative',
                backgroundColor: '#292d29'
              }}
            >
              <Text style={styles.labelStyle}>Incoming</Text>
            </CardSection>
          </TouchableOpacity>

          <IncomingSeparate
            isAdmin={this.state.isAdmin}
            navigation={this.props.navigation}
          />
        </ScrollView>

        <ModalScene
          modalVisible={this.state.modalVisible}
          setModalVisible={this.setModalVisible.bind(this)}
          type={'one'}
          title={'Outgoing Orders'}
        >
          <OutgoingSeparate navigation={this.props.navigation} isAdmin={this.state.isAdmin} />
        </ModalScene>

        <ModalScene
          modalVisible={this.state.modalVisibleTwo}
          setModalVisible={this.setModalVisible.bind(this)}
          type={'two'}
          title={'Incoming Orders'}
        >
          <IncomingSeparate navigation={this.props.navigation} />
        </ModalScene>

        <ModalScene
          modalVisible={this.state.modalVisibleNewOrder}
          setModalVisible={this.setModalVisible.bind(this)}
          type={'three'}
          title={'New Order'}
        >
          <NewOrder setModalVisible={this.setModalVisible.bind(this)} />
        </ModalScene>
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
  const loading = state.orders.loading;
  const scroll = state.orderForm.scroll;

  const outgoingOrders = _.map(state.orders.outgoing_list, (val, uid) => {
    return { ...val, uid };
  });
  const incomingOrders = _.map(state.incomingOrders.incoming_list, (val, uid) => {
    return { ...val, uid };
  });

  return { loading, scroll, incomingOrders, outgoingOrders };
};

export default connect(mapStateToProps, {
  outgoingFetch, incomingFetch, orderDelete, showModalChange
})(OrderList);
