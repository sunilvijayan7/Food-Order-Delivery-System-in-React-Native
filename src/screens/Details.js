import React, { Component } from 'react';
import { View, StyleSheet, ImageBackground, Dimensions, Image, YellowBox, Share, RefreshControl, ActivityIndicator } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { FlatList, ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import FlatText from '../components/FlatText';
import { Entypo, Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-community/async-storage';

import config from '../../config/config.json';
import Header from './section/Header';

const { width } = Dimensions.get('window');

class Details extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            dataFood: [],
            name: "",
            delivery_time: 0,
            ratting: 0,
            reviews: [],
            avg_ratting: 0,
            preview: "",
            dataCart: [],
            latitude: 0,
            longitude: 0,
            menus: [],
            selectMenu: 0,
            id: null,
            shopday: [],
            about: [],
            slug: "",
            error: false,
            refreshing: false,
        }
    }

    onRefresh = () => {
        this.setState({ refreshing: true });
        this.componentDidMount();

    };

    componentDidMount() {
        AsyncStorage.getItem('cart').then((cart) => {
            if (cart !== null) {
                // We have data!!
                const cartfood = JSON.parse(cart)
                this.setState({ dataCart: cartfood })
            }
        })
            .catch((err) => {
                this.setState({
                    isLoading: false,
                    error: true
                })
            })

        const { id } = this.props.route.params;
        return fetch(config.APP_URL + '/api/restaurant/'+id+'', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then((response) => response.json())
            .then((json) => {
                this.setState({
                    name: json.info.info.name,
                    slug: json.info.info.slug,
                    id: json.info.info.id,
                    delivery_time: json.info.info.delivery,
                    ratting: json.info.info.reviews.length,
                    avg_ratting: json.info.info.avg_ratting,
                    preview: json.info.info.preview,
                    dataFood: json.products,
                    latitude: parseFloat(json.info.info.location.latitude),
                    longitude: parseFloat(json.info.info.location.longitude),
                    menus: json.menus,
                    reviews: json.info.info.reviews,
                    shopday: json.info.info.shopday,
                    about: json.info.info.about,
                    isLoading: false,
                    refreshing: false,
                })

                let dta = {
                    "name": "Reset",
                    "id": 0,
                }

                let menu = this.state.menus;
                if (menu.length > 0) {
                    menu.push(dta);
                }



            })
            .catch((error) => {
                this.setState({
                    isLoading: false,
                    error: true
                })
            });
    }

    onLoadTotal() {
        var total = 0;
        const cart = this.state.dataCart;

        for (var i = 0; i < cart.length; i++) {
            total = total + (cart[i].price * cart[i].quantity)
        }
        return total;
    }

    onloadQty() {
        var qty = 0;
        const cart = this.state.dataCart;

        for (var i = 0; i < cart.length; i++) {
            qty = qty + cart[i].quantity;
        }

        return qty;
    }


    render() {

        YellowBox.ignoreWarnings([
            'VirtualizedLists should never be nested', // TODO: Remove when fixed
        ]);

        const onShare = async () => {
            try {
                const result = await Share.share({
                    message:
                        '' + config.APP_URL + '/store/' + this.state.slug + '',
                });
                if (result.action === Share.sharedAction) {
                    if (result.activityType) {
                        // shared with activity type of result.activityType
                    } else {
                        // shared
                    }
                } else if (result.action === Share.dismissedAction) {
                    // dismissed
                }
            } catch (error) {
                this.setState({
                    isLoading: false,
                    error: true
                })
            }
        };

        if (this.state.isLoading) {
            return (
                <View style={styles.flex}>
                    <Header />
                    <View style={styles.mainContainer}>
                        <ActivityIndicator size="large" color="#333" />
                    </View>
                </View>
            )
        } else {
            if (this.state.error) {
                return (
                    <View style={styles.flex}>
                        <Header />
                        <View style={styles.mainContainer}>
                            <FlatText text="Something Went Wrong" font="q_regular" size={22} />
                        </View>
                    </View>
                )
            } else {
                return (
                    <View style={styles.flex}>
                        <ImageBackground style={styles.backgroundImage} source={{ uri: this.state.preview }}>
                            <View style={styles.overlay} />
                            <View style={styles.detailsImageContent}>
                                <View>
                                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                                        <AntDesign style={styles.backBtn} name="arrowleft" size={24} color="#C01C27" />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.flexRow}>
                                    <TouchableOpacity onPress={onShare}>
                                        <AntDesign style={styles.shareBtn} name="sharealt" size={24} color="#C01C27" />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Info',
                                        {
                                            preview: this.state.preview,
                                            name: this.state.name,
                                            about: this.state.about,
                                            shopday: this.state.shopday,
                                            reviews: this.state.reviews,
                                            latitude: this.state.latitude,
                                            longitude: this.state.longitude,
                                            ratting: this.state.ratting,
                                            avg: this.state.avg_ratting
                                        }
                                    )}>
                                        <AntDesign style={styles.infoBtn} name="info" size={24} color="#C01C27" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.bgImageInfoArea}>
                                <FlatText text={this.state.name} size={22} font="q_semibold" color="#fff" />
                                <View style={styles.deliveryTime}>
                                    <FlatText text={'Delivery ' + this.state.delivery_time + ' min'} font="q_semibold" color="#fff" size={16} />
                                </View>
                                <View style={styles.marginTop}>
                                    <View style={styles.reviewContent}>
                                        <Entypo style={styles.marginRight} name="star" size={18} color="#fff" />
                                        <FlatText text={this.state.avg_ratting} font="q_semibold" size={18} color="#fff" />
                                        <FlatText text={'(' + this.state.ratting + ')'} font="q_semibold" size={18} color="#fff" />
                                    </View>
                                </View>
                            </View>
                        </ImageBackground>
                        { this.state.dataFood.length > 0 ?
                            <View style={styles.flex}>
                                <View style={styles.height70}>
                                    <FlatList
                                        style={styles.renderMenuItem}
                                        horizontal={true}
                                        showsHorizontalScrollIndicator={false}
                                        data={this.state.menus}
                                        renderItem={({ item }) => this._renderMenuItem(item)}
                                        keyExtractor={(item, index) => index.toString()}

                                    />
                                </View>

                                <ScrollView refreshControl={
                                    <RefreshControl
                                        refreshing={this.state.refreshing}
                                        onRefresh={this.onRefresh}
                                        title="Pull to refresh"
                                    />
                                }>
                                    <View style={styles.foodList}>
                                        <FlatList
                                            data={this.state.dataFood}
                                            numColumns={2}
                                            renderItem={({ item }) => this._renderItemFood(item)}
                                            keyExtractor={(item, index) => index.toString()}
                                        />
                                    </View>
                                </ScrollView>

                                <TouchableOpacity onPress={() => this.props.navigation.navigate('Cart')}>
                                    <View style={styles.cartBar}>
                                        <View style={styles.leftCartBar}>
                                            <FlatText text={this.onloadQty() + ' Items'} font="q_semibold" color="#fff" size={17} />
                                            <FlatText text=" | " font="q_semibold" color="#fff" size={17} />
                                            <FlatText text={config.CURRENCY_SYMBOL + this.onLoadTotal()} font="q_semibold" color="#fff" size={17} />

                                        </View>
                                        <View style={styles.rightCarBar}>
                                            <FlatText text="View Cart" font="q_semibold" color="#fff" size={17} />
                                            <View style={styles.carBarIcon}>
                                                <Feather name="shopping-cart" size={20} color="#fff" />
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            :
                            <View style={styles.mainContainer}>
                                <FlatText text="No Product Found" size={22} font="q_regular" />
                            </View>
                        }
                    </View>
                )
            }
        }
    }
    _renderItemFood(item) {
        let catg = this.state.selectMenu;

        var productMenu = [];

        for (let row of item.postcategory) {
            let cat = parseInt(row.category_id);
            productMenu.push(cat);
        }

        if (catg == 0 || productMenu.includes(catg)) {


            return (
                <View style={styles.singleFood}>
                    <TouchableOpacity onPress={() => this.onClickAddCart(item)}>
                        <View>
                            <Image style={styles.foodImage} source={{ uri: 'http:' + item.preview.content }} />
                            <View style={styles.foodTitle}>
                                <FlatText text={item.title} font="q_bold" size={16} color="#2A2B44" />
                            </View>
                            <View style={styles.foodPrice}>
                                <View>
                                    <FlatText font="q_semibold" size={16} color="#333" text={config.CURRENCY_CODE+' '+item.price.price} />
                                </View>
                                <View>
                                    <Entypo name="squared-plus" size={30} color="#ff3252" />
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            );
        }
    }

    _renderMenuItem(item) {
        return (
            <TouchableOpacity onPress={() => this.setState({ selectMenu: item.id })}>
                <View style={styles.menuItem}>
                    <View style={styles.menuTitle}>
                        <FlatText text={item.name} font="q_bold" size={16} color="#2A2B44" />
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    onClickAddCart(data) {

        const itemcart = {
            food: data,
            quantity: 1,
            price: data.price.price
        }

        const storedata = {
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            name: this.state.name,
            id: this.state.id
        }

        AsyncStorage.getItem('store').then(() => {
            AsyncStorage.setItem('store', JSON.stringify(storedata));
        })
            .catch((err) => {
                alert(err)
            })

        AsyncStorage.getItem('cart').then((datacart) => {
            if (datacart !== null) {
                // We have data!!
                const cart = JSON.parse(datacart)
                cart.push(itemcart)
                AsyncStorage.setItem('cart', JSON.stringify(cart));
                this.setState({ dataCart: cart });
            }
            else {
                const cart = []
                cart.push(itemcart)
                AsyncStorage.setItem('cart', JSON.stringify(cart));
                this.setState({ dataCart: cart });
            }
        })
            .catch((err) => {
                alert(err)
            })
    }

}

export default Details;

const styles = StyleSheet.create({
    flex: {
        flex: 1
    },
    backgroundImage: {
        width: width,
        height: 300
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    foodList: {
        paddingVertical: 20,
        paddingHorizontal: 20,
        flex: 1
    },
    singleFood: {
        width: ((width / 2) - 20) - 10,
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        marginRight: 20,
        marginBottom: 20
    },

    menuItem: {
        width: ((width / 2) - 20) - 10,
        marginTop: 20,
        backgroundColor: '#fff',
        marginBottom: 20,
        paddingVertical: 25,
        marginRight: 20,
        borderRadius: 10,
    },

    foodImage: {
        width: '100%',
        height: 150,
        borderRadius: 5
    },
    foodTitle: {
        marginTop: 5,
        marginBottom: 5
    },

    menuTitle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    foodPrice: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    cartBar: {
        backgroundColor: '#ff3252',
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 20
    },
    leftCartBar: {
        flexDirection: 'row'
    },
    rightCarBar: {
        flexDirection: 'row'
    },
    carBarIcon: {
        marginTop: 5,
        marginLeft: 5
    },
    mainContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    detailsImageContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 50,
        paddingHorizontal: 15
    },
    backBtn: {
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 30
    },
    shareBtn: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 50,
        marginRight: 10
    },
    infoBtn: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 50
    },
    bgImageInfoArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    deliveryTime: {
        borderWidth: 1,
        borderColor: '#fff',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        marginTop: 10
    },
    marginTop: {
        marginTop: 10
    },
    reviewContent: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    marginRight: {
        marginRight: 5
    },
    renderMenuItem: {
        marginHorizontal: 20
    },
    height70: {
        height: 75
    },
    flexRow: {
        flexDirection: 'row'
    }
});
