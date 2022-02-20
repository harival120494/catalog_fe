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

function Transaksi(){
    const [loading, setLoading] = useState(false)
    const [mount, setMount] = useState(false)
    const [dataUser, setDataUser] = useState({})
    const [dataProfile, setDataProfile] = useState({})
    const [transaksi, setTransaksi] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [detailInfo, setDetailInfo] = useState({})
    const [showModalDetai, setShowModalDetail] = useState(false)
    const [showModalDelete, setShowModalDelete] = useState(false)
    const navigation = useNavigation();

    useEffect(() => {
        const asyncFunctionData = async () => {
        try {
            const storageData = JSON.parse(await AsyncStorage.getItem('data_login'))
            setDataUser(storageData)
            if(storageData.role == 1){
                getTransaksi(storageData.token)
            }
            else{
                getTransaksiByUser(storageData.token)
            }
            getDataProfile(storageData.id, storageData.token)
            setMount(true)
            const unsubscribe = navigation.addListener('focus', () => {
                if(storageData.role == 1){
                    getTransaksi(storageData.token)
                }
                else{
                    getTransaksiByUser(storageData.token)
                }
            });
            return unsubscribe;
        } catch (e) {}
        }
        asyncFunctionData();    
    },[])

    const getTransaksi = (token) => {
        const header = { headers: {"Authorization" : `Bearer ${token}`} }
        axios.get(`${SERVER_HOST}/api/transaction`, header)
        .then(async(result) => {
            setTransaksi(result.data.data)
        })
    }

    const getTransaksiByUser = (token) => {
        const header = { headers: {"Authorization" : `Bearer ${token}`} }
        axios.get(`${SERVER_HOST}/api/transaction/by_user/${dataUser.id}`, header)
        .then(async(result) => {
            setTransaksi(result.data.data)
        })
    }
    
    const getDataProfile = (id, token) => {
        const header = { headers: {"Authorization" : `Bearer ${token}`} }
        axios.get(`${SERVER_HOST}/api/user/${id}`, header)
        .then(async(result) => {
            setDataProfile(result.data.data)
            await AsyncStorage.setItem('data_profile', JSON.stringify(result.data.data))
        })
    }

    const deleteHandler = () => {
        setLoading(true)
        const header = { headers: {"Authorization" : `Bearer ${dataUser.token}`} }
        axios.delete(`${SERVER_HOST}/api/transaction/${detailInfo.id}`, header)
        .then(async(result) => {
            setLoading(false)
            setShowModalDelete(false)
            if(dataUser.role == 1){
                getTransaksi(dataUser.token)
            }
            else{
                getTransaksiByUser(dataUser.token)
            }
        })
    }

    /**
     * Component Section
     */

    const ModalDetail = () => {
        return (
            <Modal isOpen={showModalDetai} onClose={() => setShowModalDetail(false)} size="xl">
                <Modal.Content maxWidth="350">
                    <Modal.CloseButton />
                    <Modal.Header style={{flexDirection:'row'}}><Icon name="info" size={15} color={'#289AAD'} style={{marginRight:5}}/>{detailInfo.nama_product}</Modal.Header>
                    <Modal.Body>
                        <View mb={5} style={Style.boxShadow}>
                            <HStack space={3} bg={'white'} pt={3} pb={3} pl={3} borderRadius={20}>
                                <View w={20} h={20}  borderRadius={'md'}>
                                    <Image source={{uri: `${SERVER_HOST}/${detailInfo.foto}`}} alt={`${SERVER_HOST}/${detailInfo.foto}`} size="sm" />
                                </View>
                                <View style={{justifyContent:'center'}} pl={3}>
                                    <HStack><Text fontWeight={'bold'} fontSize={20} color={'#289AAD'}>{detailInfo.name}</Text></HStack>
                                    <HStack><Text fontWeight={'bold'} fontSize={14} style={{color:'rgba(0,0,0, .30)'}}>Harga     : {detailInfo.harga}</Text></HStack>
                                    <HStack><Text fontWeight={'bold'} fontSize={14} style={{color:'rgba(0,0,0, .30)'}}>Jumlah    : {detailInfo.jumlah}</Text></HStack>
                                    <HStack><Text fontWeight={'bold'} fontSize={14} style={{color:'rgba(0,0,0, .30)'}}>Total     : {detailInfo.total}</Text></HStack>
                                    <HStack>
                                        <Text fontWeight={'bold'} fontSize={14} style={{color:'rgba(0,0,0, .30)'}}>{detailInfo.created_at}</Text>
                                    </HStack>
                                </View>
                            </HStack>
                        </View>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button flex="1" onPress={() => {setShowModalDetail(false);}}>Close</Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        )
    }

    const ModalDelete = () => {
        return (
            <Modal isOpen={showModalDelete} onClose={() => {setShowModalDelete(false), setLoading(false)}} size="xl">
                <Modal.Content maxWidth="350">
                    <Modal.CloseButton />
                    <Modal.Header style={{flexDirection:'row'}}><Icon name="info" size={15} color={'#289AAD'} style={{marginRight:5}}/>Delete Transaksi</Modal.Header>
                    <Modal.Body>
                        Yakin ingin menghapus transaksi ini ?
                    </Modal.Body>
                    <Modal.Footer>
                        <View flexDirection={'row'} style={{width:'100%'}}>
                            {
                                loading ? (
                                    <View flexDirection={'column'} style={{width:'50%', padding:5}}>
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
                                            >Ya, Hapus</Button>
                                    </View>
                                ):(
                                    <View flexDirection={'column'} style={{width:'50%', padding:5}}>
                                        <Button onPress={() => deleteHandler()}>Ya, Hapus</Button>
                                    </View>
                                )
                            }
                            <View flexDirection={'column'} style={{width:'50%', padding:5}}>
                                <Button colorScheme={'secondary'} onPress={() => {setShowModalDelete(false), setLoading(false)}}>Batalkan</Button>
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
                <ScrollView style={[Style.container, {backgroundColor:'white'}]}>
                    <View mb={5} flexDirection={'row'} style={{width:'100%'}}>
                        <View flexDirection={'column'} style={{width:'70%'}}>
                            <Text color={'#AFAFAF'} fontSize={25}>Transaksi</Text>
                        </View>
                        <View flexDirection={'column'} style={{width:'30%'}}>
                            <Button onPress={() => navigation.navigate('AddTransaksi') } variant={'link'} leftIcon={<Icon name="plus-circle" size={20} color={'#06B6D4'}/>} fontSize={'xl'} color={'#06B6D4'}>Tambah Transaksi</Button>
                        </View>
                    </View>
                    {
                        transaksi.length > 0 ? (
                            transaksi.map((v, k) => {
                                return(
                                    <View mb={5} style={Style.boxShadow} key={`prouct_${k}`}>
                                        <HStack space={3} bg={'white'} pt={3} pb={3} pl={3} borderRadius={20}>
                                            <View style={{justifyContent:'center'}} style={{width:'90%'}} pl={3}>
                                                <HStack><Text fontWeight={'bold'} fontSize={18} color={'#289AAD'}>{v.nama_product}</Text></HStack>
                                                <HStack><Text  fontSize={15} style={{color:'rgba(0,0,0, .30)'}}>{v.name}</Text></HStack>
                                                <HStack><Text  fontSize={15} style={{color:'rgba(0,0,0, .30)'}}>{v.created_at}</Text></HStack>
                                            </View>
                                            <View justifyContent={'center'} right={0}>
                                                <OptionsMenu
                                                        customButton={<Icon name="more-vertical" size={25} color="rgba(0,0,0, .30)" />}
                                                        destructiveIndex={1}
                                                        options={["Detail","Delete"]}
                                                        actions={[() => {setDetailInfo(v), setShowModalDetail(true)}, ()=> {{setDetailInfo(v), setShowModalDelete(true)}}]}
                                                        />
                                            </View>
                                            
                                        </HStack>
                                    </View>
                                )
                            })
                        ):(
                            <View style={{alignContent:'center'}}><Text>Belum Ada data</Text></View>
                        )
                    }
                </ScrollView>
            </View>
            {/*** Modal Detail*/}
            <ModalDetail/>
            <ModalDelete/>


           
        </NativeBaseProvider>
    );
}
export default Transaksi;    