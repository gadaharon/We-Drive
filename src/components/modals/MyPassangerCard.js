import React, { Component } from 'react'
import { Text, View, Modal, TouchableOpacity, Dimensions, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import axios from 'axios';
// import {  addJoinedPost } from '../../actions/postsAction';

import { URL_STRING } from '../../config/urlstring';

const WIDTH = Dimensions.get('screen').width;
const HEIGHT = Dimensions.get('screen').height;

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saterday"];


function getDay(date) {
    const postDate = new Date(date);
    return postDate.getDay();
}

function getDaysWeekly(dates){
    const daysArray = dates.split(',');
    let datesToDays = [];
    daysArray.forEach(date => {
        datesToDays.push(days[getDay(date)]);
    });

    return datesToDays.join();
}
export class MyPostCard extends Component {

    deleteRide = id => {
        // joinedRideId
        axios.post(`${URL_STRING}/DeleteJoinedRide`, { id })
        .then(res => {
            console.log(res.data.d);
            this.props.visabilityHandler();
        })
        .catch(err => console.log(err))
    }


  render() {
      const { visable, visabilityHandler, post } = this.props;
      console.log(this.props.post);
    return (
     <Modal visible={visable} onRequestClose={visabilityHandler}>   
        <View style={styles.container}>
            <View style={styles.card}>
                <Image source={{uri: post.image_uri}} style={{width: 150, height: 150, borderRadius: 100, alignSelf:'center', marginBottom: '10%'}} />
                <Text style={styles.label}>Driver</Text>
                <Text style={styles.text}>{post.name}</Text>
                <Text style={styles.label}>From Where:</Text>
                <Text style={styles.text}>{post.org_location_name}</Text>
                <Text style={styles.label}>Where To:</Text>
                <Text style={styles.text}>{post.dest_location_name}</Text>
                <Text style={styles.label}>Date/Days</Text>
                <Text style={styles.text}>{post.weekly ? `Schedual Ride: ${getDaysWeekly(post.date)}` : `Single Ride, ${post.date} - ${days[getDay(post.date)]}` }</Text>
                <Text style={styles.label}>Departure:</Text>
                <Text style={styles.text}>{post.time}</Text>
                <Text style={styles.label}>Available Seats:</Text>
                <Text style={styles.text}>{post.seats} seats</Text>
                <View style={{flexDirection: 'row', justifyContent: 'center', marginBottom: 15}}>
                    <TouchableOpacity onPress={() => {
                        {/* Remove Post */}
                        this.deleteRide(post.joinedRideId);
                        }} style={{flexDirection: 'row'}}>
                        <Icon color="#FF1919" size={27} name="trash" />
                        <Text style={{color: '#FF1919', fontSize: 22}}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
      </Modal>
    )
  }
}

const styles = {
    container: {
        flex: 1,
        backgroundColor: '#3498db',
        justifyContent: 'center'
    },
    card: {
        width: WIDTH ,
        backgroundColor: '#fff',
        padding: 20
    },
    text: {
        fontSize: 22,
        marginVertical: 5
    },
    label: {
        fontWeight: '300', 
        fontSize: 15,
         color: 'rgba(0,0,0,0.7)'
      },
}


const mapStateToProps = state => ({
    post: state.rides.joinedPost
})

export default connect(mapStateToProps)(MyPostCard)
