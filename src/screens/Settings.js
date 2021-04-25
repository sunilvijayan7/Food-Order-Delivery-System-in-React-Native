import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import FlatText from '../components/FlatText';
import Header from './section/Header';
import AsyncStorage from '@react-native-community/async-storage';
import config from '../../config/config.json';
import Toast from 'react-native-simple-toast';

export default class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authorization_key: null,
      name: "",
      email: "",
      current_pass: "",
      password: "",
      confirm_pass: "",
      btnText: "Update",
      error: false
    };
  }

  componentDidMount() {

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
      this.setState({
        error: true
      })
    })

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
            email: json.email
          })
        })
        .catch((error) => {
          this.setState({
            error: true
          })
        });
    },100);
  }

  handleName = (text) => {
    this.setState({ name: text });
  }; 

  handleEmail = (text) => {
    this.setState({ email: text });
  }; 

  handleCurrentPass = (text) => {
    this.setState({ current_pass: text });
  };

  handlePass = (text) => {
    this.setState({ password: text });
  };

  handleConfirmPass = (text) => {
    this.setState({ confirm_pass: text });
  };


  logincheck()
  {
    AsyncStorage.getItem('login').then((login) => {
      if (login !== null) {
        const logininfo = JSON.parse(login)
        this.setState({ authorization_key: logininfo.token });
      }else{
        this.setState({
          authorization_key: null
        })
      }
    })
    .catch((err) => {
      this.setState({
        error: true
      })
    })
  }

  profile_update()
  {
    
    this.logincheck();

    if (this.state.authorization_key == null) {
      this.props.navigation.navigate('Login',{
          screen: 'Account'
        });
      return true;
    }

    if(this.state.name == '')
    {
      Toast.showWithGravity(
        "The Name field is required",
        Toast.SHORT,
        Toast.CENTER
      );
      return true;
    }

    if(this.state.email == '')
    {
      Toast.showWithGravity(
        "The Email field is required",
        Toast.SHORT,
        Toast.CENTER
      );
      return true;
    }

    if(this.state.current_pass != '')
    {
      if(this.state.password == '')
      {
        Toast.showWithGravity(
          "The Password field is required",
          Toast.SHORT,
          Toast.CENTER
        );
        return true;
      }

      if(this.state.confirm_pass == '')
      {
        Toast.showWithGravity(
          "The Confirmation Password field is required",
          Toast.SHORT,
          Toast.CENTER
        );
        return true;
      }

    }

    this.setState({btnText: 'Please Wait...'});

    fetch(config.APP_URL+'/api/user/settings', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: this.state.authorization_key
      },
      body: JSON.stringify({
        name: this.state.name,
        email: this.state.email,
        current_password: this.state.current_pass,
        password: this.state.password,
        password_confirmation: this.state.confirm_pass
      })
    }).then((response) => response.json())
    .then((json) => {
      if(json.error)
      {
        Toast.showWithGravity(
          json.error,
          Toast.SHORT,
          Toast.CENTER
        );
        this.setState({btnText: 'Update'});
      }
      if(json.name)
      {
        Toast.showWithGravity(
          'Profile Successfully Updated',
          Toast.SHORT,
          Toast.CENTER
        );

        this.setState({
          btnText: "Update"
        })

        this.props.navigation.navigate('Account');
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
      return(
        <View style={styles.flex}>
          <Header />
          <View style={styles.mainContainer}>
            <FlatText text="Something Went Wrong" font="q_regular" size={22}/>
          </View>
        </View>
      )
    }else{

    }
    return (
      <View style={styles.flex}>
        <Header />
        <ScrollView style={styles.flex}>
          <View style={styles.card}>
            <View style={styles.title}>
              <FlatText text="Profile Settings" font="q_regular" size={20} />
            </View>
            <View style={styles.formGroup}>
              <FlatText text="Name" font="q_regular" size={16} />
              <TextInput style={styles.inputText} placeholder="Enter Your Name" value={this.state.name} onChangeText={(text) => this.handleName(text)} />
            </View>
            <View style={styles.formGroup}>
              <FlatText text="Email" font="q_regular" size={16} />
              <TextInput style={styles.inputText} placeholder="Enter Your Email" value={this.state.email} onChangeText={(text) => this.handleEmail(text)}/>
            </View>
            <View style={styles.title}>
              <FlatText text="Password Change" font="q_regular" size={20} />
            </View>
            <View style={styles.formGroup}>
              <FlatText text="Current Password" font="q_regular" size={16} />
              <TextInput style={styles.inputText} placeholder="Current Password" onChangeText={(text) => this.handleCurrentPass(text)} secureTextEntry={true}/>
            </View>
            <View style={styles.formGroup}>
              <FlatText text="Password" font="q_regular" size={16} />
              <TextInput style={styles.inputText} placeholder="Password" onChangeText={(text) => this.handlePass(text)} secureTextEntry={true}/>
            </View>
            <View style={styles.formGroup}>
              <FlatText text="Confirmation Password" font="q_regular" size={16} />
              <TextInput style={styles.inputText} placeholder="Confirmation Password" onChangeText={(text) => this.handleConfirmPass(text)} secureTextEntry={true}/>
            </View>
            <View style={styles.formGroup}>
              <TouchableOpacity style={styles.btn} onPress={() => this.profile_update()}>
                <FlatText text={this.state.btnText} font="q_semibold" size={17} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  card: {
    marginHorizontal: 20,
    marginVertical: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#fff'
  },
  inputText: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: 10,
    color: '#333'
  },
  formGroup: {
    marginBottom: 20
  },
  title: {
    marginBottom: 20
  },
  btn: {
    backgroundColor: '#C01C27',
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderRadius: 5
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});