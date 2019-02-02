import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, AsyncStorage } from 'react-native';
import { Notifications } from 'expo';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';

import { getPosts, getSinglePost } from '../../actions/postsAction';
import ErrorModal from '../modals/Alert';
import { API_KEY } from '../../config/API_KEY';
import { AutoComplete } from '../AutoComplete';
import { searchRideValidation } from '../../utils/validation';
import PostCard from '../../utils/PostCard';
import DriverPostCard from '../modals/DriverPostCard';
import { URL_STRING } from '../../config/urlstring';




class SearchDrive extends Component {
	constructor(props){
		super(props);
		this.state = {
			isVerified: true,
			errorModalVisability: false,
			postModalVisability: false,
			isDatePickerVisible: false,
			errors: '',
			zIndexState: { from: 1, to: 0 },
			originLocation: "",
			destinationLocation: "",
			originCoords:'',
			destCoords:'',
			selectedDate: '',
			posts: [],
			searchResultArray: []
		};
	 this.res = true;
	}

	componentWillReceiveProps(nextProps){
		console.log(nextProps.posts)
		this.setState({ posts: nextProps.posts});
	}

	componentWillMount(){
		console.log(this.props.auth.user)
		console.log(this.props.auth.userPushToken);
		axios.post(`${URL_STRING}/AddPushToken`, {userId: this.props.auth.user.id, pushToken: this.props.auth.userPushToken}).then(res => {
			console.log(res.data);
		}).catch(err => console.log('something went wrong with add token method',err))
	 }

	 componentDidMount(){
		this._notificationSubscription = Notifications.addListener(this._handleNotification);
	 }

	 _handleNotification = ({data}) => {
		const { navigate } = data;
		if(navigate){
			this.props.navigation.navigate('passengerCard', { data });
			console.log(data)
		}
	 }

	// zIndex Change Handlers
	zIndexHandler = (from, to) => {
		const { zIndexState } = this.state;
		zIndexState.from = from;
		zIndexState.to = to;
		this.setState({ zIndexState })
	}

	//   Calculate distace
	  isRideDisplayable = async (originDriver, destinationDriver, name) => {
		console.log('isRideDisplayable is running...')
		const  { originCoords, destCoords } = this.state;
		var re = /{([^}]+)}/g;
		let driverOriginalRoute = 0;
		let routeWithPassanger = 0;

		console.log(originDriver, destinationDriver, originCoords, destCoords);
		// routeWithPassanger =  parseFloat(res.data.rows[0].elements[0].distance.text.split(" km")[0]);
		// routeWithPassanger +=  parseFloat(res.data.rows[0].elements[0].distance.text.split(" km")[0]);
		// routeWithPassanger +=  parseFloat(res.data.rows[0].elements[0].distance.text.split(" km")[0]);

		// Calculate driver original route
		 await axios.post(`https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${originDriver.split(re)[1]}&destinations=${destinationDriver.split(re)[1]}&key=${API_KEY}`)
		.then(res => {driverOriginalRoute = parseFloat(res.data.rows[0].elements[0].distance.text.split(" km")[0]); console.log(driverOriginalRoute) })		 		 
		.catch(err => console.log(err))

		// Calculate distance between driver to passanger and add to routeWithPassanger
		await axios.post(`https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${originDriver.split(re)[1]}&destinations=${originCoords}&key=${API_KEY}`)
		.then(res => { routeWithPassanger =  parseFloat(res.data.rows[0].elements[0].distance.text.split(" km")[0]); }) 
		.catch(err => console.log(err))

		// Calculate distance between passanger to destination and add to routeWithPassanger
		await axios.post(`https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${originCoords}&destinations=${destCoords}&key=${API_KEY}`)
		.then(res => { routeWithPassanger +=  parseFloat(res.data.rows[0].elements[0].distance.text.split(" km")[0]); })
		.catch(err => console.log(err))

		// Calculate distance between passanger destination and driver destination and add to routeWithPassanger
		 await axios.post(`https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${destCoords}&destinations=${destinationDriver.split(re)[1]}&key=${API_KEY}`)
		.then(res => { routeWithPassanger +=  parseFloat(res.data.rows[0].elements[0].distance.text.split(" km")[0]); console.log(routeWithPassanger) })
		.catch(err => console.log(err))

		if((routeWithPassanger - driverOriginalRoute) <= 16){
			this.res = true;
			console.log('with pass', routeWithPassanger, 'driver', driverOriginalRoute);
			console.log(name ,routeWithPassanger - driverOriginalRoute)
		}else{
			this.res = false;
			console.log(name ,routeWithPassanger - driverOriginalRoute, false)
		}
		return "hello";
	  }

	//   Filltering rides
	  searchRides =  async () => {
		this.setState({ searchResultArray: [] })
		console.log('searchRide is running...')
		//   Get logged in user data
		const user = JSON.parse(await AsyncStorage.getItem('user'));
		// const { posts } = this.state;
		// console.log(this.props.posts)
		this.props.posts.forEach(async post => {
			console.log(post);
			const { orgLocCoord, destLocCoord, name } = post;
			await this.isRideDisplayable(orgLocCoord, destLocCoord, name);
			if(this.res !== false && user.email !== post.email ){
			this.setState(prevState => ({
				searchResultArray: [...prevState.searchResultArray, post]
			}))
		}
		})
	  }

	//   Modal Handlers : 
	// Error modal handler
	errorModalHandler = () => {
		this.setState({ errorModalVisability: !this.state.errorModalVisability });
		setTimeout(() => this.setState({errorModalVisability: !this.state.errorModalVisability}) ,3000)
	}
	// Post modal handler
	postModalHandler = () => {
		this.setState({ postModalVisability: !this.state.postModalVisability })
	}


	// Set Location:
	// Set Origin Location
	setOrgLocation = data => {
		const {lat, lng} = data.geometry.location
		this.setState({ originLocation: data.name})
		this.setState({ originCoords: `${lat},${lng}`})
	}
	// Set Destination Location
	setDestLocation = data => {
		const {lat, lng} = data.geometry.location
		this.setState({ destinationLocation: data.name})
		this.setState({ destCoords: `${lat},${lng}`})
	}
	// Date Modal Handler
	_handleDatePicker = () =>
		this.setState({ isDatePickerVisible: !this.state.isDatePickerVisible });
	_setDatePicker = date => {
		console.log('A date has been picked: ', date);
		this.setState({selectedDate: `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}` })
		this._handleDatePicker();
	};

	// OnSubmit Handler
	onSubmit = () => {
		const { originLocation, destinationLocation  } = this.state;
		const errors = searchRideValidation({ originLocation, destinationLocation });
		console.log(errors)
		if(errors !== ''){
			this.setState({ errors })
			this.errorModalHandler();
		} else {
			this.searchRides();
		console.log('Everything OK');
		}
		
	}

	render() {
		const { container, searchButoton, dateButtonStyle, resContainer, wrapper } = styles;
		const { selectedDate, errorModalVisability, errors, zIndexState, postModalVisability } = this.state;
		return (
	<View style={wrapper}>	
		<View style={container}>	
			<View style={{ width:'80%', top: 0, position: 'absolute' }} >
				<View style={{width: '100%',zIndex:this.state.zIndexState.from}}>
					<AutoComplete 
					zIndexHandler={this.zIndexHandler} 
					placeholder="From Where?" 
					zIndex={{from: 1, to: 0 }}
					setLocation={this.setOrgLocation} />
				</View>
			</View>
			
			<View style={{ width: '80%', top: '22%', position: 'absolute'}} >
				<View style={{width: '100%', zIndex:this.state.zIndexState.to}}>
					<AutoComplete
					 zIndexHandler={this.zIndexHandler} 
					 placeholder="Where To?" 
					 zIndex={{from:0 , to: 1}}
					 setLocation={this.setDestLocation} />
				</View>
			</View>

			  <TouchableOpacity style={searchButoton} onPress={this.onSubmit}>
					<Icon name="search" size={24} color="#3498db" />
					<Text style={{ fontSize: 20, marginLeft: 10, color:'#3498db', textAlign:'center' }}>Search Ride</Text>
			</TouchableOpacity>

			<ErrorModal errorModalVisable={this.state.errorModalVisability} errorText={errors}/>
		</View>

		<View style={resContainer}>
			{this.state.searchResultArray.map((post,i) => (
				<PostCard post={post} key={i + 0.5} openPost={ async () => {
						await this.props.getSinglePost(post);
						this.postModalHandler();
				}}/>
			))}
		</View>
		<DriverPostCard visable={postModalVisability} visableHandler={this.postModalHandler}/>
	</View>
		);
	}
}

const styles = StyleSheet.create({
	wrapper:{
		flex: 1,
		paddingTop: '10%',
		backgroundColor: '#3498db',
		width: '100%'
	},
	container: {
		flex: 0.4,
		alignItems: 'center',
	},
	resContainer:{
		flex: 0.6,
		alignItems: 'center',
		width: '100%',
		margin:0,
		padding:0
	},
	dateButtonStyle: {
		position: 'relative',
		top:'26%',
		width: '80%',
		paddingVertical: 12,
		paddingLeft: 10,
		backgroundColor: "#fff",
		flexDirection: "row",
		marginBottom: 15
	  },
	searchButoton: {
		backgroundColor: '#fff',
		width: '40%',
		padding: 10,
		flexDirection: 'row',
		alignSelf: 'flex-start',
		marginLeft: '10%',
		marginBottom: 5,
		top: '30%'
	},
});

const mapStateToProps = state => ({
	posts: state.rides.posts,
	auth: state.auth
})

export default connect(mapStateToProps, { getPosts, getSinglePost })(SearchDrive);
