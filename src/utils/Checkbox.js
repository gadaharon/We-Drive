import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

export default CheckBox = props =>  {
        const { pressedButtonStyle, pressedTextStyle, defaultButtonStyle, defaultTextStyle} = styles;
        const { addDays, isChecked, label, value} = props;
        return (
        <TouchableOpacity onPress={() => {addDays(value)}} style={isChecked ? pressedButtonStyle : defaultButtonStyle}>
            <Text style={isChecked ? pressedTextStyle : defaultTextStyle}>{label}</Text>
        </TouchableOpacity>
        )
}

const styles = {
    defaultButtonStyle:{
        borderRadius: 50,
        padding: 10,
        backgroundColor: '#3498db',
        borderWidth: 1,
        borderColor: '#fff',
        margin: 3
    },
    defaultTextStyle:{
        color: '#fff',
        textAlign: 'center'
    },
    pressedButtonStyle: {
        borderRadius: 50,
        padding: 10,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#3498db',
        margin: 3
    },
    pressedTextStyle: {
        color: '#3498db',
        textAlign: 'center'
    }
    
}