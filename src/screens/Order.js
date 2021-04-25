import React, { Component } from 'react';
import { View, StyleSheet,ActivityIndicator,RefreshControl } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import FlatText from '../components/FlatText';
import Header from './section/Header';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-community/async-storage';
import config from '../../config/config.json';

export default class Order extends Component {
  constructor(props) {
    super(props);
    this.state = {
        isLoading: true,
        authorization_key: null,
        dataOrder: [],
        error: false,
        refreshing: false,
    };
  }

onRefresh = () => {
    this.setState({ refreshing: true });
    this.componentDidMount();
  
};

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
        isLoading: false,
        error: true
      });
    })

    setTimeout(() => {
      return fetch(config.APP_URL+'/api/customer/orders', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: this.state.authorization_key
        }
      })
        .then((response) => response.json())
        .then((json) => {
          this.setState({dataOrder: json,isLoading:false,refreshing: false});
        })
        .catch((error) => {
          this.setState({
            isLoading: false,
            error: true
          })
        });
    },100);
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
        if(this.state.dataOrder.length > 0 )
        {
          return (
            <View style={styles.flex}>
              <Header />
              <ScrollView style={StyleSheet.flex} refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
            title="Pull to refresh"
          />
        }>
                  <View style={styles.container}>
                      <View style={styles.headerTitle}>
                          <FlatText text="All Orders" font="q_regular" size={22} />
                      </View>
                      {
                          this.state.dataOrder.map((order,i) => {
                              return(
                                  <TouchableOpacity key={i} onPress={() => this.props.navigation.navigate('Orderview',{id:order.id})}>
                                      <View style={styles.singleOrder}>
                                          <View>
                                            
                                              <View>
                                                  <FlatText text={'Order No: #'+order.id} font="q_regular" size={22} />
                                              </View>
                                              <View style={styles.orderPrice}>
                                                  <FlatText text={config.CURRENCY_CODE+' '+order.total} font="q_regular" size={15}/>
                                              </View>
                                          </View>
                                          <View style={styles.viewOrderBtn}>
                                              <Feather name="eye" size={24} color="#fff" />
                                          </View>
                                      </View>
                                  </TouchableOpacity>
                              )
                          })
                      }
                  </View>
              </ScrollView>
            </View>
          );
        }else{
          return (
            <View style={styles.flex}>
              <Header />
              <View style={styles.mainContainer}>
                <FlatText text="No Order Found" font="q_regular" size={22} />
              </View>
            </View>
          )
        }
      }
    }
  }
}

const styles = StyleSheet.create({
    flex: {
        flex: 1
    },
    container: {
        flex: 1,
        paddingVertical: 20,
        paddingHorizontal: 20,
        marginBottom: 0
    },
    headerTitle: {
        marginBottom: 20
    },
    singleOrder: {
        backgroundColor: '#fff',
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    flexDirection: {
        flexDirection: 'row',
        marginBottom: 5
    },
    orderPrice: {
        marginTop: 7
    },
    viewOrderBtn: {
        backgroundColor: '#C01C27',
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 5
    },
    mainContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    }
});