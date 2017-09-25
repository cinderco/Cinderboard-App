import React from 'react';
import { View } from 'react-native';
import { Icon } from 'react-native-elements';

const SwipeButton = ({ buttonType, iconName, iconColor, height, width }) => {
    let poo = {};

    switch (buttonType) {
      case 'delete':
        poo = styles.buttonBackgroundDelete;
        break;
      case 'undoReady':
        poo = styles.buttonBackgroundUndoReady;
        break;
      case 'undoComplete':
        poo = styles.buttonBackgroundUndoComplete;
        break;
      case 'complete':
        poo = styles.buttonBackgroundComplete;
        break;
      case 'ready':
        poo = styles.buttonBackgroundReady;
        break;
      case 'processing':
        poo = styles.buttonBackgroundProcessing;
        break;
      case 'received':
        poo = styles.buttonBackgroundComplete;
        break;
      case 'undoProcessing':
        poo = styles.buttonBackgroundUndoProcessing;
        break;
      case 'undoReceived':
        poo = styles.buttonBackgroundUndoProcessing;
        break;
      default:
        poo = styles.buttonBackgroundArchive;
    }

  return (
    <View style={[styles.backRightBtn, poo, { width, top: 0, bottom: 0 }]}>
      <Icon
        name={iconName}
        type='font-awesome'
        color={iconColor}
      />
    </View>
  );
};

const styles = {
  backRightBtn: {
		alignItems: 'center',
		justifyContent: 'center',
    flex: 1
	},
	buttonBackgroundArchive: {
		backgroundColor: 'green',
	},
  buttonBackgroundDelete: {
		backgroundColor: 'red',
	},
  buttonBackgroundUndoReady: {
		backgroundColor: 'white',
	},
  buttonBackgroundUndoComplete: {
		backgroundColor: 'white',
	},
  buttonBackgroundReady: {
		backgroundColor: '#4ff765',
	},
  buttonBackgroundComplete: {
		backgroundColor: '#0288D1',
	},
  buttonBackgroundProcessing: {
		backgroundColor: '#fff163',
	},
  buttonBackgroundUndoProcessing: {
		backgroundColor: 'white',
	},
	backRightBtnRight: {
		backgroundColor: 'red',
	}
};

export { SwipeButton };
