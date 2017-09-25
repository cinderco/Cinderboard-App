import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';
import MapView from 'react-native-maps';
import Communications from 'react-native-communications';
import { Icon, Button } from 'react-native-elements';
import getDirections from 'react-native-google-maps-directions';
import { CardSection } from '../common';
import { orderUpdate } from '../../actions';

class VendorInfo extends Component {
  static navigationOptions = {
    title: 'Vendor Info',
    header: ({ navigate, state }) => ({
        right: (
          <Button
            title='Edit'
            onPress={() => navigate('newVendor', { vendor: state.params.vendor})}
            backgroundColor="rgba(0,0,0,0)"
            color="white"
            buttonStyle={{ justifyContent: 'flex-end' }}
          />
        ),
        style: {
            backgroundColor: 'black'
        },
        title: 'Vendor Info',
        tintColor: 'white'
    }),
    tabBar: {
      visible: false
    }
  };

  state = {
    initialPosition: 'unknown',
    lastPosition: 'unknown',
    showModal: false
  };

  componentDidMount() {
    this.watchID = navigator.geolocation.watchPosition((position) => {
      const lastPosition = JSON.stringify(position);
      this.setState({ lastPosition });
    });
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  getLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const initialPosition = JSON.stringify(position);
        this.handleGetDirections(latitude, longitude);
      },
      (error) => console.log(JSON.stringify(error)),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }

  getOrderHistory(company) {
    const { navigate } = this.props.navigation;
    this.props.orderUpdate({ prop: 'currentCompany', value: company });

    navigate('OrderHistory', { name: company });
  }

  watchID: ?number = null;

  handleGetDirections = (lat, long) => {
    const { params } = this.props.navigation.state;
    const vendor = params.vendor;

    const data = {
       source: {
        latitude: lat,
        longitude: long
      },
      destination: {
        latitude: vendor.lat,
        longitude: vendor.long
      }
    };

    getDirections(data);
  }

  showModal() {
    this.setState({
      showModal: true
    });
  }

  render() {
    const { params } = this.props.navigation.state;
    const vendor = params.vendor;
    const date = new Date(vendor.createDate);
    const shortDate = date.toLocaleDateString();

        return (
          <ScrollView style={{ padding: 15, backgroundColor: 'white' }}>
            <Text style={styles.companyStyle}>{this.props.vendor.companyName}</Text>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingRight: 40, paddingLeft: 40 }}>
              <TouchableOpacity
                onPress={() => Communications.phonecall(this.props.vendor.phone, true)}
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
                onPress={() => Communications.phonecall([this.props.vendor.email], null, null, null, null)}
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
                onPress={() => Communications.text(this.props.vendor.phone)}
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
            <CardSection style={styles.container}>
              <Text style={styles.textLabel}>Contact:</Text>
              <Text style={styles.textStyle}>{this.props.vendor.contact}</Text>
            </CardSection>
            <CardSection style={styles.container}>
              <Text style={styles.textLabel}>Job Title:</Text>
              <Text style={styles.textStyle}>{this.props.vendor.jobTitle}</Text>
            </CardSection>

              <CardSection style={styles.address}>
              <TouchableWithoutFeedback
                styles={{ flex: 1 }}
                onPress={() => this.getLocation(this.handleGetDirections.bind(this))}
              >
                <View style={{ flex: 1, flexDirection: 'column' }}>
                  <View>
                    <Text style={styles.textStyle}>{this.props.vendor.street}</Text>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.textStyle}>{this.props.vendor.city}</Text>
                    <Text>, </Text>
                    <Text style={styles.textStyle}>{this.props.vendor.state}</Text>
                    <Text> </Text>
                    <Text style={styles.textStyle}>{this.props.vendor.zip}</Text>
                  </View>
                </View>
                </TouchableWithoutFeedback>
                <View style={{ flex: 1 }}>
                  <MapView
                    initialRegion={{
                      latitude: this.props.vendor.lat,
                      longitude: this.props.vendor.long,
                      latitudeDelta: 0.0922,
                      longitudeDelta: 0.0421,
                    }}
                    style={{ height: 150, width: 150, borderRadius: 50, alignSelf: 'center' }}
                    onPress={() => this.getLocation(this.handleGetDirections.bind(this))}
                  />
                </View>
              </CardSection>

            <TouchableOpacity
              onPress={() => Communications.phonecall(this.props.vendor.phone, true)}
              style={{ flex: 1 }}
            >
              <CardSection style={styles.container}>
                <Icon
                  name='phone'
                  type='font-awesome'
                  color='#DB2728'
                />
              <Text style={styles.textStylePhone}>{this.props.vendor.phone}</Text>
              </CardSection>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => Communications.email([this.props.vendor.email], null, null, null, null)}
              style={{ flex: 1 }}
            >
              <CardSection style={styles.container}>
                <Icon
                  name='envelope-o'
                  type='font-awesome'
                  color='#DB2728'
                />
              <Text style={styles.textStylePhone}>{this.props.vendor.email}</Text>
              </CardSection>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.getOrderHistory(this.props.vendor.companyName)}
            >
              <View style={styles.button}>
                <Text style={styles.text}>Order History</Text>
              </View>
            </TouchableOpacity>

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
          </ScrollView>
        );
  }
}

const styles = {
  address: {
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15
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
  const { vendor } = state.clients;

  return { vendor };
};

export default connect(mapStateToProps, { orderUpdate })(VendorInfo);
