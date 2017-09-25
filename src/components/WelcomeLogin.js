import React, { Component } from 'react';
import { Text, View, TouchableOpacity, AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import { Button } from 'react-native-elements';
import ResponsiveImage from 'react-native-responsive-image';
import { fetchAllUsers } from '../actions';

const uri = 'https://s3-us-west-1.amazonaws.com/cinderco/cinder_logo.jpg';

class WelcomeLogin extends Component {
  state = {
    loginButton: false
  }

  componentDidMount() {
    this.props.fetchAllUsers();

    const { navigate } = this.props.navigation;

    setTimeout(() => this.setState({ loginButton: true }), 3000);
  }

  renderButton() {
    const { navigate } = this.props.navigation;
    
    if (this.state.loginButton === true) {
      return (
        <View style={{ alignSelf: 'center', flexDirection: 'row', marginTop: 60}}>
          <Text onPress={() => navigate('auth')} style={{ color: 'white', paddingRight: 15, fontSize: 16 }}>Log in</Text>
        </View>
      );
    } else {
      return null;
    }
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'space-between', backgroundColor: '#0C120C' }}>
        <View style={{ flex: 1.5, justifyContent: 'center' }}>
          <ResponsiveImage
            style={{
              height: 80,
              marginLeft: 15,
              marginRight: 15
            }}
            source={{ uri, }}
          />

          {this.renderButton()}

        </View>
      </View>
    );
  }
}

const styles = {
  textStyle: {
    alignSelf: 'center',
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    paddingTop: 10,
    paddingBottom: 10
  },
  buttonStyle: {
    height: 40,
    alignSelf: 'stretch',
    backgroundColor: '#DB2728',
    marginLeft: 15,
    marginRight: 15,
    marginTop: 15,
    borderRadius: 5
  }
};

export default connect(null, { fetchAllUsers })(WelcomeLogin);
