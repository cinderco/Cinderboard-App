import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Switch, KeyboardAvoidingView, Platform } from 'react-native';
import { connect } from 'react-redux';
import { Icon, Button } from 'react-native-elements';
import {
  emailChanged,
  passwordChanged,
  updateUser,
  checkIfLoggedIn,
  confirmPasswordChanged,
  nameChanged,
 } from '../../actions';
import { CardSection, Input, Spinner, SceneHeader } from '../common';

class EditUser extends Component {
  static navigationOptions = {
    title: 'Edit User',
    header: ({ navigate }) => ({
        left: (
          <Button
            icon={{name: 'bars', type: 'font-awesome', size: 20}}
            onPress={() => navigate('DrawerOpen')}
            backgroundColor="rgba(0,0,0,0)"
            color="white"
          />
        ),
        style: {
            backgroundColor: 'black'
        },
        title: 'New User',
        tintColor: 'white'
    }),
    tabBar: () => ({
      visible: false
    })
  };

  state = {
    adminSwitchIsOn: false,
    password: '',
    confirmPassword: '',
    name: '',
    email: '',
    passwordsError: false,
    passwordsMatch: false,
    loading: false,
    updateError: ''
  };

  componentDidMount() {
    this.setState({ name: this.props.user.name, email: this.props.user.email, adminSwitchIsOn: this.props.user.isAdmin });
  }

  onEmailChange(text) {
    this.props.emailChanged(text);
  }

  onPasswordChange(text) {
    this.props.passwordChanged(text);
  }

  onConfirmPasswordChange(text) {
    this.props.confirmPasswordChanged(text);
  }

  onNameChange(text) {
    this.props.nameChanged(text);
  }

  onButtonPress() {
    if (this.state.password !== this.state.confirmPassword) {
      this.setState({ passwordsMatch: true, passwordsError: false});
    } else {
      this.setState({ passwordsError: false, passwordsMatch: false, loading: true });
      const { email, password, name, adminSwitchIsOn } = this.state;

      this.props.updateUser({
        email,
        password,
        name,
        admin:
        adminSwitchIsOn,
        uid: this.props.user.uid,
        setModalVisible: this.props.setModalVisible,
        setError: this.setError.bind(this)
      });
    }
  }

  setError(error) {
    this.setState({ updateError: error, loading: false });
  }

  renderButton() {
    return (
      <TouchableOpacity onPress={this.onButtonPress.bind(this)} style={styles.buttonStyle}>
        <Text style={styles.textStyle}>Save Changes</Text>
      </TouchableOpacity>
    );
  }

  renderPasswordsError() {
    if (this.state.passwordsError === true) {
      return (
        <Text style={{ color: 'red', fontSize: 16, fontWeight: '600', alignSelf: 'center' }}>Please enter password!</Text>
      );
    }
    return null;
  }

  renderPasswordsMatch() {
    if (this.state.passwordsMatch === true) {
      return (
        <Text style={{ color: 'red', fontSize: 16, fontWeight: '600', alignSelf: 'center' }}>Passwords do not match!</Text>
      );
    }
    return null;
  }

  renderEmailAlreadyInUseError() {
    if (this.state.updateError !== '') {
      return (
        <Text style={{ color: 'red', fontSize: 16, fontWeight: '600', alignSelf: 'center' }}>{this.state.updateError}</Text>
      );
    } else {
      return null;
    }
  }

  render() {
    if (this.state.loading) {
      return <Spinner loadingMessage="Updating user" size="large" />;
    } else {
      if (Platform.OS === 'android') {
        return (
            <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#292d29' }}>
                <View style={{ borderRadius: 5 }}>
                  <CardSection style={{ borderRadius: 5 }}>
                    <Input
                      label="Name"
                      placeholder="ex. John Doe"
                      onChangeText={(text) => this.setState({ name: text})}
                      value={this.state.name}
                      autoCapitalize="words"
                    />
                  </CardSection>

                  <CardSection style={{ borderRadius: 5, marginTop: 5 }}>
                    <Input
                      label="Email"
                      placeholder="email@gmail.com"
                      onChangeText={(text) => this.setState({ email: text})}
                      value={this.state.email}
                      autoCapitalize='none'
                    />
                  </CardSection>

                  <CardSection style={{ borderRadius: 5, marginTop: 5 }}>
                    <Input
                      secureTextEntry
                      label="New Password"
                      placeholder="password"
                      onChangeText={(text) => this.setState({ password: text})}
                      value={this.state.password}
                    />
                  </CardSection>

                  <CardSection style={{ borderRadius: 5, marginTop: 5 }}>
                    <Input
                      secureTextEntry
                      label="Confirm"
                      placeholder="re-type password"
                      onChangeText={(text) => this.setState({ confirmPassword: text})}
                      value={this.state.confirmPassword}
                    />
                  </CardSection>
                </View>

                <View style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
                  <Switch
                    onValueChange={(value) => this.setState({ adminSwitchIsOn: value })}
                    style={{ marginBottom: 10, marginTop: 15, marginRight: 15 }}
                    value={this.state.adminSwitchIsOn}
                  />

                  <Text style={{ fontSize: 18, color: 'white' }}>Admin</Text>
                </View>

                {this.renderPasswordsError()}
                {this.renderPasswordsMatch()}
                {this.renderEmailAlreadyInUseError()}

                {this.renderButton()}
            </View>
        );
      } else {
        return (
            <KeyboardAvoidingView behavior={'padding'} style={{ flex: 1, justifyContent: 'center', backgroundColor: '#292d29' }}>
                <View style={{ borderRadius: 5 }}>
                  <CardSection style={{ borderRadius: 5 }}>
                    <Input
                      label="Name"
                      placeholder="ex. John Doe"
                      onChangeText={(text) => this.setState({ name: text})}
                      value={this.state.name}
                      autoCapitalize="words"
                    />
                  </CardSection>

                  <CardSection style={{ borderRadius: 5, marginTop: 5 }}>
                    <Input
                      label="Email"
                      placeholder="email@gmail.com"
                      onChangeText={(text) => this.setState({ email: text})}
                      value={this.state.email}
                      autoCapitalize='none'
                    />
                  </CardSection>

                  <CardSection style={{ borderRadius: 5, marginTop: 5 }}>
                    <Input
                      secureTextEntry
                      label="New Password"
                      placeholder="password"
                      onChangeText={(text) => this.setState({ password: text})}
                      value={this.state.password}
                    />
                  </CardSection>

                  <CardSection style={{ borderRadius: 5, marginTop: 5 }}>
                    <Input
                      secureTextEntry
                      label="Confirm"
                      placeholder="re-type password"
                      onChangeText={(text) => this.setState({ confirmPassword: text})}
                      value={this.state.confirmPassword}
                    />
                  </CardSection>
                </View>

                <View style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
                  <Switch
                    onValueChange={(value) => this.setState({ adminSwitchIsOn: value })}
                    style={{ marginBottom: 10, marginTop: 15, marginRight: 15 }}
                    value={this.state.adminSwitchIsOn}
                  />

                <Text style={{ fontSize: 18, color: 'white' }}>Admin</Text>
                </View>

                {this.renderPasswordsError()}
                {this.renderPasswordsMatch()}
                {this.renderEmailAlreadyInUseError()}

                {this.renderButton()}
            </KeyboardAvoidingView>
        );
      }
    }
  }
}

const styles = {
  errorTextStyle: {
    fontSize: 20,
    alignSelf: 'center',
    color: 'red',
  },
  successTextStyle: {
    fontSize: 20,
    alignSelf: 'center',
    color: 'green'
  },
  textStyle: {
    alignSelf: 'center',
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    paddingTop: 10,
    paddingBottom: 10
  },
  buttonStyle: {
    height: 40,
    alignSelf: 'stretch',
    backgroundColor: '#DB2728',
    marginLeft: 15,
    marginRight: 15,
    marginTop: 15,
    borderRadius: 5
  }
};

const mapStateToProps = state => {
  const success = state.auth.success;
  return { success };
};

export default connect(mapStateToProps, {
  emailChanged, passwordChanged, updateUser, checkIfLoggedIn, nameChanged, confirmPasswordChanged
})(EditUser);
