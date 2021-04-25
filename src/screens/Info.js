import React, { Component } from 'react';
import { View, ImageBackground, StyleSheet, Dimensions } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { FlatList, ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import FlatText from '../components/FlatText';
import { Entypo, EvilIcons } from '@expo/vector-icons';
import MapView from 'react-native-maps';

const { width } = Dimensions.get('window');

export default class Info extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };
    }

    render() {

        const { preview, name, about, shopday, reviews, latitude, longitude, ratting, avg } = this.props.route.params;


        return (
            <View style={styles.flex}>
                <ImageBackground style={styles.backgroundImage} source={{ uri: preview }}>
                    <View style={styles.overlay} />
                    <View style={styles.InfoImgBgConTent}>
                        <View>
                            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                                <AntDesign style={styles.backBtn} name="arrowleft" size={24} color="#C01C27" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </ImageBackground>
                <View style={styles.infoTitle}>
                    <FlatText text={name} size={17} font="q_semibold" color="#333" />
                    <View style={styles.infoFlex}>
                        <Entypo style={styles.marginRight5} name="star" size={17} color="#333" />
                        <FlatText text={avg} font="q_semibold" size={17} color="#333" />
                        <FlatText text={'(' + reviews.length + ')'} font="q_semibold" size={17} color="#333" />
                    </View>
                </View>
                <ScrollView>
                    <View style={styles.infoArea}>
                        <View style={styles.flexContainer}>
                            <FlatText text={about.description} font="q_regular" size={15} />
                        </View>
                        <View style={styles.flexContainer1}>
                            <EvilIcons style={styles.locationIcon} name="location" size={24} color="#333" />
                            <FlatText text={about.full_address} style={styles.marginTop5} font="q_regular" size={15} />
                        </View>
                        <View style={styles.flexContainer}>
                            <EvilIcons style={styles.locationIcon} name="envelope" size={24} color="#333" />
                            <FlatText text={" " + about.email1} style={styles.locationIcon1} font="q_regular" size={15} />
                        </View>
                        <View style={styles.flexContainer}>
                            <EvilIcons style={styles.locationIcon} name="envelope" size={24} color="#333" />
                            <FlatText text={" " + about.email2} style={styles.locationIcon1} font="q_regular" size={15} />
                        </View>
                        <View style={styles.flexContainer}>
                            <AntDesign name="phone" size={20} color="#333" style={styles.locationIcon} />
                            <FlatText text={" " + about.phone1} style={styles.locationIcon1} font="q_regular" size={15} />
                        </View>
                        <View style={styles.flexContainer}>
                            <AntDesign name="phone" size={20} color="#333" style={styles.locationIcon} />
                            <FlatText text={" " + about.phone2} style={styles.locationIcon1} font="q_regular" size={15} />
                        </View>
                        <View style={styles.flexContainer}>
                            <EvilIcons style={styles.locationIcon} name="clock" size={24} color="black" />
                            <FlatText text={"Opening Time"} font="q_regular" size={15} />
                        </View>
                        <View style={styles.flexContainer}>
                            <FlatList data={shopday}
                                renderItem={({ item }) => this._renderTime(item)}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </View>
                    </View>
                    <View style={styles.mapArea}>
                        <MapView
                            style={styles.mapHeight}
                            initialRegion={{
                                latitude: latitude,
                                longitude: longitude,
                                latitudeDelta: 0.015 * 5,
                                longitudeDelta: 0.0121 * 5,
                            }}
                        >
                        <MapView.Marker
                            coordinate={{
                                latitude: latitude,
                                longitude: longitude,
                            }}
                            title={name}
                        />
                        </MapView>
                    </View>
                </ScrollView>
            </View>
        );
    }

    _renderTime(item) {
        if (item.status == "1") {
            return (
                <View style={styles.marginBottom}>
                    <FlatText text={item.day + ": " + item.opening + "-" + item.close} font="q_regular" size={16} />
                </View>
            );
        }


    }
}



const styles = StyleSheet.create({
    flex: {
        flex: 1
    },
    backgroundImage: {
        width: width,
        height: 250
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    infoArea: {
        paddingVertical: 20,
        paddingHorizontal: 20
    },
    flexContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20

    },
    flexContainer1: {
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 20
    },
    locationIcon: {
        marginTop: 5,
        paddingTop: 5,
        textAlign: "justify",
        marginRight: 5

    },

    locationIcon1: {
        marginHorizontal: 20

    },

    marginTop: {
        marginTop: 20
    },
    mapHeight: {
        height: 250
    },
    mainContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    mapArea: {
        paddingVertical: 20
    },
    marginBottom: {
        marginBottom: 20
    },
    InfoImgBgConTent: {
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
    infoTitle: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingHorizontal: 20, 
        paddingVertical: 20, 
        borderBottomWidth: 1, 
        borderBottomColor: '#ddd'
    },
    infoFlex: {
        flexDirection: 'row', 
        alignItems: 'center'
    },
    marginRight5: {
        marginRight: 5
    },
    marginTop5: {
        marginTop: 5
    }
})