import React, { Component } from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { View, Text, TouchableOpacity } from 'react-native';

import { API_KEY } from '../config/API_KEY';

export class AutoComplete extends Component {
  render() {
    const { zIndex, zIndexHandler} = this.props;
    return (
      <View style={{backgroundColor: '#fff'}}>
          <GooglePlacesAutocomplete
            placeholder={this.props.placeholder}
            enablePoweredByContainer={false}
            minLength={2} // minimum length of text to search
            autoFocus={false}
            returnKeyType={"search"} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
            listViewDisplayed="ture" // true/false/undefined
            fetchDetails={true}
            renderDescription={row => row.description} // custom description render
            onPress={(data, details = null) => {
              // 'details' is provided when fetchDetails = true
              console.log(details.name); 
              this.props.setLocation(details);
              {/* this.props.zIndexChange() */}
            }}
            getDefaultValue={() => ""}
            query={{
              // available options: https://developers.google.com/places/web-service/autocomplete
              key: API_KEY,
              language: "en", // language of the results
              types: "geocode" // default: 'geocode'
              
            }}
            
            textInputProps={{
              onFocus: () => zIndexHandler(zIndex.from, zIndex.to),
              onBlur: () => console.log('object')
          }}

            styles={{
              textInputContainer: {
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    height: 50,
                    width: '100%',
                    borderTopWidth: 0,
                    borderBottomWidth:0,
                  },
                  description: {
                    fontWeight: 'bold',
                    width: '100%',
                    textAlign: 'center'
                  },
                  textInput: {
                    backgroundColor: '#fff',  
                    height:47,
                    marginLeft:0,
                    marginRight:0,
                    marginTop:1,
                    borderRadius:0,
                    color: '#5d5d5d',
                    fontSize: 16,
                },
                  predefinedPlacesDescription: {
                    color: '#fff'
                  }
            }}

            currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
            currentLocationLabel="Current"
            nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
            GoogleReverseGeocodingQuery={
              {
                // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
              }
            }
            GooglePlacesSearchQuery={{
              // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
              rankby: "distance",
              types: "food"
            }}
            filterReverseGeocodingByTypes={[
              "locality",
              "administrative_area_level_3"
            ]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
            debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
           // renderRightButton={}
          />
      </View>
    );
  }
}

export default AutoComplete;


