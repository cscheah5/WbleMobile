import React, { useContext } from "react";
import {Text, View, Button} from "react-native";

import { AuthContext } from "@/contexts/AuthContext";

const ProfileScreen = ({navigation}) => {
    const {logout} = useContext(AuthContext);

    return(
        <View>
            <Text>This is the profile page</Text>
            <Button title="Log out" onPress={() => logout()} />
        </View>
    )
}

export default ProfileScreen;