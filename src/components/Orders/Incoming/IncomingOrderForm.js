import React, { Component } from 'react';
import { View, Text, TextInput, TouchableWithoutFeedback, TouchableOpacity, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import { orderUpdate, incomingCreate } from '../../../actions';
import { Button, CardSection, Spinner } from '../../common';
import OrderTypeButtons from '../OrderTypeButtons';
import CalendarPick from '../CalendarPicker';
import CompanyModal from '../CompanyModal';

class IncomingOrderForm extends Component {
  state = {
    visible: false,
    visibleTwo: false,
    date: 'Unknown',
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
    type: '',
    companyName: '',
    companyNameTwoStyle: '',
    typeTwoStyle: '',
    loading: false,
    newDate: 'Unknown'
  }

  setLoading(bool) {
    this.setState({ loading: bool });
  }

  onButtonPressIncoming() {
    const { companyName, type, other, newDate } = this.state;

    const arr = [{ companyName }, { type }, { newDate }, { other }];

    if (companyName === '' || type === '' || newDate === '') {
      for (let i = 0; i < arr.length; i++) {
        const key = Object.keys(arr[i])[0];

        if (arr[i][key] === '' || !arr[i][key]) {
          const keyError = `${key}Error`;
          const keyStyle = `${key}Style`;

          this.setState({ [keyStyle]: 'Error', [keyError]: true });
        }
      }
    } else {
      this.setState({ loading: true });
      this.props.incomingCreate({ companyName, type, newDate, setModalVisible: this.props.setModalVisible, setLoading: this.setLoading.bind(this) });
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
            editable={modal}
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
            onChangeText={text => this.props.orderUpdate({ prop: 'date', value: text })}
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
    } else {
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

  renderSaveButton(edit) {
    if(edit) {
      return null;
    } else {
      return (
        <TouchableOpacity onPress={this.onButtonPressIncoming.bind(this)} style={styles.buttonStyle}>
          <Text style={styles.textStyle}>Save</Text>
        </TouchableOpacity>
      );
    }
  }

  render() {
    if (this.state.loading === true) {
      return <Spinner loadingMessage={'Creating Order'} />;
    }
    return (
      <ScrollView
        style={{ paddingHorizontal: 5, paddingTop: 15, flex: 1, backgroundColor: '#292d29' }}
      >
        <View style={styles.containerStyle}>
          <CardSection
            style={{
              justifyContent: 'center',
              borderBottomWidth: 1,
              marginTop: 15,
              position: 'relative'
            }}
          >
            {this.renderIcon('companyName')}
            <Text style={styles.labelStyle}>Vendor</Text>
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
              marginTop: 15,
              position: 'relative'
            }}
          >
            {this.renderIcon('type')}
            <Text style={styles.labelStyle}>Order</Text>
          </CardSection>
          {this.renderInput('input', 'type', 'ex: "Steel Grit"', true, 'textArea', true)}
        </View>

        <View style={styles.containerStyle}>
          <CardSection
            style={{
              justifyContent: 'center',
              borderBottomWidth: 1,
              marginTop: 15,
              position: 'relative'
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
          {...this.props}
        />

        <CompanyModal
          visible={this.state.visibleTwo}
          closeModal={this.closeModalTwo.bind(this)}
          setCompany={this.setCompany.bind(this)}
          orderType={'incoming'}
        />

      {this.renderSaveButton()}
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
  const { companyName, type, newDate, other, orderType, date } = state.orderForm;

  return { companyName, type, newDate, other, orderType, date };
};

export default connect(mapStateToProps, { orderUpdate, incomingCreate })(IncomingOrderForm);
