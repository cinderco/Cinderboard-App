import React, { Component } from 'react';
import {
  Dimensions,
  View,
  Modal,
  Text,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import CalendarPicker from 'react-native-calendar-picker';
import { Button } from '../common';
import { orderUpdate } from '../../actions';

const { height, width } = Dimensions.get('window');

class CalendarPick extends Component {
  state = {
    date: '',
    currentDate: new Date()
  }

  componentWillMount() {
    if (this.props.date) {
      console.log('Date property exists')
      if (this.props.date === 'Unknown') {
        console.log('Date = Unknown')
        const date = new Date();
        this.setState({ date: date });
      } else {
        const date = new Date(this.props.date);
        this.setState({ date: date });
      }
    } else if (!this.props.date) {
      const date = new Date();
      this.setState({ date: date });
    }
  }

  setDate(date) {
    this.setState({ date: date});
    this.props.setDate(date);
  }

  setUnknown() {
    this.props.setDate('Unknown');
    this.props.closeModal();
  }

  render() {
      return (
        <Modal
          visible={this.props.visible}
          transparent
          animationType="slide"
          onRequestClose={() => this.props.closeModal()}
        >
          <View style={styles.containerStyle}>
            <View style={{ backgroundColor: '#292d29', marginHorizontal: 5, borderRadius: 25, height: 450, paddingBottom: 10 }}>
              <Text style={{ fontSize: 18, color: 'red', fontWeight: '600', alignSelf: 'center', paddingVertical: 15 }}>Date</Text>
                <View style={{ height: 340, backgroundColor: 'white', padding: 15 }}>
                  <CalendarPicker
                    selectedDate={this.state.date}
                    onDateChange={date => this.setDate(date)}
                    screenWidth={width - 40}
                    selectedDayColor={'#DB2728'}
                    style={{ backgroundColor: 'white'}}
                  />
                </View>

                <View style={{ height: 50, width: width - 30, flexDirection: 'row', alignItems: 'center' }}>
                  <TouchableOpacity onPress={() => this.setUnknown()} style={{ flex: 1, justifyContent: 'center'  }}>
                      <Text style={{ fontSize: 18, color: 'white', fontWeight: '600', alignSelf: 'center' }}>
                        Unknown
                      </Text>
                    </TouchableOpacity>

                    <View style={{ width: 1, height: 45, backgroundColor: '#ddd'}}/>

                    <TouchableOpacity onPress={() => this.props.closeModal()} style={{ flex: 1, justifyContent: 'center'  }}>
                      <View style={{ borderRadius: 25 }}>
                        <Text style={{ fontSize: 18, color: 'white', fontWeight: '600', alignSelf: 'center' }}>Save</Text>
                      </View>
                    </TouchableOpacity>
                </View>

            </View>
          </View>
       </Modal>
      );
  }
}

const styles = {
  containerStyle: {
    position: 'relative',
    justifyContent: 'center',
    backgroundColor:'rgba(0, 0, 0, 0.75)',
    flex: 1,
    paddingHorizontal: 10
  },
  container: {
    flex: 1,
    marginTop: 10,
    marginBottom: 10,
    justifyContent: 'center',
    paddingHorizontal: 10
  },
  selectedDate: {
    backgroundColor: 'rgba(0,0,0,0)',
    color: '#000',
  }
};

const mapStateToProps = (state) => {
  const { newDate } = state.orderForm;

  return { newDate };
};

export default connect(mapStateToProps, { orderUpdate })(CalendarPick);
