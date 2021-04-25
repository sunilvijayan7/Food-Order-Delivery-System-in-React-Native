import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions,Keyboard } from 'react-native';

import MapView from 'react-native-maps';

import Toast from 'react-native-simple-toast';

import config from '../../config/config.json';

const { width,height } = Dimensions.get('window');

import { MaterialIcons } from '@expo/vector-icons'; 
import FLatText from '../components/FlatText';

import AsyncStorage from '@react-native-community/async-storage';
import { TextInput, TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';

import { SimpleLineIcons } from '@expo/vector-icons'; 


class Search extends Component{

    constructor(props)
    {
        super(props);
        this.state = {
            isLoading: false,
            latitude: 37.78825,
            longitude: -122.4324,
            city: '',
            address: '',
            dataCity: [],
            searchContent: 'Search',
            SearchColor: '#C01C27',
            error: false
        };
    }

    hideKeyboard()
    {
        Keyboard.dismiss();
    }

    
    handleText = (text) => {
        this.setState({
            address: text,
            SearchColor: '#969696',
            searchContent: 'Loading...'
        });
        return fetch('https://maps.googleapis.com/maps/api/place/autocomplete/json?input='+text+'&key='+config.GOOGLE_MAP_API_KEY+'')
        .then((response) => response.json())
        .then((json) => {
           this.setState({
            dataCity: json.predictions,
            SearchColor: '#C01C27',
            searchContent: 'Search'
           });
        })
        .catch((error) => {
          this.setState({
              error: true
          })
        });
    };

    selectLocation(address,place_id)
    {
        return fetch('https://maps.googleapis.com/maps/api/place/details/json?place_id='+place_id+'&fields=geometry&key='+config.GOOGLE_MAP_API_KEY+'')
        .then((response) => response.json())
        .then((json) => {
           this.setState({
               latitude: json.result.geometry.location.lat,
               longitude: json.result.geometry.location.lng,
               dataCity: [],
               address: address,
               SearchColor: '#969696',
               searchContent: 'Loading...'
           });
           this.storePosition();
        })
        .catch((error) => {
          this.setState({
              error: true
          })
        });
    }

    currenLocation()
    {
        this.setState({
            isLoading: true,
            SearchColor: '#969696',
            searchContent: 'Loading...'
        });

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                ({ coords: { latitude, longitude } }) => this.setState({ latitude, longitude }, this.storePosition),
                (error) => console.log('Error:', error)
            )
        } else {
            alert("Geolocation is not supported by this phone.");
        }
    }

    storePosition()
    {
        return fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng='+this.state.latitude+','+this.state.longitude+'&key='+config.GOOGLE_MAP_API_KEY+'')
        .then((response) => response.json())
        .then((json) => {
            if(json.status == 'OK')
            {
                if (json.results[1]) {
                    var country = null, countryCode = null, city = null, cityAlt = null;
                    var c, lc, component;
                    for (var r = 0, rl = json.results.length; r < rl; r += 1) {
                        var result = json.results[r];
    
                        if (!city && result.types[0] === 'locality') {
                            for (c = 0, lc = result.address_components.length; c < lc; c += 1) {
                                component = result.address_components[c];
    
                                if (component.types[0] === 'locality') {
                                    city = component.long_name;
                                    break;
                                }
                            }
                        }
                        else if (!city && !cityAlt && result.types[0] === 'administrative_area_level_1') {
                            for (c = 0, lc = result.address_components.length; c < lc; c += 1) {
                                component = result.address_components[c];
    
                                if (component.types[0] === 'administrative_area_level_1') {
                                    cityAlt = component.long_name;
                                    break;
                                }
                            }
                        } else if (!country && result.types[0] === 'country') {
                            country = result.address_components[0].long_name;
                            countryCode = result.address_components[0].short_name;
                        }
    
                        if (city && country) {
                            break;
                        }
                    }
                    
                    this.setState({
                        city: city,
                        address: json.results[1].formatted_address,
                        searchContent: 'Search',
                        SearchColor: '#C01C27'
                    });

                   
                    let url =config.APP_URL+'/api/area/'+this.state.city;
   
                    fetch(url)
                    .then((response) => response.json())
                    .then((json) => {
                    if (json.data != null) {
                     var id = json.data.id;
                   
                        const location = {
                            latitude: this.state.latitude,
                            longitude: this.state.longitude,
                            city: this.state.city,
                            address: this.state.address,
                            city_id:id,
                            city_change:true
                        }
                        AsyncStorage.setItem('location',JSON.stringify(location));

                    }
                   else{
                        const location = {
                            latitude: this.state.latitude,
                            longitude: this.state.longitude,
                            city: this.state.city,
                            address: this.state.address,
                            city_id: null,
                            city_change:true
                        }
                        AsyncStorage.setItem('location',JSON.stringify(location));


                   }
                        

                    })
                   .catch((error) => console.error(error));
                    
            
                   

                }
            }

        })
        .catch((error) => {
            this.setState({
                error: true
            })
        });

       
    }

    draggleStart()
    {
        this.setState({
            SearchColor: '#969696',
            searchContent: 'Loading...'
        })
    }

    draggableMap(e)
    {

        const latitude  = e.nativeEvent.coordinate.latitude
        const longitude = e.nativeEvent.coordinate.longitude

        this.setState({
            latitude: latitude,
            longitude: longitude,
        })

        this.storePosition();
    }

    MoveHome()
    {
        this.setState({ searchContent: 'Please Wait...' })
        AsyncStorage.getItem('location').then((data)=>{
        if (data !== null) {
            this.setState({
                searchContent: 'Search'
            });
            this.props.navigation.navigate('Home');
        }
        else{
            Toast.showWithGravity(
                "Please Select a Location",
                Toast.SHORT,
                Toast.CENTER
                );
                this.setState({
                    searchContent: 'Search'
                });    
        }
        })
        .catch((err)=>{
            alert(err)
        })
       
        
    }

    mapStyle = [ { "featureType": "water", "elementType": "geometry", "stylers": [ { "color": "#e9e9e9" }, { "lightness": 17 } ] }, { "featureType": "landscape", "elementType": "geometry", "stylers": [ { "color": "#f5f5f5" }, { "lightness": 20 } ] }, { "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [ { "color": "#ffffff" }, { "lightness": 17 } ] }, { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [ { "color": "#ffffff" }, { "lightness": 29 }, { "weight": 0.2 } ] }, { "featureType": "road.arterial", "elementType": "geometry", "stylers": [ { "color": "#ffffff" }, { "lightness": 18 } ] }, { "featureType": "road.local", "elementType": "geometry", "stylers": [ { "color": "#ffffff" }, { "lightness": 16 } ] }, { "featureType": "poi", "elementType": "geometry", "stylers": [ { "color": "#f5f5f5" }, { "lightness": 21 } ] }, { "featureType": "poi.park", "elementType": "geometry", "stylers": [ { "color": "#dedede" }, { "lightness": 21 } ] }, { "elementType": "labels.text.stroke", "stylers": [ { "visibility": "on" }, { "color": "#ffffff" }, { "lightness": 16 } ] }, { "elementType": "labels.text.fill", "stylers": [ { "saturation": 36 }, { "color": "#333333" }, { "lightness": 40 } ] }, { "elementType": "labels.icon", "stylers": [ { "visibility": "off" } ] }, { "featureType": "transit", "elementType": "geometry", "stylers": [ { "color": "#f2f2f2" }, { "lightness": 19 } ] }, { "featureType": "administrative", "elementType": "geometry.fill", "stylers": [ { "color": "#fefefe" }, { "lightness": 20 } ] }, { "featureType": "administrative", "elementType": "geometry.stroke", "stylers": [ { "color": "#fefefe" }, { "lightness": 17 }, { "weight": 1.2 } ] } ];

    render()
    {
       
        if(this.state.error)
        {
            return (
                <View style={styles.mainContainer}>
                    <FLatText text="Something Went Wrong" font="q_regular" size={22}/>
                </View>
            )
        }else{
            return(
                <TouchableWithoutFeedback onPress={this.hideKeyboard}>
                    <View>
                     <MapView
                        style={styles.customMap}
                        region={{
                            latitude: this.state.latitude,
                            longitude: this.state.longitude,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                        customMapStyle={this.mapStyle}
                        >
                        <MapView.Marker draggable
                            coordinate={{
                            latitude: parseFloat(this.state.latitude),
                            longitude: parseFloat(this.state.longitude)
                            }}
                            title={this.state.city}
                            onDragStart={() => this.draggleStart()}
                            onDragEnd={(e) => this.draggableMap(e)}
                        />
                    </MapView>
                    <View style={styles.searchContent}>
                        <TextInput style={styles.searchInput} placeholder="Search Your Location" placeholderTextColor="#a6a6a6" onChangeText={(text) => this.handleText(text)} value={this.state.address}></TextInput>
                        <View style={ styles.currenLocation }>
                            <TouchableOpacity onPress={()=>this.currenLocation()}>
                            <MaterialIcons name="my-location" size={24} color="#C01C27" />
                            </TouchableOpacity>
                        </View>
                        <View>
                            {
                                this.state.dataCity.map((item)=>{
                                    return (
                                       <TouchableOpacity key={item.description} onPress={()=> this.selectLocation(item.description,item.place_id)}>
                                            <View style={styles.autocompleteArea}>
                                            <Text style={styles.marginRight10}>
                                                <SimpleLineIcons name="location-pin" size={24} color="#666" /></Text>
                                            <View>
                                            <FLatText text={item.description.substring(0,30)} font="q_regular" color="#666" size={17} />
                                            <FLatText text={item.structured_formatting.secondary_text} font="q_regular" color="#666" size={14} />
                                            </View>
                                        </View>
                                       </TouchableOpacity>
                                    )
                                })
                            }
                        </View>
                     </View>
                     <View style={styles.btnArea}>
                         <View style={styles.btnContentArea}>
                            <TouchableOpacity style={styles.btnTouchAble} onPress={() => this.MoveHome()}>
                            <FLatText color="#fff" size={20} font="q_semibold" text={this.state.searchContent} />
                            </TouchableOpacity>
                         </View>
                     </View>
                </View>
            </TouchableWithoutFeedback>
            )
        }
    }
}


export default Search;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },  
    customMap: {
        width: width,
        height: height
    },
    searchContent: {
        position:'absolute',
        top:40,
        left:0,
        right: 0
    },
    searchInput: {
        backgroundColor: '#fff',
        width: width,
        height:60,
        marginLeft:'auto',
        marginRight:'auto',
        paddingLeft: 20,
        paddingRight: 60,
        color:'#222',
        fontWeight: '600',
        fontSize: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd'
    },
    currenLocation: {
        position: 'absolute', 
        right: 35,
        top: 18
    },
    autocompleteArea: {
        flexDirection: 'row',
        backgroundColor:'#fff',
        width: width,
        height: 80,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingHorizontal: 15
    },
    marginRight10: {
        marginRight: 10
    },
    btnArea: {
        position: 'absolute', 
        bottom: 70, 
        left: 0,
        right: 0
    },
    btnContentArea: {
        width: width -30,
        height: 60,
        marginLeft:'auto',
        marginRight:'auto', 
        borderRadius: 5,
        backgroundColor: '#C01C27', 
        flex: 1, 
        justifyContent:'center',
        alignItems:'center'
    },
    btnTouchAble: {
        width:  width -30,
        height: 60,
        flexDirection:'row',
        justifyContent:'center',
        alignItems: 'center'
    }
});