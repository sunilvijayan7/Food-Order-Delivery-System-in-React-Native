import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import FlatText from '../components/FlatText';
import Header from './section/Header';
import AsyncStorage from '@react-native-community/async-storage';
import config from '../.././config/config.json';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            btnText: "Login",
            email: "",
            password: "",
            errormessage: "",
            screen: "Account",
            error: false
        };
    }


    componentDidMount()
    {
        const {screen} = this.props.route.params;
        this.setState({
            screen: screen
        })
    }

    handleEmail = (text) => {
        this.setState({ email: text });
    };

    handlePassword = (text) => {
        this.setState({ password: text });
    };

    login()
    {
        
        this.setState({btnText: 'Please Wait...'});
        if(this.state.email == "")
        {
            this.setState({errormessage: 'The Email filed is required',btnText: 'Login'});
            return true;
        }

        if(this.state.password == "")
        {
            this.setState({errormessage: 'The Password filed is required',btnText: 'Login'});
            return true;
        }

        fetch(config.APP_URL+'/api/login', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password
            })
        }).then((response) => response.json())
        .then((json) => {
          if(json.email)
          {
              this.setState({errormessage: json.email,btnText: 'Login'});
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
              
              this.setState({btnText: 'Login'});
              
            this.props.navigation.navigate(this.state.screen);
              
              
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
                    <ScrollView>
                        <View style={styles.mainContainer}>
                            <View style={styles.title}>
                                <FlatText text="Login Your Account" font="q_semibold" size={20} />
                            </View>
                            {this.state.errormessage != "" ? <View style={styles.errorMessage}>
                                <FlatText text={this.state.errormessage} font="q_regular" size={16} color="#C01C27" />
                            </View> : <FlatText/>}
                            <View style={styles.formGroup}>
                                <FlatText text="Email" font="q_regular" size={17} />
                                <TextInput style={styles.textInput} placeholder="Enter Your Email" onChangeText={(text) => this.handleEmail(text)}/>
                            </View>
                            <View style={styles.formGroup}>
                                <FlatText text="Password" font="q_regular" size={17} />
                                <TextInput style={styles.textInput} placeholder="Enter Your Password" onChangeText={(text) => this.handlePassword(text)} secureTextEntry={true}/>
                            </View>
                            <View>
                                <TouchableOpacity style={styles.btn} onPress={() => this.login()}>
                                    <FlatText text={this.state.btnText} font="q_semibold" size={18} color="#fff" />
                                </TouchableOpacity>
                            </View>
                            <View>
                                <TouchableOpacity style={styles.textCenter} onPress={() => this.props.navigation.navigate('Register')}>
                                    <FlatText text="Don't Have an Account? SignUp" font="q_regular" size={16} color="#666" />
                                </TouchableOpacity>
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
    title: {
        marginBottom: 7
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
    errorMessage: {
        marginBottom: 7
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});