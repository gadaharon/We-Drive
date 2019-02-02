import React, { Component } from 'react'
import { Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { URL_STRING } from '../../config/urlstring';

import PostedRides from '../RidesList/PostedRides';
import JoinedRides from '../RidesList/JoinedRides';
import NewRide from '../modals/AddNewRide';

export class PostDrive extends Component {
	state = {
		pageSwitch: 0,
		visable: false
	}

	// Things left to do:
	// Add My Rides as a Passanger

	// Modal Handlers
	addModalHandler = () => {
		this.setState({ visable: !this.state.visable });
	}
  render() {
	  const { pageSwitch } = this.state;
	  const { container, switchButton, switchButtonOn, addButton } = styles;
	return (
	  <View style={container}>
		  <Text style={{color: '#fff', fontSize: 28, fontWeight: '300', marginVertical: 10, textDecorationLine: 'underline'}}>My Rides As</Text>
		  {/* Switch page buttons */}
		<View style={{flexDirection: 'row'}}>
			<TouchableOpacity 
				style={pageSwitch === 0 ? switchButtonOn.button : switchButton.button} 
				onPress={() => this.setState({ pageSwitch: 0})}>
				<Text style={pageSwitch === 0 ? switchButtonOn.text : switchButton.text}>Driver</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={pageSwitch === 1 ? switchButtonOn.button : switchButton.button}
				onPress={() => this.setState({ pageSwitch: 1})}>
				<Text style={pageSwitch === 1 ? switchButtonOn.text : switchButton.text}>Passenger</Text>
			 </TouchableOpacity>
		</View>
		{ pageSwitch === 0 ? <PostedRides /> : <JoinedRides /> }
		<TouchableOpacity onPress={this.addModalHandler} style={addButton.button}>
			{/* <Text style={addButton.text}><Icon name="pl" /></Text> */}
			<Icon size={38} name="add" color="#3498db" />
		</TouchableOpacity>
		{/* New Ride Modal */}
		<NewRide visable={this.state.visable} visabilityHandler={this.addModalHandler} />
	  </View>
	)
  }
}

const styles = {
	container: {
		flex: 1,
		alignItems: 'center',
		paddingTop: 30,
		backgroundColor: '#3498db'
	},
	buttonWrapper: {
		flexDirection: 'row',
	},
	switchButtonOn:{
		button: {
		padding: 20,
		backgroundColor: '#fff',
		marginHorizontal: 10
		},
		text: {color: '#3498db', fontSize: 24, textDecorationLine: 'underline'}
	},
	switchButton: {
		button: {
		padding: 20,
		backgroundColor: '#3498db',
		marginHorizontal: 10
		},
		text: {color: '#fff', fontSize: 24}
	},
	addButton: {	
		button:{
			position: 'absolute',
			bottom: 50,
			right: 50,
			backgroundColor: '#fff',
			paddingHorizontal: 15,
			paddingVertical: 15,
			borderRadius: 50
		},
		text: {
			color: '#3498db',
			fontSize: 20,
			fontWeight: 'bold'
		}
	}
}

export default PostDrive
