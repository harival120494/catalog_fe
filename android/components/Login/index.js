import React, { useState, useEffect } from "react";
import {
    Stack,
    Input,
    View,
    Text,
    Button,
    Heading,
    Modal
}
from 'native-base';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {SERVER_HOST} from '../../constant/Environment';
import axios from "axios";
import Style from "../../styles/Style";
import AsyncStorage from "@react-native-async-storage/async-storage";
const FormLogin = () => {
    const [count, setCount] = useState(null)
    const [dataUser, setDataUser] = useState({})
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [response, setResponse] = useState(null)
    const navigation = useNavigation();

   
    useEffect(() => {
        const asyncFunctionData = async () => {
          try {
            const storageData = await AsyncStorage.getItem('data_login')
            setDataUser(JSON.parse(storageData));
            if(storageData !== null){navigation.navigate('MainLayoutPage')}
          } catch (e) {}
        }
        asyncFunctionData();
        setCount(100);
       }, [count]);

    /**
     * Function handler section
     */
    const login = async () => {
        setLoading(true);
        const formData = {
            email : email,
            password : password
        }
        axios.post(`${SERVER_HOST}/api/user/login`, formData)
            .then(async (response) => {
                setLoading(false);
                if(response.data.data.message){
                    setResponse(response.data.data.message)
                    setShowModal(true)
                }
                else{
                    const data_login = JSON.stringify(response.data.data)
                    await AsyncStorage.setItem('data_login', data_login)
                    navigation.navigate('MainLayoutPage')
                }
            })
    }

    /**
     * Component Section
     */

    const ModalResponse = () => {
        return (
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
                <Modal.Content maxWidth="350">
                    <Modal.CloseButton />
                    <Modal.Header style={{flexDirection:'row'}}><Icon name="md-information-circle-sharp" size={15} color={'#289AAD'} style={{marginRight:5}}/>Perhatian!</Modal.Header>
                    <Modal.Body>
                        <Text fontSize={16}>{response}</Text>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button flex="1" onPress={() => {setShowModal(false);}}>Close</Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        )
    }

    return (
        <Stack w="100%" style={[Style.container, {justifyContent:'center'}]}>
            <View mb={10}>
                <Heading size="lg">MASUK</Heading>
            </View>
            <View mb={5}>
                <Text mb={2}>E-mail</Text>
                <Input  InputLeftElement={<Icon name="ios-person-outline" size={20} color={'#289AAD'} style={{marginLeft:5}}/>}
                        fontSize={16}
                        placeholder="E-mail"
                        onChangeText={(text) => setEmail(text)} />
            </View>

            <View mb={5}>
                <Text mb={2}>Password</Text>
                <Input  type="password"
                        InputLeftElement={<Icon name="ios-lock-closed-outline" size={20} color={'#289AAD'} style={{marginLeft:5}}/>}
                        fontSize={16}
                        placeholder="Password"
                        onChangeText={(text) => setPassword(text)} />
            </View>
            <View>
                {
                    loading ? (
                        <Button
                            isLoading _loading={{
                                bg: "grey",
                                _text: {
                                color: "white"
                                }
                            }} _spinner={{
                                color: "#179BB1"
                            }}
                            isLoadingText="Tunggu.."
                            leftIcon={<Icon name="ios-finger-print" size={25} />} >MASUK</Button>
                    ):(
                        <Button
                            colorScheme={'primary'}
                            leftIcon={<Icon name="ios-finger-print" size={25} color={'white'}/>} 
                            onPress={() => login()}>MASUK</Button>
                    )
                }
            </View>

            {/**
             * Response Modal
             */}
             <ModalResponse/>
        </Stack>
    )
}
  

export default FormLogin;