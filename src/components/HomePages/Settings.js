import React, { Component } from "react";
import { Text, View, StyleSheet, Button, AsyncStorage, Image, TouchableOpacity, ScrollView } from "react-native";
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Rating } from 'react-native-elements';

import { URL_STRING } from '../../config/urlstring';
import EditProfile from '../modals/EditProfile';

// Things left to do:
// Add image to database function to the edit method

export class Settings extends Component {

  state = {
    id: 0,
    name: '',
    email: '',
    phone: '',
    carType: '',
    carNumber:'',
    carColor:'',
    rating: 0,
    image_uri: 'image_uri',
    base64ImageFormat: '',

    // Modal
    isVisable: false
  }


  // Log Out User
  async removeItemValue(key) {
    try {
      await AsyncStorage.removeItem(key);
      return true
    }
    catch(exception) {
      return false;
    }
  }

  async componentDidMount() {
  await this.getUserId();
  this.getUserProfile();
  }

   getUserId = async () => {
    const user = await AsyncStorage.getItem('user');
    const id = JSON.parse(user).id;
    this.setState({ id });
  }

  getUserProfile = () => {
    const { id } = this.state;
    axios.post(`${URL_STRING}/GetUserProfile`, { id })
    .then(res => {
      const profile = JSON.parse(res.data.d);
      const { name, email, phone, carColor, carNumber, carType, rating, image_uri } = profile;
      this.setState({ name, email, phone, carType, carNumber, carColor, rating, image_uri });
    }).then(() => console.log(this.state))
    .catch(err => console.log(err));
  
  }

  saveChanges = (phone, carType, carNumber, carColor, imgBase64, image_uri) => {
    const { id, name, email } = this.state;
    const objectToSend = {
      id,
      phone,
      carType,
      carNumber,
      carColor,
      imgBase64
    }
    this.setState({ image_uri  })
    // console.log(res);
    axios.post(`${URL_STRING}/ProfileUpdate`, objectToSend)
    .then(async res => {
      console.log(res.data.d);
      this.setState({ phone, carType, carNumber, carColor, image_uri })
      await AsyncStorage.setItem('user', JSON.stringify({ id, name, email, phone: this.state.phone }))
    })
    .catch(err => console.log(err));
  }

  // Modal Handlers
  visabilityHandler = () => {
    this.setState({ isVisable: !this.state.isVisable})
  }


  render() {
    const { name, email, phone, carNumber, carType, carColor, rating, image_uri, isVisable } = this.state;
    const { container, headerWrapper, iconWrapper, imageWrapper, label, textStyle, hr } = styles;
    return (
      <View style={container}>
        <View style={headerWrapper}>
          <TouchableOpacity style={iconWrapper} onPress={this.visabilityHandler}>
          <Icon name='edit' size={25} style={{color: '#85C1E9' }} />
          </TouchableOpacity>
            <Image source={{uri: this.state.image_uri}} style={{height: 150, width: 150, borderRadius: 100,}} />
            <Text style={{fontSize: 35, color: '#85C1E9'}}>{name}</Text>
            <Rating
						type="star"
						fractions={1}
						startingValue={parseFloat(rating)}

						readonly
						imageSize={20}
						style={{ paddingVertical: 10 }}
					/>

        </View>

        <ScrollView style={{ width: '80%', paddingTop: 10 }} >
          <Text style={label}>Email</Text>
          <Text style={textStyle}>{email}</Text>
          <Text style={label}>Phone Number</Text>
          <Text style={textStyle}>{phone}</Text>

          <View style={hr} />

          <Text style={label}>Car Type</Text>
          <Text style={textStyle}>{carType === '' ? 'None' : carType}</Text>
          <Text style={label}>Car Number</Text>
          <Text style={textStyle}>{carNumber === '' ? 'None' : carNumber}</Text>
          <Text style={label}>Car Color</Text>
          <Text style={textStyle}>{carColor === '' ? 'None' : carColor}</Text>


          <View style={hr} />

          <TouchableOpacity style={{alignSelf: 'flex-end'}} onPress={() =>{
           const x = this.removeItemValue('user');
            if(x){
              this.props.navigation.navigate('auth')
            }
            }}>
            <Text style={{fontSize:20, color: '#fff'}} >Log Out</Text>
            </TouchableOpacity>
            <View style={{height: 30}}></View>
        </ScrollView>
        <EditProfile isVisable={isVisable} 
          visabilityHandler={this.visabilityHandler} 
          saveChanges={this.saveChanges} profile={{ phone, carType, carNumber, carColor, image_uri }} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
	flex: 1,
	alignItems: 'center',
  backgroundColor: "#3498db"
  },
  headerWrapper: {
    backgroundColor: '#fff', 
    width: '100%', 
    alignItems: 'center', 
    paddingTop: '10%', 
    marginBottom: 10
  },
  iconWrapper: {
    top: 30, 
    right: 20, 
    position:'absolute' 
  },
  imageWrapper: {
    borderWidth: 2, 
    borderColor: '#85C1E9', 
    padding: 15, 
    borderRadius: 70, 
    marginBottom: 10
  },
  label: {
    fontWeight: '300', 
    fontSize: 15,
     color: 'rgba(255,255,255,0.7)'
  },
  textStyle: {
    fontSize: 20, 
    marginBottom: 10, 
    color: '#fff'
  },
  hr: {
    width: '100%', 
    borderWidth: 0.5, 
    borderColor: 'rgba(255,255,255,0.4)', 
    marginVertical: 10
  }
});

export default Settings;
