import firebase from 'firebase';
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import Badge from 'react-native-smart-badge';
import { fetchMessagesUnread } from '../../actions';


class CustomBadge extends Component {
  componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        this.props.fetchMessagesUnread(user.uid);
      }
    });
  }

  render() {
    return (
      <Badge minWidth={18} minHeight={18} textStyle={{color: '#fff',}} style={{ position: 'absolute', top: 0, right: -20, zIndex: 20000 }}>
          {this.props.badgeNumber}
      </Badge>
    );
  }
}

const mapStateToProps = state => {
  const badgeNumber = state.orders.badgeNumber;

  return { badgeNumber };
};

export default connect(mapStateToProps, { fetchMessagesUnread })(CustomBadge);
