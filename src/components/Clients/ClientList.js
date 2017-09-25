import _ from 'lodash';
import React, { Component } from 'react';
import { Icon, Button, SearchBar } from 'react-native-elements';
import { connect } from 'react-redux';
import { ListView, View, Text, StatusBar, TextInput, ScrollView, TouchableOpacity, Keyboard } from 'react-native';
import { clientsFetch, clientDelete, showModalChange, orderUpdate } from '../../actions';
import ClientListItem from './ClientListItem';
import { Spinner, SceneHeader } from '../common';
import ModalScene from '../ModalScene';
import ClientCreate from './ClientCreate';

class ClientList extends Component {
  constructor(props) {
    super(props);

    this.clear = this.clear.bind(this);
  }

  static navigationOptions = {
    title: 'Clients',
    tabBarLabel: 'Clients',
    tabBarIcon: ({ tintColor }) => (
      <Icon
        name='address-book'
        type='font-awesome'
        color={tintColor}
      />
    ),
  };

  state = {
    text: '',
    showCancel: false,
    clients: [],
    modalVisible: false,

  }

  componentWillMount() {
    this.props.clientsFetch();
  }

  componentWillReceiveProps(nextProps) {
    const clients = _.filter(nextProps.clients, (o) => {
       return _.includes(o.companyName.toLowerCase(), this.state.text.toLowerCase()) === true;
     });

    this.setState({ modalVisible: nextProps.modalVisible });

    this.setState({
      clients: clients
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
    this.filterClients('');
  }

  filterClients(text) {
    this.setState({ text: text });

    const clients = _.filter(this.props.clients, (o) => {
       return _.includes(o.companyName.toLowerCase(), text.toLowerCase()) === true;
     });

    this.setState({ clients });
  }

  renderList() {
    return this.state.clients.map((client, index) => {
      return(
        <ClientListItem client={client} key={index} />
      )
    })
  }

  renderClients() {
    if (this.props.clients.length === 0) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 18 }}>No Clients</Text>
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1 }}>
          <View>
            <View>
              <SearchBar
                onChangeText={(text) => this.filterClients(text)}
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
          title={'Clients'}
          navigation={this.props.navigation}
          rightButtonPress={this.rightButtonPress.bind(this)}
        />

        {this.renderClients()}

        <ModalScene
          modalVisible={this.state.modalVisible}
          setModalVisible={this.setModalVisible.bind(this)}
          title={`New Client`}
        >
          <ClientCreate
            client={this.props.client}
            navigation={this.props.navigation}
            contactType={'Client'}
          />
        </ModalScene>
      </View>
    );
  }
}

const mapStateToProps = state => {
  const unsortedClients = _.map(state.clients.client_list, (val, uid) => {
    return { ...val, uid };
  });

  const sortedClients = _.sortBy(unsortedClients, ['companyName']);

  const clients = sortedClients;

  const loading = state.clients.loading;
  const modalVisible = state.clientForm.modalVisible;

  return { clients, loading, modalVisible };
};

export default connect(mapStateToProps, {
  clientsFetch, clientDelete, showModalChange, orderUpdate
})(ClientList);
