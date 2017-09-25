import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ListView, Text, TouchableOpacity, View } from 'react-native';
import { adminEmployeesFetch } from '../../actions';
import { Spinner, CardSection } from '../common';

class AdminEmployeesList extends Component {
  componentWillMount() {
    this.props.adminEmployeesFetch();

    this.createDataSource(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.createDataSource(nextProps);
  }

  createDataSource({ adminEmployees }) {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.dataSource = ds.cloneWithRows(adminEmployees);
  }

  renderRow(employee) {
    return (
        <CardSection>
          <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={() => this.props.makeListVisible(employee.name)}>
              <Text
                style={{ paddingTop: 20, paddingBottom: 20, paddingLeft: 15 }}
              >
                {employee.name}
              </Text>
            </TouchableOpacity>
          </View>
        </CardSection>
    );
  }

  render() {
    if (this.props.loading) {
      return <Spinner size="large" />;
    }
    return (
      <ListView
        dataSource={this.dataSource}
        renderRow={(employee) => this.renderRow(employee)}
        enableEmptySections
      />
    );
  }
}

const mapStateToProps = state => {
  const adminEmployees = _.map(state.admin.admin_list, (val, uid) => {
    return { ...val, uid };
  });

  const loading = state.admin.loading;

  return { adminEmployees, loading };
};

export default connect(mapStateToProps, { adminEmployeesFetch })(AdminEmployeesList);
