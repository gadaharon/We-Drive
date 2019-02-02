import React, { Component } from "react";
import { Text, View, Modal, Dimensions, TouchableOpacity, Picker, Switch, AsyncStorage } from "react-native";
import { connect } from 'react-redux';
import axios from 'axios';
import DateTimePicker from "react-native-modal-datetime-picker";

import Icon from "react-native-vector-icons/MaterialIcons";
import IconFA from "react-native-vector-icons/FontAwesome";

import AutoComplete from "../AutoComplete";
import { postValidation } from '../../utils/validation';
import { API_KEY } from '../../config/API_KEY';
import ErrorModal from './Alert';
import CheckBox from '../../utils/Checkbox';
import { URL_STRING } from '../../config/urlstring';

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;
const days = [{ name: 'Sun',value : "Sunday"}, {name: 'Mon',value: "Monday"}, {name: 'Tue',value: "Tuesday"}, {name: 'Wed',value: "Wednesday"}, {name: 'Thu',value: "Thursday"}, {name: 'Fri',value: "Friday"}, {name: 'Sat',value: "Saturday"}];

export class EditRidePost extends Component {
  state = {
    desttinationTime: '', // <- Arival time of drive post
    selectedTime: this.props.post.time, // <- Departue time of the ride post
    selectedDate: this.props.post.date, // <- Departue date of the ride post (for single ride post)
    days: {Sunday: false, Monday: false, Tuesday: false, Wednesday: false, Thursday: false, Friday: false, Saturday: false}, // <- Selected days for constant ride post
    isDatePickerVisible: false,// <- Date Modal Visability Flag
    isTimePickerVisible: false,// <- Time Modal Vidability Flag
    availableSeats: this.props.post.seats.toString(), // <Seats available for ride post
    switchBtn: this.props.post.weekly,// Flag to declare single or constant ride post
    zIndexState: { from: 1, to: 0 }, // <- zIndex flag
    originLocation: this.props.post.orgLocName, // <- Departure location for ride post
    destinationLocation: this.props.post.destLocName,// <- Destination location for ride post
    originCoords:this.props.post.orgLocCoord,// <- Departure coords for ride post
    destCoords:this.props.post.destLocCoord, // <- Destination coords for ride post
    errorModalVisability: false,// <- Error Modal Visability Flag
    errors: ''// <- Error message incase of errors
  }



  // Handle location name when name has ' chracter in it
  handleLocationNameSyntax = name => {
    let newName = '';
    const nameArray = name.split("'");
   nameArray.forEach(name => {
     newName += name;
   });
   return newName;
  }

  handleDateOrDaysDisplay = () => {
    const dates = this.props.post.date.split(',');
    const _days = this.state.days;
    if(this.state.switchBtn){
      this.setState({ selectedDate: '' });
      dates.forEach(date => {
        const day = new Date(date).getDay();
        _days[Object.values(days[day])[1]] = !_days[Object.values(days[day])[1]]
      });
      this.setState({ days: _days });
    }
  }

  componentWillReceiveProps = (nextProps) => {
    this.handleDateOrDaysDisplay();
    this.forceUpdate();
  }


  // Edit Ride Post Handler
  editRide = async () => {
    const { originLocation, destinationLocation, originCoords, destCoords, selectedDate, selectedTime, availableSeats, switchBtn } = this.state;
    const days = this.getSelectedDays();
    const objectToSend = {
      id:this.props.post.postId,
      originLocationName: this.handleLocationNameSyntax(originLocation),
      destLocationName: this.handleLocationNameSyntax(destinationLocation),
      coordOrigin: originCoords,
      coordDest: destCoords,
      date: switchBtn ? days.join(',') : selectedDate,
      time: selectedTime,
      availableSeats,
      isWeekly: switchBtn ? 1 : 0
    }    
    // Check for errors
    const res = postValidation(objectToSend);
    if(res !== ""){
      this.errorModalHandler();
      this.setState({ errors: res })
    }else{
      console.log('Object To Send', objectToSend);
      axios.post(`${URL_STRING}/EditRide`, objectToSend)
      .then(res => {
        console.log(res.data.d)
        this.props.updatePostUI(objectToSend);
        this.props.visabilityHandler();
      })
      .catch(err => console.log(err.response.data))
    }
  }
  // Edit Ride Post End

  // zIndex Change Handlers
	zIndexHandler = (from, to) => {
		const { zIndexState } = this.state;
		zIndexState.from = from;
		zIndexState.to = to;
		this.setState({ zIndexState })
  }
  // zInde Change Handlers End
  
  // Location Setters Handlers:
	setOrgLocation = data => { // <- Origin Location Setter
    const {lat, lng} = data.geometry.location
		this.setState({ originLocation: data.name})
		this.setState({ originCoords: `{${lat},${lng}}`})
	}
	setDestLocation = data => { // <- Destination Location Setter
    const {lat, lng} = data.geometry.location
		this.setState({ destinationLocation: data.name})
		this.setState({ destCoords: `{${lat},${lng}}`})
  }
  // Location Setters Handlers End


  // Modal Visability Handlers
  _handleDatePicker = () => this.setState({ isDatePickerVisible: !this.state.isDatePickerVisible }); // <- Toggle Date Picker Modal 
  _handleTimePicker = () => this.setState({ isTimePickerVisible: !this.state.isTimePickerVisible }); // <- Toggle Time Picker Modal 
	errorModalHandler = () => { // <- Error Modal Handler
		this.setState({ errorModalVisability: !this.state.errorModalVisability });
		setTimeout(() => this.setState({errorModalVisability: !this.state.errorModalVisability}) ,3000)
	}
  // Modal Visability Handlers End

  // DateTime setPicker Handlers
  _setDatePicker = date => { // <- Date Picker Setter
    this.setState({ selectedDate: `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}` });
    this._handleDatePicker();
  };
  _setTimePicker = date => { // <- Time Picker Setter
    this.setState({ selectedTime: `${date.getHours()}:${date.getMinutes()}` });
    this._setArivalTime();
    this._handleTimePicker(); // <- 
  };
  _setArivalTime = () => {
    const { originCoords, destCoords } = this.state;
    // originCoords === '' || destCoords === '' ? alert("Location Fields Are Required, 'From Where' And 'Where To' "): null;
    console.log('origin', originCoords, 'destination', destCoords);
    var re = /{([^}]+)}/g;
     axios.post(`https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${originCoords.split(re)[1]}&destinations=${destCoords.split(re)[1]}&key=${API_KEY}`)
		.then(res => console.log(res.data))
		.catch(err => console.log(err))
  }
  // DateTime setPicker Handlers End

  // Filter Selected Days Handler (For Constant Ride Only)
  filterDays = day => {
    const { days } = this.state;
    days[day] = !days[day];
    this.setState({ days });
  }
  // Filter Days End

  //Get Selected Days
  getSelectedDays = () => {
    const { days } = this.state;
    let daysArray = [];
   for (const key in days) {
     if (days[key]) {
       daysArray.push(key);
     }
   }
   return daysArray;
  }

  render() {
    const { selectedDate, selectedTime, availableSeats, zIndexState, switchBtn} = this.state;
    const { visable, visabilityHandler, } = this.props;
    const { container, dateButtonStyle, timeButtonStyle, availableSeatsPickerStyle } = styles;
    let isConstant;
    // Checking if ride to post is SINGLE or CONSTANT: 
    // View Days CheckBoxs for constant ride
    if(switchBtn){
     isConstant = (
        <View style={{position: 'absolute', top: HEIGHT / 3, flexDirection: 'row', flexWrap: 'wrap'}}>
            {days.map(day => <CheckBox addDays={this.filterDays} isChecked={this.state.days[day.value]} key={day.name} label={day.name} value={day.value}  />)}
        </View>
      )
    }
    // View Date Picker For Single Ride
    else{
      isConstant = (
      <TouchableOpacity
                style={dateButtonStyle}
                onPress={this._handleDatePicker}
              >
                <IconFA name="calendar" size={24} color="'rgba(0,0,0,0.3)'" />
                <Text
                  style={{
                    fontSize: 20,
                    marginLeft: 10,
                    color: "rgba(0,0,0,0.3)"
                  }}
                >
                  {selectedDate === "" ? "Date" : selectedDate}
                </Text>
      </TouchableOpacity>
      )
    }

    return (
    <Modal visible={visable} onRequestClose={visabilityHandler}>
        
       <View style={container}>
         {/* Arrow Back Button */}
       <TouchableOpacity onPress={visabilityHandler} style={{ alignSelf: 'flex-start', margin: 15}}>  
        <Icon name="arrow-back" size={40} color="#fff"  />
       </TouchableOpacity>
        
         {/* Origin Text Input */}
        <View style={{position:'absolute', width: '80%', top: HEIGHT / 10, zIndex: zIndexState.from}}>
            <AutoComplete 
              zIndexHandler={this.zIndexHandler} 
              placeholder={this.state.originLocation} 
              zIndex={{from: 1, to: 0 }}
              setLocation={this.setOrgLocation} />
          </View>
          {/* Destination Text Input */}
          <View style={{position:'absolute', width: '80%', top: HEIGHT / 5, zIndex: zIndexState.to}}>
            <AutoComplete
              zIndexHandler={this.zIndexHandler} 
              placeholder={this.state.destinationLocation} 
              zIndex={{from:0 , to: 1}}
              setLocation={this.setDestLocation} />
          </View>
          {/* Switch */}
          <Switch 
          style={{ position: 'absolute', top: HEIGHT / 3.5, alignSelf: 'flex-end', right: 50}} 
          trackColor="#fff"
          thumbColor="#B0E8EE"
          value={this.state.switchBtn} 
          onValueChange={(value) => this.setState({switchBtn: value})} 
          />
            {/* Single Ride or Constant Ride -- if switchBtn == true : Constant,  else: Single */}
            {isConstant}

              {/* Date Picker for Single Ride */}
              <DateTimePicker
                isVisible={this.state.isDatePickerVisible}
                onConfirm={this._setDatePicker}
                onCancel={this._handleDatePicker}
              />
              {/* Time */}
              <View style={{position: 'absolute', top: '45%', width: '80%'}}>
                <TouchableOpacity
                  style={timeButtonStyle}
                  onPress={this._handleTimePicker}
                >
                  <Icon
                    name="schedule"
                    size={24}
                    color="'rgba(0,0,0,0.3)'"
                  />
                  <Text
                    style={{
                      fontSize: 20,
                      marginLeft: 10,
                      color: "rgba(0,0,0,0.3)"
                    }}
                  >
                    {selectedTime === "" ? "Time" : selectedTime}
                  </Text>
                </TouchableOpacity>
                {/* Destination Time 
                    this.state.selectedTime !== '' ?
                <View>
                  <Text style={{fontSize: 20, color: '#fff', fontWeight: '600'}}>Estimated Arrival Time: {this.state.desttinationTime}</Text>
                </View> : null
                */}
              </View>

              <DateTimePicker
                mode="time"
                isVisible={this.state.isTimePickerVisible}
                onConfirm={this._setTimePicker}
                onCancel={this._handleTimePicker}
              />

        <Picker
         prompt="Available Seats"
         selectedValue={availableSeats}
         itemStyle={{textAlign: 'center'}}
         onValueChange={itemValue =>
           this.setState({ availableSeats: itemValue })
         }
         style={availableSeatsPickerStyle}
       >
          <Picker.Item label="Available Seats" value="" />
         <Picker.Item label="One Seat" value="1" />
         <Picker.Item label="Two Seats" value="2" />
         <Picker.Item label="Three Seats" value="3" />
         <Picker.Item label="Four Seats" value="4" />
       </Picker>
              <TouchableOpacity 
              style={{ position: 'absolute', bottom: HEIGHT / 5, backgroundColor: '#fff', padding: 20, }}
              onPress={this.editRide}
              >
                <Text style={{textAlign:'center', fontSize: 19, color: '#3498db'}}>Update Ride</Text>
              </TouchableOpacity>
              <ErrorModal errorModalVisable={this.state.errorModalVisability} errorText={this.state.errors} />
          </View>
      </Modal>
    );
  }
}

const styles = {
  container: {
    height: HEIGHT,
    alignItems: "center",
    backgroundColor: "#3498db"
  },
  editContainer: {
    height: "90%",
    backgroundColor: "#3498db",
    width: WIDTH,
    alignItems: "center"
  },
  dateButtonStyle: {
    position: 'absolute',
		top: HEIGHT / 3,
		width: '80%',
		paddingVertical: 12,
		paddingLeft: 10,
		backgroundColor: "#fff",
		flexDirection: "row",
		marginBottom: 15
	  },
  timeButtonStyle: {
    // position: 'absolute',
    // top: '45%',
    width: '100%',
    paddingVertical: 12,
    paddingLeft: 10,
    backgroundColor: "#fff",
    flexDirection: "row",
    marginBottom: 15
    },
  availableSeatsPickerStyle: {
    position: 'absolute',
    width: "80%",
    color: 'rgba(0,0,0,0.3)',
    padding: 10,
    height: 50,
    bottom: HEIGHT / 3.3,
    backgroundColor: "#fff",
    marginBottom: 40
  },
};

export default EditRidePost;

