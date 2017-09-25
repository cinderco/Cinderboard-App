import React from 'react';
import { TextInput, View, Text } from 'react-native';

const Input = ({ label, value, onChangeText, placeholder, secureTextEntry, keyboardType, autoCapitalize }) => {
  const { inputStyle, labelStyle, containerStyle } = styles;

  return (
    <View style={containerStyle}>
      <Text style={labelStyle}>{label}</Text>
      <TextInput
        secureTextEntry={secureTextEntry}
        placeholder={placeholder}
        autoCorrect={false}
        style={inputStyle}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        selectionColor={'#DB2728'}
        autoCapitalize={autoCapitalize}
        underlineColorAndroid={"transparent"}
      />
    </View>
  );
};

const styles = {
  inputStyle: {
    color: 'black',
    paddingRight: 5,
    paddingLeft: 5,
    fontSize: 18,
    lineHeight: 23,
    flex: 1,
  },
  labelStyle: {
    fontSize: 18,
    paddingLeft: 15,
    width: 100,
    fontWeight: '600'
  },
  containerStyle: {
    height: 40,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  }
};

export { Input };
