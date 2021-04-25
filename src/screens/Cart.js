import React, { Component } from 'react';
import { View,StyleSheet,Image,Dimensions,RefreshControl } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import FlatText from '../components/FlatText';
import Header from '../screens/section/Header';
import { Entypo,MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-community/async-storage';
import { ActivityIndicator } from 'react-native-paper';
import config from '../../config/config.json';
const { width } = Dimensions.get('window');

export default class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      dataCart: [],
      error: false,
      refreshing: false,
    };
  }

  onRefresh = () => {
    this.setState({ refreshing: true });
    this.componentDidMount();
  
};

  componentDidMount()
  {
    AsyncStorage.getItem('cart').then((cart)=>{
      if (cart !== null) {
        const cartfood = JSON.parse(cart)
        this.setState({dataCart:cartfood,isLoading:false,refreshing: false});
      }else{
        this.setState({isLoading:false,refreshing: false});
      }
    })
    .catch((err)=>{
      this.setState({
        isLoading: false,
        error: true
      });
    })
  }

  onChangeQual(i,type)
  {
    const dataCar = this.state.dataCart
    let cantd = dataCar[i].quantity;

    if (type) {
     cantd = cantd + 1
     dataCar[i].quantity = cantd
     this.setState({dataCart:dataCar})
     AsyncStorage.setItem('cart',JSON.stringify(dataCar));
    }
    else if (type==false&&cantd>=2){
     cantd = cantd - 1
     dataCar[i].quantity = cantd
     this.setState({dataCart:dataCar})
     AsyncStorage.setItem('cart',JSON.stringify(dataCar));
    }
    else if (type==false&&cantd==1){
     dataCar.splice(i,1)
     this.setState({dataCart:dataCar})
     AsyncStorage.setItem('cart',JSON.stringify(dataCar));
    } 
  }

  render() {

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
        return(
          <View style={styles.flex}>
            <Header />
            <View style={styles.mainContainer}>
              <FlatText text="Something Went Wrong" font="q_regular" size={22} />
            </View>
          </View>
        )
      }else{
        if(this.state.dataCart.length > 0)
        {
          return (
            <View style={styles.flex}>
              <Header/>
              <ScrollView style={ styles.scrollHeight } refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh}
                    title="Pull to refresh"
                  />
                }>
                {
                  this.state.dataCart.map((item,i) => {
                    return(
                      <View style={styles.singleCartItem} key={i}>
                        <Image style={styles.cartItemImage} source={{ uri: 'http:'+item.food.preview.content }} />
                        <View style={styles.widthSection}>
                            <FlatText text={item.food.title} font="q_semibold" size={18} />
                            <View style={styles.cartRightSection}>
                                <FlatText text={config.CURRENCY_CODE+' '+item.price*item.quantity} font="q_semibold" size={17} color="#666"/>
                                <View style={styles.qualityCart}>
                                    {item.quantity == 1 ? 
                                      <TouchableOpacity onPress={() => this.onChangeQual(i,false)}>
                                        <MaterialCommunityIcons name="delete-circle" size={28} color="#C01C27" />
                                      </TouchableOpacity>
                                      : <TouchableOpacity onPress={() => this.onChangeQual(i,false)}>
                                        <Entypo name="circle-with-minus" size={28} color="#C01C27" />
                                      </TouchableOpacity>
                                    }
                                    
                                    <FlatText text={' '+item.quantity+' ' } font="q_semibold" size={19} color="#666"/>
                                    <TouchableOpacity onPress={() => this.onChangeQual(i,true)}>
                                      <Entypo name="circle-with-plus" size={28} color="#C01C27" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                    )
                  })
                }
              </ScrollView>
              <View>
                <TouchableOpacity style={styles.bottomButton} onPress={() => this.props.navigation.navigate('Checkout')}>
                  <FlatText text="Checkout" font="q_semibold" size={20} color="#fff"/>
                </TouchableOpacity>
              </View>
            </View>
          );
        }else{
          return(
            <View style={styles.flex}>
              <Header/>
              <View style={styles.mainContainer}>
                <FlatText text="Your Cart is Empty" font="q_regular" size={22} />
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
      flex: 1,
    },
    cartItemImage: {
        width: 100,
        height: 100,
        borderRadius: 50
    },
    singleCartItem: {
        marginHorizontal: 20,
        marginVertical: 20,
        borderBottomWidth: 1,
        paddingBottom: 20,
        borderBottomColor: '#ddd',
        width: width,
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    cartRightSection:{
        flexDirection: 'row',
        marginTop: 15,
        justifyContent: 'space-between'
    },
    widthSection: {
        width: width - 140,
        paddingLeft: 10
    },
    qualityCart: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    bottomButton: {
      alignItems: 'center',
      backgroundColor: '#C01C27',
      paddingVertical: 20
    },
    mainContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    scrollHeight: {
      flex: 1
    }
});