import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { clientUpdate, clientCreate, clearClientForm } from '../../actions';
import ClientForm from './ClientForm';
import { Spinner } from '../common';

class ClientCreate extends Component {
  static navigationOptions = {
    title: 'New Client',
    header: ({ navigate }) => ({
        style: {
            backgroundColor: 'black'
        },
        title: 'New Client',
        tintColor: 'white'
    }),
    tabBar: {
      visible: false
    }
  };

  state = {
    loading: false,
    loadingDelete: false
  }

  setLoading() {
    this.setState({ loading: true })
  }

  render() {
    if(this.state.loading) {
      return <Spinner loadingMessage={'Saving Client'} />;
    } else if(this.state.loadingDelete) {
      return <Spinner loadingMessage={'Deleting Client'} />;
    }else if (this.props.client) {
      return (
        <KeyboardAwareScrollView style={{backgroundColor: '#292d29', paddingHorizontal: 10, paddingTop: 10 }}>
            <ClientForm
              {...this.props}
              navigation={this.props.navigation}
              contactType={'client'}
              client={this.props.client}
              setLoading={this.setLoading.bind(this)}
            />
        </KeyboardAwareScrollView>
      );
    }
    return (
      <KeyboardAwareScrollView style={{backgroundColor: '#292d29', paddingHorizontal: 10, paddingTop: 10 }}>
          <ClientForm
            client={this.props.client}
            navigation={this.props.navigation}
            contactType={'client'} 
            setLoading={this.setLoading.bind(this)}
          />
      </KeyboardAwareScrollView>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    loading, loadingDelete
   } = state.clientForm;

  return { loading, loadingDelete };
};

export default connect(mapStateToProps, {
  clientUpdate, clientCreate, clearClientForm
})(ClientCreate);
