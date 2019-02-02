import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import IconFA from "react-native-vector-icons/FontAwesome";
import MyPostCard from '../modals/MyPostCard';
import { getSinglePost, getPosts } from '../../actions/postsAction';

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

class PostedRides extends Component {
    state = {
        visable: false,
        singlePostIndex: null,
        posts: []
    }

    componentWillMount(){
        this.setState({ posts: this.props.posts });
    }
    componentDidMount(){
        this.props.getPosts();
        console.log('Mounted');
    }
    componentWillReceiveProps(nextProps){
        this.setState({ posts: nextProps.posts })
    }

    visabilityHandler = () => {
        this.setState({ visable: !this.state.visable });
    }
    deleteRide = post => {
     const { posts } = this.state;
     let newPostsArray = [];
     posts.forEach(p => {
         if(p.postId !== post.postId){
             newPostsArray.push(p)
         }
     })
     this.setState({ posts: newPostsArray })
    }


    render() {
            const id = this.props.auth.user.id;
            return(
                <View style={styles.container}>
                    { this.state.posts.map((post, i) => {
                        if(post.id === parseInt(id)){
                        return(
                        <TouchableOpacity onPress={() => {
                            this.setState({ singlePostIndex: i});
                            this.props.getSinglePost(post);
                            this.visabilityHandler();
                            }} 
                            style={styles.postCard.card} key={i} >
                            <View style={{backgroundColor: '#3498db', justifyContent: 'center', padding: 10, marginRight: 10 }}>
                                {!post.weekly ? <Text style={{color: '#fff'}}>{days[getDay(post.date)]}</Text>: <IconFA name="calendar" size={24} color="#fff" /> }
                            </View>
                            <View style={{padding: 10}}>
                                <Text style={styles.postCard.cardText}>From: {post.orgLocName}</Text>
                                <Text style={styles.postCard.cardText}>To: {post.destLocName}</Text>
                                <Text style={styles.postCard.cardText}>At: { post.weekly ? getDays(post.date).join(',') : post.date} -- Depart at: {post.time}</Text>
                            </View>
                        </TouchableOpacity>
                        );
                        } else{
                            return null;
                        }
                    }) }
                    <MyPostCard visable={this.state.visable} visabilityHandler={this.visabilityHandler} deleteRide={this.deleteRide} />
                </View>
            )
        }
}

const styles = {
    container: {
        alignItems: 'center',
        marginTop: 20,
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
    posts: state.rides.posts,
    auth: state.auth
})

export default connect(mapStateToProps, { getSinglePost, getPosts })(PostedRides);