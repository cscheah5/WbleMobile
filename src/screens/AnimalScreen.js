import React, { Component, useEffect }  from "react";
import {Button,View, Image} from "react-native";

const App = ({route, navigation}) => {
    useEffect(()=>{
        navigation.setOptions({
            headerTitle: route.params.title
        })
    }, []);

    const img = route.params.img;
    
    return(
        <View style={{flex:1, alignSelf:'center', justifyContent:'center'}} >
            <Image style={{ alignSelf:'center', justifyContent:'center', width: 300, height: 300}} 
                source={img} />
            <Button title="Go back" onPress={()=>navigation.goBack()}></Button>
        </View>
    )
}

export default App;