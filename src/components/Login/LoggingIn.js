import React, { Component } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Spinner } from '../common';

const LoggingIn = () => {
  return (
    <View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size={'large'} color={'white'} />
        <Text style={{ marginTop: 15, color: 'white' }}>Logging In</Text>
    </View>
  );
}

export default LoggingIn;
