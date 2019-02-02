import React, { Component } from 'react'
import { Text, View, Modal, Dimensions } from 'react-native'
import PropTypes from 'prop-types'


 const ErrorModal = (props) =>  {
     const {errorModalVisable, errorText} = props;
    return (
    <Modal transparent visible={errorModalVisable} onRequestClose={() => console.log('error modal')} animationType='fade' > 
    <View style={styles.wrapper}>
      <View style={styles.container}>
          <View style={styles.header}><Text style={styles.heading}>ERROR</Text></View>
        <Text style={{fontSize: 23, textAlign:'center', marginTop: 10 }} >{errorText}</Text>
      </View>
      </View>
    </Modal>
    )
}

const styles = {
    wrapper:{
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flex:1
    },
    header: {
        width: '100%',
        backgroundColor: '#DFF6F8',
        height: 50
    },
    container: {
        backgroundColor: 'rgba(255,255,255,1)',
        marginTop: '20%',
        height: '30%',
        width: '80%',
    },
    heading: {
        fontSize: 24,
        marginTop: 5,
        marginLeft: 5
    }
}

ErrorModal.propTypes = {
    errorModalVisable: PropTypes.bool.isRequired,
    errorText: PropTypes.string.isRequired 
}

export default ErrorModal