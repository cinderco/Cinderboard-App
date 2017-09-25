import _ from 'lodash';
import moment from 'moment';
import Search from 'react-native-search-box';
import React, { Component } from 'react';
import { Icon, Button, SearchBar } from 'react-native-elements';
import { connect } from 'react-redux';
import {
  ScrollView,
  View,
  Text,
  StatusBar,
  KeyboardAvoidingView,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity
} from 'react-native';
import { archivedFetch, orderUpdate } from '../../../actions';
import ArchivedListItem from './ArchivedListItem';
import { Spinner, SceneHeader } from '../../common';
import CalendarPick from '../CalendarPicker';

class ArchivedList extends Component {
  constructor(props) {
    super(props);

    this.clear = this.clear.bind(this);
  }

  static navigationOptions = {
    title: 'Archived',
    tabBarLabel: 'Archived',
    tabBarIcon: ({ tintColor }) => (
      <Icon
        name='archive'
        type='font-awesome'
        color={tintColor}
      />
    ),
    headerVisible: false
  };

  state = {
    text: '',
    orders: [],
    visibleStart: false,
    visibleEnd: false,
    dateStart: '',
    dateEnd: ''
  }

  componentWillMount() {
    const start = moment().subtract(7, 'days');
    const end = moment();

    this.props.archivedFetch(start, end);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.order !== 'no results') {
      const orders = this.filterList(nextProps.orders, this.state.text);

      this.setState({ orders });
    }
  }

  setDateStart(poo) {
    const date = poo.toLocaleDateString();

    this.setState({
      dateStart: date, newDate: date
    });
  }

  setDateEnd(poo) {
    const date = poo.toLocaleDateString();

    this.setState({
      dateEnd: date, newDate: date
    });
  }

  closeModalStart() {
    this.setState({ visibleStart: false });
  }

  closeModalEnd() {
    this.setState({ visibleEnd: false });
  }

  clear() {
    this.input.clear();
    this.filterOrders('');
  }

  filterList(arr, searchKey) {
    if (arr !== 'no results') {
      return arr.filter(obj => {
        return Object.values(obj).some(val => {
          if (typeof val === 'string') {
            const value = val.toLowerCase();
            return value.includes(searchKey.toLowerCase());
          } else {
            return Object.values(val).some(valTwo => {
              return Object.values(valTwo).some(valThree => {
                if (typeof valThree === 'string') {
                  const valueTwo = valThree.toLowerCase();
                  return valueTwo.includes(searchKey.toLowerCase());
                } else {
                  return;
                }
              });
            });
          }
        });
      });
    }
  }

  filterOrders(text) {
    this.setState({ text: text })

    const orders = this.filterList(this.props.orders, text);

    this.setState({ orders });
  }

  renderList() {
    return this.state.orders.map((order, index) => {
      return(
        <ArchivedListItem order={order} key={order.uid} />
      )
    })
  }

  render() {
    if (this.props.loading) {
      return <Spinner size="large" />;
    } else if (this.props.orders.length === 0) {
      return (
        <View style={{ flex: 1}}>
          <SceneHeader
            title={'Archived Orders'}
            navigation={this.props.navigation}
            hamburgerOnly={true}
          />
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 18 }}>No Archived Orders</Text>
            </View>
        </View>
      );
    } else if (this.props.orders === 'no results') {
      return (
        <View style={{ flex: 1}}>
          <SceneHeader
            title={'Archived Orders'}
            navigation={this.props.navigation}
            hamburgerOnly={true}
          />

          <View
            style={{
              flexDirection: 'row',
              height: 50,
              backgroundColor: '#86939e',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 10
            }}
          >
            <TouchableWithoutFeedback onPress={() => this.setState({ visibleStart: true })} style={{ flex: 1, position: 'relative' }}>
              <View style={{ flex: 1 }}>
                <TextInput
                  style={{ flex: 1, backgroundColor: 'white', borderRadius: 3, marginRight: 5, paddingLeft: 30 }}
                  placeholder='Start'
                  editable={false}
                  value={this.state.dateStart}
                  underlineColorAndroid={"transparent"}
                />
                <Icon
                  name='calendar'
                  type='font-awesome'
                  containerStyle={{ position: 'absolute', top: 5, left: 5 }}
                  size={18}
                />
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => this.setState({ visibleEnd: true })} style={{ flex: 1, position: 'relative' }}>
              <View style={{ flex: 1 }}>
                <TextInput
                  style={{ flex: 1, backgroundColor: 'white', borderRadius: 3, marginLeft: 5, paddingLeft: 30 }}
                  placeholder='End'
                  editable={false}
                  value={this.state.dateEnd}
                  underlineColorAndroid={"transparent"}
                />
                <Icon
                  name='calendar'
                  type='font-awesome'
                  containerStyle={{ position: 'absolute', top: 5, left: 10 }}
                  size={18}
                />
              </View>
            </TouchableWithoutFeedback>
            <TouchableOpacity onPress={() => this.props.archivedFetch(this.state.dateStart, this.state.dateEnd)}>
              <View style={{ marginLeft: 10 }}>
                <Text>Search</Text>
              </View>
            </TouchableOpacity>

            <CalendarPick
              visible={this.state.visibleStart}
              closeModal={this.closeModalStart.bind(this)}
              newDate={''}
              date={this.state.dateStart}
              setDate={this.setDateStart.bind(this)}
              date={this.state.dateStart}
            />

            <CalendarPick
              visible={this.state.visibleEnd}
              closeModal={this.closeModalEnd.bind(this)}
              newDate={''}
              date={this.state.dateEnd}
              setDate={this.setDateEnd.bind(this)}
              date={this.state.dateEnd}
            />
          </View>

          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 18 }}>No results found</Text>
          </View>
        </View>
      );
    }
    return (
      <KeyboardAvoidingView behavior={'padding'} style={{ flex: 1 }}>
        <StatusBar
          barStyle="light-content"
        />
        <SceneHeader
          title={'Archived Orders'}
          navigation={this.props.navigation}
          hamburgerOnly={true}
        />
        <View>
          <SearchBar
            onChangeText={(text) => this.filterOrders(text)}
            placeholder='Search'
            textInputRef={(input) => { this.input = input; }}
            returnKeyType={'done'}
          />

          <Icon
            color='#86939e'
            name='clear'
            onPress={() => this.clear()}
            containerStyle={{ position: 'absolute', top: 0, bottom: 0, right: 15, zIndex: 5000 }}
            size={20}
            underlayColor='#303338'
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            height: 50,
            backgroundColor: '#86939e',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 10
          }}
        >
          <TouchableWithoutFeedback onPress={() => this.setState({ visibleStart: true })} style={{ flex: 1, position: 'relative' }}>
            <View style={{ flex: 1 }}>
              <TextInput
                style={{ flex: 1, backgroundColor: 'white', borderRadius: 3, marginRight: 5, paddingLeft: 30 }}
                placeholder='Start'
                editable={false}
                value={this.state.dateStart}
                underlineColorAndroid={"transparent"}
              />
              <Icon
                name='calendar'
                type='font-awesome'
                containerStyle={{ position: 'absolute', top: 5, left: 5 }}
                size={18}
              />
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => this.setState({ visibleEnd: true })} style={{ flex: 1, position: 'relative' }}>
            <View style={{ flex: 1 }}>
              <TextInput
                style={{ flex: 1, backgroundColor: 'white', borderRadius: 3, marginLeft: 5, paddingLeft: 30 }}
                placeholder='End'
                editable={false}
                value={this.state.dateEnd}
                underlineColorAndroid={"transparent"}
              />
              <Icon
                name='calendar'
                type='font-awesome'
                containerStyle={{ position: 'absolute', top: 5, left: 10 }}
                size={18}
              />
            </View>
          </TouchableWithoutFeedback>
          <TouchableOpacity onPress={() => this.props.archivedFetch(this.state.dateStart, this.state.dateEnd)}>
            <View style={{ marginLeft: 10 }}>
              <Text>Search</Text>
            </View>
          </TouchableOpacity>

          <CalendarPick
            visible={this.state.visibleStart}
            closeModal={this.closeModalStart.bind(this)}
            newDate={''}
            date={this.state.dateStart}
            setDate={this.setDateStart.bind(this)}
            date={this.state.dateStart}
          />

          <CalendarPick
            visible={this.state.visibleEnd}
            closeModal={this.closeModalEnd.bind(this)}
            newDate={''}
            date={this.state.dateEnd}
            setDate={this.setDateEnd.bind(this)}
            date={this.state.dateEnd}
          />
        </View>

        <ScrollView keyboardShouldPersistTaps='always'>
          {this.renderList()}
        </ScrollView>
      </KeyboardAvoidingView>

    );
  }
}

const mapStateToProps = state => {
  if (state.archivedOrders.archived_list === 'no results') {
    const orders = 'no results';

    return { orders};
  } else {
    const unsortedOrders = _.map(state.archivedOrders.archived_list, (val) => {
      return val;
    });

    const sortedOrders = unsortedOrders.sort((a, b) => {
      return new Date(b.archiveDate).getTime() - new Date(a.archiveDate).getTime();
    });
    const orders = sortedOrders;
    const loading = state.archivedOrders.loading;

    return { orders, loading };
  }
};

export default connect(mapStateToProps, { archivedFetch, orderUpdate })(ArchivedList);
