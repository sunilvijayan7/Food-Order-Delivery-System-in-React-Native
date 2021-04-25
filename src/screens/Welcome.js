import React, { Component } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from "react-native";

const { width, height } = Dimensions.get("window");

import AsyncStorage from "@react-native-community/async-storage";
import FlatText from "../components/FlatText";

import config from '../../config/config.json';

class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      loading: "Use Current Location",
      locationBtnColor: "#C01C27",
      buttonDisable: false,
      latitude: "",
      longitude: "",
      city: "",
      address: "",
      city_id:null,
      found_city:true,
      error: false
    };
  }


  componentDidMount()
  {
    AsyncStorage.getItem('location').then((location) => {
      if (location !== null) {
          this.props.navigation.navigate('Home');
          return true;
      }
    })
    .catch((err) => {
        
    });
  }

  currenLocation() {
    this.setState({
      isLoading: true,
      buttonDisable: true,
      loading: "Please Wait....",
      locationBtnColor: "#e9636c",
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) =>
          this.setState({ latitude, longitude }, this.storePosition),
        (error) => console.log("Error:", error)
      );
    } else {
      alert("Geolocation is not supported by this phone.");
      this.setState({
        loading: "Use Current Location",
        locationBtnColor: "#C01C27",
        buttonDisable: false,
      });
    }
  }

  storePosition() {
    return fetch(
      "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
        this.state.latitude +
        "," +
        this.state.longitude +
        "&key="+ config.GOOGLE_MAP_API_KEY +""
    )
      .then((response) => response.json())
      .then((json) => {
        if (json.status == "OK") {
          if (json.results[1]) {
            var country = null,
              countryCode = null,
              city = null,
              cityAlt = null;
            var c, lc, component;
            for (var r = 0, rl = json.results.length; r < rl; r += 1) {
              var result = json.results[r];

              if (!city && result.types[0] === "locality") {
                for (
                  c = 0, lc = result.address_components.length;
                  c < lc;
                  c += 1
                ) {
                  component = result.address_components[c];

                  if (component.types[0] === "locality") {
                    city = component.long_name;
                    break;
                  }
                }
              } else if (
                !city &&
                !cityAlt &&
                result.types[0] === "administrative_area_level_1"
              ) {
                for (
                  c = 0, lc = result.address_components.length;
                  c < lc;
                  c += 1
                ) {
                  component = result.address_components[c];

                  if (component.types[0] === "administrative_area_level_1") {
                    cityAlt = component.long_name;
                    break;
                  }
                }
              } else if (!country && result.types[0] === "country") {
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
              loading: "Use Current Location"
            });

            let url =config.APP_URL+'/api/area/'+city;
   
             fetch(url)
             .then((response) => response.json())
             .then((json) => {
             if (json.data != null) {
              var id = json.data.id;
              this.setState({
                   city_id:id,
                   found_city:true
                 });
             }
             else{
              this.setState({
                city_id: null,
                found_city:true
              });
             }
            
                 
             })
            .catch((error) => console.error(error));
           

            if (this.state.found_city == true) {
             
              const location = {
                latitude: this.state.latitude,
                longitude: this.state.longitude,
                city: this.state.city,
                city_id:this.state.city_id,
                address: this.state.address,
                city_change:true
              };
            
              AsyncStorage.setItem("location", JSON.stringify(location));
              this.props.navigation.navigate("Home");
            }
           
            
          }
        }

        if(json.error_message)
        {
          Toast.showWithGravity(
            json.error_message,
            Toast.SHORT,
            Toast.CENTER
          );
          this.setState({
            loading: "Use Current Location"
          })
          return true;
        }
      })
      .catch((error) => {
        this.setState({
          error: true
        })
      });
  }


 

  render() {
    if(this.state.error)
    {
      return (
        <View style={styles.mainContainer}>
          <FlatText text="SomeThing Went Wrong" font="q_regular" size={20} />
        </View>
      )
    }else{
      return (
        <View style={styles.container}>
          <Image
            style={styles.bannerImage}
            source={{ uri: config.BANNER_IMAGE }}
          />
          <View style={styles.marginBottom}>
            <View>
              <FlatText text="fooddelivery uses your location to show the restaurants near you!" font="q_regular" size={17} textalign='center'/>
            </View>
          </View>
          <View>
            <TouchableOpacity
              style={styles.currenLocationBtn}
              onPress={() => this.currenLocation()}
            >
              <FlatText text={this.state.loading} font="q_regular" size={18} color="#fff"/>
            </TouchableOpacity>
          </View>
          <View style={styles.selectButton}>
            <TouchableOpacity
              disabled={this.state.buttonDisable}
              onPress={() => this.props.navigation.navigate("Search")}
            >
              <FlatText text="Select Another Location" color="#C01C27" size={18} font="q_regular"/>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  }
}

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    backgroundColor: "#fff",
  },
  bannerImage: {
    width: width,
    height: height / 2,
  },
  selectButton: {
    marginTop: 20,
  },
  marginBottom: {
    marginBottom: 25
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  currenLocationBtn: {
    backgroundColor: '#C01C27',
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: width - 50,
    flexDirection: "row",
    justifyContent: "center",
    borderRadius: 5,
  }
});
