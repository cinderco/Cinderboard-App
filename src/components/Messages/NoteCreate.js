import React, { Component } from 'react';
import { View, KeyboardAvoidingView, Platform } from 'react-native';
import { connect } from 'react-redux';
import { Button } from 'react-native-elements';
import { noteUpdate, noteCreate, clearNoteForm, adminEmployeesFetch } from '../../actions';
import NoteForm from './NoteForm';
import { Spinner } from '../common';

class NoteCreate extends Component {
  static navigationOptions = {
    title: 'New Message',
    header: ({ navigate, state }) => ({
        style: {
            backgroundColor: 'black'
        },
        title: 'New Message',
        tintColor: 'white'
    }),
    tabBar: {
      visible: false
    }
  };

  state = {
    newDate: new Date()
  }

  componentWillMount() {
    this.props.clearNoteForm();
  }

  render() {
    if (Platform.OS === 'android') {
      return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <NoteForm {...this.props} style={{ flex: 1 }} navigation={this.props.navigation} setModalVisible={this.props.setModalVisible} />
        </View>
      );
    } else {
      return (
        <KeyboardAvoidingView behavior={'padding'} style={{ flex: 1, backgroundColor: 'white' }} keyboardVerticalOffset={0}>
            <NoteForm {...this.props} style={{ flex: 1 }} navigation={this.props.navigation} setModalVisible={this.props.setModalVisible} />
        </KeyboardAvoidingView>
      );
    }
  }
}

const mapStateToProps = (state) => {
  const { note, newDate, loading } = state.noteForm;


  return { note, newDate, loading };
};

export default connect(mapStateToProps, {
  noteUpdate, noteCreate, clearNoteForm, adminEmployeesFetch
})(NoteCreate);
