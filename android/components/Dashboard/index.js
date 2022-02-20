import React, { useEffect, useState } from "react";
import {
    NativeBaseProvider,
    Input,
    View,
    Text,
    Button,
    Heading,
    Modal,
    HStack,
    Center,
    ScrollView,
    Image,
    Badge
}
from 'native-base';
import {SERVER_HOST} from '../../constant/Environment';
import Icon from 'react-native-vector-icons/Feather';
import Style from "../../styles/Style";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

function Dashboard(){
    const [dataUser, setDataUser] = useState({})
    const [dataProfile, setDataProfile] = useState({})
    const [products, setProducts] = useState([])
    useEffect(() => {
        dataUserLogin()
    },[])

    const dataUserLogin = async () => {
        const data = JSON.parse(await AsyncStorage.getItem('data_login'))
        setDataUser(data)
        getDataProfile(data.id, data.token)
    }

    const getDataProfile = (id, token) => {
        const header = { headers: {"Authorization" : `Bearer ${token}`} }
        axios.get(`${SERVER_HOST}/api/user/${id}`, header)
        .then(async(result) => {
            setDataProfile(result.data.data)
            getDataProduct(token)
            await AsyncStorage.setItem('data_profile', JSON.stringify(result.data.data))
        })
    }

    const getDataProduct = (token) => {
        const header = { headers: {"Authorization" : `Bearer ${token}`} }
        axios.get(`${SERVER_HOST}/api/product/`, header)
        .then(async(result) => {
            setProducts(result.data.data)
        })
    }

    return (
        <NativeBaseProvider>
            <View style={{backgroundColor:'white', flex:1}}>
                <HStack space={3} bg="primary.500" pt={6} pb={6} pl={3} borderBottomRightRadius={'25'} borderBottomLeftRadius={'25'}>
                    <View w={20} h={20}  borderRadius={'full'}>
                        <Center>
                            <Image source={{uri: dataProfile.foto ? `${SERVER_HOST}/${dataProfile.foto}` : '' }} borderRadius={'full'} alt={`${SERVER_HOST}/${dataProfile.foto}`} size="md" />
                        </Center>
                    </View>
                    <View style={{justifyContent:'center'}} pl={3}>
                        <HStack><Text color={'white'} fontWeight={'bold'} fontFamily={"Poppins-Medium"}>Halo,</Text></HStack>
                        <HStack><Text color={'white'} fontSize={16}>{dataProfile.name ? dataProfile.name : ''}</Text></HStack>
                    </View>
                </HStack>
                <ScrollView style={[Style.container, {backgroundColor:'white'}]}>
                    <View mb={5}>
                        <Input  InputRightElement={<Icon name="search" size={20} color={'#289AAD'} style={{marginRight:10}}/>}
                                fontSize={16}
                                variant="rounded"
                                backgroundColor={'#F9F9F9'}
                                borderColor={'white'}
                                color={'#289AAD'}
                                placeholder="Cari product.."/>
                    </View>
                    <View mb={5}>
                        <Text fontWeight={'bold'} color={'#AFAFAF'} fontFamily={"Poppins-Medium"} fontSize={20}>Pilihan Product</Text>
                    </View>
                    {
                        products.length > 0 ? (
                            products.map((v, k) => {
                                return(
                                    <View mb={5} style={Style.boxShadow} key={`prouct_${k}`}>
                                        <HStack space={3} bg={'white'} pt={3} pb={3} pl={3} borderRadius={20}>
                                            <View w={20} h={20}  borderRadius={'md'}>
                                                <Image source={{uri: `${SERVER_HOST}/${v.foto}`}} alt={`${SERVER_HOST}/${v.foto}`} size="sm" />
                                            </View>
                                            <View style={{justifyContent:'center'}} pl={3}>
                                                <HStack><Text fontWeight={'bold'} fontSize={20} color={'#289AAD'}>{v.nama_product}</Text></HStack>
                                                <HStack>
                                                    <Text fontWeight={'bold'} fontSize={25} style={{color:'rgba(0,0,0, .30)'}}>Rp.{v.harga}</Text>
                                                </HStack>
                                            </View>
                                            <Button colorScheme="primary" p={1} borderRadius={'full'}
                                                style={[Style.boxShadow, {position:'absolute', right:10, bottom:-15}]}>
                                                <Icon name="info"  size={30}/>
                                            </Button>
                                        </HStack>
                                    </View>
                                )
                            })
                        ):(
                            <View><Text>Loading..</Text></View>
                        )
                    }
                </ScrollView>
            </View>
        </NativeBaseProvider>
    );
}
export default Dashboard;