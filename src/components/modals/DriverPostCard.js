import React, { Component } from 'react'
import { Text, View, TouchableOpacity, Image, Modal, ScrollView, Linking, AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import { Rating } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { URL_STRING } from '../../config/urlstring';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export class DriverPostCard extends Component {
  state = {
    post: {}
  }
  componentWillReceiveProps( nextProps){
    this.setState({ post: nextProps.post });
    console.log(nextProps.post);
  }

  sendRequestHandler = async () => {
    const user = JSON.parse(await AsyncStorage.getItem("user")); 
    const passangerId = user.id; // <- Get user id from AsyncStorage
    const { post } = this.state;
    const title = `You have new request for a ride`;
    axios.post(`${URL_STRING}/SendPushNotification`, {passangerId: passangerId, driverId: post.id, postId: post.postId, navigatePage: true, title: title, body: 'Gad Aharon sent you ride request'})
      .then(res => {
        console.log(res.data.d)
        this.props.visableHandler();
      })
      .catch(err => console.log('Something went wrong'))
  }

  showDays = () => {
    const dates = this.state.post.date.split(',');
    let dateArray = [];
    dates.forEach(date => {
        const d = new Date(date);
        dateArray.push(days[d.getDay()])
    });
    return dateArray.join(',');
}

  render() {
      const { requestBtn, requestBtnText, container, headerWrapper, label, hr, imageWrapper, textStyle, backButton } = styles; 
      const { visable, visableHandler } = this.props;
      const { post } = this.state;
    return (
      <Modal visible={visable} onRequestClose={visableHandler}>
        <View style={container}>
        <TouchableOpacity style={backButton} onPress={visableHandler}><Icon name="arrow-back" color="#3498db" size={30} /></TouchableOpacity>
          {/* Heading Container  */}
          <View style={headerWrapper}>
              <Image source={{uri: post.image }} style={{height: 100, width: 100, borderRadius: 50}} />
              <Text style={{fontSize: 35, color: '#85C1E9'}}>{post.name}</Text>
              <Rating
              type="star"
              fractions={1}
              startingValue={parseFloat(post.rating)}
              readonly
              imageSize={20}
              style={{ paddingVertical: 10 }}
            />
          </View>
          {/* Route and date of the ride */}
          <View style={{alignSelf: 'flex-start', backgroundColor: '#D6E8EA', width: '100%', padding: 15}}>
            <Text style={{fontSize: 14,color: '#000',   }}>{post.orgLocName} >> {post.destLocName}</Text>
            <Text style={{fontSize: 14,color: '#000',  }}>{post.weekly ? this.showDays() : post.date } Depart: {post.time}</Text>
          </View>
            {/* Body Container */}
            <ScrollView style={{ width: '80%', paddingTop: 10 }} >
              {/* Profile and Car Details */}
              <View style={{flexDirection: 'row', width: '100%'}}>
                <View style={{width: '80%'}}>
                <Text style={label}>Email:</Text>
                <Text style={textStyle}>{post.email}</Text>
                </View>
                <TouchableOpacity onPress={() => Linking.openURL(`mailto:${post.email}`)} style={{ width: '10%' }}><Icon style={{marginTop: 10}} color="#FF4500" name="email" size={30}/></TouchableOpacity>
              </View>
              <View style={{flexDirection: 'row', width: '100%'}}>
                <View style={{width: '80%'}}>
                <Text style={label}>Phone Number:</Text>
                <Text style={textStyle}>{post.phone}</Text>
                </View>
                <TouchableOpacity onPress={() => Linking.openURL(`tel:${post.phone}`)} style={{ width: '10%' }}><Icon style={{marginTop: 10}} color="#00ff00" name="phone" size={30}/></TouchableOpacity>
                <TouchableOpacity onPress={() => Linking.openURL(`sms:${post.phone}`)} style={{ width: '10%' }}><Icon style={{marginTop: 10}} color="#FFD700" name="textsms" size={30}/></TouchableOpacity>
              </View>
                <View style={hr}/>
                <Text style={label}>Car Type:</Text>
                <Text style={textStyle}>{post.carType}</Text>
                <Text style={label}>Car Number:</Text>
                <Text style={textStyle}>{post.carNumber}</Text>
                <Text style={label}>Car Color</Text> 
                <Text style={textStyle}>{post.carColor}</Text>
              <View style={hr}/>
              {/* Request for Ride Button */}
              <TouchableOpacity onPress={this.sendRequestHandler} style={requestBtn}>
                <Text style={requestBtnText}>Send Request</Text>
                <Image source={require('../../../assets/steering-wheel.svg')} style={{height: 30, width: 30, zIndex: 1 }} />
              </TouchableOpacity>  
         </ScrollView>
       </View>
      </Modal>
    )
  }
}
const styles = {
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
    },
  requestBtn: {
    height: 50,
    width: '50%',
    padding: '3%',
    backgroundColor: '#fff',
    flexDirection: 'row',
  },
  requestBtnText: {
    color: '#3498db',
    fontSize: 20,
    fontWeight: '600'
  },
  backButton: {
    zIndex: 1,
    position: 'absolute',
    top: 20, 
    left: 20,
  }
}


const mapStateToProps = state => ({
  post: state.rides.singlePost
})

export default connect(mapStateToProps)(DriverPostCard)

