import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-elements';

const OrderTypeButtonSelected = ({ onPress, children, icon, source }) => {
  const { buttonStyle, textStyle } = styles;

  return (
    <TouchableOpacity onPress={onPress} style={buttonStyle}>
      <View style={{ paddingVertical: 10 }}>
        <Icon
          name={icon}
          type={source}
          color='#DB2728'
        />
        <Text style={textStyle}>
          {children}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = {
  buttonStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2.5,
    borderWidth: 1,
    borderColor: '#DB2728',
    borderRadius: 50
  },
  textStyle: {
    alignSelf: 'center',
    color: '#DB2728',
    fontSize: 16,
    fontWeight: '600',
  },
};

export default OrderTypeButtonSelected;
