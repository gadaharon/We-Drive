import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions
} from "react-native";

import { Camera, Permissions, ImageManipulator } from 'expo'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const HEIGHT = Dimensions.get('screen').height;

class MyCamera extends Component {
    constructor(props){
        super(props)
    }

    state = {
        hasCameraPermission: null,
        type: Camera.Constants.Type.back
    }

    async componentWillMount() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermission: status === 'granted' })
    }

    switchCameraType = () => {
        this.setState({ type: this.state.type ? Camera.Constants.Type.back : Camera.Constants.Type.front})
    }
    
    snap = async () => {
        if (this.camera) {
          let photo = await this.camera.takePictureAsync({base64: true});
            let resizePhoto = await ImageManipulator.manipulateAsync(photo.uri, [{resize: {width: 100, height: 100}}], {compress: 0, format: 'png', base64: true})
          this.props.imageUriChangeHandler(resizePhoto.uri, resizePhoto.base64);
          setTimeout(() => {
            this.props.cameraVisibilityHandler();
            console.log('Done...');
          },1000)
        //   this.props.modalVisableHandler();
        // console.log(resizePhoto.base64);
        }
    }
    render() {
        const { hasCameraPermission } = this.state

        if (hasCameraPermission === null) {
            return <View />
        }
        else if (hasCameraPermission === false) {
            return <Text> No access to camera</Text>
        }
        else {
            return (
                <View style={{ flex: 1 }}>
                    <Camera style={{ flex: 1, justifyContent: 'space-between' }} type={this.state.type} ref={ref => { this.camera = ref; }} >
                        <View style={{flex:1, alignItems: "center", justifyContent: "flex-end",}}>
                            <View style={{flexDirection:'row', backgroundColor: '#000', width: '100%'}}>
                                <MaterialCommunityIcons name="camera-party-mode"
                                style={{ color: 'white', fontSize: 40, marginTop: 30, marginLeft: 30}}
                                onPress={this.switchCameraType}
                                >
                                </MaterialCommunityIcons>
                                <MaterialCommunityIcons name="circle-outline"
                                    style={{ color: 'white', fontSize: 100, textAlign:'center', flexGrow: 2, marginRight: 60 }}
                                    onPress={this.snap.bind(this)}
                                ></MaterialCommunityIcons>
                                
                            </View>
                            

                        </View>
                    </Camera>
                </View>
            )
        }
    }
}
export default MyCamera;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});