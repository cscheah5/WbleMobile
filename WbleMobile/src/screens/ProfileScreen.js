import React, { useContext } from "react";
import {Text, View, Button} from "react-native";

const ProfileScreen = ({navigation}) => {
    return(
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
            <Text style={{fontSize:50}}>
                Profile
            </Text>
        </View>
    )
}

export default ProfileScreen;