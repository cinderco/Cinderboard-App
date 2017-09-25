import firebase from 'firebase';
import _ from 'lodash';
import axios from 'axios';
import React, { Component } from 'react';
import { ListView, View, KeyboardAvoidingView, TouchableOpacity, Text, ScrollView, Platform, Dimensions } from 'react-native';
import { Icon } from 'react-native-elements';
import InvertibleScrollView from 'react-native-invertible-scroll-view';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';
import { connect } from 'react-redux';
import { Message } from '../common';
import { noteUpdate, noteSave, noteDelete, messagesFetch, newMessageCreate, noteUpdateRead } from '../../actions';

const { height, width } = Dimensions.get('window');

class NoteEdit extends Component {
  static navigationOptions = {
    tabBar: {
      visible: false
    }
  };

  state = {
    currentUser: '',
    text: '',
    uid: '',
    newText: ''
   };

  componentWillMount() {
    const noteItem = this.props.noteItem;
    const { currentUser } = firebase.auth();
    const { uid } = currentUser;
    this.setState({ uid });

    this.props.messagesFetch(noteItem.uid);

    this.createDataSource(this.props);

    this.setState({
      currentUser
    });
  }

  componentDidMount() {
    const noteItem = this.props.noteItem;
    const userRead = this.state.uid.toLowerCase() + 'Read';
    this.props.noteUpdateRead({ read: noteItem[userRead], uid: noteItem.uid, userRead });
  }

  componentWillReceiveProps(nextProps) {
    this.createDataSource(nextProps);
  }

  onButtonPress() {
    const { note, newDate } = this.props;

    this.props.noteSave({ note, newDate, uid: this.props.note.uid });
  }

  onAccept() {
    const { params } = this.props.navigation.state;
    const noteItem = params.noteItem;
    const { uid } = noteItem;

    this.props.noteDelete({ uid });
  }

  onDecline() {
    this.setState({ showModal: false });
  }

  createDataSource({ messages }) {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.dataSource = ds.cloneWithRows(messages);
  }

  sendMessage() {
    const noteItem = this.props.noteItem;
    const { uid } = noteItem;
    const messageText = this.state.text;
    const newDate = new Date();
    const read = true;

    if (messageText === '') {
      return null;
    } else {
      this.props.newMessageCreate({ messageText, newDate, read, uid });
      this.setState({ text: '' });
    }
  }

  renderRow(message) {
    if (message.from === this.state.currentUser.displayName) {
      return <Message position={'right'} name={''} date={message.date}>{message.note}</Message>;
    }
    return <Message position={'left'} name={message.from} date={message.date}>{message.note}</Message>;
  }

  render() {
    if (Platform.OS === 'android') {
      return (
          <View behavior={'padding'} style={{ flex: 1, backgroundColor: 'white' }} keyboardVerticalOffset={0}>
            <View style={{ flex: 1 }}>
              <ListView
                dataSource={this.dataSource}
                renderScrollComponent={props => <InvertibleScrollView {...props} inverted />}
                renderRow={(rowData) => this.renderRow(rowData)}
                style={{ paddingHorizontal: 20, paddingBottom: 20 }}
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
                keyboardShouldPersistTaps='always'
              />

              <View
                  style={styles.containerStyle}
              >
                  <AutoGrowingTextInput
                    style={styles.textInputAndroid}
                    placeholder={'Your Message'}
                    onChangeText={(text) => this.setState({ text: text })}
                    value={this.state.text}
                  />

                <View style={{ width: width - 260, alignItems: 'center', justifyContent: 'center' }}>
                  <TouchableOpacity
                    onPress={() => this.sendMessage()}
                    style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                  >
                      <Icon
                        name='send'
                        type='material-community'
                        color='white'
                      />
                 </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
      );
    } else {
      return (
        <KeyboardAvoidingView behavior={'padding'} style={{ flex: 1, backgroundColor: 'white' }} keyboardVerticalOffset={0}>
          <View style={{ flex: 1 }}>
            <ListView
              dataSource={this.dataSource}
              renderScrollComponent={props => <InvertibleScrollView {...props} inverted />}
              renderRow={(rowData) => this.renderRow(rowData)}
              style={{ paddingHorizontal: 20, paddingBottom: 20 }}
              contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
              keyboardShouldPersistTaps='always'
              enableEmptySections
            />

            <View
                style={styles.containerStyle}
            >
                <AutoGrowingTextInput
                  style={styles.textInput}
                  placeholder={'Your Message'}
                  onChangeText={(text) => this.setState({ text: text })}
                  value={this.state.text}
                />
                <TouchableOpacity
                  onPress={() => this.sendMessage()}
                  style={{ flex: 1, alignItems: 'center' }}
                >
                  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Icon
                      name='send'
                      type='material-community'
                      color='white'
                      containerStyle={{ alignSelf: 'center' }}
                    />
                  </View>
                </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      );
    }
  }
}

const styles = {
  textInput: {
    paddingLeft: 10,
    fontSize: 17,
    lineHeight: 35,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    borderRadius: 5,
    paddingRight: 10,
    paddingBottom: 10,
    width: 250,
    marginRight: 20
  },
  textInputAndroid: {
    paddingLeft: 10,
    fontSize: 17,
    lineHeight: 35,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    borderRadius: 5,
    paddingRight: 10,
    width: 250
  },
  containerStyle: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#292d29',
    paddingVertical: 20,
    paddingLeft: 20
  }
};

const mapStateToProps = (state) => {
  const { note, newDate, messageText } = state.noteForm;
  const unreversedMessages = _.map(state.messages.messages_list, (val, uid) => {
    return { ...val, uid };
  });

  const messages = unreversedMessages.reverse();
  return { note, newDate, messages, messageText };
};

export default connect(mapStateToProps, {
  noteUpdate, noteSave, noteDelete, messagesFetch, newMessageCreate, noteUpdateRead
})(NoteEdit);
