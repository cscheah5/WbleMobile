import React, { useContext } from "react";
import {Text, View, Button} from "react-native";

import { AuthContext } from "@/contexts/AuthContext";

const HomeScreen = ({navigation}) => {
    const {logout} = useContext(AuthContext);

    return(
        <View>
            <Text>This is the home page</Text>
            <Button title="Log out" onPress={() => logout()} />
        </View>
    )
}

export default HomeScreen;