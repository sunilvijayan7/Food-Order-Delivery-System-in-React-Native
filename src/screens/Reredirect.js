import React, { Component } from 'react';
import { View, Text } from 'react-native';

export default class Reredirect extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount()
  {
      const { data  } = this.props.route.params;
      if(data == true)
      {
        this.props.navigation.navigate('Home');
        console.log('RE Redirect');
        return true;
      }else{
        console.log('Redirect');
      }
  }

  render() {
    return (
      <View>
        <Text> Reredirect </Text>
      </View>
    );
  }
}
