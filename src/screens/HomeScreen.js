import React, { Component }  from "react";
import {Button, View} from "react-native";

const HomeScreen = ({navigation}) => {
    return(
        <View>
            <View style={{ margin:10 }}>
                <Button title="Chicken" onPress={()=>{navigation.navigate('Animal', {
                    title: 'Chicken',
                    img: require('@/assets/images/chicken.jpg'),
                })}} />
            </View>
            <View style={{ margin:10 }}>
                <Button title="Koala" onPress={()=>{navigation.navigate('Animal', {
                    title: 'Koala',
                    img: require('@/assets/images/koala.jpg'),
                })}} />
            </View>
        </View>
    )
}

export default HomeScreen;