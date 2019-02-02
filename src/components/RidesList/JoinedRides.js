import React, { Component } from 'react';
import { View, Text, TouchableOpacity, AsyncStorage, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import IconFA from "react-native-vector-icons/FontAwesome";

import MyPassangerCard from '../modals/MyPassangerCard';
import { getJoinedPosts, addJoinedPost } from '../../actions/postsAction';

const WIDTH = Dimensions.get('window').width;
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getDay(date) {
    const postDate = new Date(date);
    return postDate.getDay();
}

function getDays(data){
    const daysArray = [];
    const dates = data.split(',');
    dates.forEach(date => {
        daysArray.push(days[getDay(date)]);
    })
    return daysArray;
}

class JoinedRides extends Component {
    state = {
        post: {},
        visable: false
    }

    async componentDidMount() {
        const user = JSON.parse(await AsyncStorage.getItem('user'));
        console.log(user.id);
        this.props.getJoinedPosts(user.id);
    }

    componentWillReceiveProps(nextProps){
        console.log(this.props.posts);
    }

    visabilityHandler = () => {
        this.setState({ visable: !this.state.visable });
    }
    
    render(){
        return(
            <View style={styles.container}>
            { this.props.posts.map((post, i) => {
                            console.log('Ok It Works')
                            return(
                                <TouchableOpacity onPress={() => {
                                    this.props.addJoinedPost(post);
                                    {/* this.props.getSinglePost(post); */}
                                    this.visabilityHandler();
                                    }} 
                                    style={styles.postCard.card} key={i} >
                                    <View style={{backgroundColor: '#3498db', justifyContent: 'center', padding: 10, marginRight: 10 }}>
                                        {!post.weekly ? <Text style={{color: '#fff'}}>{days[getDay(post.date)]}</Text>: <IconFA name="calendar" size={24} color="#fff" /> }
                                    </View>
                                    <View style={{padding: 10}}>
                                        <Text style={styles.postCard.cardText}>From: {post.org_location_name}</Text>
                                        <Text style={styles.postCard.cardText}>To: {post.dest_location_name}</Text>
                                        <Text style={styles.postCard.cardText}>At: { post.weekly ? getDays(post.date).join(',') : post.date} -- Depart at: {post.time}</Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        })
                    }
                    <MyPassangerCard visable={this.state.visable} visabilityHandler={this.visabilityHandler} post={this.state.post} />
            </View>
        )
    }
}

const styles = {
    container: {
        flex: 1,
        alignItems: 'center'
    },
    postCard: {
        card:{
        width: WIDTH - 40,
        borderWidth: 1,
        borderColor: '#fff',
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginVertical: 10,
        },
        cardText: {
            fontSize: 15,
        }
    }
}

const mapStateToProps = state => ({
    posts: state.rides.joinedRides
})

export default connect(mapStateToProps, {getJoinedPosts, addJoinedPost })(JoinedRides);