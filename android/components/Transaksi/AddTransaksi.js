import React, { useEffect, useState } from "react";
import {
    NativeBaseProvider,
    Input,
    View,
    Text,
    Button,
    Image,
    Modal,
    HStack,
    ScrollView
}
from 'native-base';
import { TouchableOpacity } from "react-native";
import {SERVER_HOST} from '../../constant/Environment';
import Icon from 'react-native-vector-icons/Feather';
import Style from "../../styles/Style";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from '@react-navigation/native';


function AddTransaksi(){
    const [mount, setMount] = useState(false)
    const [dataUser, setDataUser] = useState({})
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [isSaved, setIsSaved] = useState(null)
    const [showProduct, setShowProduct] = useState(false)
    const [showUser, setShowUser] = useState(false)
    const [products, setProducts] = useState([])
    const [users, setUsers] = useState([])
    const navigation = useNavigation();


    
    const [idProduct, setIdProduct] = useState({})
    const [idUser, setIdUser] = useState({})
    const [jumlah, setJumlah]= useState(null)
    const [totalHarga, setTotalHarga]= useState(null)

    useEffect(() => {
        const asyncFunctionData = async () => {
        try {
            const storageData = JSON.parse(await AsyncStorage.getItem('data_login'))
            setDataUser(storageData)
            getDataProduct(storageData.token)
            getDataUser(storageData.token)
            setMount(true)
        } catch (e) {}
        }
        asyncFunctionData();    
    },[mount])
   
    const getDataProduct = (token) => {
        const header = { headers: {"Authorization" : `Bearer ${token}`} }
        axios.get(`${SERVER_HOST}/api/product/`, header)
        .then(async(result) => {
            setProducts(result.data.data)
        })
    }

    const getDataUser = (token) => {
        const header = { headers: {"Authorization" : `Bearer ${token}`} }
        axios.get(`${SERVER_HOST}/api/user`, header)
        .then(async(result) => {
            setUsers(result.data.data)
        })
    }

    const handlerUserSelect = (v) => {
        setIdUser(v)
        setShowUser(false)
    }

    const handlerProductSelect = (v) => {
        setIdProduct(v)
        setShowProduct(false)
    }

    const calculateHandler = (v) =>{
        const total = parseInt(v) * parseInt(idProduct.harga)
        setTotalHarga(total)
    }

    const saveTransaksi = async() => {
        setLoading(true)
        let formData  = new FormData();
        formData.append('product_id', idProduct.id);
        if(dataUser.role == 1){
            formData.append('user_id', idUser.id);
        }
        else{
            formData.append('user_id', dataUser.id);
        }
        formData.append('jumlah', jumlah);
        formData.append('total', totalHarga);
        let res = await fetch(
            `${SERVER_HOST}/api/transaction`,
            {
              method: 'post',
              body: formData,
              headers: {
                "Authorization" : `Bearer ${dataUser.token}`,
                'Content-Type': 'multipart/form-data; '
              },
            }
        );
        let responseJson = await res.json();
        
        if (responseJson.status) {
            setShowModal(true)
            setLoading(false)
            setIsSaved(true)
        }
        else{
            setShowModal(true)
            setLoading(false)
            setIsSaved(false)
        }
    }


    const ModalResponse = () => {
        return (
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="xl">
                <Modal.Content maxWidth="350">
                    <Modal.CloseButton />
                    <Modal.Header style={{flexDirection:'row'}}><Icon name="info" size={15} color={'#289AAD'} style={{marginRight:5}}/>Information</Modal.Header>
                    <Modal.Body>
                        <View>
                            <Text fontSize={20}>
                                {isSaved ? 'Produk berhasil di tambahkan' :'Gagal menambahkan produk'}
                            </Text>
                        </View>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button flex="1" onPress={() => {setShowModal(false), navigation.goBack()}}>Close</Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        )
    }

    function ModalUser () {
        return (
            <Modal isOpen={showUser} onClose={() => setShowUser(false)} size="xl">
                <Modal.Content maxWidth="350">
                    <Modal.CloseButton />
                    <Modal.Header style={{flexDirection:'row'}}><Icon name="info" size={15} color={'#289AAD'} style={{marginRight:5}}/>Pilih User</Modal.Header>
                    <Modal.Body>
                        {
                            users.map((v, k) => {
                                return(
                                    <TouchableOpacity mb={5} style={Style.boxShadow} key={`prouct_${k}`} onPress={() => handlerUserSelect(v)}>
                                        <HStack space={3} bg={'white'} pt={3} pb={3} pl={3} borderRadius={20}>
                                            <View w={20} h={20}  borderRadius={'md'}>
                                                <Image source={{uri: `${SERVER_HOST}/${v.foto}`}} alt={`${SERVER_HOST}/${v.foto}`} size="sm" borderRadius={10}/>
                                            </View>
                                            <View style={{justifyContent:'center'}} pl={3}>
                                                <HStack><Text fontWeight={'bold'} fontSize={20} color={'#289AAD'}>{v.name}</Text></HStack>
                                                <HStack>
                                                    <Text fontWeight={'bold'} fontSize={14} style={{color:'rgba(0,0,0, .30)'}}>{v.email}</Text>
                                                </HStack>
                                                <HStack>
                                                    <Text fontWeight={'bold'} fontSize={14} style={{color:'rgba(0,0,0, .30)'}}>{v.alamat}</Text>
                                                </HStack>
                                            </View>
                                        </HStack>
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        <Button flex="1" onPress={() => {setShowUser(false);}}>Close</Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        )
    }

    function ModalProduct () {
        return (
            <Modal isOpen={showProduct} onClose={() => setShowProduct(false)} size="xl">
                <Modal.Content maxWidth="350">
                    <Modal.CloseButton />
                    <Modal.Header style={{flexDirection:'row'}}><Icon name="info" size={15} color={'#289AAD'} style={{marginRight:5}}/>Pilih Product</Modal.Header>
                    <Modal.Body>
                        {
                            products.length > 0 ? (
                                products.map((v, k) => {
                                    return(
                                        <TouchableOpacity mb={2} style={Style.boxShadow} key={`prouct_${k}`} onPress={() => handlerProductSelect(v)}>
                                            <HStack space={3} bg={'white'} pt={3} pb={3} pl={3} borderRadius={20}>
                                                <View w={20} h={20}  borderRadius={'md'}>
                                                    <Image source={{uri: `${SERVER_HOST}/${v.foto}`}} alt={`${SERVER_HOST}/${v.foto}`} size="sm" />
                                                </View>
                                                <View style={{justifyContent:'center'}} pl={3}>
                                                    <HStack><Text fontWeight={'bold'} fontSize={20} color={'#289AAD'}>{v.nama_product}</Text></HStack>
                                                    <HStack>
                                                        <Text fontWeight={'bold'} fontSize={14} style={{color:'rgba(0,0,0, .30)'}}>Rp.{v.harga}</Text>
                                                    </HStack>
                                                </View>
                                            </HStack>
                                        </TouchableOpacity>
                                    )
                                })
                            ):(
                                <View><Text>Loading..</Text></View>
                            )
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        <Button flex="1" onPress={() => {setShowProduct(false)}}>Close</Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        )
    }

    

    return (
        <NativeBaseProvider>
            <View style={{backgroundColor:'white', flex:1}}>
                <ScrollView style={[Style.container, {backgroundColor:'white'}]}>
                   
                    <View mb={15}>
                        <Text mb={2}>Pilih Product</Text>
                        <Input type="number" fontSize={16}
                                placeholder="Pilih Product"
                                value={
                                    idProduct.nama_product != undefined ? idProduct.nama_product : ""
                                }
                                onPressIn={(text) => setShowProduct(true)} />
                    </View>
                    {
                        dataUser.role == 1 && (
                            <View mb={5}>
                                <Text mb={2}>Pilih User</Text>
                                <Input type="number" fontSize={16}
                                        placeholder="Pilih User"
                                        value={
                                            idUser.email != undefined ? idUser.email : ""
                                        }
                                        onPressIn={(text) => setShowUser(true)} />
                            </View>
                        )
                    }
                    
                    <View mb={5}>
                        <Text mb={2}>Jumlah</Text>
                        <Input type="number" fontSize={16}
                                placeholder="Jumlah"
                                onChangeText={(text) => {setJumlah(text), calculateHandler(text)}} />
                    </View>
                    
                    <View mb={5}>
                        {
                            loading ? (
                                <Button
                                    isLoading _loading={{
                                        bg: "#88D6E3",
                                        _text: {
                                        color: "coolGray.700"
                                        }
                                    }} _spinner={{
                                        color: "#179BB1"
                                    }}
                                    isLoadingText="Menyimpan.."
                                    >Simpan</Button>
                            ):(
                                <Button 
                                    colorScheme="primary" 
                                    variant={'solid'}
                                    size={'lg'}
                                    onPress={() => saveTransaksi()}>Simpan</Button>
                            )
                        }
                    </View>
                </ScrollView>
            </View>
            <ModalUser/> 
            <ModalProduct/>
            <ModalResponse/>            
        </NativeBaseProvider>
    );
}
export default AddTransaksi;