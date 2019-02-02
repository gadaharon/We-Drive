import React, { Component } from 'react'
import { Text, View, Modal, TouchableOpacity, Dimensions, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import { deletePost, getPosts } from '../../actions/postsAction';
import EditRidePost from './EditRidePost';

const WIDTH = Dimensions.get('screen').width;
const HEIGHT = Dimensions.get('screen').height;

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saterday"];

// Things left to do:
// Add Edit and Delete Methods to post card

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
    state = {
        post: {},
        editModalVisable: false
    }

    componentWillReceiveProps = async (nextProps) => {
      await this.setState({ post: nextProps.post });
    }

    editModalHandler = () => {
        this.setState({ editModalVisable: !this.state.editModalVisable });
    }

    updatePostUI = (data) => {
        let { post } = this.state;
        post["date"] = data.date;
        post["time"] = data.time;
        post["orgLocName"] = data.originLocationName;
        post["destLocName"] = data.destLocationName;
        post["orgLocCoord"] = data.coordOrigin;
        post["destLocCoord"] = data.coordDest;
        post["seats"] = data.availableSeats;
        post["weekly"] = data.isWeekly;
        
        this.setState({ post });
    }
  render() {
      const { visable, visabilityHandler } = this.props;
      const { date, time,  orgLocName, destLocName, seats, weekly } = this.state.post;
    return (
     <Modal visible={visable} onRequestClose={visabilityHandler}>   
        <View style={styles.container}>
            <View style={styles.card}>
                <Image source={require('../../../assets/my-rides-image.png')} style={{width: 150, height: 150, borderRadius: 100, alignSelf:'center', marginBottom: '10%'}} />
                <Text style={styles.label}>From Where:</Text>
                <Text style={styles.text}>{orgLocName}</Text>
                <Text style={styles.label}>Where To:</Text>
                <Text style={styles.text}>{destLocName}</Text>
                <Text style={styles.label}>Date/Days</Text>
                <Text style={styles.text}>{weekly ? `Schedual Ride: ${getDaysWeekly(date)}` : `Single Ride, ${date} - ${days[getDay(date)]}` }</Text>
                <Text style={styles.label}>Departure:</Text>
                <Text style={styles.text}>{time}</Text>
                <Text style={styles.label}>Available Seats:</Text>
                <Text style={styles.text}>{seats} seats</Text>
                <View style={{flexDirection: 'row', justifyContent: 'center', marginBottom: 15}}>
                    <TouchableOpacity style={{flexDirection: 'row', marginRight: '10%'}} onPress={this.editModalHandler}>
                        <Icon color="#85C1E9" size={27} name="edit" />
                        <Text style={{color: '#85C1E9', fontSize: 22}}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        console.log(this.state.post)
                         this.props.deletePost(this.state.post);
                         this.props.deleteRide(this.state.post);
                         this.props.getPosts();
                         this.props.visabilityHandler();
                        }} style={{flexDirection: 'row'}}>
                        <Icon color="#FF1919" size={27} name="trash" />
                        <Text style={{color: '#FF1919', fontSize: 22}}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
        <EditRidePost visable={this.state.editModalVisable} visabilityHandler={this.editModalHandler} post={this.state.post} updatePostUI={this.updatePostUI} />
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
    post: state.rides.singlePost
})

export default connect(mapStateToProps, { deletePost, getPosts })(MyPostCard)
