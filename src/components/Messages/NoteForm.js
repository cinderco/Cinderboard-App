import React, { Component } from 'react';
import {
  View,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView
} from 'react-native';
import { Icon, Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { noteUpdate } from '../../actions';
import { CardSection, Spinner } from '../common';
import AdminList from './AdminList';

class NoteForm extends Component {
  state = {
    selected2: 'key1',
    listVisible: false,
    employee1: '',
    employee2: '',
    note: '',
    newDate: new Date(),
    comma: '',
    deleteButton: false,
    buttonSend: false,
    loading: false
  };

  onButtonPress() {
    this.setState({ loading: true });
    const note = this.state.note;
    const recipient1 = this.state.employee1;
    const recipient2 = this.state.employee2;

    this.props.noteCreate({
      note,
      recipient1,
      recipient2,
      newDate: this.state.newDate,
      read: false,
      ampersand: '&',
      adminEmployees: this.props.admin,
      setModalVisible: this.props.setModalVisible
    });
  }

  setListVisible() {
    if (this.state.employee1 && this.state.employee2) {
      this.setState({ listVisible: false });
    } else {
      this.setState({ listVisible: true });
    }
  }

  makeListVisible(employeeName) {
    if (this.state.employee1 === '') {
      this.setState({
        listVisible: false,
        employee1: employeeName,
        deleteButton: true
      });

      const nameArr = employeeName.split(' ');
      const name = nameArr[0];

      this.props.noteUpdate({ prop: 'recipient1', value: name });
    } else if (this.state.employee1 !== '' && this.state.employee2 === '') {
      this.setState({
        listVisible: false,
        employee2: employeeName,
        comma: ', '
      });

      const nameArr = employeeName.split(' ');
      const name = nameArr[0];

      this.props.noteUpdate({ prop: 'recipient2', value: name });
    } else if (this.state.employee1 !== '' && this.state.employee2 !== '') {
      this.setState({
        listVisible: false,
        comma: ', '
      });
    }
  }

  deleteEmployee() {
    if (this.state.employee2 !== '') {
      this.setState({ employee2: '', comma: '', listVisible: false });
    } else if (this.state.employee1 !== '') {
      this.setState({ employee1: '', deleteButton: false, listVisible: false });
    }
  }

  renderButtons() {
    if (this.state.deleteButton === true) {
      return (
        <View style={{ flex: 1, alignItems: 'flex-end', paddingRight: 10 }}>
          <TouchableOpacity onPress={() => this.deleteEmployee()}>
            <Icon
              name='minus-circle'
              type='font-awesome'
              color='#DB2728'
            />
          </TouchableOpacity>
        </View>
      );
    }
  }

  changeText(text) {
    if (text === '') {
      this.setState({ note: text, buttonSend: false });
    } else {
      this.setState({ note: text, buttonSend: true });
    }
  }

  renderBelowTo() {
    const currentDate = new Date();

    if (this.state.listVisible === true) {
      return <AdminList makeListVisible={this.makeListVisible.bind(this)} />;
    }
    return (
      <View style={{ flex: 1 }}>
        <TextInput
          placeholder="Write message here"
          value={this.state.note}
          onChangeText={(text) => this.changeText(text)}
          style={{ flex: 1, paddingLeft: 10, paddingTop: 10, fontSize: 18 }}
          multiline
          returnKeyLabel='done'
          placeholderTextColor='#545050'
          underlineColorAndroid={"transparent"}
        />
      </View>
    );
  }

  renderButton() {
    if (this.state.buttonSend === true && this.state.employee1 !== '') {
      return (
        <View>
          <Button
            title='Send Message'
            onPress={() => this.onButtonPress()}
            buttonStyle={{ marginBottom: 15 }}
            raised
            backgroundColor={'red'}
          />
        </View>
      );
    } else {
      return (
        <View>
          <Button
            title='Send Message'
            icon={{name: 'send', type: 'font-awesome'}}
            buttonStyle={{ marginBottom: 15 }}
            disabled
          />
        </View>
      );
    }
  }

  render() {
    if (this.state.loading === true) {
      return <Spinner loadingMessage={'Sending Message'} />
    }
    return (
        <View style={{ flex: 1 }}>
          <TouchableWithoutFeedback onPress={() => this.setListVisible()}>
            <View>
              <CardSection>
                <View style={styles.containerStyle}>
                  <Text style={{ color: 'red', paddingRight: 10 }}>To:</Text>
                  <Text>{this.state.employee1}</Text>
                  <Text>{this.state.comma}</Text>
                  <Text>{this.state.employee2}</Text>
                  {this.renderButtons()}
                </View>
              </CardSection>
            </View>
          </TouchableWithoutFeedback>


          {this.renderBelowTo()}

          {this.renderButton()}
        </View>
    );
  }
}

const styles = {
  inputStyle: {
    color: '#000',
    paddingRight: 5,
    paddingLeft: 5,
    fontSize: 18,
    lineHeight: 23,
    flex: 1,
  },
  labelStyle: {
    fontSize: 18,
    paddingLeft: 20,
    width: 100
  },
  containerStyle: {
    height: 40,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15
  }
};

const mapStateToProps = (state) => {
  const { note, newDate, recipient1, recipient2 } = state.noteForm;
  const admin = state.admin.admin_list;

  return { note, newDate, recipient1, recipient2, admin };
};

export default connect(mapStateToProps, { noteUpdate })(NoteForm);
