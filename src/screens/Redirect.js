import React, { Component } from 'react';
import { View } from 'react-native';

export default class Redirect extends Component {
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
        this.props.navigation.navigate('Reredirect',
        {
            data: true
        });
        return true;
      }else{
        console.log('Redirect');
      }
  }

  render() {
    return (
      <View>

      </View>
    );
  }
}
