import React, { Component } from 'react';
import { Text, TouchableHighlight, View, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import Communications from 'react-native-communications';
import { Icon, Button } from 'react-native-elements';
import SwipeableView from 'react-native-swipeable-view';
import { CardSection } from '../common';
import { fetchClient } from '../../actions';
import ModalScene from '../ModalScene';
import ClientInfo from './ClientInfo';
import ClientForm from './ClientForm';

class ClientListItem extends Component {
  state = {
    modalVisible: false
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible});
  }

  onListItemPress() {
    this.setModalVisible({ modalVisible: !this.state.modalVisible});
  }

  rightButtonPress() {
    this.props.setEditVisible(false);
  }

  render() {
    const { companyName } = this.props.client;

    return (
      <View>
        <TouchableHighlight onPress={this.onListItemPress.bind(this)} style={{ flex: 1 }}>
          <View>
            <CardSection style={styles.titleStyle}>
                <Text style={styles.textStyle}>
                  {companyName}
                </Text>
            </CardSection>
          </View>
        </TouchableHighlight>

        <ModalScene
          modalVisible={this.state.modalVisible}
          setModalVisible={this.setModalVisible.bind(this)}
          title={`Client Info`}
          rightButtonPress={this.rightButtonPress.bind(this)}
        >
          <ClientInfo
            client={this.props.client}
            navigation={this.props.navigation}
            contactType={'Client'}
            setModalVisible={this.setModalVisible.bind(this)}
          />
        </ModalScene>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60
  },
  textStyle: {
    fontSize: 18,
  }
};

const mapStateToProps = (state) => {
  const { modalVisibleSave } = state.clientForm;

  return { modalVisibleSave };
};

export default connect(mapStateToProps, { fetchClient })(ClientListItem);
