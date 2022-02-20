import React from "react";
import {
    NativeBaseProvider, View, Heading
}
from 'native-base';
import Style from "../../styles/Style";
import MainLayout from "../../components/MainLayout/index";

function MainLayoutPage(){
    return(
        <NativeBaseProvider>
            <MainLayout/>
        </NativeBaseProvider>
    )
}
export default MainLayoutPage;