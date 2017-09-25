import _ from 'lodash';
import React, { Component } from 'react';
import { View, Text, Alert, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import Geocoder from 'react-native-geocoding';
import { clientUpdate, clientDelete, vendorDelete, clientSave, vendorSave, clientCreate, vendorCreate } from '../../actions';
import { CardSection, Input, Button, Spinner, ConfirmAlert } from '../common';

class ClientForm extends Component {
  state = {
    visible: false,
    date: '',
    loading: false,
    companyName: '',
    contact: '',
    jobTitle: '',
    phone: '',
    email: '',
    street: '',
    streetTwo: '',
    city: '',
    zip: '',
    state: '',
    companyError: false,
    createDate: ''
  }

  componentDidMount() {
    if (this.props.client) {
      _.forEach(this.props.client, (value, key) => {
        this.setState({ [key]: value });
      });
    } else if (this.props.vendor) {
      _.forEach(this.props.vendor, (value, key) => {
        this.setState({ [key]: value });
      });
    }
  }

  onButtonPress() {
    if (this.state.companyName === '') {
      Alert.alert(
        'Company Name Blank',
        'Please enter a company name',
        [
          { text: 'Ok', onPress: () => console.log('Canceled') },
        ]
      )
    } else {
      this.setState({ loading: true });
      const { companyName, contact, jobTitle, phone, email, street, streetTwo, city, zip, state, uid } = this.state;
      const address = street + ', ' + city + ', ' + state + ' ' + zip;
      const testAddress = street + streetTwo + city + state + zip;

      if (testAddress === '') {
        if (this.props.contactType === 'client') {
            this.props.clientCreate({
              companyName, contact, jobTitle, phone, email, street, streetTwo, city, zip, state, lat: '', long: '', navigation: this.props.navigation
            });
        } else if (this.props.contactType === 'vendor') {
            this.props.vendorCreate({
              companyName, contact, jobTitle, phone, email, street, streetTwo, city, zip, state, lat: '', long: '', navigation: this.props.navigation
            });
        }
      } else {
        Geocoder.setApiKey('AIzaSyBljWinBqN_Jv9jzdEJiYRSat6oG-quVsg');

        Geocoder.getFromLocation(address).then(
            json => {
              const location = json.results[0].geometry.location;
              const lat = location.lat;
              const long = location.lng;

              if (this.props.contactType === 'client') {
                  this.props.clientCreate({
                    companyName, contact, jobTitle, phone, email, street, streetTwo, city, zip, state, lat, long, navigation: this.props.navigation
                  });
              } else if (this.props.contactType === 'vendor') {
                  this.props.vendorCreate({
                    companyName, contact, jobTitle, phone, email, street, streetTwo, city, zip, state, lat, long, navigation: this.props.navigation
                  });
              }
            },
            error => {
              Alert.alert(
                'Incorrect Address',
                'Please enter a valid address',
                [
                  { text: 'Ok', onPress: () => console.log('Canceled') },
                ]
              )
            }
          );
      }
    }
  }

  onButtonPressEdit() {
    this.props.setLoading();

    const { companyName, contact, jobTitle, phone, email, street, streetTwo, city, zip, state, createDate, uid } = this.state;
    const address = street + ', ' + city + ', ' + state + ' ' + zip;
    const testAddress = street + streetTwo + city + state + zip;

    if (testAddress === '') {
      if (this.props.contactType === 'client') {
          this.props.clientSave({
            companyName, contact, jobTitle, phone, email, street, streetTwo, city, zip, state, lat: '', long: '', createDate, uid, navigation: this.props.navigation
          });
      } else if (this.props.contactType === 'vendor') {
          this.props.vendorSave({
            companyName, contact, jobTitle, phone, email, street, streetTwo, city, zip, state, lat: '', long: '', createDate, uid, navigation: this.props.navigation
          });
      }
    } else {
      Geocoder.setApiKey('AIzaSyBljWinBqN_Jv9jzdEJiYRSat6oG-quVsg');

      Geocoder.getFromLocation(address).then(
          json => {
            const location = json.results[0].geometry.location;
            const lat = location.lat;
            const long = location.lng;

            if (this.props.contactType === 'client') {
                this.props.clientSave({
                  companyName, contact, jobTitle, phone, email, street, streetTwo, city, zip, state, lat, long, createDate, uid, navigation: this.props.navigation
                });
            } else if (this.props.contactType === 'vendor') {
                this.props.vendorSave({
                  companyName, contact, jobTitle, phone, email, street, streetTwo, city, zip, state, lat, long, createDate, uid, navigation: this.props.navigation
                });
            }
          },
          error => {
            Alert.alert(
              'Incorrect Address',
              'Please enter a valid address',
              [
                { text: 'Ok', onPress: () => console.log('Canceled') },
              ]
            )
          }
      );
    }
  }

  makeModalVisible() {
    this.setState({
      visible: true
    });
  }

  closeModal() {
    this.setState({
      visible: false
    });
  }

  renderButton() {
    if (this.props.client || this.props.vendor) {
      return (
        <View style={{ flexDirection: 'row' }}>
          <Button onPress={() => this.onButtonPressEdit()} style={{ marginTop: 15 }}>
            Save
          </Button>
        </View>
      );
    } else {
      return (
        <Button onPress={this.onButtonPress.bind(this)} style={{ marginTop: 15 }}>
          Add New Client
        </Button>
      );
    }
  }

  render() {
    if (this.state.loading === true) {
      return (
        <View style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center'}}>
          <Spinner size="large" loadingMessage={'Saving'}/>
        </View>
      );
    }
        return (
          <View>
            <View style={{ borderRadius: 5, paddingBottom: 20, backgroundColor: 'white', marginBottom: 15 }}>
              <CardSection style={{ justifyContent: 'center', borderBottomWidth: 1, marginTop: 10 }}>
                <Text style={{ color: '#DB2728', paddingVertical: 5, fontSize: 18 }}>Contact Info</Text>
              </CardSection>
              <CardSection>
                <Input
                  label="Company"
                  placeholder="company name"
                  value={this.state.companyName}
                  onChangeText={text => this.setState({ companyName: text })}
                  returnKeytype={'done'}
                  selectionColor={'#DB2728'}
                />
              </CardSection>
              <CardSection>
                <Input
                  label="Name"
                  placeholder="contact name"
                  value={this.state.contact}
                  onChangeText={text => this.setState({ contact: text })}
                  style={{ color: 'red' }}
                />
              </CardSection>

              <CardSection>
                <Input
                  label="Job Title"
                  placeholder="job title"
                  value={this.state.jobTitle}
                  onChangeText={text => this.setState({ jobTitle: text })}
                />
              </CardSection>

              <CardSection>
                <Input
                  label="Phone"
                  placeholder="555-555-5555"
                  value={this.state.phone}
                  onChangeText={text => this.setState({ phone: text })}
                  keyboardType={'numbers-and-punctuation'}

                />
              </CardSection>

              <CardSection>
                <Input
                  label="email"
                  placeholder="example@gmail.com"
                  value={this.state.email}
                  onChangeText={text => this.setState({ email: text })}
                  keyboardType={'email-address'}
                />
              </CardSection>
            </View>

            <View style={{ borderRadius: 5, paddingBottom: 20, backgroundColor: 'white' }}>
              <CardSection
                style={{
                  justifyContent: 'center',
                  borderBottomWidth: 1,
                  marginTop: 10
                }}
              >
                <Text style={{ color: '#DB2728', paddingVertical: 5, fontSize: 18 }}>Address</Text>
              </CardSection>
              <CardSection>
                <Input
                  label="Street1"
                  placeholder="Street"
                  value={this.state.street}
                  onChangeText={text => this.setState({ street: text })}
                />
              </CardSection>
              <CardSection>
                <Input
                  label="Street2"
                  placeholder="Apt, suite, unit, bld, etc.."
                  value={this.state.streetTwo}
                  onChangeText={text => this.setState({ streetTwo: text })}
                />
              </CardSection>
              <CardSection>
                <Input
                  label="City"
                  placeholder="City"
                  value={this.state.city}
                  onChangeText={text => this.setState({ city: text })}
                />
              </CardSection>
              <CardSection>
                <Input
                  label="Zip"
                  placeholder="Zip"
                  value={this.state.zip}
                  onChangeText={text => this.setState({ zip: text })}
                  keyboardType={'numeric'}
                />
              </CardSection>

              <CardSection>
                <Input
                  label="State"
                  placeholder="State"
                  value={this.state.state}
                  onChangeText={text => this.setState({ state: text })}
                />
              </CardSection>
            </View>

            {this.renderButton()}
          </View>
        );
      }
}

const styles = {
  buttonStyle: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DB2728',
    borderRadius: 5,
    borderColor: '#db2728',
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 5
  }
};

const mapStateToProps = (state) => {
  const { companyName, contact, jobTitle, phone, email, address } = state.clientForm;

  return { companyName, contact, jobTitle, phone, email, address };
};

export default connect(mapStateToProps, { clientUpdate, clientDelete, vendorDelete, clientSave, vendorSave, clientCreate, vendorCreate  })(ClientForm);
