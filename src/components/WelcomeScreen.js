import React, { Component } from 'react';
import { View, Text, Image, AsyncStorage } from 'react-native';
import { connect } from 'react-redux';

import { setUser } from '../actions/authAction';

class WelcomeScreen extends Component {
	componentDidMount() {
		setTimeout(async () => {
			try {
				const user = await AsyncStorage.getItem('user');
				if (user) {
					this.props.setUser(JSON.parse(user));
					this.props.navigation.navigate('home');
				}
				else this.props.navigation.navigate('auth');
			} catch (error) {
				alert(error);
			}
		}, 3000);
	}
	render() {
		return (
			<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#3498db' }}>
				<Image source={require('../../assets/carlogo.png')} style={{ height: 130, width: 160 }} />
				<Text style={{ fontSize: 30 }}>WeDrive</Text>
			</View>
		);
	}
}

export default connect(null, { setUser } )(WelcomeScreen);
