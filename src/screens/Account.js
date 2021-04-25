import React, { Component } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import FlatText from '../components/FlatText';
import Header from './../screens/section/Header';
import { Ionicons,Octicons, Feather,AntDesign } from '@expo/vector-icons';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';

import config from '../../config/config.json';
import { ActivityIndicator } from 'react-native-paper';

export default class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      name: "",
      avatar: "",
      authorization_key: null,
      error: false
    };
  }

  componentDidMount() {

    setTimeout(() => {
      AsyncStorage.getItem('login').then((login) => {
        if (login !== null) {
          const logininfo = JSON.parse(login)
          this.setState({ authorization_key: logininfo.token });
        }else{
          this.props.navigation.navigate('Login',{
            screen: 'Account'
          });
          return true;
        }
      })
      .catch((err) => {
        
      });
    }, 200);
    

    setTimeout(() => {
      return fetch(config.APP_URL+'/api/info', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: this.state.authorization_key
        }
      })
        .then((response) => response.json())
        .then((json) => {
          this.setState({
            name: json.name,
            avatar: json.avatar,
            isLoading: false
          })
        })
        .catch((error) => {
          this.setState({
            isLoading: false,
            error: true
          });
        });
    },500);
  }


  logout()
  {
    AsyncStorage.removeItem('login');
    this.props.navigation.navigate('Home');
  }

  render() {
    console.disableYellowBox = true; 

    
    if(this.state.isLoading)
    {
      return (
        <View style={styles.flex}>
          <Header/>
          <View style={styles.mainContainer}>
            <ActivityIndicator size="large" color="#333" />
          </View>
        </View>
      )
    }else{
      if(this.state.error)
      {
        return (
          <View style={styles.flex}>
            <Header />
            <View style={styles.mainContainer}>
              <FlatText text="Something Went Wrong" font="q_regular" size={22}/>
            </View>
          </View>
        )
      }else{
        
        return (
          <View style={styles.flex}>
            <Header />
            <ScrollView style={styles.flex}>
              <View style={styles.conatiner}> 
                <Image style={styles.profileImg} source={{ uri: "https://ui-avatars.com/api/?background=random&size=100&name="+this.state.name }} />
                <View style={styles.username}>
                  <FlatText text={this.state.name} font="q_regular" size={22} />
                </View>
                <View style={styles.singleList}>
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('Home')}>
                    <View style={styles.flexDirection}>
                      <View style={styles.flexContain}>
                        <AntDesign style={styles.icon} name="home" size={20} color="#666" />
                        <FlatText text=" Homepage" font="q_regular" size={18} />
                      </View>
                      <Ionicons name="ios-arrow-forward" size={24} color="#666" />
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={styles.singleList}>
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('Order')}>
                    <View style={styles.flexDirection}>
                      <View style={styles.flexContain}>
                        <Octicons style={styles.icon} name="list-unordered" size={20} color="#666" />
                        <FlatText text=" All Orders" font="q_regular" size={18} />
                      </View>
                      <Ionicons name="ios-arrow-forward" size={24} color="#666" />
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={styles.singleList}>
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('Settings')}>
                    <View style={styles.flexDirection}>
                      <View style={styles.flexContain}>
                        <Feather style={styles.icon} name="settings" size={20} color="#666" />
                        <FlatText text=" Profile Settings" font="q_regular" size={18} />
                      </View>
                      <Ionicons name="ios-arrow-forward" size={24} color="#666" />
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={styles.singleList}>
                  <TouchableOpacity onPress={() => this.logout()}>
                    <View style={styles.flexDirection}>
                      <View style={styles.flexContain}>
                        <AntDesign style={styles.icon} name="logout" size={20} color="#666" />
                        <FlatText text=" Logout" font="q_regular" size={18} />
                      </View>
                      <FlatText text="" font="q_regular" size={18} />
                      <Ionicons name="ios-arrow-forward" size={24} color="#666" />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        );
      }
    }
  }
}


const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  conatiner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 30,
    marginVertical: 30
  },
  profileImg: {
    width: 100,
    height: 100,
    borderRadius: 100
  },
  username: {
    marginTop: 10,
    marginBottom: 20
  },
  singleList: {
    backgroundColor: '#fff',
    width: '100%',
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 20
  },
  flexDirection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center'
  },
  flexContain: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  icon: {
    marginRight: 5
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});