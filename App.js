import React from 'react';
import { AsyncStorage } from 'react-native'
import { setPushToken } from './src/actions/authAction';
import { Notifications, Permissions, Constants } from 'expo';
import { Provider } from 'react-redux';
import Navigation, { createBottomTabNavigator, createStackNavigator, createSwitchNavigator, } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';

import store from './src/store';

// Import components
import WelcomeScreen from './src/components/WelcomeScreen';
import Login from './src/components/auth/Login';
import Register from './src/components/auth/Register';
import SearchDrive from './src/components/HomePages/SearchDrive';
import PostDrive from './src/components/HomePages/PostDrive';
import Settings from './src/components/HomePages/Settings';
import { getPosts } from './src/actions/postsAction';
import PassengerCard from './src/components/PassengerCard';

// Navigations
const authNavigation = createStackNavigator({
	LoginScreen: Login,
	RegisterScreen: Register,
});

const homeNavigation = createBottomTabNavigator(
	{
		Search: {
			screen: SearchDrive,
			navigationOptions: {
				tabBarLabel: 'Search',
				tabBarIcon: ({ tintColor }) => <Icon name="search" color={tintColor} size={24} />
			}
		},
		Post: {
			screen: PostDrive,
			navigationOptions: {
				tabBarLabel: 'Ride Management',
				tabBarIcon: ({ tintColor }) => <Icon name="car" color={tintColor} size={24} />
			}
		},
		Settings: {
			screen: Settings,
			navigationOptions: {
				tabBarLabel: 'Profile',
				tabBarIcon: ({ tintColor }) => <Icon name="cog" color={tintColor} size={24} />
			}
		}
	},
	{
		tabBarOptions: {
			activeTintColor: '#3498db',
			activeBackgroundColor: '#fff',
			inactiveTintColor: '#fff',
			inactiveBackgroundColor: '#3498db',
			labelStyle: {
				fontSize: 12
			},
			style: {
				backgroundColor: '#3498db'
			}
		}
	}
);

async function register() {
	const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
	if(status !== "granted"){
		alert('something went wrong');
		return;
	}
	const token = await Notifications.getExpoPushTokenAsync();
	store.dispatch(setPushToken(token));
}

const AppNavigator = createSwitchNavigator({
	intro: WelcomeScreen,
	auth: authNavigation,
	home: homeNavigation,
	passengerCard: PassengerCard
});


 class App extends React.Component {

	state = {
		notification: {},
	  };

	 componentWillMount(){
		store.dispatch(getPosts());
		register(); 
	 }

	
	render() {
		return (
		<Provider store={store}>
			<AppNavigator />
			{/* <PassengerCard /> */}
		</Provider>
		);
	}
}

export default App;
