import firebase from 'firebase';
import moment from 'moment';
import _ from 'lodash';
import React, { Component } from 'react';
import { ScrollView, Text, ListView, View, Image, Modal, TouchableOpacity, TouchableHighlight, Alert, Dimensions } from 'react-native';
import { Icon, Button } from 'react-native-elements';
import { connect } from 'react-redux';
import MaterialInitials from 'react-native-material-initials/native';
import { CardSection, Spinner, ConfirmAlert } from '../../common';
import { orderUpdate, outgoingSave, outgoingDelete, logFetch, orderFetch, restoreOrder, incomingDelete } from '../../../actions';
import OrderEditForm from '../OrderEditForm';
import IncomingOrderEditForm from '../IncomingOrderEditForm';
import ModalScene from '../../ModalScene';

const { height, width } = Dimensions.get('window');

class OrderDetails extends Component {
  static navigationOptions = {
    title: 'Order',
    header: (navigation, defaultHeader) => ({
        ...defaultHeader,
        style: {
            backgroundColor: 'black'
        },
        title: 'Order',
        tintColor: 'white'
    }),
    tabBar: {
      visible: false
    }
  };

  state = {
    edit: false,
    modalVisible: false,
    loading: false,
    loadingOrder: true,
    orderInfo: {}
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  componentWillMount() {
    if (this.props.logType === 'outgoing_orders') {
      this.props.orderFetch({ uid: this.props.uid, type: 'outgoing_orders' });
      this.props.logFetch({ uid: this.props.uid, logType: 'outgoing_orders' });
      this.createDataSource(this.props);
    } else if (this.props.logType === 'incoming_orders') {
      this.props.orderFetch({ uid: this.props.uid, type: 'incoming_orders' });
      this.props.logFetch({ uid: this.props.uid, logType: 'incoming_orders' });
      this.createDataSource(this.props);
    }else if (this.props.logType === 'archived_orders') {
      this.props.orderFetch({ uid: this.props.order.uid, type: 'archived_orders' });
      this.props.logFetch({ uid: this.props.order.uid, logType: 'archived_orders' });
      this.createDataSource(this.props);
    } else {
      this.props.orderFetch({ uid: this.props.order.uid, type: 'archived_orders' });
      this.props.logFetch({ uid: this.props.order.uid, logType: 'archived_orders' });
      this.createDataSource(this.props);
    }
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
    this.setState({ orderInfo: nextProps.orderInfo, loadingOrder: false });
    this.createDataSource(nextProps);
  }

  createDataSource({ log }) {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.dataSource = ds.cloneWithRows(log);
  }

  updateOrder(type) {
    this.props.orderFetch({ uid: this.props.uid, type: type });
  }

  restoreOrder() {
    Alert.alert(
      'Restore',
      'Are you sure you want to restore this order?',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        { text: 'Ok', onPress: () => {
          this.setState({ loading: true });

          const { orderType, uid } = this.state.orderInfo;

          this.props.restoreOrder({ type: orderType, uid, setModalVisible: this.props.setModalVisible });
        }
      }
    ],
      { cancelable: true }
    )
  }

  setLoading() {
    this.setState({
      loading: true
    })
  }

  stopEditing() {
    this.setState({ edit: false });
  }

  renderIcon(order, type) {
    if (this.state.orderInfo.orderType === 'incoming') {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>Incoming</Text>
          <Icon
            name='long-arrow-right'
            type='font-awesome'
            color='black'
          />
        </View>
      );
    } else {
      if (type === 'Delivery') {
        return (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Icon
              name='truck-delivery'
              type='material-community'
              color='black'
            />
            <Text>{order.other}</Text>
          </View>
        );
      } else if (type === 'Freight') {
        return (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Icon
              name='package-variant-closed'
              type='material-community'
              color='black'
            />
            <Text>{order.other}</Text>
          </View>
        );
      } else if (type === 'Will Call'){
        return (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Icon
              name='walk'
              type='material-community'
              color='black'
            />
            <Text>{order.other}</Text>
          </View>
        );
      } else {
        return null;
      }
    }
  }

  renderType(status) {
    switch (status) {
      case 'new':
        return <Text style={styles.textStyle}>{status}</Text>;
      case 'processing':
        return <Text style={styles.textStyleProcessing}>{status}</Text>;
      case 'ready':
        return <Text style={styles.textStyleReady}>{status}</Text>;
      case 'complete':
        return <Text style={styles.textStyleComplete}>{status}</Text>;
      default:
        return null;
    }
  }

  renderRow(log) {
    const date = moment(log.logDate).format('LL');

    return (
      <View>
        <Text style={{ alignSelf: 'center', fontSize: 12, color: '#595853', marginTop: 10 }}>{log.logDate}  {log.logTime}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', flex: 1 }}>
            <Text><Text style={{ color: '#DB2728' }}>{log.createdBy}</Text> {log.log}</Text>
          </View>
        </View>
      </View>
    );
  }

  renderLog() {
    return (
      <View style={styles.logStyle}>
        <ListView
          dataSource={this.dataSource}
          renderRow={(rowData) => this.renderRow(rowData)}
          removeClippedSubviews={false}
          enableEmptySections
          style={{ marginBottom: 10 }}
        />
      </View>
    );
  }

  renderEditButton(order) {
    if (this.state.isAdmin === true) {
      if (this.props.logType === 'archived_orders') {
        return (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, height: 60 }}>
            <TouchableHighlight
                  style={styles.wrapper}
                  onPress={() => this.restoreOrder()}
            >
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 5,
                    backgroundColor: 'green',
                    flexDirection: 'row',
                    height: 50,
                    width: width - 30
                  }}
                >
                <Text style={{ marginLeft: 5, color: 'white', fontSize: 18 }}>Restore Order</Text>
              </View>
            </TouchableHighlight>
          </View>
        );
      } else if (this.props.logType === 'outgoing_orders' || this.props.logType === 'incoming_orders') {
        return (
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10, height: 40 }}>
            <TouchableOpacity
                  style={styles.wrapper}
                  onPress={() => this.setState({ modalVisible: true })}
            >
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 5,
                    borderWidth: 1,
                    backgroundColor: 'white',
                    flexDirection: 'row',
                    height: 40,
                    width: (width - 20) / 3,
                    marginRight: 10
                  }}
                >
                  <Icon
                    name='pencil-square-o'
                    type='font-awesome'
                  />
                <Text style={{ marginLeft: 5 }}>Edit</Text>
              </View>
            </TouchableOpacity>

            <ConfirmAlert
              message='Are you sure you want to delete this order?'
              order={this.props.orderInfo}
              incomingDelete={this.props.incomingDelete}
              outgoingDelete={this.props.outgoingDelete}
              navigation={this.props.navigation}
              setLoading={this.setLoading.bind(this)}
              setModalVisible={this.props.setModalVisible}
            />
          </View>
        );
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  renderModal() {
    if (this.props.orderType === 'outgoing') {
      return (
        <ModalScene
          modalVisible={this.state.modalVisible}
          setModalVisible={this.setModalVisible.bind(this)}
          title={'Edit Outgoing'}
        >
          <OrderEditForm
            order={this.state.orderInfo}
            orderTypeTwo={'outgoing'}
            edit={true}
            navigation={this.props.navigation}
            stopEditing={this.stopEditing.bind(this)}
            setModalVisible={this.setModalVisible.bind(this)}
            setModalVisibleTwo={this.props.setModalVisible}
            updateOrder={this.updateOrder.bind(this)}
          />
        </ModalScene>
      );
    } else if (this.props.orderType === 'incoming') {
      return (
        <ModalScene
          modalVisible={this.state.modalVisible}
          setModalVisible={this.setModalVisible.bind(this)}
          title={'Edit Incoming'}
        >
          <IncomingOrderEditForm
            order={this.state.orderInfo}
            orderTypeTwo={'incoming'}
            edit={true}
            navigation={this.props.navigation}
            stopEditing={this.stopEditing.bind(this)}
            setModalVisible={this.setModalVisible.bind(this)}
            setModalVisibleTwo={this.props.setModalVisible}
            updateOrder={this.updateOrder.bind(this)}
          />
        </ModalScene>
      );
    }
  }

  renderOrderType() {
    if (this.props.orderType === 'outgoing') {
      return (
        <CardSection style={styles.cardSection}>
          <Text style={styles.textStyleLabel}>Order Type:   </Text>
          <Text style={styles.textStyle}>{this.state.orderInfo.other}</Text>
          {this.renderIcon(this.state.orderInfo.other)}
        </CardSection>
      );
    } else {
      return null;
    }
  }

  renderStatus(type) {
    console.log('ORDER DETAILS TYPE: ', type);

    const status = type.charAt(0).toUpperCase() + type.slice(1);

    if (type === 'complete') {
      return (
        <View style={{ borderRadius: 5, height: (width - 50)/4, width: (width - 50)/4, borderWidth: 1, borderColor: '#ddd', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0288D1'  }}>
          <Text style={{ color: 'white' }}>{status}</Text>
        </View>
      );
    } else if (type === 'ready') {
      return (
        <View style={{ borderRadius: 5, height: (width - 50)/4, width: (width - 50)/4, borderWidth: 1, borderColor: '#ddd', alignItems: 'center', justifyContent: 'center', backgroundColor: '#4ff765'  }}>
          <Text style={{ color: 'white' }}>{status}</Text>
        </View>
      );
    } else if (type === 'processing') {
      return (
        <View style={{ borderRadius: 5, height: (width - 50)/4, width: (width - 50)/4, borderWidth: 1, borderColor: '#ddd', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF163'  }}>
          <Text style={{ color: 'white' }}>{status}</Text>
        </View>
      );
    } else {
      return (
        <View style={{ borderRadius: 5, height: (width - 50)/4, width: (width - 50)/4, borderWidth: 1, borderColor: '#ddd', alignItems: 'center', justifyContent: 'center' }}>
          <Text>{status}</Text>
        </View>
      );
    }
  }

  render() {
    if (this.state.loading) {
      return <Spinner loadingMessage="Restoring Order" />
    } else if (this.state.edit) {
      return (
        <View style={{ flex: 1 }}>
          {this.renderModal()}
        </View>
      )
    } else if (this.state.loadingOrder) {
      return <Spinner loadingMessage="Loading Order" />
    }
    const order = this.state.orderInfo;
    const date = moment(order.date).format('LL');
    const createDate = moment(order.createDate).format('LL');

    return (
        <View style={{ borderRadius: 5, paddingHorizontal: 15, paddingTop: 15, paddingBottom: 25, backgroundColor: 'white', flex: 1 }}>
          <View style={{ marginBottom: 15 }}>
            <CardSection style={{ justifyContent: 'center', paddingBottom: 15 }}>
              <Text style={styles.textStyleCompany}>{order.companyName}</Text>
            </CardSection>

            <CardSection style={{ padding: 10 }}>
              <Text style={styles.textStyleLabel}>Order:   </Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.textStyle}>{order.type}</Text>
              </View>
            </CardSection>

            <View style={{ height: (width - 50)/4, alignSelf: 'stretch', justifyContent: 'space-between', flexDirection: 'row', marginTop: 15, alignItems: 'center' }}>
              <View style={{ borderRadius: 5, height: (width - 50)/4, width: (width - 50)/4, borderWidth: 1, borderColor: '#ddd' }}>
                {this.renderIcon(order, order.other)}
              </View>
              <View style={{ borderRadius: 5, height: (width - 50)/4, width: (width - 50)/4, borderWidth: 1, borderColor: '#ddd', alignItems: 'center', justifyContent: 'center'  }}>
                <Icon
                  name='calendar-o'
                  type='font-awesome'
                  color='black'
                />
                <Text style={{ marginTop: 5 }}>{order.date}</Text>
              </View>

                {this.renderStatus(order.status)}

              <View style={{ borderRadius: 5, height: (width - 50)/4, width: (width - 50)/4, borderWidth: 1, borderColor: '#ddd', alignItems: 'center', justifyContent: 'center' }}>
                  <MaterialInitials
                    style={{
                      alignSelf: 'center',
                      shadowOffset: { width: 2, height: 2 },
                      shadowColor: 'black',
                      shadowOpacity: 5,
                      shadowRadius: 3
                    }}
                    backgroundColor={'white'}
                    color={'#DB2728'}
                    size={40}
                    text={order.createdBy}
                    single={false}
                  />
              </View>
            </View>
          </View>

          <Text style={{ alignSelf: 'center', fontWeight: '600' }}>Order Log</Text>

          {this.renderLog()}

          {this.renderModal()}

          {this.renderEditButton(order)}
        </View>
    );
  }
}

const styles = {
  textStyle: {
    fontSize: 16,
    paddingRight: 10
  },
  textStyleProcessing: {
    fontSize: 16,
    paddingRight: 10,
    color: '#fff163'
  },
  textStyleReady: {
    fontSize: 16,
    paddingRight: 10,
    color: '#4ff765'
  },
  textStyleComplete: {
    fontSize: 16,
    paddingRight: 10,
    color: '#0288D1'
  },
  textStyleLabel: {
    fontSize: 16,
    color: '#DB2728',
    fontWeight: '500'
  },
  textStyleCompany: {
    fontSize: 25,
    fontWeight: '600'
  },
  cardSection: {
    padding: 10,
    alignItems: 'center'
  },
  logStyle: {
    flexDirection: 'column',
    flex: 1,
    height: 200,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ddd',
    marginTop: 10,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    flex: 1
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
  },
  button: {
    flex: 1,
    borderRadius: 5,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  text: {
    paddingTop: 15,
    paddingBottom: 15,
    fontSize: 20
  },
  wrapper: {
    borderRadius: 5
  },
};

const mapStateToProps = (state) => {
  const log = _.map(state.orderLog.log_list, (val, uid) => {
    return { ...val, uid };
  });

  const orderInfo = state.orderInfo.orderInfo;

  const { createdBy } = log;


  const { newDate } = state.orderForm;
  const { loading } = state.orderLog;

  return { newDate, log, loading, createdBy, orderInfo };
};

export default connect(mapStateToProps, {
  orderUpdate, outgoingSave, outgoingDelete, logFetch, orderFetch, restoreOrder, incomingDelete
})(OrderDetails);
