import React, { Component } from 'react';
import { Text, View, TouchableHighlight, TextInput } from 'react-native';

class OrderStatusButtons extends Component {
  render() {
    if (this.props.status === 'processing') {
      return (
        <View style={{ flex: 1, flexDirection: 'row', paddingBottom: 10, paddingTop: 15 }}>
          <TouchableHighlight
            onPress={this.props.onPressProcessing.bind(this)}
            style={styles.processingSelected}
          >
            <Text>Processing</Text>
          </TouchableHighlight>

          <TouchableHighlight
            onPress={this.props.onPressReady.bind(this)}
            style={styles.ready}
          >
            <Text>Ready</Text>
          </TouchableHighlight>

          <TouchableHighlight
            onPress={this.props.onPressComplete.bind(this)}
            style={styles.complete}
          >
            <Text>Complete</Text>
          </TouchableHighlight>
        </View>
      );
    } else if (this.props.status === 'ready') {
      return (
        <View style={{ flex: 1, flexDirection: 'row', paddingBottom: 10, paddingTop: 15  }}>
          <TouchableHighlight
            onPress={this.props.onPressProcessing.bind(this)}
            style={styles.processing}
          >
            <Text>Processing</Text>
          </TouchableHighlight>

          <TouchableHighlight
            onPress={this.props.onPressReady.bind(this)}
            style={styles.readySelected}
          >
            <Text style={{ color: 'white' }}>Ready</Text>
          </TouchableHighlight>

          <TouchableHighlight
            onPress={this.props.onPressComplete.bind(this)}
            style={styles.complete}
          >
            <Text>Complete</Text>
          </TouchableHighlight>
        </View>
      );
    } else if (this.props.status === 'complete') {
      return (
        <View style={{ flex: 1, flexDirection: 'row', paddingBottom: 10, paddingTop: 15  }}>
          <TouchableHighlight
            onPress={this.props.onPressProcessing.bind(this)}
            style={styles.processing}
          >
            <Text>Processing</Text>
          </TouchableHighlight>

          <TouchableHighlight
            onPress={this.props.onPressReady.bind(this)}
            style={styles.ready}
          >
            <Text>Ready</Text>
          </TouchableHighlight>

          <TouchableHighlight
            onPress={this.props.onPressComplete.bind(this)}
            style={styles.completeSelected}
          >
            <Text style={{ color: 'white' }}>Complete</Text>
          </TouchableHighlight>
        </View>
      );
    }
      return (
        <View style={{ flex: 1, flexDirection: 'row', paddingBottom: 10, paddingTop: 15  }}>
          <TouchableHighlight
            onPress={this.props.onPressProcessing.bind(this)}
            style={styles.processing}
          >
            <Text>Processing</Text>
          </TouchableHighlight>

          <TouchableHighlight
            onPress={this.props.onPressReady.bind(this)}
            style={styles.ready}
          >
            <Text>Ready</Text>
          </TouchableHighlight>

          <TouchableHighlight
            onPress={this.props.onPressComplete.bind(this)}
            style={styles.complete}
          >
            <Text>Complete</Text>
          </TouchableHighlight>
        </View>
      );
    }
}

const styles = {
  processing: {
    flex: 1,
    borderWidth: 1,
    height: 60,
    borderRadius: 5,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15
  },
  ready: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ddd',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15
  },
  complete: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ddd',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center'
  },
  processingSelected: {
    flex: 1,
    height: 60,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    backgroundColor: '#FFF163'
  },
  readySelected: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 5,
    height: 60,
    borderColor: '#4ff765',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    backgroundColor: '#4ff765'
  },
  completeSelected: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 5,
    height: 60,
    borderColor: '#0288D1',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0288D1'
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 10,
    height: 50,
    borderRadius: 5
  }
};

export default OrderStatusButtons;
