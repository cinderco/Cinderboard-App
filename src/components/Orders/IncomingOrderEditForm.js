import _ from 'lodash';
import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ScrollView,
  Platform,
  TouchableHighlight
} from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import { orderUpdate, incomingCreate, incomingDelete, incomingSave } from '../../actions';
import { Button, CardSection, ConfirmAlert, Spinner } from '../common';
import OrderTypeButtons from './OrderTypeButtons';
import CalendarPick from './CalendarPicker';
import OrderStatusButtons from './OrderStatusButtons';
import CompanyModal from './CompanyModal';

class IncomingOrderEditForm extends Component {
  static navigationOptions = {
    title: 'Edit Order',
    tabBar: {
      visible: false
    },
    header: ({ navigate }) => {
      return {
        style: {
          marginTop: Platform.OS === 'android' ? 24 : 0,
          backgroundColor: 'black',
        },
        tintColor: 'white'
      }
    }
  };

  state = {
    visible: false,
    date: '',
    hidden: true,
    companyNameError: false,
    typeError: false,
    otherError: false,
    companyName: '',
    type: '',
    companyNameStyle: '',
    typeStyle: '',
    otherBlah: '',
    otherStyle: '',
    typeTwo: '',
    companyNameTwo: '',
    companyNameTwoStyle: '',
    typeTwoStyle: '',
    loadingDelete: false,
    visibleTwo: false
  }

  componentWillMount() {
      const order = this.props.order;
      const date = order.date;

      this.setState({
        other: this.props.order.other,
        date,
        newDate: date,
        companyName: this.props.order.companyName,
        type: this.props.order.type,
        status: this.props.order.status
      });
  }

  onPressProcessing() {
    this.props.orderUpdate({ prop: 'status', value: 'processing' });
    this.setState({ hidden: true });
  }

  onPressReady() {
    this.props.orderUpdate({ prop: 'status', value: 'ready' });
    this.setState({ hidden: true });
  }

  onPressComplete() {
    this.props.orderUpdate({ prop: 'status', value: 'complete' });
    this.setState({ hidden: true });
  }

  onButtonPress() {
    console.log('HEHEHEHHEHEHEHEHEHE EHE EH E');

    const order = this.props.order;
    const uid = order.uid;
    const { companyName, type, status } = this.state;
    const newDate = this.state.newDate;
    const date = order.date;
    const companyNameOld = order.companyName;
    const typeOld = order.type;
    const statusOld = order.status;
    const { createDate, createdBy } = order;

    const changedValues = _.differenceWith(
      [{ companyName }, { type }, { newDate }, { status }],
      [{ companyName: companyNameOld }, { type: typeOld }, { newDate: date }, { status: statusOld }],
       _.isEqual);

    const changedValuesTwo = () => {
      const changedValuesArr = ['changed '];
      const date1 = new Date(date).toLocaleDateString();
      const date2 = new Date(newDate).toLocaleDateString();

      for (let i = 0; i < changedValues.length; i++) {
        if (Object.keys(changedValues[i])[0] === 'companyName') {
            changedValuesArr.push(`company name from ${companyNameOld} to ${companyName}, `);
        } else if (Object.keys(changedValues[i])[0] === 'type') {
            changedValuesArr.push(`order from ${typeOld} to ${type}, `);
        } else if (Object.keys(changedValues[i])[0] === 'newDate') {
            changedValuesArr.push(`order date from ${date1} to ${date2}`);
        } else if (Object.keys(changedValues[i])[0] === 'status') {
            changedValuesArr.push(`order status from ${statusOld} to ${status}`);
        }
      }

      return changedValuesArr;
    };

    const changed = changedValuesTwo();

    if (changed.length > 1) {
      this.props.incomingSave({
        companyName,
        type,
        newDate,
        status,
        uid,
        changed,
        createDate,
        createdBy,
        setModalVisible: this.props.setModalVisible,
        setModalVisibleTwo: this.props.setModalVisibleTwo,
        updateOrder: this.props.updateOrder
      });
    } else {
      this.props.stopEditing();
      console.log('order has not changed')
    }
  }

  setDate(poo) {
    if (poo === 'Unknown') {
      this.setState({ date: 'Unknown', newDate: 'Unknown' });
    } else {
      const date = poo.toLocaleDateString();

      this.setState({
        date, newDate: date
      });
    }
  }

  makeModalVisible() {
    this.setState({
      visible: true
    });
  }

  closeModal() {
    this.setState({
      visible: false
    });
  }

  closeModalTwo() {
    this.setState({
      visibleTwo: false
    });
  }

  setCompany(name) {
    this.ifEmpty(name, 'companyNameStyle', 'companyNameBool', 'companyName')
  }

  blur(prop) {
    if (this.state[prop] !== '') {
      console.log('no error');
    } else {
      const propStyle = `${prop}Style`;
      this.setState({ [propStyle]: 'Error' });
    }
  }

  ifEmpty(text, propStyle, propBool, prop) {
    if (text === '') {
      this.setState({ [prop]: text, [propStyle]: 'Error' });
    } else {
      this.setState({ [prop]: text, [propStyle]: '', [propBool]: true });
    }
  }

  renderInput(type, prop, placeholder, bool, style, modal) {
    if (type === 'input') {
      const propStyle = `${prop}Style`;
      const inputStyle = `${style}${this.state[propStyle]}`;
      const propBool = `${prop}Bool`;

      if (this.state[propStyle] === '') {
        return (
          <TextInput
            placeholder={placeholder}
            value={this.state[prop]}
            multiline={bool}
            onBlur={() => this.blur(prop)}
            onChangeText={text => this.ifEmpty(text, propStyle, propBool, prop)}
            style={styles[inputStyle]}
            editable={modal}
            underlineColorAndroid={"transparent"}
          />
        );
      } else if (this.state[propStyle] === 'Error') {
        return (
          <TextInput
            placeholder={placeholder}
            value={this.state[prop]}
            multiline={bool}
            onChangeText={text => this.setState({ [prop]: text, [propStyle]: '', [propBool]: true })}
            style={styles[inputStyle]}
            underlineColorAndroid={"transparent"}
          />
        );
      }
    } else if (type === 'date') {
      return (
        <View>
          <TextInput
            placeholder="order date"
            value={this.state.date}
            style={styles.input}
            editable={false}
            underlineColorAndroid={"transparent"}
          />
        </View>
      );
    } else if (type === 'type') {
      if (!this.state.otherError) {
        return (
          <View>
            <OrderTypeButtons
              {...this.props}
              hidden={this.state.hidden}
              onPressFreight={this.onPressFreight.bind(this)}
              onPressDelivery={this.onPressDelivery.bind(this)}
              onPressWillCall={this.onPressWillCall.bind(this)}
              error={''}
              otherBlah={this.state.other}
            />
          </View>
        );
      } else {
        return (
          <View>
            <OrderTypeButtons
              {...this.props}
              hidden={this.state.hidden}
              onPressFreight={this.onPressFreight.bind(this)}
              onPressDelivery={this.onPressDelivery.bind(this)}
              onPressWillCall={this.onPressWillCall.bind(this)}
              error={'Error'}
              otherBlah={this.state.other}
            />
          </View>
        );
      }
    }
  }

  renderIcon(prop) {
    const propStyle = `${prop}Style`;
    const propBool = `${prop}Bool`;

    if (this.state[propStyle] === '') {
      if (this.state[propBool]) {
        return (
          <View style={{ position: 'absolute', left: 10 }}>
            <Icon
              name='check'
              type='font-awesome'
              color='green'
            />
          </View>
        );
      }
      return null;
    } else if (this.state[propStyle] === 'Error') {
      return (
        <View style={{ position: 'absolute', left: 10 }}>
          <Icon
            name='times'
            type='font-awesome'
            color='red'
          />
        </View>
      );
    }
  }

  renderOtherIcon() {
    if (this.state.otherBlah === '') {
      if (this.state.otherStyle !== '') {
        return (
          <View style={{ position: 'absolute', left: 10 }}>
            <Icon
              name='times'
              type='font-awesome'
              color='red'
            />
          </View>
        );
      } else {
        return null;
      }
    }  else {
      return (
        <View style={{ position: 'absolute', left: 10 }}>
          <Icon
            name='check'
            type='font-awesome'
            color='green'
          />
        </View>
      );
    }
  }

  setLoading() {
    this.props.incomingDelete({ uid: this.props.order.uid, navigation: this.props.navigation});
  }

  renderSaveButton() {
      return (
          <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between' }}>
            <TouchableHighlight
                  style={styles.wrapper}
                  onPress={() => this.props.stopEditing()}
            >
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 5,
                    backgroundColor: 'white',
                    flexDirection: 'row',
                    height: 50,
                  }}
                >
                <Text style={{ marginLeft: 5 }}>Cancel</Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight
                  style={styles.wrapperRight}
                  onPress={() => this.onButtonPress()}
            >
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 5,
                    backgroundColor: '#db2728',
                    flexDirection: 'row',
                    height: 50,

                  }}
                >
                <Text style={{ marginLeft: 5, color: 'white' }}>Save</Text>
              </View>
            </TouchableHighlight>
          </View>
     );
  }

  render() {
    if (this.props.loadingSave) {
      return <Spinner size="large" loadingMessage="Saving Changes"/>;
    } else if (this.props.loadingDelete) {
      return <Spinner size="large" loadingMessage="Deleting Order"/>;
    }
    return (
      <ScrollView style={{ paddingHorizontal: 5, paddingTop: 15, flex: 1, backgroundColor: '#292d29' }}>
        <View style={styles.containerStyle}>
          <CardSection
            style={{
              justifyContent: 'center',
              borderBottomWidth: 1,
              marginTop: 10,
              position: 'relative'
            }}
          >
            {this.renderIcon('companyName')}
            <Text style={styles.labelStyle}>Company</Text>
          </CardSection>
          <TouchableWithoutFeedback onPress={() => this.setState({ visibleTwo: true })}>
            <View>
              {this.renderInput('input', 'companyName', 'Company Name', false, 'input', false)}
            </View>
          </TouchableWithoutFeedback>
        </View>

        <View style={styles.containerStyle}>
          <CardSection
            style={{
              justifyContent: 'center',
              borderBottomWidth: 1,
              marginTop: 15
            }}
          >
            {this.renderIcon('type')}
            <Text style={styles.labelStyle}>Order</Text>
          </CardSection>
          {this.renderInput('input', 'type', 'ex: "Steel Grit"', true, 'textArea')}
        </View>

        <View style={styles.containerStyle}>
          <CardSection
            style={{
              justifyContent: 'center',
              borderBottomWidth: 1,
              marginTop: 15
            }}
          >
            <View style={{ position: 'absolute', left: 10 }}>
              <Icon
                name='check'
                type='font-awesome'
                color='green'
              />
            </View>
            <Text style={styles.labelStyle}>Date</Text>
          </CardSection>
          <TouchableWithoutFeedback onPress={() => this.makeModalVisible()}>
            {this.renderInput('date', 'date', null, false, null)}
          </TouchableWithoutFeedback>
        </View>

        <CompanyModal
          visible={this.state.visibleTwo}
          closeModal={this.closeModalTwo.bind(this)}
          setCompany={this.setCompany.bind(this)}
          orderType={'incoming'}
        />

          <CalendarPick
            visible={this.state.visible}
            closeModal={this.closeModal.bind(this)}
            newDate={''}
            date={this.state.date}
            setDate={this.setDate.bind(this)}
            date={this.state.date}
          />

        {this.renderSaveButton(this.props.edit)}

      </ScrollView>
    );
  }
}

const styles = {
  containerStyle: {
    flexDirection: 'column',
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: 'white',
    paddingBottom: 5
  },
  textArea: {
    flex: 1,
    fontSize: 16,
    padding: 10,
    height: 100,
    backgroundColor: 'white'
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 10,
    height: 50,
    backgroundColor: 'white'
  },
  inputError: {
    flex: 1,
    fontSize: 16,
    padding: 10,
    borderWidth: 1,
    height: 50,
    borderColor: 'red',
    borderRadius: 5,
    backgroundColor: 'white'
  },
  textAreaError: {
    flex: 1,
    fontSize: 16,
    padding: 10,
    borderWidth: 1,
    height: 100,
    borderRadius: 5,
    borderColor: 'red',
    backgroundColor: 'white'
  },
  labelStyle: {
    color: '#DB2728',
    paddingBottom: 5,
    fontSize: 16
  },
  labelTextStyle: {
    fontSize: 16,
    paddingVertical: 10,
    fontWeight: '500',
    color: '#DB2728'
  },
  buttonStyle: {
    height: 50,
    alignSelf: 'stretch',
    backgroundColor: '#DB2728',
    marginTop: 5,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15
  },
  textStyle: {
    alignSelf: 'center',
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
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
  },
  wrapper: {
    borderRadius: 5,
    marginBottom: 10,
    flex: 1
  },
  wrapperRight: {
    borderRadius: 5,
    marginBottom: 10,
    flex: 1,
    marginLeft: 10
  },
};

const mapStateToProps = (state) => {
  const { companyName, type, newDate, orderType, date, uid, loadingSave, loadingDelete, modalVisible } = state.orderForm;

  return { companyName, type, newDate, orderType, date, uid, loadingSave, loadingDelete, modalVisible };
};

export default connect(mapStateToProps, { orderUpdate, incomingCreate, incomingDelete, incomingSave })(IncomingOrderEditForm);
