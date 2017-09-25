import firebase from 'firebase';
import moment from 'moment';
import _ from 'lodash';
import React, { Component } from 'react';
import { Text, TouchableHighlight, View, ScrollView } from 'react-native';
import MaterialInitials from 'react-native-material-initials/native';
import { connect } from 'react-redux';
import { CardSection } from '../common';
import { noteUpdateRead } from '../../actions';
import Message from './NoteEdit';
import ModalScene from '../ModalScene';

class NotesListItem extends Component {
  state = {
    uid: '',
    modalVisible: false
  }

  componentWillMount() {
    const { currentUser } = firebase.auth();
    const { uid } = currentUser;
    this.setState({ uid });
  }

  onRowPress() {
    if (this.props.isOpen === false) {
      this.props.setNoteItem(this.props.noteItem);
      this.props.setModalVisible(true);
      // this.props.navigation.navigate('message', { noteItem: this.props.noteItem });
    } else {
      this.props.setIsOpen(false);
      this.props.rowMap[`${this.props.secId}${this.props.rowId}`].closeRow();
    }
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  renderDate() {
    const date = new Date();
    const shortDate = date.toLocaleDateString();
    const noteDate = new Date(this.props.noteItem.date);
    const time = moment(this.props.noteItem.date).format('LT');
    const shortNoteDate = noteDate.toLocaleDateString();
    const start = moment().subtract(7, 'd').format('x');
    const end = moment().subtract(2, 'd').format('x');
    const poo = moment(this.props.noteItem.date).format('YYYY-MM-DD');
    const yesterday = moment().subtract(1, 'd').format('YYYY-MM-DD');
    const dateTwo = moment(this.props.noteItem.date).format('x');
    const dateDay = moment(this.props.noteItem.date).format('dddd');

    if (shortNoteDate === shortDate) {
      return (
        <Text style={{ fontSize: 14 }}>
          {time}
        </Text>
      );
    } else if (poo === yesterday) {
      return (
        <Text style={{ fontSize: 14 }}>
          Yesterday
        </Text>
      );
    } else if (dateTwo >= start && dateTwo <= end) {
      return (
        <Text style={{ fontSize: 14 }}>
          {dateDay}
        </Text>
      );
    }
    return (
      <Text style={{ fontSize: 14 }}>
        {shortNoteDate}
      </Text>
    );
  }

  renderRecipients() {
    const { recipient1, recipient2 } = this.props.noteItem;
    if (recipient2 !== '') {
      const recip1 = _.split(recipient1, ' ', 1);
      const recip2 = _.split(recipient2, ' ', 1);

      return <Text>{recip1[0]} & {recip2[0]}</Text>;
    } else {
      return <Text>{recipient1}</Text>;
    }
  }

  render() {
    const { note, recipient1, recipient2, ampersand, from } = this.props.noteItem;
    const userRead = this.state.uid.toLowerCase() + 'Read';

    if (this.props.noteItem[userRead] === false) {
      return (
        <View>
          <TouchableHighlight
            onPress={this.onRowPress.bind(this)}
          >
            <View style={{ flex: 1, height: 80 }}>
              <CardSection style={styles.titleStyle}>
                  <MaterialInitials
                    style={{ alignSelf: 'center' }}
                    backgroundColor={'#DB2728'}
                    color={'white'}
                    size={40}
                    text={from}
                    single={false}
                  />

                  <View style={{ flex: 1, flexDirection: 'column', paddingLeft: 15 }}>
                    <Text style={styles.textStyleFromUnread}>
                      {this.renderRecipients()}
                    </Text>
                    <Text ellipsizeMode='tail' numberOfLines={2} style={styles.textStyleUnread}>
                      {note}
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                    {this.renderDate()}
                  </View>
              </CardSection>
            </View>
          </TouchableHighlight>

          <ModalScene
            modalVisible={this.state.modalVisible}
            setModalVisible={this.setModalVisible.bind(this)}
            title={'Message'}
          >
            <Message
              noteItem={this.props.noteItem}
            />
          </ModalScene>
        </View>
      );
    }
    return (
      <View>
        <TouchableHighlight
          onPress={this.onRowPress.bind(this)}
        >
          <View style={{ flex: 1, height: 80 }}>
            <CardSection style={styles.titleStyle}>
                <MaterialInitials
                  style={{
                    alignSelf: 'center',
                    shadowOffset: { width: 2, height: 2 },
                    shadowColor: 'black',
                    shadowOpacity: 5,
                    shadowRadius: 3
                  }}
                  backgroundColor={'white'}
                  color={'#DB2728'}
                  size={40}
                  text={from}
                  single={false}
                />

                <View style={{ flex: 1, flexDirection: 'column', paddingLeft: 15 }}>
                  <Text style={styles.textStyleFromRead}>
                    {this.renderRecipients()}
                  </Text>
                  <Text ellipsizeMode='tail' numberOfLines={2} style={styles.textStyleRead}>
                    {note}
                  </Text>
                </View>

                <View style={{ flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                  {this.renderDate()}
                </View>
            </CardSection>
          </View>
        </TouchableHighlight>

          <ModalScene
            modalVisible={this.state.modalVisible}
            setModalVisible={this.setModalVisible.bind(this)}
            title={'Message'}
          >
            <Message
              noteItem={this.props.noteItem}
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
    alignItems: 'center'
  },
  textStyleUnread: {
    fontSize: 15,
    fontWeight: '600',
  },
  textStyleRead: {
    fontSize: 15,
    color: '#B3B3B3'
  },
  textStyleFromUnread: {
    fontSize: 18,
    fontWeight: '600',
    color: '#DB2728'
  },
  textStyleFromRead: {
    fontSize: 18,
    fontWeight: '600'
  }
};

export default connect(null, { noteUpdateRead })(NotesListItem);
