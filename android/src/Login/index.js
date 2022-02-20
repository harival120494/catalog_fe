import React from "react";
import {
    NativeBaseProvider,
    View,
}
from 'native-base';
import Style from "../../styles/Style";
import FormLogin from "../../components/Login/index";

function LoginPage(){
    return(
        <NativeBaseProvider >
            <View style={Style.middleOfScreen}>
                <FormLogin/>
            </View>
        </NativeBaseProvider>
        
    )
}
export default LoginPage;