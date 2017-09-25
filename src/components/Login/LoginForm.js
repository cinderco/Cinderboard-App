import _ from 'lodash';
import firebase from 'firebase';
import React, { Component } from 'react';
import { Text, View, TouchableOpacity, AsyncStorage, ActivityIndicator } from 'react-native';
import ResponsiveImage from 'react-native-responsive-image';
import { connect } from 'react-redux';
import { loginUser, checkIfLoggedIn, fetchAllUsers, fetchMessagesUnread } from '../../actions';
import { CardSection, Input, Spinner } from '../common';
import LoggingIn from './LoggingIn';

const uri = 'https://s3-us-west-1.amazonaws.com/cinderco/cinder_logo.jpg';

class LoginForm extends Component {
  state = {
    user: null,
    users: [],
    loading: false,
    email: '',
    password: '',
    error: ''
  }

  componentWillMount() {
    const { navigate } = this.props.navigation;

    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        navigate('main');
      }
    });
  }

  onEmailChange(text) {
    this.setState({ email: text });
  }

  onPasswordChange(text) {
    this.setState({ password: text });
  }

  setError(message) {
    this.setState({ error: message });
  }

  setLoading(bool) {
    this.setState({ loading: bool });
  }

  onButtonPress() {
    if (this.state.email === '' || this.state.password === '') {
      this.setState({ error: 'Please enter email and password!'})
    } else {
      this.setState({ loading: true, error: '' });
      const { email, password } = this.state;

      this.props.loginUser({ email, password, setError: this.setError.bind(this), setLoading: this.setLoading.bind(this) });
    }
  }

  renderError() {
    if (this.state.error === '') {
      return null;
    } else {
      return <Text style={{ color: 'red', fontSize: 16, fontWeight: '600', alignSelf: 'center', marginTop: 15 }}>{this.state.error}</Text>;
    }
  }

  renderButton() {
    return (
      <TouchableOpacity onPress={this.onButtonPress.bind(this)} style={styles.buttonStyle}>
        <Text style={styles.textStyle}>Log in</Text>
      </TouchableOpacity>
    );
  }

  render() {
    if (this.state.loading) {
      return <LoggingIn />;
    }
    return (
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#0C120C', alignItems: 'center' }}>
          <View style={{ alignSelf: 'stretch', borderRadius: 5, paddingHorizontal: 15 }}>
            <CardSection style={{ borderRadius: 5 }}>
              <Input
                label="Email"
                placeholder="email@gmail.com"
                onChangeText={this.onEmailChange.bind(this)}
                value={this.state.email}
                autoCapitalize={'none'}
              />
            </CardSection>

            <CardSection style={{ borderRadius: 5, marginTop: 5 }}>
              <Input
                secureTextEntry
                label="Password"
                placeholder="password"
                onChangeText={this.onPasswordChange.bind(this)}
                value={this.state.password}
              />
            </CardSection>
          </View>

          {this.renderError()}
          {this.renderButton()}
      </View>
    );
  }
}

const styles = {
  errorTextStyle: {
    fontSize: 20,
    alignSelf: 'center',
    color: 'red',
  },
  successTextStyle: {
    fontSize: 20,
    alignSelf: 'center',
    color: 'green'
  },
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


export default connect(null, {
  loginUser, checkIfLoggedIn, fetchAllUsers, fetchMessagesUnread
})(LoginForm);
