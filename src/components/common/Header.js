// Import libraries for making a component
import React from 'react';
import { Text, View, TouchableWithoutFeedback } from 'react-native';

// Make a component
const Header = (props) => {
  const { textStyle, viewStyle } = styles;

  return (
    <TouchableWithoutFeedback onPress={props.onPress}>
      <View style={viewStyle}>
        <Text style={textStyle}>{props.children}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = {
  viewStyle: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 2,
    position: 'relative',
    borderColor: 'red',
    borderTopWidth: 1,
    borderBottomWidth: 1
  },
  textStyle: {
    fontSize: 20,
    alignSelf: 'center',
    color: '#DB2728'
  }
};

// Make the component available to other parts of the app
export { Header };
