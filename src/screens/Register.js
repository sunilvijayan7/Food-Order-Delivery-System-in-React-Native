import React, { Component } from 'react';
import { View, StyleSheet,TextInput,TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Header from './section/Header';
import FlatText from '../components/FlatText';
import AsyncStorage from '@react-native-community/async-storage';
import config from '../.././config/config.json';
import Toast from 'react-native-simple-toast';

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      btnText: 'Register',
      name: '',
      email: '',
      password: '',
      confirm_pass: '',
      error: false
    };
  }

  handleRegisterName = (text) => {
    this.setState({ name: text });
  };

  handleRegisterEmail = (text) => {
      this.setState({ email: text });
  };

  handleRegisterPassword = (text) => {
      this.setState({ password: text });
  };

  handleConfirmPassword = (text) => {
      this.setState({ confirm_pass: text });
  };

  register()
  {
    if(this.state.name == '')
    {
      Toast.showWithGravity(
        "The Name filed is required",
        Toast.SHORT,
        Toast.CENTER
      );
      return true;
    }

    if(this.state.email == '')
    {
      Toast.showWithGravity(
        "The Email filed is required",
        Toast.SHORT,
        Toast.CENTER
      );
      return true;
    }

    if(this.state.password == '')
    {
      Toast.showWithGravity(
        "The Password filed is required",
        Toast.SHORT,
        Toast.CENTER
      );
      return true;
    }

    if(this.state.confirm_pass == '')
    {
      Toast.showWithGravity(
        "The Confirmation Password filed is required",
        Toast.SHORT,
        Toast.CENTER
      );
      return true;
    }

    if(this.state.password.length < 8)
    {
      Toast.showWithGravity(
        "The password must be at least 8 characters.",
        Toast.SHORT,
        Toast.CENTER
      );
      return true;
    }

    if(this.state.password != this.state.confirm_pass)
    {
      Toast.showWithGravity(
        "The Confirmation password doesn't match",
        Toast.SHORT,
        Toast.CENTER
      );
      return true;
    }

    this.setState({
      btnText: 'Please Wait...'
    });


    fetch(config.APP_URL+'/api/register', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: this.state.name,
            email: this.state.email,
            password: this.state.password
        })
    }).then((response) => response.json())
    .then((json) => {
      if(json.errors)
      {
        Toast.showWithGravity(
          json.errors,
          Toast.SHORT,
          Toast.CENTER
        );
        this.setState({
          btnText: 'Register'
        });
      }
      if(json.token)
      {
          const logininfo = {
              token: 'Bearer '+json.token,
              login_id: json.login_id
          }
            AsyncStorage.getItem('login').then(()=>{
                AsyncStorage.setItem('login',JSON.stringify(logininfo));
            })
            .catch((err)=>{
                alert(err)
            })
          
          this.setState({btnText: 'Register'});
          this.props.navigation.navigate('Home');
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
        <View style={styles.flex}> 
              <Header />
              <View style={styles.container}>
                  <FlatText text="Something Went Wrong" font="q_regular" size={22} />
              </View>
          </View>
      )
    }else{
      return (
        <View style={styles.flex}>
          <Header />
          <ScrollView style={styles.flex}>
            <View>
              <View style={styles.mainContainer}>
                  <View style={styles.title}>
                      <FlatText text="Register Your Account" font="q_semibold" size={20} />
                  </View>
                  <View style={styles.formGroup}>
                      <FlatText text="Name" font="q_regular" size={17} />
                      <TextInput style={styles.textInput} placeholder="Enter Your Name" onChangeText={(text) => this.handleRegisterName(text)}/>
                  </View>
                  <View style={styles.formGroup}>
                      <FlatText text="Email" font="q_regular" size={17} />
                      <TextInput style={styles.textInput} placeholder="Enter Your Email" onChangeText={(text) => this.handleRegisterEmail(text)}/>
                  </View>
                  <View style={styles.formGroup}>
                      <FlatText text="Password" font="q_regular" size={17} />
                      <TextInput style={styles.textInput} placeholder="Enter Your Password" secureTextEntry={true} onChangeText={(text) => this.handleRegisterPassword(text)}/>
                  </View>
                  <View style={styles.formGroup}>
                      <FlatText text="Confirmation Password" font="q_regular" size={17} />
                      <TextInput style={styles.textInput} placeholder="Enter Your Confirmation Password" secureTextEntry={true} onChangeText={(text) => this.handleConfirmPassword(text)}/>
                  </View>
                  <TouchableOpacity style={styles.btn} onPress={() => this.register()}>
                      <FlatText text={this.state.btnText} font="q_semibold" size={18} color="#fff" />
                  </TouchableOpacity>
                  <View>
                      <TouchableOpacity style={styles.textCenter} onPress={() => this.props.navigation.navigate('Login')}>
                          <FlatText text="Already Have an Account? SignIn" font="q_regular" size={16} color="#666" />
                      </TouchableOpacity>
                  </View>
              </View>
            </View>
          </ScrollView>
        </View>
      );
    }
  }
}


const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  mainContainer: {
      paddingHorizontal: 20,
      paddingVertical: 40
  },
  textInput: {
      borderWidth: 1,
      borderColor: '#ddd',
      paddingVertical: 20,
      borderRadius: 5,
      paddingHorizontal: 20,
      marginTop: 10
  },
  formGroup: {
      marginBottom: 20
  },
  title: {
      marginBottom: 7
  },
  btn: {
      alignItems: 'center',
      backgroundColor: '#C01C27',
      paddingVertical: 20,
      borderRadius: 5
  },
  textCenter: {
      alignItems: 'center',
      marginTop: 20
  },
  container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
  }
});