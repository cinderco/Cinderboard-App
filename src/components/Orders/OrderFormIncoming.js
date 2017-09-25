import _ from 'lodash';
import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ScrollView,
  Platform
} from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import { orderUpdate, incomingCreate } from '../../actions';
import { Button, CardSection, ConfirmAlert, Spinner } from '../common';
import OrderTypeButtons from './OrderTypeButtons';
import CalendarPick from './CalendarPicker';
import OrderStatusButtons from './OrderStatusButtons';

class OrderFormIncoming extends Component {
  static navigationOptions = {
    title: 'New Incoming',
    header: ({ navigate }) => {
      return {
        style: {
          marginTop: Platform.OS === 'android' ? 24 : 0,
          backgroundColor: 'black',
        },
        tintColor: 'white'
      }
    },
    tabBarLabel: 'Incoming',
    tabBarIcon: ({ tintColor }) => (
      <Text style={{ fontSize: 18, color: tintColor, fontWeight: '600' }}>Incoming</Text>
    ),
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
    companyNameTwo: '',
    companyNameTwoStyle: '',
    typeTwoStyle: '',
  }

  componentWillMount() {
    const date = new Date();
    const newDate = date.toLocaleDateString();

      this.setState({
        date: newDate
      });
  }

  onButtonPressIncoming() {
    const { companyName, type, newDate } = this.state;

    const arr = [{ companyName }, { type }, { newDate }];

    if (companyName === '' || type === '' || newDate === '') {
      for (let i = 0; i < arr.length; i++) {
        const key = Object.keys(arr[i])[0];

        if (arr[i][key] === '' || !arr[i][key]) {
          const keyStyle = `${key}Style`;

          this.setState({ [keyStyle]: 'Error' });
        }
      }
    } else {
      this.props.incomingCreate({ companyName, type, newDate, navigation: this.props.navigation });
    }
  }

  setDate(poo) {
    const date = poo.toLocaleDateString();

    this.setState({
      date, newDate: date
    });
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

  renderInput(type, prop, placeholder, bool, style) {
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
    }
  }

  renderSaveButton() {
      return (
        <TouchableOpacity onPress={() => this.onButtonPressIncoming()} style={styles.buttonStyle}>
          <Text style={styles.textStyle}>Save</Text>
        </TouchableOpacity>
      );
  }

  render() {
    if (this.props.loadingSave) {
      return <Spinner size="large" loadingMessage="Creating Order"/>;
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
            <Text style={styles.labelStyle}>Company</Text>
          </CardSection>
          {this.renderInput('input', 'companyName', 'Company Name', false, 'input')}
        </View>

        <View style={styles.containerStyle}>
          <CardSection
            style={{
              justifyContent: 'center',
              borderBottomWidth: 1,
              marginTop: 15
            }}
          >
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


        <CalendarPick
          visible={this.state.visible}
          closeModal={this.closeModal.bind(this)}
          newDate={''}
          date={this.state.date}
          setDate={this.setDate.bind(this)}
        />



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
};

const mapStateToProps = (state) => {
  const { loadingSave } = state.orderForm;

  return { loadingSave };
};

export default connect(mapStateToProps, { orderUpdate, incomingCreate })(OrderFormIncoming);
