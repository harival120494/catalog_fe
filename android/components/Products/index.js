import React, { useEffect, useRef, useState } from "react";
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
    TextArea
}
from 'native-base';
import { useNavigation } from '@react-navigation/native';
import {SERVER_HOST} from '../../constant/Environment';
import Icon from 'react-native-vector-icons/Feather';
import Style from "../../styles/Style";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import OptionsMenu from "react-native-options-menu";

const Products = (props) => {
    const [loading, setLoading] = useState(false)
    const [mount, setMount] = useState(false)
    const [dataUser, setDataUser] = useState({})
    const [dataProfile, setDataProfile] = useState({})
    const [products, setProducts] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [showModalDelete, setShowModalDelete] = useState(false)
    const [detailProduct, setDetailProduct] = useState({})
    const [selectedProduct, setSelectedProduct] = useState(null)
    const options = ["Detail", "Edit", "Hapus"]
    const navigation = useNavigation();
    useEffect(() => {
        const asyncFunctionData = async () => {
            try {
                const storageData = JSON.parse(await AsyncStorage.getItem('data_login'))
                setDataUser(storageData)
                getDataProfile(storageData.id, storageData.token)
                setMount(true)
                const unsubscribe = navigation.addListener('focus', () => {
                    getDataProduct(storageData.token)
                });
                return unsubscribe;
            } catch (e) {}
        }
        asyncFunctionData();    
    },[])

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
    
    const detailProductHandler = (data) => {
        setDetailProduct(data)
        setShowModal(true)
    }

    const deleteProduct = (data) => {
        setShowModalDelete(true)
        setSelectedProduct(data.id)
    }

    const deleteHandler = () => {
        setLoading(true)
        const header = { headers: {"Authorization" : `Bearer ${dataUser.token}`} }
        axios.delete(`${SERVER_HOST}/api/product/${selectedProduct}`, header)
        .then(async(result) => {
            setLoading(false)
            setShowModalDelete(false)
            getDataProduct(dataUser.token)
        })
    }

    /**
     * Component Section
     */

    const ModalResponse = (data) => {
        return (
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="xl">
                <Modal.Content maxWidth="350">
                    <Modal.CloseButton />
                    <Modal.Header style={{flexDirection:'row'}}><Icon name="info" size={15} color={'#289AAD'} style={{marginRight:5}}/>{detailProduct.nama_product}</Modal.Header>
                    <Modal.Body>
                        <View mb={5} style={Style.boxShadow}>
                            <HStack space={3} bg={'white'} pt={3} pb={3} pl={3} borderRadius={20}>
                                <View w={20} h={20}  borderRadius={'md'}>
                                    <Image source={{uri: `${SERVER_HOST}/${detailProduct.foto}`}} alt={`${SERVER_HOST}/${detailProduct.foto}`} size="sm" />
                                </View>
                                <View style={{justifyContent:'center'}} pl={3}>
                                    <HStack><Text fontWeight={'bold'} fontSize={20} color={'#289AAD'}>{detailProduct.nama_product}</Text></HStack>
                                    <HStack><Text fontWeight={'bold'} fontSize={12} color={'rgba(0,0,0, .30)'}>{detailProduct.sku}</Text></HStack>
                                    <HStack>
                                        <Text fontWeight={'bold'} fontSize={25} style={{color:'rgba(0,0,0, .30)'}}>Rp.{detailProduct.harga}</Text>
                                    </HStack>
                                </View>
                            </HStack>
                        </View>
                        <View>
                            <Text>{detailProduct.desc}</Text>
                        </View>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button flex="1" onPress={() => {setShowModal(false);}}>Close</Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        )
    }

    const ModalDelete = () => {
        return (
            <Modal isOpen={showModalDelete} onClose={() => {setShowModalDelete(false)}} size="xl">
                <Modal.Content maxWidth="350">
                    <Modal.CloseButton />
                    <Modal.Header style={{flexDirection:'row'}}><Icon name="info" size={15} color={'#289AAD'} style={{marginRight:5}}/>Delete Product</Modal.Header>
                    <Modal.Body>
                        Yakin ingin menghapus product ini ?
                    </Modal.Body>
                    <Modal.Footer>
                        <View flexDirection={'row'} style={{width:'100%'}}>
                            {
                                loading ? (
                                    <View flexDirection={'column'} style={{width:'50%'}}>
                                    <Button
                                        isLoading _loading={{
                                            bg: "#88D6E3",
                                            _text: {
                                            color: "coolGray.700"
                                            }
                                        }} _spinner={{
                                            color: "#179BB1"
                                        }}
                                        isLoadingText="Menghapus.."
                                        >Ya, Haps</Button>
                                    </View>
                                ):(
                                    <View flexDirection={'column'} style={{width:'50%', padding:5}}>
                                        <Button onPress={() => deleteHandler()}>Ya, Hapus</Button>
                                    </View>
                                )
                            }
                            <View flexDirection={'column'} style={{width:'50%',padding:5}}>
                                <Button colorScheme={'secondary'} onPress={() => {setShowModalDelete(false)}}>Batalkan</Button>
                            </View>
                        </View>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        )
    }

    return (
        <NativeBaseProvider>
            <View style={{backgroundColor:'white', flex:1}}>
                <View p={2}>
                    <View borderBottomRadius={25} borderTopRadius={25} bg={'#06b6d4'} flexDirection={'row'} p={5} pl={2}>
                        <View w={20} h={20}  borderRadius={'full'}>
                            {
                                mount && (
                                    <Center>
                                        <Image source={{uri: dataProfile.foto ? `${SERVER_HOST}/${dataProfile.foto}` : `${SERVER_HOST}/default-avatar.png` }} borderRadius={'full'} alt={`${SERVER_HOST}/${dataProfile.foto}`} size="md" />
                                    </Center>
                                )
                            }
                        </View>
                        <View style={{justifyContent:'center'}} pl={3}>
                            <HStack><Text color={'#FFFFFF'} fontWeight={'bold'} fontSize={18}>Halo,</Text></HStack>
                            <HStack><Text color={'#FFFFFF'} fontSize={20}>{dataProfile.name ? dataProfile.name : ''}</Text></HStack>
                        </View>
                    </View>
                </View>
                <ScrollView style={[Style.container, {backgroundColor:'white'}]} pb={40}>
                    <View mb={5} flexDirection={'row'} style={{width:'100%'}}>
                        <View flexDirection={'column'} style={{width:'70%'}}>
                            <Text  color={'#AFAFAF'}  fontSize={25}>Pilihan Product</Text>
                        </View>
                        {
                            dataUser.role == 1 && (
                                <View flexDirection={'column'} style={{width:'30%'}}>
                                    <Button onPress={() => navigation.navigate('AddProduct') } variant={'link'} leftIcon={<Icon name="plus-circle" size={20} color={'#06B6D4'}/>} fontSize={20}>Add Produk</Button>
                                </View>
                            )
                        }
                    </View>
                    {
                        products.length > 0 ? (
                            products.map((v, k) => {
                                return(
                                    <View mb={5} style={Style.boxShadow} key={`prouct_${k}`}>
                                        <HStack space={3} bg={'white'}  pt={3} pb={3} pl={3} borderRadius={20}>
                                            <View w={20} h={20}  borderRadius={'md'}>
                                                <Image source={{uri: `${SERVER_HOST}/${v.foto}`}} alt={`${SERVER_HOST}/${v.foto}`} size="sm" />
                                            </View>
                                            <View pl={3} style={{width:'60%'}}>
                                                <HStack><Text fontWeight={'bold'} fontSize={22} color={'#289AAD'}>{v.nama_product}</Text></HStack>
                                                <HStack>
                                                    <Text fontWeight={'bold'} fontSize={18} style={{color:'rgba(0,0,0, .30)'}}>Rp.{v.harga}</Text>
                                                </HStack>
                                            </View>
                                            {
                                                dataUser.role == 1 ? (
                                                    <View justifyContent={'center'} right={0}>
                                                        <OptionsMenu
                                                            customButton={<Icon name="more-vertical" size={25} color="rgba(0,0,0, .30)" />}
                                                            destructiveIndex={1}
                                                            options={["Detail", "Delete", "Edit"]}
                                                            actions={[()=> detailProductHandler(v), () => deleteProduct(v), () => {navigation.navigate('EditProduct', {param:v})}]}
                                                            />
                                                    </View>
                                                ):(
                                                    <View justifyContent={'center'} right={0}>
                                                        <OptionsMenu
                                                            customButton={<Icon name="more-vertical" size={25} color="rgba(0,0,0, .30)" />}
                                                            destructiveIndex={1}
                                                            options={["Detail"]}
                                                            actions={[()=> detailProductHandler(v)]}
                                                            />
                                                    </View>
                                                )
                                            }
                                        </HStack>
                                    </View>
                                )
                            })
                        ):(
                            <View><Text>Belum ada data..</Text></View>
                        )
                    }
                </ScrollView>
            </View>
            {/*** Modal Add*/}
            <ModalDelete/>

            {/*** Response Modal*/}
             <ModalResponse/>
        </NativeBaseProvider>
    );
}
export default Products;