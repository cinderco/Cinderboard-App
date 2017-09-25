import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-elements';

const OrderTypeButton = ({ onPress, children, icon, source }) => {
  const { buttonStyle, textStyle } = styles;
  
  return (
    <TouchableOpacity onPress={onPress} style={buttonStyle}>
      <View style={{ paddingVertical: 10 }}>
        <Icon
          name={icon}
          type={source}
          color='#292d29'
        />
        <Text style={textStyle}>
          {children}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = {
  pickerTextStyle: {
    fontSize: 20,
    paddingLeft: 20
  },
  textStyle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#292d29'
  },
  buttonStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 2.5
  }
};

export default OrderTypeButton;
