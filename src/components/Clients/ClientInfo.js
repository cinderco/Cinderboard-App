import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Alert,
  Platform,
  Linking
 } from 'react-native';
import { connect } from 'react-redux';
import { MapView, Location, Permissions, Constants } from 'expo';
import Communications from 'react-native-communications';
import { Icon, Button } from 'react-native-elements';
import { CardSection, Spinner } from '../common';
import { orderUpdate, fetchClient, vendorDelete, clientDelete } from '../../actions';
import ClientCreate from './ClientCreate';
import VendorCreate from './VendorCreate';
import ModalScene from '../ModalScene';
import OrderHistory from './OrderHistory';

class ClientInfo extends Component {
  state = {
    initialPosition: 'unknown',
    lastPosition: 'unknown',
    showModal: false,
    modalVisible: false,
    modalVisibleTwo: false,
    loadingClient: false,
    loadingVendor: false
  };

  componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ latitude: location.coords.latitude, longitude: location.coords.longitude });
  };

  componentWillReceiveProps(nextProps) {
    this.setState({ modalVisible: nextProps.modalVisible});
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible});
  }

  setModalVisibleTwo(visible) {
    this.setState({ modalVisibleTwo: visible});
  }

  getOrderHistory(company) {
    this.props.orderUpdate({ prop: 'currentCompany', value: company });

    this.setModalVisibleTwo({ modalVisibleTwo: !this.state.modalVisibleTwo});
  }

  handleGetDirections = (lat, long) => {


    Alert.alert(
      'Sure you want to leave?',
      'Pressing ok will take you from Cinderboard to Maps App',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        { text: 'Ok', onPress: () => {
          Platform.select({
              ios: () => {
                  Linking.openURL('http://maps.apple.com/maps?daddr=' + this.props.client.lat + ',' + this.props.client.long);
              },
              android: () => {
                  Linking.openURL('http://maps.google.com/maps?daddr=' + this.props.client.lat + ',' + this.props.client.long);
              }
          })();
        }
      }
    ],
      { cancelable: true }
    )
  }

  showModal() {
    this.setState({
      showModal: true
    });
  }

  onButtonPressDelete() {
    if (this.props.contactType === 'Client') {
      Alert.alert(
        'Delete',
        'Are you sure you want to delete this client?',
        [
          { text: 'Cancel', onPress: () => console.log('Canceled') },
          { text: 'OK', onPress: () => {
            this.setState({ loadingClient: true });
            this.props.clientDelete({ uid: this.props.client.uid, navigation: this.props.navigation, setModalVisible: this.props.setModalVisible });
            }
          },
        ]
      )
    } else if (this.props.contactType === 'Vendor') {
      Alert.alert(
        'Delete',
        'Are you sure you want to delete this vendor?',
        [
          { text: 'Cancel', onPress: () => console.log('Canceled') },
          { text: 'OK', onPress: () => {
            this.setState({ loadingVendor: true });
            this.props.vendorDelete({ uid: this.props.client.uid, navigation: this.props.navigation });
            }
          },
        ]
      )
    }
  }

  renderCreateComponent() {
    if (this.props.contactType === 'Client') {
      return (
        <ClientCreate
          client={this.props.client}
          navigation={this.props.navigation}
        />
      );
    } else if (this.props.contactType === 'Vendor') {
      return (
        <VendorCreate
          vendor={this.props.client}
          navigation={this.props.navigation}
        />
      );
    }
  }

  renderContactButtons() {
    if (this.props.client.phone === '' && this.props.client.email === '') {
      return (
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingRight: 40, paddingLeft: 40 }}>
            <View style={{ alignItems: 'center' }}>
              <Icon
                reverse
                name='phone'
                type='font-awesome'
                color='#ddd'
              />
            <Text style={{ color: '#ddd'}}>Call</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Icon
                reverse
                name='envelope-o'
                type='font-awesome'
                color='#ddd'
              />
              <Text style={{ color: '#ddd'}}>Email</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Icon
                reverse
                name='comment'
                type='font-awesome'
                color='#ddd'
              />
              <Text style={{ color: '#ddd'}}>Text</Text>
            </View>
        </View>
      );
    } else if (this.props.client.phone === '') {
      return (
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingRight: 40, paddingLeft: 40 }}>
          <View style={{ alignItems: 'center' }}>
            <Icon
              reverse
              name='phone'
              type='font-awesome'
              color='#ddd'
            />
          <Text style={{ color: '#ddd'}}>Call</Text>
          </View>
          <TouchableOpacity
            onPress={() => Communications.email([this.props.client.email], null, null, null, null)}
            style={{ flex: 1 }}
          >
            <View style={{ alignItems: 'center' }}>
              <Icon
                reverse
                name='envelope-o'
                type='font-awesome'
                color='#DB2728'
              />
              <Text>Email</Text>
            </View>
          </TouchableOpacity>
          <View style={{ alignItems: 'center' }}>
            <Icon
              reverse
              name='comment'
              type='font-awesome'
              color='#ddd'
            />
            <Text style={{ color: '#ddd'}}>Text</Text>
          </View>
        </View>
      );
    } else if (this.props.client.email === '') {
      return (
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingRight: 40, paddingLeft: 40 }}>
          <TouchableOpacity
            onPress={() => Communications.phonecall(this.props.client.phone, true)}
            style={{ flex: 1 }}
          >
            <View style={{ alignItems: 'center' }}>
              <Icon
                reverse
                name='phone'
                type='font-awesome'
                color='#DB2728'
              />
              <Text>Call</Text>
            </View>
          </TouchableOpacity>
          <View style={{ alignItems: 'center' }}>
            <Icon
              reverse
              name='envelope-o'
              type='font-awesome'
              color='#ddd'
            />
            <Text style={{ color: '#ddd'}}>Email</Text>
          </View>
          <TouchableOpacity
            onPress={() => Communications.text(this.props.client.phone)}
            style={{ flex: 1 }}
          >
            <View style={{ alignItems: 'center' }}>
              <Icon
                reverse
                name='comment'
                type='font-awesome'
                color='#DB2728'
              />
              <Text>Text</Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingRight: 40, paddingLeft: 40 }}>
          <TouchableOpacity
            onPress={() => Communications.phonecall(this.props.client.phone, true)}
            style={{ flex: 1 }}
          >
            <View style={{ alignItems: 'center' }}>
              <Icon
                reverse
                name='phone'
                type='font-awesome'
                color='#DB2728'
              />
              <Text>Call</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Communications.email([this.props.client.email], null, null, null, null)}
            style={{ flex: 1 }}
          >
            <View style={{ alignItems: 'center' }}>
              <Icon
                reverse
                name='envelope-o'
                type='font-awesome'
                color='#DB2728'
              />
              <Text>Email</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Communications.text(this.props.client.phone)}
            style={{ flex: 1 }}
          >
            <View style={{ alignItems: 'center' }}>
              <Icon
                reverse
                name='comment'
                type='font-awesome'
                color='#DB2728'
              />
              <Text>Text</Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    }
  }

  renderContact() {
    if (this.props.client.contact === '') {
      return (
        <CardSection style={styles.container}>
          <Text style={styles.textLabel}>Contact:</Text>
          <Text style={styles.textStyle}>-</Text>
        </CardSection>
      );
    } else {
      return (
        <CardSection style={styles.container}>
          <Text style={styles.textLabel}>Contact:</Text>
          <Text style={styles.textStyle}>{this.props.client.contact}</Text>
        </CardSection>
      );
    }
  }

  renderJobTitle() {
    if (this.props.client.jobTitle === '') {
      <CardSection style={styles.container}>
        <Text style={styles.textLabel}>Job Title:</Text>
        <Text style={styles.textStyle}>-</Text>
      </CardSection>
    } else {
      return (
        <CardSection style={styles.container}>
          <Text style={styles.textLabel}>Job Title:</Text>
          <Text style={styles.textStyle}>{this.props.client.jobTitle}</Text>
        </CardSection>
      );
    }
  }

  renderComma() {
    if (this.props.client.streetTwo === '') {
      return null;
    } else {
      return <Text>, </Text>;
    }
  }

  renderAddress() {
    const client = this.props.client;

    if (client.street === '' && client.streetTwo === '' && client.city === '' && client.zip === '' && client.state === '') {
      return null;
    } else {
      return (
        <CardSection style={styles.address}>
          <TouchableWithoutFeedback
            styles={{ flex: 1 }}
            onPress={() => this.handleGetDirections()}
          >
            <View style={{ flex: 2, flexDirection: 'column', flexWrap: 'wrap' }}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.addressTextStyle}>{this.props.client.street}</Text>
                <Text style={styles.addressTextStyle}>{this.renderComma()}{this.props.client.streetTwo}</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.addressTextStyle}>{this.props.client.city}</Text>
                <Text>, </Text>
                <Text style={styles.addressTextStyle}>{this.props.client.state}</Text>
                <Text> </Text>
                <Text style={styles.addressTextStyle}>{this.props.client.zip}</Text>
              </View>
            </View>
            </TouchableWithoutFeedback>
            <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row' }}>
              <MapView
                initialRegion={{
                  latitude: this.props.client.lat,
                  longitude: this.props.client.long,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                style={{ height: 120, width: 120, borderRadius: 25, alignSelf: 'center' }}
                onPress={() => this.handleGetDirections()}
              />
            </View>
        </CardSection>
      );
    }
  }

  renderPhone() {
    if (this.props.client.phone === '') {
      return (
        <TouchableOpacity
          onPress={() => Communications.phonecall(this.props.client.phone, true)}
          style={{ flex: 1 }}
        >
          <CardSection style={styles.container}>
            <Icon
              name='phone'
              type='font-awesome'
              color='#DB2728'
            />
          <Text style={styles.textStylePhone}>-</Text>
          </CardSection>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          onPress={() => Communications.phonecall(this.props.client.phone, true)}
          style={{ flex: 1 }}
        >
          <CardSection style={styles.container}>
            <Icon
              name='phone'
              type='font-awesome'
              color='#DB2728'
            />
          <Text style={styles.textStylePhone}>{this.props.client.phone}</Text>
          </CardSection>
        </TouchableOpacity>
      );
    }
  }

  renderEmail() {
    if (this.props.client.email === '') {
      return (
        <TouchableOpacity
          onPress={() => Communications.email([this.props.client.email], null, null, null, null)}
          style={{ flex: 1 }}
        >
          <CardSection style={styles.container}>
            <Icon
              name='envelope-o'
              type='font-awesome'
              color='#DB2728'
            />
          <Text style={styles.textStylePhone}>-</Text>
          </CardSection>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          onPress={() => Communications.email([this.props.client.email], null, null, null, null)}
          style={{ flex: 1 }}
        >
          <CardSection style={styles.container}>
            <Icon
              name='envelope-o'
              type='font-awesome'
              color='#DB2728'
            />
          <Text style={styles.textStylePhone}>{this.props.client.email}</Text>
          </CardSection>
        </TouchableOpacity>
      );
    }
  }

  render() {
    const client = this.props.client;
    const date = new Date(client.createDate);
    const shortDate = date.toLocaleDateString();

    if (this.state.loadingClient === true) {
      return <Spinner loadingMessage={'Deleting Client'} />;
    } else if (this.state.loadingVendor === true) {
      return <Spinner loadingMessage={'Deleting Vendor'} />;
    }
        return (
          <ScrollView style={{ padding: 15, backgroundColor: 'white' }}>
            <Text style={styles.companyStyle}>{this.props.client.companyName}</Text>

            {this.renderContactButtons()}

            {this.renderContact()}

            {this.renderJobTitle()}

            {this.renderAddress()}

            {this.renderPhone()}

            {this.renderEmail()}

            <TouchableOpacity
              onPress={() => this.getOrderHistory(this.props.client.companyName)}
            >
              <View style={styles.button}>
                <Text style={styles.text}>Order History</Text>
              </View>
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between' }}>
              <TouchableOpacity
                onPress={() => this.setModalVisible({ modalVisible: !this.state.modalVisible})}
                style={[styles.button, { marginRight: 10 }]}
              >
                <View>
                  <Text style={styles.text}>Edit {this.props.contactType}</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => this.onButtonPressDelete()}
                style={styles.button}
              >
                <View>
                  <Icon
                    name='trash'
                    type='font-awesome'
                    color='red'
                  />
                </View>
              </TouchableOpacity>
            </View>

            <Text
              style={{
                alignSelf: 'center',
                fontWeight: '600',
                marginTop: 15,
                marginBottom: 15,
                fontSize: 15
              }}
            >
                Client Since: {shortDate}
            </Text>

            <ModalScene
              modalVisible={this.state.modalVisibleTwo}
              setModalVisible={this.setModalVisibleTwo.bind(this)}
              title={`Order History`}
            >
              <OrderHistory
                client={this.props.client}
                navigation={this.props.navigation}
              />
            </ModalScene>

            <ModalScene
              modalVisible={this.state.modalVisible}
              setModalVisible={this.setModalVisible.bind(this)}
              title={`Edit ${this.props.contactType}`}
            >
              {this.renderCreateComponent()}
            </ModalScene>
          </ScrollView>
        );
  }
}

const styles = {
  address: {
    alignItems: 'center'
  },
  companyStyle: {
    fontSize: 30,
    fontWeight: '600',
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 20
  },
  container: {
    height: 60,
    alignItems: 'center'
  },
  textStyle: {
    fontSize: 18,
  },
  addressTextStyle: {
    fontSize: 16
  },
  textStylePhone: {
    fontSize: 18,
    paddingLeft: 25
  },
  button: {
    flex: 1,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#DB2728',
    marginBottom: 10,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    color: '#DB2728',
    paddingTop: 15,
    paddingBottom: 15,
    fontSize: 20
  },
  textLabel: {
    fontSize: 18,
    color: '#DB2728',
    marginRight: 20
  }
};

const mapStateToProps = (state) => {
  const {
    modalVisible
   } = state.clientForm;

  return { modalVisible };
};

export default connect(mapStateToProps, { orderUpdate, fetchClient, vendorDelete, clientDelete })(ClientInfo);
