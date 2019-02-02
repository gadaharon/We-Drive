import React, { Component } from 'react'
import { Text, View, Image, Dimensions, TouchableOpacity } from 'react-native';
import { Rating } from 'react-native-elements';

const WIDTH = Dimensions.get('window').width;
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];


export class PostCard extends Component {
    constructor(props){
        super(props)
    }

 showDays = () => {
    const dates = this.props.post.date.split(',');
    let dateArray = [];
    dates.forEach(date => {
        const d = new Date(date);
        dateArray.push(days[d.getDay()])
    });
    if(dates.length > 3){
        dateArray = dateArray.slice(0, 3)
        dateArray.push('....')
    }
    return dateArray.join(',');
}

  render() {
      const { post } = this.props;
    //   console.log(post);
      const day = new Date(post.date);
    return (
    <TouchableOpacity
        style={{width: WIDTH - 50, backgroundColor:'#fff', marginBottom: 20}}
        onPress={this.props.openPost}
    >
        <View style={{paddingVertical: 3, backgroundColor: '#CCF1F5', paddingLeft: 5}}>
        <Text>{post.orgLocName} >> {post.destLocName}</Text>
        </View>
        <View style={{flexDirection: 'row', padding: 8}}>
            <View style={{flexGrow: 1}}>
                <Image style={{height: 40, width: 40 }} source={{uri: post.image }} />
                <Text>
                    {post.name}
                </Text>
                <Rating 
                type="star"
                fractions={1}
                startingValue={parseFloat(post.rating)}
                readonly
                imageSize={15}
                    />
            </View>
            <View style={{flexGrow: 2, justifyContent: 'center' }}>
                
                <Text>
                    {post.weekly ? this.showDays() : `${day.getMonth() + 1}/${day.getDate()}/${day.getFullYear()} - ${days[day.getDay()]} \n`}
                </Text>
                <Text>Depart: {post.time}</Text>
            </View>
        </View>
    </TouchableOpacity>
    )
  }
}

export default PostCard