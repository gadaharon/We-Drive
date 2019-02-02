import React, { Component } from 'react';
import { View, StyleSheet, TextInput, Text, KeyboardAvoidingView, TouchableOpacity, Image, AsyncStorage
} from 'react-native';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';

import { loginUser } from '../../actions/authAction';
import { loginValidation } from '../../utils/validation';
import ErrorModal from '../modals/Alert';

export class Login extends Component {
	static navigationOptions = {
		header: null
	};

	state = {
		email: '',
		password: '',
		errors: '',
		errorModalVisable: false
	};


	async componentWillReceiveProps(nextProps){
		await AsyncStorage.setItem('user', JSON.stringify(nextProps.user))
		this.props.navigation.navigate('home');
	}

	//  onChangeText handlers
	onEmailTextChange = (text) => {
		this.setState({ email: text });
	};
	onPasswordTextChange = (text) => {
		this.setState({ password: text });
	};

	// Error modal handler
	errorModalHandler = () => {
		this.setState({ errorModalVisable: !this.state.errorModalVisable });
		setTimeout(() => this.setState({errorModalVisable: !this.state.errorModalVisable}) ,3000)
	}


// onSubmit handlers
	onSubmit = async () => {
		const { email, password } = this.state;
		const { loginUser } = this.props;
		// Error Checking
		const errors = loginValidation({email, password});

		if(errors !== ''){
			this.setState({errors});
			this.errorModalHandler();
		} else{
			await loginUser( { email, password } );
		}
	};

	render() {
		const { textInputWrapper, container, buttonStyle, buttonWrapperStyle, textInputStyle } = styles;
		const { navigate } = this.props.navigation;
		return (
			<KeyboardAvoidingView style={container} behavior="padding" enabled>
				<Image
					source={require('../../../assets/carlogo.png')}
					style={{ height: 130, width: 160, position: 'relative', top: -50, left: 100 }}
				/>
				<View style={textInputWrapper}>
					<Text style={{ color: '#fff', fontSize: 28 }}>Email</Text>
					<TextInput
						style={textInputStyle}
						placeholder="Enter Email"
						underlineColorAndroid="transparent"
						keyboardType="email-address"
						onChangeText={this.onEmailTextChange}
					/>
				</View>
				<View style={textInputWrapper}>
					
					<Text style={{ color: '#fff', fontSize: 28 }}>Password</Text>
					<TextInput
						style={textInputStyle}
						placeholder="Enter Email"
						underlineColorAndroid="transparent"
						secureTextEntry
						onChangeText={this.onPasswordTextChange}
					/>
				</View>
				<View style={buttonWrapperStyle}>
					<Button
						buttonStyle={buttonStyle}
						title="Log In"
						backgroundColor="#fff"
						color="#000"
						rounded
						onPress={this.onSubmit}
					/>
				</View>

				<TouchableOpacity
					style={{alignSelf: 'center', marginTop: 15}}
					onPress={() => navigate('RegisterScreen')}
				>
					<Text style={{ fontSize: 20, color: '#fff' }}>No Account? Register</Text>
				</TouchableOpacity>

				<ErrorModal errorModalVisable={this.state.errorModalVisable} errorText={this.state.errors}/>
			</KeyboardAvoidingView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#3498db',
		justifyContent: 'center',
		paddingBottom: 50
	},
	textInputWrapper: {
		marginLeft: '15%'
	},
	textInputStyle: {
		height: 40,
		backgroundColor: 'rgba(255,255,255,0.2)',
		marginBottom: 20,
		color: '#fff',
		paddingHorizontal: 10,
		width: '85%'
	},
	buttonStyle: {
		marginTop: 10,
		width: '80%'
	},
	buttonWrapperStyle: {
		marginLeft: '15%'
	}
});

const mapStateToProps = state => ({
	user: state.auth.user
})

export default connect(mapStateToProps, { loginUser } )(Login);
