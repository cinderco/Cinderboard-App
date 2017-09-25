import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { vendorUpdate, vendorCreate, clearClientForm } from '../../actions';
import ClientForm from './ClientForm';
import { Spinner } from '../common';

class VendorCreate extends Component {
  state = {
    loading: false,
    loadingDelete: false
  }

  setLoading() {
    this.setState({ loading: true })
  }

  render() {
    if(this.state.loading) {
      return <Spinner loadingMessage={'Saving Vendor'} />;
    } else if(this.state.loadingDelete) {
      return <Spinner loadingMessage={'Deleting Vendor'} />;
    }else if (this.props.vendor) {
      return (
        <KeyboardAwareScrollView style={{backgroundColor: '#292d29', paddingHorizontal: 10, paddingTop: 10 }}>
            <ClientForm
              {...this.props}
              navigation={this.props.navigation}
              contactType={'vendor'}
              vendor={this.props.vendor}
              setLoading={this.setLoading.bind(this)}
            />
        </KeyboardAwareScrollView>
      );
    }
    return (
      <KeyboardAwareScrollView style={{backgroundColor: '#292d29', paddingHorizontal: 10, paddingTop: 10 }}>
          <ClientForm
            vendor={this.props.vendor}
            navigation={this.props.navigation}
            contactType={'vendor'}
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
  vendorUpdate, vendorCreate, clearClientForm
})(VendorCreate);
