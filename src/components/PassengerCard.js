import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { URL_STRING } from '../config/urlstring';
import { Rating } from 'react-native-elements';
import axios from 'axios';

export default PassengerCard = props => {

    const acceptPassanger = (userId, postId, navigatePage, title, body) => {
        axios.post(`${URL_STRING}/AcceptPassangerNotification`, 
        {userId, postId, navigatePage, title, body})
            .then(res => {
                props.navigation.navigate('home');
            })
            .catch(err=> console.log(err))
    }
    
    const declinePassanger = (userId, navigatePage, title, body) => {
        axios.post(`${URL_STRING}/DeclinePassangerNotification`, 
        {userId, navigatePage, title, body})
        .then(res => {
            props.navigation.navigate('home');
        })
        .catch(err => console.log(err))
    }
    
    const data = props.navigation.state.params.data;

    return (
        <View style={styles.container}>
            <Image source={{uri: data.image }} style={styles.imageStyle} />
            <Text style={styles.headerText}>{data.name}</Text>
            <Rating 
                type="star"
                fractions={1}
                startingValue={parseFloat(data.rating)}
                readonly
                imageSize={20}
                style={{ paddingVertical: 10 }}                   
            />
            <View style={{flex: 1, justifyContent: 'flex-end'}}>
                <View style={{...styles.buttonsWrapper}}>
                    <TouchableOpacity onPress={() => acceptPassanger(data.id, data.post_id, false, "Request Accepted", "Driver has accepted your request")}>
                        <Text style={{fontSize: 28, color: '#3498db'}}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => declinePassanger(data.id, false, "Request Decline", "Driver has declined your request")}>
                        <Text style={{fontSize: 28, color: '#3498db'}}>Decline</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = {
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: '10%'
    },
    imageStyle: {
        height: 200, 
        width: 200, 
        borderRadius: 100, 
        marginBottom: 20
    },
    headerText: {
        fontSize: 32, 
        fontWeight: '400'
    },
    buttonsWrapper: {
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        width: '60%'
    },
    buttonText: {
        
    }
}