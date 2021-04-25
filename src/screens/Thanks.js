import React, { Component } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import FlatText from '../components/FlatText';
import Header from './section/Header';
import { Feather } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';


export default class Thanks extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View style={styles.flex}>
        <Header/>
        <View style={styles.container}>
          <Feather name="check-circle" size={80} color="black" />
          <View style={styles.message}>
            <FlatText text="Your Order successfully Sent" font="q_semibold" size={18} color="#333"/>
          </View>
          <TouchableOpacity style={styles.btntext} onPress={() => this.props.navigation.navigate('Account')}>
            <FlatText text="Dashboard" font="q_semibold" color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  container: {  
    flex: 1,  
    justifyContent: 'center',  
    alignItems: 'center'
  },
  message: {
    marginTop: 10,
    marginBottom: 20
  },
  btntext: {
    backgroundColor: '#333',
    borderRadius: 5,
    paddingHorizontal: 30,
    paddingVertical: 15
  }
});