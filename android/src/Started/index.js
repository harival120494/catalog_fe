import React from "react";
import {
    NativeBaseProvider,
    Text,
    View,
    Button, 
    Heading
}
from 'native-base';
import { useNavigation } from '@react-navigation/native';
import Style from "../../styles/Style";
import Avatar from "../../components/Started/index";
import BgStarted from '../../assets/BgStarted.svg';
import { Dimensions } from "react-native";
const {width, height} = Dimensions.get('window');

function Started(){
    const navigation = useNavigation();
    return(
        <NativeBaseProvider style={{flex:1}}>
            <View style={[Style.container, {justifyContent:'center'}]} >
                <View style={{alignItems:'center'}} mb={10}>
                    <Heading size="lg">C A T A L O G</Heading>
                </View>
                <View mb={5}>
                    <Button onPress={() => navigation.navigate('LoginPage')} colorScheme="primary" size={'lg'}>MASUK</Button>
                </View>
                <View style={{alignItems:'center'}} mb={5}>
                    <Text>Belum punya akun ?</Text>
                </View>
                <View>
                    <Button colorScheme="gray" size={'lg'} variant="outline" >DAFTAR</Button>
                </View>
            </View>
        </NativeBaseProvider>
        
    )
}
export default Started;