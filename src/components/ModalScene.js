import React, { Component } from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';


const ModalScene = (props) => {
    return (
      <Modal
        animationType={"slide"}
        transparent={false}
        visible={props.modalVisible}
        onRequestClose={() => props.setModalVisible(false, props.type)}
      >
        <View style={styles.modalHeader}>
          <TouchableOpacity
            onPress={() => props.setModalVisible(false, props.type)}
            style={styles.backButton}
          >
            <Icon
              name='chevron-left'
              type='font-awesome'
              color='white'
            />
          <Text style={{ color: 'white', fontSize: 16, marginLeft: 10 }}>Back</Text>
          </TouchableOpacity>

          <Text style={{ color: 'white', fontSize: 20, alignSelf: 'center'}}>{props.title}</Text>

            <TouchableOpacity
              onPress={() => props.rightButtonPress()}
              style={styles.buttonRight}
            >
              <Text style={{ color: 'white', fontSize: 16, marginLeft: 10 }}>{props.rightText}</Text>
            </TouchableOpacity>
        </View>
        {props.children}
      </Modal>
    );
}

const styles = {
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
  buttonRight: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    flexDirection: 'row',
    alignItems: 'center'
  }
}

export default ModalScene;
