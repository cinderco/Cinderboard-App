import React, { Component } from 'react';
import { Text, TouchableHighlight, View, Image, Modal, TouchableOpacity, Platform } from 'react-native';
import { connect } from 'react-redux';
import { Icon, Button } from 'react-native-elements';
import moment from 'moment';
import { CardSection } from '../common';
import ModalScene from '../ModalScene';
import EditUser from './EditUser';

class UserListItem extends Component {
  state = {
    visible: false,
    isOpen: false,
    modalVisible: false
  }

  onListItemPress() {
    if (this.props.isOpen === false) {
      this.setModalVisible({ modalVisible: !this.state.modalVisible});
    } else {
      this.props.setIsOpen(false);
      this.props.rowMap[`${this.props.secId}${this.props.rowId}`].closeRow();
    }
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  renderModal() {
    if (Platform.OS === 'android') {
      return (
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => this.setModalVisible(false)}
        >
          <EditUser
            user={this.props.user}
            navigation={this.props.navigation}
            setModalVisible={this.setModalVisible.bind(this)}
          />
        </Modal>
      );
    } else {
      return (
        <ModalScene
          modalVisible={this.state.modalVisible}
          setModalVisible={this.setModalVisible.bind(this)}
          title={'Edit User'}
        >
          <EditUser
            user={this.props.user}
            navigation={this.props.navigation}
            setModalVisible={this.setModalVisible.bind(this)}
          />
        </ModalScene>
      );
    }
  }

  render() {
    return (
      <View>
          <TouchableHighlight onPress={this.onListItemPress.bind(this)} style={{ flex: 1, justifyContent: 'space-between' }}>
            <View>
              <CardSection style={styles.titleStyle}>
                  <View style={{ justifyContent: 'center', alignItems: 'center', width: 210 }}>
                    <Text style={styles.textStyleComplete}>
                      {this.props.user.name}
                    </Text>
                    <Text>{this.props.user.email}</Text>
                  </View>
              </CardSection>
            </View>
          </TouchableHighlight>

          {this.renderModal()}
      </View>
    );
  }
}

const styles = {
  titleStyle: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 15,
    paddingBottom: 15,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    fontSize: 18,
  },
  titleStyleReady: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 15,
    paddingBottom: 15,
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4ff765',
  },
  textStyleReady: {
    fontSize: 18,
  },
  titleStyleComplete: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 15,
    paddingBottom: 15,
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0288D1'
  },
  titleStyleProcessing: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 15,
    paddingBottom: 15,
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF163'
  },
  textStyleComplete: {
    fontSize: 18,
    paddingBottom: 5,
    fontWeight: '600'
  },
  modalHeader: {
    height: 63,
    backgroundColor: 'black',
    position: 'relative',
    justifyContent: 'flex-end',
    flexDirection: 'column',
    paddingBottom: 10
  },
  backButton: {
    position: 'absolute',
    left: 10,
    bottom: 10,
    flexDirection: 'row',
    alignItems: 'center'
  }
};

export default connect(null, { })(UserListItem);
