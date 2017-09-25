import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, Modal, TouchableOpacity, Picker, TextInput, ScrollView } from 'react-native';
import _ from 'lodash';
import { SearchBar } from 'react-native-elements';
import { clientsFetch, vendorsFetch } from '../../actions';

const Item = Picker.Item;

class CompanyModal extends Component {

  state = {
    clients: [],
    vendors: [],
    text: '',
    company: ''
  }

  componentWillMount() {
    if (this.props.orderType === 'outgoing') {
      this.props.clientsFetch();
    } else if (this.props.orderType === 'incoming') {
      this.props.vendorsFetch();
    }
  }

  componentWillReceiveProps(nextProps) {
    const clients = _.filter(nextProps.clients, (o) => {
       return _.includes(o.companyName.toLowerCase(), this.state.text.toLowerCase()) === true;
     });

    const vendors = _.filter(nextProps.vendors, (o) => {
      return _.includes(o.companyName.toLowerCase(), this.state.text.toLowerCase()) === true;
    });

    this.setState({
      clients: clients,
      vendors: vendors
    });
  }

  filterClients(text, type) {
    this.setState({ company: text, text: text });

    if (type === 'client') {
      const clients = _.filter(this.props.clients, (o) => {
         return _.includes(o.companyName.toLowerCase(), text.toLowerCase()) === true;
      });

      this.setState({ clients });
    } else if (type === 'vendor') {
      const vendors = _.filter(this.props.vendors, (o) => {
         return _.includes(o.companyName.toLowerCase(), text.toLowerCase()) === true;
      });

      this.setState({ vendors });
    }
  }

  onValueChange = (key: string, value: string) => {
    const newState = {};
    newState[key] = value;
    this.setState(newState);
  };

  onButtonPress() {
    this.props.setCompany(this.state.company);
    this.setState({ text: '' })
    this.props.closeModal();
  }

  renderList() {
    if (this.props.orderType === 'outgoing') {
      return this.state.clients.map((client, index) => {
        return(
          <Item label={client.companyName} value={client.companyName} key={index} />
        )
      })
    } else if (this.props.orderType === 'incoming') {
      return this.state.vendors.map((vendor, index) => {
        return(
          <Item label={vendor.companyName} value={vendor.companyName} key={index} />
        )
      })
    }
  }

  renderCompanyList() {
    if (this.props.orderType === 'outgoing') {
      return this.state.clients.map((client, index) => {
        if (index === this.state.clients.length - 1) {
          return(
            <TouchableOpacity onPress={() => this.filterClients(client.companyName, 'client')} key={index}>
              <Text style={{ fontSize: 16, paddingTop: 5, paddingBottom: 30 }}>{client.companyName}</Text>
            </TouchableOpacity>
          )
        }
        return(
          <TouchableOpacity onPress={() => this.filterClients(client.companyName, 'client')} key={index}>
            <Text style={{ fontSize: 16, paddingVertical: 5 }}>{client.companyName}</Text>
          </TouchableOpacity>
        )
      })
    } else if (this.props.orderType === 'incoming') {
      return this.state.vendors.map((vendor, index) => {
        if (index === this.state.vendors.length - 1) {
          return(
            <TouchableOpacity onPress={() => this.filterClients(vendor.companyName, 'vendor')} key={index}>
              <Text style={{ fontSize: 16, paddingTop: 5, paddingBottom: 30 }}>{vendor.companyName}</Text>
            </TouchableOpacity>
          )
        }
        return(
          <TouchableOpacity onPress={() => this.filterClients(vendor.companyName, 'vendor')} key={index}>
            <Text style={{ fontSize: 16, paddingVertical: 5 }}>{vendor.companyName}</Text>
          </TouchableOpacity>
        )
      })
    }
  }

  renderSearchBar() {
    if (this.props.orderType === 'outgoing') {
      return (
        <SearchBar
          noIcon
          lightTheme
          value={this.state.text}
          onChangeText={(text) => this.filterClients(text, 'client')}
          placeholder='Company Name'
          returnKeyType={'done'}
          inputStyle={{ color: 'black' }}
        />
      );
    }
    return (
      <SearchBar
        noIcon
        lightTheme
        value={this.state.text}
        onChangeText={(text) => this.filterClients(text, 'vendor')}
        placeholder='Company Name'
        returnKeyType={'done'}
        inputStyle={{ color: 'black' }}
      />
    )
  }

  render() {
    const pickerItem = this.renderList();

    return (
      <Modal
        visible={this.props.visible}
        transparent
        animationType="slide"
        onRequestClose={() => this.props.closeModal()}
      >
        <View style={styles.containerStyle}>
          <View style={{ backgroundColor: '#292d29', marginHorizontal: 5, borderRadius: 25, height: 450, paddingBottom: 10 }}>
            <Text style={{ fontSize: 18, color: 'red', fontWeight: '600', alignSelf: 'center', paddingVertical: 15 }}>Company</Text>

            {this.renderSearchBar()}

            <ScrollView
              style={{ flex: 1, backgroundColor: 'white', padding: 15, marginBottom: 15 }}
            >
              {this.renderCompanyList()}
            </ScrollView>

            <TouchableOpacity onPress={() => this.onButtonPress()}>
              <View style={{ borderRadius: 25 }}>
                <Text style={{ fontSize: 18, color: 'white', fontWeight: '600', alignSelf: 'center', paddingVertical: 15 }}>Save</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
     </Modal>
    )
  }
}

const styles = {
  containerStyle: {
    position: 'relative',
    justifyContent: 'center',
    backgroundColor:'rgba(0, 0, 0, 0.75)',
    flex: 1,
    paddingRight: 10,
    paddingLeft: 10
  },
  container: {
    flex: 1,
    marginTop: 10,
    marginBottom: 10,
    justifyContent: 'center',
  },
  selectedDate: {
    backgroundColor: 'rgba(0,0,0,0)',
    color: '#000',
  }
};

const mapStateToProps = state => {
  const unsortedClients = _.map(state.clients.client_list, (val, uid) => {
    return { ...val, uid };
  });

  const sortedClients = _.sortBy(unsortedClients, ['companyName']);

  const unsortedVendors = _.map(state.clients.vendor_list, (val, uid) => {
    return { ...val, uid };
  });

  const sortedVendors = _.sortBy(unsortedVendors, ['companyName']);

  const clients = sortedClients;
  const vendors = sortedVendors;

  const loading = state.clients.loading;
  const modalVisible = state.clientForm.modalVisible;

  return { clients, vendors, loading, modalVisible };
};

export default connect(mapStateToProps, { clientsFetch, vendorsFetch })(CompanyModal);
