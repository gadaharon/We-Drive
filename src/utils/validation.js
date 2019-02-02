// Check for valid email
export const checkEmail = email => {

}

// Login validation
export const loginValidation = (data) => {
    const { email, password } = data;
    // validate email
    if(email === '') return 'Please enter your email address';
    // validate password
    if(password  === '') return 'Please enter your password';

    return '';
}
// Register validation
export const registerValidation = data => {
    const { name, email, password, phone } = data;

    // name validation
    if(name === '') return 'Name is required';
    
    // Regex for checking email validation
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    // email field empty validation
    if(email === '') return 'Email is required';
    // isEmail validation
    if(!re.test(String(email).toLowerCase())){
    return 'Email is invalid';
   }

//  Password & Password confirm validation    
//    validate password
   if(password === '') return 'Password is required';


//    validate phone number
   if(phone === '') return 'Phone number is required';


   return '';
}

// Post drive validation
export const postValidation = data => {
    const { originLocationName, destLocationName, dateOrDays, time, availableSeats, isWeekly } = data;
    if(originLocationName === "") return "Enter Departure Location";
    if(destLocationName === "") return "Enter Destination Location";
    if(dateOrDays === "") return isWeekly ? "Select Days For Your Ride" : "Enter Departure Date";
    if(time === "") return "Enter Departure Time";
    if(availableSeats === "") return "Enter Avilable Seats";
    return '';
}

export const searchRideValidation = data => {
    const { originLocation, destinationLocation } = data;
    if(originLocation === '') return 'Please enter your pickup location';
    if(destinationLocation === '') return 'Please enter your destination';

    return '';
}

export const isEmpty = (data) => {
    if(data !== "" || data.length === 0 || Object.keys(data)) return true ;
    return false;
}
