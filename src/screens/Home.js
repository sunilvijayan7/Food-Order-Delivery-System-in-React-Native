import React, { Component } from 'react';
import { View, StyleSheet, Image, ActivityIndicator,RefreshControl,ImageBackground } from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import config from '../.././config/config.json';
// import header
import Header from './section/Header';
import { ScrollView, TouchableOpacity, FlatList } from 'react-native-gesture-handler';
import FlatText from '../components/FlatText';
import { Entypo } from '@expo/vector-icons';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            latitude: '',
            longitude: '',
            city: '',
            address: '',
            city_id: null,
            Offerresturants: [],
            AllResturents: [],
            Categories: [],
            PageNo: 1,
            selectCatg: 0,
            error: false,
            refreshing: false,
            reload: 'no'
        }
    }

    onRefresh = () => {
        this.setState({ refreshing: true });
        this.componentDidMount();
    };

   
    componentDidMount() {

        this.props.navigation.addListener('focus', () => {
            AsyncStorage.getItem('location').then((location) => {
                if (location !== null) {
                    // We have data!!
                    const locationdata = JSON.parse(location)
                    this.setState({
                        latitude: locationdata.latitude,
                        longitude: locationdata.longitude,
                        city: locationdata.city,
                        address: locationdata.address,
                        city_id:locationdata.city_id,
                        refreshing: false
                    })
                }else{
                    
                }
            })
            .catch((err) => {
                
            });
    
            setTimeout(() => {
                let city_id = this.state.city_id;
    
                fetch(config.APP_URL + '/api/home/' + city_id, {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    }
                })
                    .then((response) => response.json())
                    .then((json) => {
                        this.setState({
                            Offerresturants: json.offerables.data,
                            AllResturents: [...json.all_resturants.data],
                            Categories: json.categories,
                            isLoading: false
                        })
                    })
                    .catch((error) => {
                        this.setState({
                            error: true,
                            isLoading: false
                        })
                    });  
            }, 100);
        });
       
        AsyncStorage.getItem('location').then((location) => {
            if (location !== null) {
                // We have data!!
                const locationdata = JSON.parse(location)
                this.setState({
                    latitude: locationdata.latitude,
                    longitude: locationdata.longitude,
                    city: locationdata.city,
                    address: locationdata.address,
                    city_id:locationdata.city_id,
                    refreshing: false
                })
            }else{
                
            }
        })
        .catch((err) => {
            
        });

        setTimeout(() => {
            let city_id = this.state.city_id;

            fetch(config.APP_URL + '/api/home/' + city_id, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then((response) => response.json())
                .then((json) => {
                    this.setState({
                        Offerresturants: json.offerables.data,
                        AllResturents: [...json.all_resturants.data],
                        Categories: json.categories,
                        isLoading: false
                    })
                })
                .catch((error) => {
                    this.setState({
                        error: true,
                        isLoading: false
                    })
                });  
        }, 100);

        
    }

    

    LoadResturants() {
        let page_no = this.state.PageNo;
        let city_id = this.state.city_id;
        setTimeout(() => {

            return fetch(config.APP_URL + '/api/get_resturents/' + city_id + '?page=' + page_no, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then((response) => response.json())
                .then((json) => {
                    this.setState({
                        AllResturents: [...json.all_restaurants.data],
                        isLoading: false
                    })
                })
                .catch((error) => {
                    this.setState({
                        isLoading: false
                    });
                });
        }, 1500)
    }

    LoadMore = () => {
        this.setState({
            PageNo: this.state.PageNo + 1,
        },
            () => {
                this.LoadResturants();
            }
        );
    }

    _renderItem(item) {
        return (
            <TouchableOpacity style={styles.renderItemStyle} onPress={() => this.props.navigation.navigate('Details',{ id: item.offerables.restaurants.id })}>
                <View style={styles.renderItemContent}>
                    <Image style={styles.renderItemImg} source={{ uri: item.offerables.restaurants.preview.content }} />
                    <View style={styles.renderItemBadge}>
                        <FlatText color="#fff" font="q_semibold" text={item.offerables.restaurants.coupons.count + '% OFF'} size={12} />
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    _renderCategory(item) {
        return (
            <TouchableOpacity onPress={() => this.setState({ selectCatg: item.id })} style={styles.renderCategory}>
                <View style={styles.renderBg}>
                    <ImageBackground style={styles.categoryBgImg} imageStyle={styles.categoryImageStyle} source={{ uri: item.avatar }}>
                        <View style={styles.overlay} />
                        <View style={styles.categoryNameStyle}>
                            <FlatText color="#fff" font="q_semibold" text={item.name} size={14} />
                        </View>
                    </ImageBackground>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        console.disableYellowBox = true;


        if(this.state.isLoading)
        {
            return (
                <View style={styles.flex}>
                    <Header />
                    <View style={styles.mainContainer}>
                        <ActivityIndicator size="large" color="#333"/>
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
                if(this.state.city_id == null)
                {
                    return (
                        <View style={styles.flex}>
                            <Header reload={this.state.reload} />
                            <View style={styles.mainContainer}>
                                <FlatText text="No Restaurants Found In this Area" font="q_regular" size={20} />
                            </View>
                        </View>
                    )
                }else{

                    return (
                        <View style={styles.flex} >
                            <Header reload={this.state.reload} />
                            <ScrollView refreshControl={
                                <RefreshControl
                                    refreshing={this.state.refreshing}
                                    onRefresh={this.onRefresh}
                                    title="Pull to refresh"
                                />
                                }>
                                <View style={styles.hconatiner}>
                                    <View>
                                        <FlatText text="Available Offer Right Now" size={20} color="#333" font="q_regular" />
                                        <FlatList
                                            showsHorizontalScrollIndicator={false}
                                            horizontal={true}
                                            data={this.state.Offerresturants}
                                            renderItem={({ item }) => this._renderItem(item)}
                                            keyExtractor={(item, index) => index.toString()}
                                        />
                                    </View>
                                    <View style={styles.marginBottomView}>
                                        <FlatText text="Browse By Category" color="#333" size={20} font="q_regular" />
                                        <FlatList
                                            showsHorizontalScrollIndicator={false}
                                            horizontal={true}
                                            data={this.state.Categories}
                                            renderItem={({ item }) => this._renderCategory(item)}
                                            keyExtractor={(item, index) => index.toString()}
                                        />
                                    </View>
                                    <View>
                                        <View style={styles.row}>
                                            <FlatText text="All Restaurants" size={20} font="q_regular" color="#333" />
                                            <TouchableOpacity onPress={() => this.setState({ selectCatg: 0, isLoading: false })} style={styles.paddingLeft}><FlatText text=" Reset" color="#333" size={20} font="q_regular" /></TouchableOpacity>
                                        </View>
                                        <FlatList
                                            data={this.state.AllResturents}
                                            renderItem={({ item }) => this._renderAllResturents(item)}
                                            keyExtractor={(item, index) => index.toString()}
                                            onEndReached={this.LoadMore}
                                            onEndReachedThreshold={100}
                                        />
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                    )
                }
            }
        }

    }

    _renderAllResturents(param) {
        let totalRates = param.restaurant_info.ratting.content;
        let catg = this.state.selectCatg;

        var shopCats = [];

        for (let dta of param.restaurant_info.shoptag) {
            let cat = parseInt(dta.pivot.category_id);
            shopCats.push(cat);
        }

        if (catg == 0 || shopCats.includes(catg)) {
            return (
                <TouchableOpacity style={styles.renderfeaureds} onPress={() => this.props.navigation.navigate('Details', {
                    id: param.restaurant_info.id
                })}>
                    <View>
                        <Image style={styles.imageWidth} source={{ uri: param.restaurant_info.preview.content }} />
                        <View style={styles.badge}>
                            <FlatText text={param.restaurant_info.delivery.content} color="#333" font="q_semibold" textalign="center" />
                            <FlatText text="MIN" color="#333" font="q_semibold" textalign="center" />
                        </View>

                        <View>
                            <View style={styles.productTitle}>
                                <FlatText text={param.restaurant_info.name} size={16} font="q_semibold" color="#333" />
                                <View>
                                    <View style={styles.productContentFlex}>
                                        <Entypo style={styles.paddingHorizontal5} name="star" size={15} color="#C01C27" />
                                        <FlatText text={param.restaurant_info.avg_ratting.content} size={15} font="q_semibold" />
                                        <FlatText text={'(' + totalRates + ')'} size={15} font="q_regular" />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            );
        }

    }
}


export default Home;

const styles = StyleSheet.create({
    flex: {
        flex: 1
    },
    mainContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    hconatiner: {
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        flex: 1,
        paddingVertical: 5,
    },
    dFlex: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 10
    },
    renderfeaured: {
        marginRight: 15,
        marginTop: 10,
        paddingBottom: 10
    },
    renderfeaureds: {
        marginTop: 10,
        paddingBottom: 10,
        marginBottom: 10
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        borderRadius: 100
    },
    marginBottomView: {
        marginTop: 10,
        marginBottom: 10
    },
    row: {
        flexDirection: "row",
        justifyContent: 'space-between'
    },
    paddingLeft: {
        marginBottom: 10
    },
    imageWidth: {
        width: '100%', 
        height: 200
    },
    badge: {
        position: 'absolute', 
        right: 0, 
        top: 0, 
        backgroundColor: '#fff', 
        paddingHorizontal: 15, 
        paddingVertical: 5
    },
    productTitle: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        paddingTop: 5
    },
    productContentFlex: {
        flexDirection: 'row', 
        alignItems: 'center'
    },
    paddingHorizontal5: {
        paddingHorizontal: 5
    },
    renderCategory: {
        marginRight: 15, 
        marginBottom: 15, 
        marginTop: 15
    },
    renderBg: {
        backgroundColor: '#fff', 
        borderRadius: 10
    },
    categoryBgImg: {
        width: 150, 
        height: 150,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    categoryImageStyle: {
        borderRadius: 15
    },
    categoryNameStyle: {
        backgroundColor: '#C01C27', 
        borderRadius: 5, 
        paddingHorizontal: 10, 
        paddingVertical: 6
    },
    renderItemStyle: {
        marginRight: 15, 
        marginBottom: 15, 
        marginTop: 15
    },
    renderItemContent: {
        backgroundColor: '#fff', 
        borderRadius: 10
    },
    renderItemImg: {
        width: 190, 
        height: 150, 
        borderRadius: 5
    },
    renderItemBadge: {
        position: 'absolute', 
        bottom: 15, 
        color: '#fff', 
        left: 15, 
        backgroundColor: '#C01C27', 
        borderRadius: 5, 
        paddingHorizontal: 10, 
        paddingVertical: 6
    }
});