import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, TouchableOpacity, Dimensions } from 'react-native';
import { SwipeButton, ConfirmModal } from '../common';
import {
  outgoingDelete,
  orderUpdate,
  outgoingSave,
  outgoingArchive,
  setOrderStatus,
  incomingDelete,
  incomingArchive,
  noteDelete,
  userDelete
} from '../../actions';

const { height, width } = Dimensions.get('window');

class HiddenListItem extends Component {
  state = {
    visible: false,
    isOpen: false,
    archive: false
  }

  onAccept() {
    const uid = this.props.order.uid;

    this.props.rowMap[`${this.props.secId}${this.props.rowId}`].closeRow();
    this.props.outgoingDelete({ uid, navigation: this.props.navigation });
    this.setState({
      visible: false
    });
  }

  onAcceptDeleteMessage() {
    const uid = this.props.order.uid;

    this.props.rowMap[`${this.props.secId}${this.props.rowId}`].closeRow();
    this.props.noteDelete({ uid });
    this.setState({
      visible: false
    });
  }

  onAcceptDeleteUser() {
    const uid = this.props.order.uid;

    this.props.rowMap[`${this.props.secId}${this.props.rowId}`].closeRow();
    this.props.userDelete({ uid });
    this.setState({
      visible: false
    });
  }

  onAcceptIncoming() {
    const uid = this.props.order.uid;

    this.props.rowMap[`${this.props.secId}${this.props.rowId}`].closeRow();
    this.props.incomingDelete({ uid });
    this.setState({
      visible: false
    });
  }

  onAcceptArchive() {
    const { uid } = this.props.order;

    this.props.outgoingArchive({ uid });
    this.props.outgoingDelete({ uid });
    this.setState({
      visible: false,
      isOpen: false
    });
    this.props.rowMap[`${this.props.secId}${this.props.rowId}`].closeRow();
  }

  onAcceptArchiveIncoming() {
    const { uid } = this.props.order;

    this.props.incomingArchive({ uid });
    this.props.incomingDelete({ uid });
    this.setState({
      visible: false,
      isOpen: false
    });
    this.props.rowMap[`${this.props.secId}${this.props.rowId}`].closeRow();
  }

  onDecline() {
    this.props.rowMap[`${this.props.secId}${this.props.rowId}`].closeRow();
    this.setState({
      visible: false,
      isOpen: false
    });
  }

  showModal() {
    this.setState({
      visible: true
    });
  }

  showModalArchive() {
    this.setState({
      archive: true,
      visible: true
    });
  }


  hideModal() {
    this.setState({
      visible: false
    });
  }

  updateStatus(orderStatus) {
    if (orderStatus === 'ready') {
      this.props.setOrderStatus({
        orderStatus, uid: this.props.order.uid, company: this.props.order.companyName, log: 'set order status to ready'
      });

      this.props.rowMap[`${this.props.secId}${this.props.rowId}`].closeRow();
    } else if (orderStatus === 'complete') {
      this.props.setOrderStatus({
        orderStatus, uid: this.props.order.uid, company: this.props.order.companyName, log: 'set order status to complete'
      });

      this.props.rowMap[`${this.props.secId}${this.props.rowId}`].closeRow();
    } else if (orderStatus === 'processing') {
      this.props.setOrderStatus({
        orderStatus, uid: this.props.order.uid, company: this.props.order.companyName, log: 'set order status to processing'
      });

      this.props.rowMap[`${this.props.secId}${this.props.rowId}`].closeRow();
    } else if (orderStatus === 'received') {
      this.props.setOrderStatus({
        orderStatus: 'Received', uid: this.props.order.uid, company: this.props.order.companyName, log: 'set incoming order status to received'
      });

      this.props.rowMap[`${this.props.secId}${this.props.rowId}`].closeRow();
    }
  }

  undoStatus(orderStatus) {
    if (orderStatus === 'ready') {
      this.props.setOrderStatus({
        orderStatus: 'processing', uid: this.props.order.uid, company: this.props.order.companyName, log: 'changed back order status to processing'
      });

      this.props.rowMap[`${this.props.secId}${this.props.rowId}`].closeRow();
    } else if (orderStatus === 'complete') {
      this.props.setOrderStatus({
        orderStatus: 'ready', uid: this.props.order.uid, company: this.props.order.companyName, log: 'changed back order status to ready'
      });

      this.props.rowMap[`${this.props.secId}${this.props.rowId}`].closeRow();
    } else if (orderStatus === 'processing') {
      this.props.setOrderStatus({
        orderStatus: 'new', uid: this.props.order.uid, company: this.props.order.companyName, log: 'changed back order status to new'
      });

      this.props.rowMap[`${this.props.secId}${this.props.rowId}`].closeRow();
    } else if (orderStatus === 'received') {
      this.props.setOrderStatus({
        orderStatus: 'In Transit', uid: this.props.order.uid, company: this.props.order.companyName, log: 'changed back incoming order status to "In Transit"'
      });

      this.props.rowMap[`${this.props.secId}${this.props.rowId}`].closeRow();
    }
  }

  renderButton(buttonType, iconName, backgroundColor, color) {
    return (
      <SwipeButton
        type={buttonType}
        backgroundColor={backgroundColor}
        iconColor={color}
        iconName={iconName}
        buttonType={buttonType}
        showModal={this.props.showModal}
        width={this.props.width}
      />
    );
  }

  renderModal(bool) {
    if (this.props.orderType === 'incoming') {
      if (bool) {
        return (
          <ConfirmModal
            visible={this.state.visible}
            onAccept={this.onAcceptArchiveIncoming.bind(this)}
            onDecline={this.onDecline.bind(this)}
            buttonText='Archive'
          >
            Are you sure you want to archive this order?
          </ConfirmModal>
        );
      }
      return (
        <ConfirmModal
          visible={this.state.visible}
          onAccept={this.onAcceptIncoming.bind(this)}
          onDecline={this.onDecline.bind(this)}
          buttonText='Delete'
        >
          Are you sure you want to delete this order?
        </ConfirmModal>
      );
    } else if (this.props.orderType === 'outgoing'){
      if (bool) {
        return (
          <ConfirmModal
            visible={this.state.visible}
            onAccept={this.onAcceptArchive.bind(this)}
            onDecline={this.onDecline.bind(this)}
            buttonText='Archive'
          >
            Are you sure you want to archive this order?
          </ConfirmModal>
        );
      }
      return (
        <ConfirmModal
          visible={this.state.visible}
          onAccept={this.onAccept.bind(this)}
          onDecline={this.onDecline.bind(this)}
          buttonText='Delete'
        >
          Are you sure you want to delete this order?
        </ConfirmModal>
      );
    } else if (this.props.orderType === 'message') {
      return (
        <ConfirmModal
          visible={this.state.visible}
          onAccept={this.onAcceptDeleteMessage.bind(this)}
          onDecline={this.onDecline.bind(this)}
          buttonText='Delete'
        >
          Are you sure you want to delete this message?
        </ConfirmModal>
      );
    } else if (this.props.orderType === 'users') {
      return (
        <ConfirmModal
          visible={this.state.visible}
          onAccept={this.onAcceptDeleteUser.bind(this)}
          onDecline={this.onDecline.bind(this)}
          buttonText='Delete'
        >
          Are you sure you want to delete this user?
        </ConfirmModal>
      );
    }
  }

  render() {
    if (this.props.order.status === 'complete') {
      return (
        <View style={styles.rowBack}>
          <View style={styles.leftButtonsContainer}>
            <TouchableOpacity onPress={() => this.undoStatus('complete')}>
              {this.renderButton('undoComplete', 'undo', 'white', '#4ff765')}
            </TouchableOpacity>
          </View>
          <View style={styles.rightButtonsContainer}>
            <TouchableOpacity onPress={() => this.showModalArchive()}>
              {this.renderButton('archive', 'archive', 'green', 'white')}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.showModal()}>
              {this.renderButton('delete', 'trash', 'red', 'white')}
            </TouchableOpacity>
          </View>
          {this.renderModal(this.state.archive)}
        </View>
      );
    } else if (this.props.order.status === 'ready') {
      return (
        <View style={styles.rowBack}>
          <View style={styles.leftButtonsContainer}>
            <TouchableOpacity onPress={() => this.undoStatus('ready')}>
              {this.renderButton('undoReady', 'undo', 'white', '#fff163')}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.updateStatus('complete')}>
              {this.renderButton('complete', 'check', '#0288D1', 'white')}
            </TouchableOpacity>
          </View>
          <View style={styles.rightButtonsContainer}>
            <TouchableOpacity onPress={() => this.showModalArchive()}>
              {this.renderButton('archive', 'archive', 'green', 'white')}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.showModal()}>
              {this.renderButton('delete', 'trash', 'red', 'white')}
            </TouchableOpacity>
          </View>
          {this.renderModal(this.state.archive)}
        </View>
      );
    } else if (this.props.order.status === 'processing') {
      return (
        <View style={styles.rowBack}>
          <View style={styles.leftButtonsContainer}>
            <TouchableOpacity onPress={() => this.undoStatus('processing')}>
              {this.renderButton('undoProcessing', 'undo', 'white', 'black')}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.updateStatus('ready')}>
              {this.renderButton('ready', 'check', '#4ff765', 'white')}
            </TouchableOpacity>
          </View>
          <View style={styles.rightButtonsContainer}>
            <TouchableOpacity onPress={() => this.showModalArchive()}>
              {this.renderButton('archive', 'archive', 'green', 'white')}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.showModal()}>
              {this.renderButton('delete', 'trash', 'red', 'white')}
            </TouchableOpacity>
          </View>
          {this.renderModal(this.state.archive)}
        </View>
      );
    } else if (this.props.orderType === 'message' || this.props.orderType === 'users') {
      return (
        <View style={styles.rowBack}>
          <View style={styles.rightButtonsContainerSingle}>
            <TouchableOpacity onPress={() => this.showModal()}>
              {this.renderButton('delete', 'trash', 'red', 'white')}
            </TouchableOpacity>
          </View>
          {this.renderModal(this.state.archive)}
        </View>
      );
    } else if (this.props.order.status === 'In Transit') {
      return (
        <View style={styles.rowBack}>
          <View style={styles.leftButtonsContainer}>
            <TouchableOpacity onPress={() => this.updateStatus('received')}>
              {this.renderButton('received', 'check', '#0288D1', 'white')}
            </TouchableOpacity>
          </View>
          <View style={styles.rightButtonsContainer}>
            <TouchableOpacity onPress={() => this.showModalArchive()}>
              {this.renderButton('archive', 'archive', 'green', 'white')}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.showModal()}>
              {this.renderButton('delete', 'trash', 'red', 'white')}
            </TouchableOpacity>
          </View>
          {this.renderModal(this.state.archive)}
        </View>
      );
    } else if (this.props.order.status === 'Received') {
      return (
        <View style={styles.rowBack}>
          <View style={styles.leftButtonsContainer}>
            <TouchableOpacity onPress={() => this.undoStatus('received')}>
              {this.renderButton('undoReceived', 'undo', 'white', 'black')}
            </TouchableOpacity>
          </View>
          <View style={styles.rightButtonsContainer}>
            <TouchableOpacity onPress={() => this.showModalArchive()}>
              {this.renderButton('archive', 'archive', 'green', 'white')}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.showModal()}>
              {this.renderButton('delete', 'trash', 'red', 'white')}
            </TouchableOpacity>
          </View>
          {this.renderModal(this.state.archive)}
        </View>
      );
    }
    return (
      <View style={styles.rowBack}>
        <View style={styles.leftButtonsContainerSmall}>
          <TouchableOpacity onPress={() => this.updateStatus('processing')}>
            {this.renderButton('processing', 'check', '#fff163', 'white')}
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: this.props.width + this.props.width,
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            flexDirection: 'row'
          }}
        >
          <TouchableOpacity onPress={() => this.showModalArchive()}>
            {this.renderButton('archive', 'archive', 'green', 'white')}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.showModal()}>
            {this.renderButton('delete', 'trash', 'red', 'white')}
          </TouchableOpacity>
        </View>
        {this.renderModal(this.state.archive)}
      </View>
    );
  }
}

const styles = {
	rowBack: {
		alignItems: 'center',
		width: width,
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
		flexDirection: 'row',
		paddingLeft: 15,
	},
  rightButtonsContainer: {
    width: 150,
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    flexDirection: 'row'
  },
  rightButtonsContainerSingle: {
    width: 75,
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    flexDirection: 'row'
  },
  leftButtonsContainer: {
    width: 150,
    top: 0,
    bottom: 0,
    position: 'absolute',
    left: 0,
    flexDirection: 'row'
  },
  leftButtonsContainerSmall: {
    width: 75,
    top: 0,
    bottom: 0,
    position: 'absolute',
    left: 0,
    flexDirection: 'row'
  }
};

export default connect(null, {
  outgoingDelete,
  orderUpdate,
  outgoingSave,
  outgoingArchive,
  setOrderStatus,
  incomingDelete,
  incomingArchive,
  noteDelete,
  userDelete
})(HiddenListItem);
