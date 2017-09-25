import React, { Component } from 'react';
import { Text, TouchableHighlight, View, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import Communications from 'react-native-communications';
import { Icon, Button } from 'react-native-elements';
import { CardSection } from '../common';
import { fetchVendor, setModalVisible } from '../../actions';
import ModalScene from '../ModalScene';
import ClientInfo from './ClientInfo';
import ClientForm from './ClientForm';

class VendorListItem extends Component {
  state = {
    modalVisible: false,
    modalVisibleTwo: false
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible});
  }

  setModalVisibleTwo(visible) {
    this.setState({ modalVisibleTwo: visible});
  }

  onListItemPress() {
    this.props.fetchVendor({ uid: this.props.vendor.uid });

    this.setModalVisible({ modalVisible: !this.state.modalVisible});
  }

  render() {
    const { companyName } = this.props.vendor;

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
          title={`Vendor Info`}
        >
          <ClientInfo
            client={this.props.vendor}
            navigation={this.props.navigation}
            contactType={'Vendor'}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60
  },
  textStyle: {
    fontSize: 18,
  }
};

export default connect(null, { fetchVendor })(VendorListItem);
