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



function User(){
    const [loading, setLoading] = useState(false)
    const [mount, setMount] = useState(false)
    const [dataUser, setDataUser] = useState({})
    const [dataProfile, setDataProfile] = useState({})
    const [users, setUsers] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [showModalDelete, setShowModalDelete] = useState(false)
    const [detailUser, setDetailUser] = useState({})
    const [selectedUser, setSelectedUser] = useState(null)
    const navigation = useNavigation();

    useEffect(() => {
        const asyncFunctionData = async () => {
        try {
            const storageData = JSON.parse(await AsyncStorage.getItem('data_login'))
            setDataUser(storageData)
            getDataUser(storageData.token)
            getDataProfile(storageData.id, storageData.token)
            setMount(true)
            const unsubscribe = navigation.addListener('focus', () => {
                getDataUser(storageData.token)
            });
            return unsubscribe;
        } catch (e) {}
        }
        asyncFunctionData();    
    },[navigation])

    const getDataProfile = (id, token) => {
        const header = { headers: {"Authorization" : `Bearer ${token}`} }
        axios.get(`${SERVER_HOST}/api/user/${id}`, header)
        .then(async(result) => {
            setDataProfile(result.data.data)
            await AsyncStorage.setItem('data_profile', JSON.stringify(result.data.data))
        })
    }

    const getDataUser = (token) => {
        const header = { headers: {"Authorization" : `Bearer ${token}`} }
        axios.get(`${SERVER_HOST}/api/user`, header)
        .then(async(result) => {
            setUsers(result.data.data)
        })
    }
    
    const detailUserHandler = (data) => {
        setDetailUser(data)
        setShowModal(true)
    }

    const deleteUser = (data) => {
        setShowModalDelete(true)
        setSelectedUser(data.id)
    }

    const deleteHandler = () => {
        setLoading(true)
        const header = { headers: {"Authorization" : `Bearer ${dataUser.token}`} }
        axios.delete(`${SERVER_HOST}/api/user/${selectedUser}`, header)
        .then(async(result) => {
            setLoading(false)
            setShowModalDelete(false)
            getDataUser(dataUser.token)
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
                    <Modal.Header style={{flexDirection:'row'}}><Icon name="info" size={15} color={'#289AAD'} style={{marginRight:5}}/>{detailUser.name}</Modal.Header>
                    <Modal.Body>
                        <View mb={5} style={Style.boxShadow}>
                            <HStack space={3} bg={'white'} pt={3} pb={3} pl={3} borderRadius={20}>
                                <View w={20} h={20}  borderRadius={'md'}>
                                    <Image source={{uri: `${SERVER_HOST}/${detailUser.foto}`}} alt={`${SERVER_HOST}/${detailUser.foto}`} size="sm" />
                                </View>
                                <View style={{justifyContent:'center'}} pl={3}>
                                    <HStack><Text fontSize={14} color={'rgba(0,0,0, .30)'}>Nama :</Text></HStack>
                                    <HStack><Text fontWeight={'bold'} fontSize={20} color={'#289AAD'}>{detailUser.name}</Text></HStack>
                                    <HStack mt={2}><Text fontSize={14} color={'rgba(0,0,0, .30)'}>Tempat/ Tgl. Lahir :</Text></HStack>
                                    <HStack><Text fontWeight={'bold'} fontSize={20} color={'rgba(0,0,0, .30)'}>{detailUser.tempatLahir}/ {detailUser.tglLahir}</Text></HStack>
                                    <HStack mt={2}><Text fontSize={14} color={'rgba(0,0,0, .30)'}>No. HP :</Text></HStack>
                                    <HStack>
                                        <Text fontWeight={'bold'} fontSize={20} style={{color:'rgba(0,0,0, .30)'}}>{detailUser.no_hp}</Text>
                                    </HStack>
                                </View>
                            </HStack>
                        </View>
                        <View>
                            <HStack><Text fontSize={14} color={'rgba(0,0,0, .30)'}>Alamat :</Text></HStack>
                            <Text>{detailUser.alamat}</Text>
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
            <Modal isOpen={showModalDelete} onClose={() => {setShowModalDelete(false), setLoading(false)}} size="xl">
                <Modal.Content maxWidth="350">
                    <Modal.CloseButton />
                    <Modal.Header style={{flexDirection:'row'}}><Icon name="info" size={15} color={'#289AAD'} style={{marginRight:5}}/>Delete Pengguna</Modal.Header>
                    <Modal.Body>
                        Yakin ingin menghapus pengguna ini ?
                    </Modal.Body>
                    <Modal.Footer>
                        <View flexDirection={'row'} style={{width:'100%'}}>
                            {
                                loading ? (
                                    <View flexDirection={'column'} style={{width:'50%'}}>
                                    <Button
                                        p={3}
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
                                <Button  colorScheme={'secondary'} onPress={() => {setShowModalDelete(false), setLoading(false)}}>Batalkan</Button>
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
                            <Text color={'#AFAFAF'} fontSize={25}>List User</Text>
                        </View>
                        <View flexDirection={'column'} style={{width:'30%'}}>
                            <Button onPress={() => navigation.navigate('AddUser') } variant={'link'} leftIcon={<Icon name="plus-circle" size={20} color={'#06B6D4'}/>} fontSize={'xl'} color={'#06B6D4'}>Tambah User</Button>
                        </View>
                    </View>
                    {
                        users.length > 0 ? (
                            users.map((v, k) => {
                                return(
                                    <View mb={5} style={Style.boxShadow} key={`prouct_${k}`}>
                                        <HStack space={3} bg={'white'} pt={3} pb={3} pl={3} borderRadius={20}>
                                            <View w={20} h={20}  borderRadius={'md'}>
                                                <Image source={{uri: `${SERVER_HOST}/${v.foto}`}} alt={`${SERVER_HOST}/${v.foto}`} size="sm" />
                                            </View>
                                            <View style={{justifyContent:'center'}} style={{width:'60%'}} pl={3}>
                                                <HStack><Text fontWeight={'bold'} fontSize={20} color={'#289AAD'}>{v.name}</Text></HStack>
                                                <HStack>
                                                    <Text fontWeight={'bold'} fontSize={18} style={{color:'rgba(0,0,0, .30)'}}>{v.alamat}</Text>
                                                </HStack>
                                            </View>
                                            <View justifyContent={'center'} right={0}>
                                                <OptionsMenu
                                                    customButton={<Icon name="more-vertical" size={25} color="rgba(0,0,0, .30)" />}
                                                    destructiveIndex={1}
                                                    options={["Detail", "Edit", "Delete"]}
                                                    actions={[()=> detailUserHandler(v), () => {navigation.navigate('EditUser', {param:v})}, () => deleteUser(v)]}
                                                    />
                                            </View>
                                            
                                        </HStack>
                                    </View>
                                )
                            })
                        ):(
                            <View><Text>Belum Ada data</Text></View>
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
export default User;    