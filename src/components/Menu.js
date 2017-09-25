import firebase from 'firebase';
import React, { Component } from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  Text
} from 'react-native';
import { connect } from 'react-redux';
import { signOutUser } from '../actions';

const window = Dimensions.get('window');

class Menu extends Component {
  componentWillMount() {
    const { currentUser } = firebase.auth();
  }

  render() {
    return (
      <View scrollsToTop={false} style={styles.menu}>
        <View style={styles.avatarContainer}>
          <Text
            style={styles.item}
          >
            {this.props.displayName}
          </Text>
        </View>

        <Text
          onPress={() => this.props.onItemSelected('notes')}
          style={styles.item}
        >
          Messages
        </Text>

        <Text
          onPress={() => this.props.onItemSelected('clients')}
          style={styles.item}
        >
          Clients
        </Text>

        <Text
          onPress={() => this.props.onItemSelected('signup')}
          style={styles.item}
        >
          Add Users
        </Text>

        <Text
          style={styles.item}
          onPress={this.props.signOutUser.bind(this)}
        >
          Logout
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  menu: {
    flex: 1,
    width: window.width,
    height: window.height,
    backgroundColor: '#0C120C',
    padding: 20,
  },
  avatarContainer: {
    marginBottom: 20,
    marginTop: 20,
    width: 100,
    height: 60
  },
  avatar: {
    flex: 1,
    resizeMode: 'cover'
  },
  name: {
    position: 'absolute',
    left: 70,
    top: 20,
  },
  item: {
    fontSize: 18,
    fontWeight: '600',
    paddingTop: 5,
    color: 'white'
  },
});

export default connect(null, { signOutUser })(Menu);
