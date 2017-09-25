import firebase from 'firebase';
import moment from 'moment';
import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ListView, ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import { fetchAllUsers } from '../../actions';
import HiddenListItem from '../Orders/HiddenListItem';
import UserListItem from './UserListItem';
import { SceneHeader, CardSection } from '../common';
import SignupForm from './SignupForm';
import ModalScene from '../ModalScene';

class Users extends Component {
  static navigationOptions = {
    title: 'Ougoing Orders',
    header: (navigation, defaultHeader) => ({
        ...defaultHeader,
        style: {
            backgroundColor: 'black'
        },
        title: 'Outgoing Orders',
        tintColor: 'white'
    }),
    tabBarVisible: false
  };

  state = {
    isOpen: false,
    modalVisible: false
  }

  componentWillMount() {
    this.props.fetchAllUsers();
    this.createDataSource(this.props);
    this.createDataSourceTwo(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.createDataSource(nextProps);
    this.createDataSourceTwo(nextProps);
  }

  createDataSource({ admin }) {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.dataSource = ds.cloneWithRows(admin);
  }

  createDataSourceTwo({ nonAdmin }) {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.dataSourceTwo = ds.cloneWithRows(nonAdmin);
  }

  setIsOpen(bool) {
    this.setState({ isOpen: bool});
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  renderRow(user, secId, rowId, rowMap, isOpen) {
    return (
      <SwipeRow
        leftOpenValue={0}
        rightOpenValue={-75}
        disableRightSwipe
      >
        <HiddenListItem
          order={user}
          secId={secId}
          rowId={rowId}
          rowMap={rowMap}
          height={80}
          width={75}
          navigation={this.props.navigation}
          orderType={'users'}
        />
        <UserListItem
          user={user}
          secId={secId}
          rowId={rowId}
          rowMap={rowMap}
          isOpen={isOpen}
          setIsOpen={this.setIsOpen.bind(this)}
          navigation={this.props.navigation}
        />
      </SwipeRow>
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <SceneHeader
          title={'Users'}
          rightButtonPress={this.setModalVisible.bind(this)}
          navigation={this.props.navigation}
        />
        <ScrollView style={{ flex: 1 }}>
            <CardSection
              style={{
                justifyContent: 'center',
                borderBottomWidth: 1,
                paddingTop: 10,
                position: 'relative',
                backgroundColor: '#292d29'
              }}
            >
              <Text style={styles.labelStyle}>Admin</Text>
            </CardSection>

          <SwipeListView
              dataSource={this.dataSource}
              renderRow={(user, secId, rowId, rowMap) => this.renderRow(user, secId, rowId, rowMap, this.state.isOpen)}
              style={{ backgroundColor: 'white' }}
              enableEmptySections
              onRowClose={() => this.setState({ isOpen: false })}
              onRowOpen={() => this.setState({ isOpen: true })}
              removeClippedSubviews={false}
          />

            <CardSection
              style={{
                justifyContent: 'center',
                borderBottomWidth: 1,
                paddingTop: 10,
                position: 'relative',
                backgroundColor: '#292d29'
              }}
            >
              <Text style={styles.labelStyle}>Users</Text>
            </CardSection>

          <SwipeListView
              dataSource={this.dataSourceTwo}
              renderRow={(user, secId, rowId, rowMap) => this.renderRow(user, secId, rowId, rowMap, this.state.isOpen)}
              style={{ backgroundColor: 'white' }}
              enableEmptySections
              onRowClose={() => this.setState({ isOpen: false })}
              onRowOpen={() => this.setState({ isOpen: true })}
              removeClippedSubviews={false}
          />
        </ScrollView>

        <ModalScene
          modalVisible={this.state.modalVisible}
          setModalVisible={this.setModalVisible.bind(this)}
          title={'Add New User'}
        >
          <SignupForm
            navigation={this.props.navigation}
            setModalVisible={this.setModalVisible.bind(this)}
          />
        </ModalScene>
      </View>
    );
  }
}

const styles = {
  labelStyle: {
    color: '#DB2728',
    paddingBottom: 5,
    fontSize: 20
  }
}

const mapStateToProps = state => {
  const users = _.map(state.admin.users, (val, uid) => {
    return { ...val, uid };
  });

  const admin = _.filter(users, (obj) => {
    return obj.isAdmin;
  });

  const nonAdmin = _.filter(users, (obj) => {
    return !obj.isAdmin;
  });

  const { loading } = state.orders;

  return { admin, nonAdmin, loading };
};

export default connect(mapStateToProps, { fetchAllUsers })(Users);
