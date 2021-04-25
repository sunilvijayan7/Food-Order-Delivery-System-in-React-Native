import React, { Component } from "react";
import { View, StyleSheet, Image } from "react-native";
import { SimpleLineIcons } from "@expo/vector-icons";

import FlatText from "../../components/FlatText";
import HeadText from "../../components/HeadText";
import AsyncStorage from "@react-native-community/async-storage";
import config from '../../../config/config.json';


export default class Header extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      city: "",
      address: "",
      isLoggedIn: false,
      name: 'test',
      authorization_key: ""
    };
  }

  componentWillReceiveProps(props)
  {
    if(this.props.reload == 'no')
    {
      this.componentDidMount();
    }
  }

  componentDidMount() {
    
    AsyncStorage.getItem("location").then((location) => {
      if (location !== null) {
        const locationdata = JSON.parse(location);
        this.setState({
          city: locationdata.city,
          address: locationdata.address,
        });
      }
    });

    AsyncStorage.getItem('login').then((login) => {
      if (login !== null) {
        const logininfo = JSON.parse(login)
        this.setState({ authorization_key: logininfo.token });
        fetch(config.APP_URL+'/api/info', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: this.state.authorization_key
          }
        })
          .then((response) => response.json())
          .then((json) => {
            if (json.message != 'Unauthenticated.') {
              this.setState({
                name: json.name,
                isLoggedIn: true
              })
            }


          })
          .catch((error) => {

          });
      }



    })
      .catch((err) => {

      });




  }

  render() {

    

    return (
      <View style={styles.headerContainer}>
        <View>
          <FlatText
            style={styles.deliverTo}
            text="Delivery To"
            font="q_semibold"
            color="#333"
            size={17}
          />
          <View style={styles.dFlex}>
            <SimpleLineIcons
              style={styles.locationIcon}
              name="location-pin"
              size={15}
              color="#666"
            />
            <HeadText
              text={this.state.address}
              font="q_medium"
              color="#666"
              size={14}
              width={50}
            />
          </View>
        </View>
        {(() => {
          if (this.state.isLoggedIn == true) {
            return (
              <View>
                <Image
                  style={styles.profileImg}
                  source={{ uri: "https://ui-avatars.com/api/?background=random&size=100&name=" + this.state.name }}
                />
              </View>
            )
          }
          return null;
        })()}

      </View>
    );
  }
}


const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 40,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    paddingBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  profileImg: {
    width: 45,
    height: 45,
    borderRadius: 60,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  location: {
    fontSize: 14,
    color: "#666",
  },
  dFlex: {
    flexDirection: "row",
  },
  arrowIcon: {
    paddingLeft: 5,
    paddingTop: 1,
  },
  locationIcon: {
    marginTop: 4,
    marginRight: 5
  }
});
