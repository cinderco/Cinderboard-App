import firebase from 'firebase';
import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ListView, View, Text, StatusBar } from 'react-native';
import { Icon, Button } from 'react-native-elements';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import { notesFetch, noteUpdate, fetchMessagesUnread } from '../../actions';
import NotesListItem from './NotesListItem';
import Badge from './Badge';
import { Spinner, SceneHeader } from '../common';
import ModalScene from '../ModalScene';
import NoteCreate from './NoteCreate';
import Message from './NoteEdit';
import HiddenListItem from '../Orders/HiddenListItem';

class NotesList extends Component {
  static navigationOptions = {
    title: 'Messages',
    tabBarLabel: 'Messages',
    tabBarIcon: ({ tintColor }) => (
      <View>
        <Badge />
        <Icon
          name='commenting-o'
          type='font-awesome'
          color={tintColor}
        />
      </View>
    ),
  };

  state = {
    modalVisibleNewMessage: false,
    modalVisible: false,
    isOpen: false,
    noteItem: {}
  }

  componentWillMount() {
    this.props.notesFetch();

    this.createDataSource(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.createDataSource(nextProps);
  }

  createDataSource({ messages }) {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.dataSource = ds.cloneWithRows(messages);
  }

  setModalVisible(visible) {
    this.setState({ modalVisibleNewMessage: visible });
  }

  setModalVisibleTwo(visible) {
    this.setState({ modalVisible: visible });
  }

  setNoteItem(noteItem) {
    this.setState({ noteItem })
  }

  setIsOpen(bool) {
    this.setState({ isOpen: bool});
  }

  rightButtonPress() {
    this.setState({
      modalVisibleNewMessage: true
    });
  }

  renderRow(message, secId, rowId, rowMap, isOpen) {
    return (
      <SwipeRow
        leftOpenValue={0}
        rightOpenValue={-75}
        style={{ position: 'relative' }}
      >
        <HiddenListItem
          order={message}
          secId={secId}
          rowId={rowId}
          rowMap={rowMap}
          height={80}
          width={75}
          navigation={this.props.navigation}
          orderType={'message'}
        />
        <NotesListItem
          noteItem={message}
          navigation={this.props.navigation}
          secId={secId}
          rowId={rowId}
          rowMap={rowMap}
          isOpen={isOpen}
          setIsOpen={this.setIsOpen.bind(this)}
          setModalVisible={this.setModalVisibleTwo.bind(this)}
          setNoteItem={this.setNoteItem.bind(this)}
        />
      </SwipeRow>
    );
  }

  render() {
    if (this.props.loading) {
      return <Spinner size="large" />;
    } else if (this.props.messages.length === 0) {
      return (
        <View style={{ flex: 1}}>
          <SceneHeader
            title={'Messages'}
            navigation={this.props.navigation}
            rightButtonPress={this.rightButtonPress.bind(this)}
          />
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 18 }}>No Messages</Text>
            </View>

            <ModalScene
              modalVisible={this.state.modalVisibleNewMessage}
              setModalVisible={this.setModalVisible.bind(this)}
              title={'New Message'}
            >
              <NoteCreate setModalVisible={this.setModalVisible.bind(this)} />
            </ModalScene>
        </View>
      );
    }
    return (
      <View style={{ flex: 1 }}>
        <StatusBar
          barStyle="light-content"
        />
        <SceneHeader
          title={'Messages'}
          navigation={this.props.navigation}
          rightButtonPress={this.rightButtonPress.bind(this)}
        />

        <SwipeListView
            dataSource={this.dataSource}
            renderRow={(message, secId, rowId, rowMap) => this.renderRow(message, secId, rowId, rowMap, this.state.isOpen)}
            style={{ flex: 1, backgroundColor: 'white' }}
            enableEmptySections
            onRowClose={() => this.setState({ isOpen: false })}
            onRowOpen={() => this.setState({ isOpen: true })}
            removeClippedSubviews={false}
        />

        <ModalScene
          modalVisible={this.state.modalVisibleNewMessage}
          setModalVisible={this.setModalVisible.bind(this)}
          title={'New Message'}
        >
          <NoteCreate setModalVisible={this.setModalVisible.bind(this)} />
        </ModalScene>

        <ModalScene
          modalVisible={this.state.modalVisible}
          setModalVisible={this.setModalVisibleTwo.bind(this)}
          title={'Message'}
        >
          <Message
            noteItem={this.state.noteItem}
          />
        </ModalScene>
      </View>
    );
  }
}

const mapStateToProps = state => {
  const unsortedMessages = _.map(state.messages.conversations_list, (val, uid) => {
    return { ...val, uid };
  });

  const messages = unsortedMessages.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const loading = state.messages.loading;
  const badgeNumber = state.orders.badgeNumber;

  return { messages, loading, badgeNumber };
};

export default connect(mapStateToProps, { notesFetch, noteUpdate, fetchMessagesUnread })(NotesList);
