import firebase from 'firebase';
import React, { Component } from 'react';
import { Text, View, TouchableOpacity, AsyncStorage } from 'react-native';
import ResponsiveImage from 'react-native-responsive-image';
import timer from 'react-native-timer';

const uri = 'https://s3-us-west-1.amazonaws.com/cinderco/cinder_logo.jpg';

class Welcome extends Component {
  state = {
    userName: ''
  }

  componentDidMount() {
    const { navigate } = this.props.navigation;

    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        this.setState({ userName: user.displayName });
        setTimeout(() => navigate('main'), 3000);
      } else {
        setTimeout(() => navigate('auth'), 7000);
      }
    });
  }

  renderButton() {
    return (
      <TouchableOpacity onPress={this.onButtonPress.bind(this)} style={styles.buttonStyle}>
        <Text style={styles.textStyle}>Log in</Text>
      </TouchableOpacity>
    );
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
        <Text style={{ color: 'white', marginTop: 25, fontSize: 18, alignSelf: 'center' }}>Welcome {this.state.userName}!</Text>
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

export default Welcome;
