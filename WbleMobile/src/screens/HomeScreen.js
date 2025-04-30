import React, { useContext } from "react";
import {Text, View, Button} from "react-native";

const HomeScreen = ({navigation}) => {
    return(
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
            <Text style={{fontSize:50}}>
                Home
            </Text>
        </View>
    )
}

export default HomeScreen;