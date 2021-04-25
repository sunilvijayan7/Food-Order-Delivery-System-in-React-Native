import React, { Component } from 'react';
import { View,StyleSheet,ActivityIndicator,RefreshControl } from 'react-native';
import FlatText from '../components/FlatText';
import Header from './section/Header';
import MapView from 'react-native-maps';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import config from '../../config/config.json';

export default class Orderview extends Component {
  constructor(props) {
    super(props);
    this.state = {
        isLoading: true,
        authorization_key: null,
        id: "",
        status: "",
        delivery_status: "",
        total: 0,
        order_amount:0,
        delivery_fee: 0,
        vendor_name: "",
        vendor_phone: "",
        vendor_address: "",
        rider_name: "",
        rider_phone: "",
        OrderItems:[],
        resturentName:"",
        resturentPhone:"",
        resturentAddress:"",
        lat:null,
        long:null,
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
      })
    })

    const {id} = this.props.route.params;

    setTimeout(() => {
      return fetch(config.APP_URL+'/api/customer/order/'+id+'', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: this.state.authorization_key
        }
      })
        .then((response) => response.json())
        .then((json) => {
          let int_status =parseInt(json.status);
          if (int_status==2) {
            var status="Pending";
            this.setState({
              status: status,
            });
          }
          else if(int_status==3){
            var status="Accepted";
            this.setState({
              status: status,
            });
          }
          else if(int_status==1){
            var status="Complete";
            this.setState({
              status: status,
            });
          }
          else{
            var status="Canceled";
            this.setState({
              status: status,
            });
          }

          let total = parseFloat(json.total);
          let shipping = parseFloat(json.shipping);
          let info=JSON.parse(json.vendorinfo.info.content);
          if (json.riderinfo != null) {
            let rider_parse=JSON.parse(json.riderinfo.info.content);
          
            this.setState({
              rider_name:json.riderinfo.name,
              rider_phone:rider_parse.phone1,
            });
          }

          if (json.liveorder != null) {
            this.setState({
              lat:json.liveorder.latitute,
              long:json.liveorder.longlatitute
            });
          }
          else{
            this.setState({
              lat:json.vendorinfo.location.latitude,
              long:json.vendorinfo.location.longitude
            });
          }

          this.setState({
            id: json.id,
            total: total,
            OrderItems:json.orderlist,
            delivery_fee:shipping,
            order_amount: total-shipping,
            resturentName:json.vendorinfo.name,
            resturentPhone:info.phone1,
            resturentAddress:info.full_address,
            isLoading: false,
            refreshing: false
          });
        })
        .catch((error) => {
          this.setState({
            isLoading: false,
            error: true,
            refreshing: false
          })
        });
    },100);
  }


  NumberFormat(number, decPlaces, decSep, thouSep) {
    decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces,
    decSep = typeof decSep === "undefined" ? "." : decSep;
    thouSep = typeof thouSep === "undefined" ? "," : thouSep;
    var sign = number < 0 ? "-" : "";
    var i = String(parseInt(number = Math.abs(Number(number) || 0).toFixed(decPlaces)));
    var j = (j = i.length) > 3 ? j % 3 : 0;
    
    return sign +
      (j ? i.substr(0, j) + thouSep : "") +
      i.substr(j).replace(/(\decSep{3})(?=\decSep)/g, "$1" + thouSep) +
      (decPlaces ? decSep + Math.abs(number - i).toFixed(decPlaces).slice(2) : "");
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
            <ScrollView refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
            title="Pull to refresh"
          />
        }>
                <View style={styles.orderContainer}>
                    <View style={styles.card}>
                        <View style={styles.title}>
                            <FlatText text="Order" font="q_regular" size={23} />
                        </View>
                        <View style={styles.marginBottom}>
                            <FlatText text={'Order Number: #'+this.state.id} font="q_regular" size={16} />
                        </View>
                        <View style={styles.marginBottom}>
                            <FlatText text={"Order Status: "+this.state.status} font="q_regular" size={16} />
                        </View>
                        <View>
                            <FlatText text={'Order Amount: '+this.NumberFormat(this.state.order_amount)} font="q_regular" size={16} />
                        </View>
                        <View>
                            <FlatText text={'Delivery Fee: '+this.NumberFormat(this.state.delivery_fee)} font="q_regular" size={16} />
                        </View>
                        <View>
                            <FlatText text={'Total Amount: '+this.NumberFormat(this.state.total)} font="q_regular" size={16} />
                        </View>
                    </View>
                    <View style={styles.card}>
                        <View style={styles.title}>
                            <FlatText text="Order Items" font="q_regular" size={20} />
                        </View>
                        <View style={styles.marginBottom}>
                            <FlatList  data={this.state.OrderItems}
                                    renderItem={({ item }) => this._renderOrderItem(item)}
                                    keyExtractor = { (item,index) => index.toString() } />
                            
                        </View>
                        
                    </View>
    
    
                    <View style={styles.card}>
                        <View style={styles.title}>
                            <FlatText text="Restaurant Information" font="q_regular" size={20} />
                        </View>
                        <View style={styles.marginBottom}>
                            <FlatText text={"Name: "+this.state.resturentName} font="q_regular" size={16} />
                        </View>
                        <View style={styles.marginBottom}>
                            <FlatText text={"Phone: "+this.state.resturentPhone} font="q_regular" size={16} />
                        </View>
                        <View style={styles.marginBottom}>
                            <FlatText text={"Address:"+this.state.resturentAddress} font="q_regular" size={16} />
                        </View>
                    </View>

                    {(() => {
                  if (this.state.rider_name !== ''){
                  
                      return (
                    <View style={styles.card}>
                        <View style={styles.title}>
                            <FlatText text="Rider Information" font="q_regular" size={20} />
                        </View>
                        <View style={styles.marginBottom}>
                            <FlatText text={"Name: "+this.state.rider_name} font="q_regular" size={16} />
                        </View>
                        <View>
                            <FlatText text={"Phone: "+this.state.rider_phone} font="q_regular" size={16} />
                        </View>
                    </View>
                    )
                  }
                  
                  return null;
                })()}
    
                    {(() => {
                  if (this.state.lat !== null){
                    let lat = parseFloat(this.state.lat);
                    let long = parseFloat(this.state.long); 
                      return (
                        <View style={styles.card}>
                        <View style={styles.title}>
                            <FlatText text="Order Tracking" font="q_regular" size={20} />
                        </View>
                    
                          <MapView
                          style={styles.mapHeight}
                          loadingEnabled={true}
                          initialRegion={{
                          latitude: lat,
                          longitude: long,
                        latitudeDelta: 0.015*1,
                          longitudeDelta: 0.0121*1,
                          }}
                      >
                          <MapView.Marker
                            coordinate={{
                              latitude: lat,
                              longitude: long,
                            }} />
                      </MapView> 
                      
                    </View>
                      )
                  }
                  
                  return null;
                })()}
    
    
                    
                    
                </View>
            </ScrollView>
          </View>
        );
      }
    }
   
  }


  _renderOrderItem(param){
    return (
      
      <FlatText text={param.products.title +" x"+param.qty+" ("+param.total+")"} font="q_regular" size={16} />
  
    );
  }

 

}




const styles = StyleSheet.create({
    flex: {
        flex: 1
    },
    card: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
        marginVertical: 20,
        borderRadius: 5,
        paddingHorizontal: 20,
        paddingVertical: 20,
        marginBottom: 20
    },
    title: {
        marginBottom: 15
    },
    marginBottom: {
        marginBottom: 10
    },
    mapHeight: {
        height: 350,
        borderRadius: 5
    },
    orderContainer: {
        marginBottom: 20
    },
    mainContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    }
});