import _ from 'lodash';
import Search from 'react-native-search-box';
import React, { Component } from 'react';
import { Icon, Button, SearchBar } from 'react-native-elements';
import { connect } from 'react-redux';
import { ListView, View, Text, StatusBar, ScrollView } from 'react-native';
import { vendorsFetch, vendorDelete, showModalChange, orderUpdate } from '../../actions';
import VendorListItem from './VendorListItem';
import { Spinner, SceneHeader } from '../common';
import ModalScene from '../ModalScene';
import VendorCreate from './VendorCreate';

class VendorList extends Component {
  constructor(props) {
    super(props);

    this.clear = this.clear.bind(this);
  }

  static navigationOptions = {
    title: 'Vendors',
    tabBarLabel: 'Vendors',
    tabBarIcon: ({ tintColor }) => (
      <Icon
        name='users'
        type='font-awesome'
        color={tintColor}
      />
    ),
  };

  state = {
    text: '',
    showCancel: false,
    vendors: [],
    modalVisible: false
  }

  componentWillMount() {
    this.props.vendorsFetch();
  }

  componentWillReceiveProps(nextProps) {
    const vendors = _.filter(nextProps.vendors, (o) => {
       return _.includes(o.companyName.toLowerCase(), this.state.text.toLowerCase()) === true;
     });

    this.setState({ modalVisible: nextProps.modalVisible });

    this.setState({
      vendors: vendors
    });
  }

  rightButtonPress() {
    this.setModalVisible({ modalVisible: !this.state.modalVisible});
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible});
  }

  clear() {
    this.input.clear();
    this.filterVendors('');
  }

  filterVendors(text) {
    this.setState({ text: text });

    const vendors = _.filter(this.props.vendors, (o) => {
       return _.includes(o.companyName.toLowerCase(), text.toLowerCase()) === true;
     });

    this.setState({ vendors });
  }

  renderList() {
    return this.state.vendors.map((vendor, index) => {
      return(
        <VendorListItem vendor={vendor} key={index}/>
      )
    })
  }

  renderCancel() {
    if (this.state.showCancel === true) {
      return (
        <TouchableOpacity onPress={() => {
            Keyboard.dismiss();
            this.setState({ text: '', showCancel: false })
          }}
        >
          <Text style={{ color: 'white', marginLeft: 10, marginRight: 5 }}>Cancel</Text>
        </TouchableOpacity>
      );
    } else {
      return null;
    }
  }

  renderVendors() {
    if (this.props.vendors.length === 0) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 18 }}>No Vendors</Text>
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1 }}>
          <View>
            <SearchBar
              onChangeText={(text) => this.filterVendors(text)}
              placeholder='Search'
              textInputRef={(input) => { this.input = input; }}
              returnKeyType={'done'}
            />

            <Icon
              color='#86939e'
              name='clear'
              onPress={() => this.clear()}
              containerStyle={{ position: 'absolute', top: 0, bottom: 0, right: 15, zIndex: 5000 }}
              size={20}
              underlayColor='#303338'
            />
          </View>

          <ScrollView keyboardShouldPersistTaps='always'>
            {this.renderList()}
          </ScrollView>
        </View>
      );
    }
  }

  render() {
    if (this.props.loading) {
      return <Spinner size="large" />;
    }
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <StatusBar
          barStyle="light-content"
        />
        <SceneHeader
          title={'Vendors'}
          navigation={this.props.navigation}
          rightButtonPress={this.rightButtonPress.bind(this)}
        />

        {this.renderVendors()}

        <ModalScene
          modalVisible={this.state.modalVisible}
          setModalVisible={this.setModalVisible.bind(this)}
          title={`New Vendor`}
        >
          <VendorCreate
            vendor={this.props.vendor}
            navigation={this.props.navigation}
            contactType={'Vendor'}
          />
        </ModalScene>
      </View>
    );
  }
}

const mapStateToProps = state => {
  const unsortedVendors = _.map(state.clients.vendor_list, (val, uid) => {
    return { ...val, uid };
  });

  const sortedVendors = _.sortBy(unsortedVendors, ['companyName']);

  const vendors = sortedVendors;

  const loading = state.clients.loading;
  const modalVisible = state.clientForm.modalVisible;

  return { vendors, loading, modalVisible };
};

export default connect(mapStateToProps, {
  vendorsFetch, vendorDelete, showModalChange, orderUpdate
})(VendorList);
