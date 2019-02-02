import React, { Component } from 'react';
import { Text, View, Modal, Dimensions, TouchableOpacity, Image, TextInput } from 'react-native';
import Camera from './MyCamera';


export class EditProfile extends Component {
    state={
        phone: '',
        carType: '',
        carNumber: '',
        carColor: '',
        image_uri: 'image_uri',
        imageBase64: '',
        cameraModalVisability: false
    }

    componentWillReceiveProps(nextProps){
        const { phone, carType, carNumber, carColor, image_uri } = nextProps.profile;
        this.setState({ phone, carType, carNumber, carColor, image_uri });
        console.log(this.state);
    }

    // Camera modal visability handler
    cameraModalVisabilityHandler = () => {
        this.setState({ cameraModalVisability: !this.state.cameraModalVisability })
    }

    // Text Change Handlers
    phoneChangeHandler = text => this.setState({ phone: text });
    carTypeChangeHandler = text => this.setState({ carType: text });
    carNumberChangeHandler = text => this.setState({ carNumber: text });
    carColorChangeHandler = text => this.setState({ carColor: text });
    imageUriChangeHandler = (uri, base64) => this.setState({ image_uri: uri, imageBase64: base64 })


  render() {
      const { phone, carType, carNumber, carColor, image_uri, imageBase64 } = this.state;
      const { isVisable, visabilityHandler, saveChanges } = this.props;
      const { imageWrapper, container, editContainer, label, textInputStyle, textWrapper, saveTxtStyle, cancelTxtStyle } = styles;
    return (
     <Modal transparent visible={isVisable} onRequestClose={visabilityHandler} animationType='slide' >   
      <View style={container}>
       <View style={editContainer}>
              
        <TouchableOpacity 
        onPress={async () => { await saveChanges(phone, carType, carNumber, carColor,imageBase64, image_uri); visabilityHandler()}} 
        style={styles.saveBtn}>
        <Text style={saveTxtStyle}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={visabilityHandler} style={styles.cancelBtn}><Text style={cancelTxtStyle}>Cancel</Text></TouchableOpacity>
        <TouchableOpacity onPress={this.cameraModalVisabilityHandler} style={{marginTop: '20%'}}>
            <Image source={{ uri: image_uri }} style={{height: 150, width: 150, borderRadius: 100,}} />
        </TouchableOpacity>
            <View style={textWrapper}>
                <Text style={label}>Phone Number</Text>
                <TextInput onChangeText={this.phoneChangeHandler} value={phone} placeholderTextColor = '#000' placeholder={phone === '' ? 'Enter Phone Number' : phone} keyboardType='numeric' style={textInputStyle} />
            </View>
            <View style={textWrapper}>
                <Text style={label}>Car Type</Text>
                <TextInput onChangeText={this.carTypeChangeHandler} value={carType} placeholderTextColor = '#000' placeholder={carType === '' ? 'Enter Car Type' : carType} style={textInputStyle} />
            </View>
            <View style={textWrapper}>
                <Text style={label}>Car Number</Text>
                <TextInput onChangeText={this.carNumberChangeHandler} value={carNumber} placeholderTextColor = '#000' placeholder={carNumber === '' ? 'Enter Car Number' : carNumber} keyboardType='numeric' style={textInputStyle} />
            </View>
            <View style={textWrapper}>
                <Text style={label}>Car Color</Text>
                <TextInput onChangeText={this.carColorChangeHandler} value={carColor} placeholderTextColor = '#000' placeholder={carColor === '' ? 'Enter Car Color' : carColor} style={textInputStyle} />
            </View>
        </View>
        <Modal visible={this.state.cameraModalVisability} onRequestClose={this.cameraModalVisabilityHandler}>
            <Camera imageUriChangeHandler={this.imageUriChangeHandler} cameraVisibilityHandler={this.cameraModalVisabilityHandler}/>
        </Modal>
      </View>
     </Modal> 
    )
  }
}

const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.8)'
    },
    editContainer: {
        height: '90%',
        backgroundColor: '#fff',
        width: '100%',
        alignItems: 'center'
    },
    textWrapper: {
        width: '50%', 
        marginVertical: 15, 
        alignSelf: 'flex-start', 
        marginLeft:'10%'
    },
    imageWrapper: {
        borderWidth: 2,
        marginTop:'20%', 
        borderColor: '#85C1E9', 
        padding: 10, 
        borderRadius: 100, 
    },
    textInputStyle: {
        padding: 10,
        paddingTop: 0
    },
    label: {
        fontWeight: '300', 
        fontSize: 15,
        color: 'rgba(0,0,0,0.7)'
    },
    cancelTxtStyle: {
        color: '#85C1E9', 
        fontSize: 20, 
        fontWeight:'700'
    },
    saveBtn: {
        position: 'absolute',
        top: 20,
        right: 50

    },
    saveTxtStyle: {
        color: '#85C1E9', 
        fontSize: 20, 
        fontWeight:'700'
    },
    cancelBtn: {
        position: 'absolute',
        top: 20,
        left: 50

    }
}

export default EditProfile