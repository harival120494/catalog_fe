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
import {SERVER_HOST} from '../../constant/Environment';
import Icon from 'react-native-vector-icons/Feather';
import Style from "../../styles/Style";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, {AxiosRequestConfig } from "axios";
import {
    launchCamera,
    launchImageLibrary
} from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import DateField from 'react-native-datefield';


function AddUser(){
    const navigation = useNavigation();
    const [isSaved, setIsSaved] = useState(null)
    const [mount, setMount] = useState(false)
    const [dataUser, setDataUser] = useState({})
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [name, setName] = useState(null)
    const [tempatLahir, setTempatLahir] = useState(null)
    const [tglLahir, setTglLahir]= useState(null)
    const [no_hp, setNoHp]= useState(null)
    const [alamat, setAlamat]= useState(null)
    const [filePath, setFilePath] = useState({});
    const [isImagePicker, setIsImagePicker] = useState(false)

    useEffect(() => {
        const asyncFunctionData = async () => {
        try {
            const storageData = JSON.parse(await AsyncStorage.getItem('data_login'))
            setDataUser(storageData)
            getDataProfile(storageData.id, storageData.token)
            setMount(true)
        } catch (e) {}
        }
        asyncFunctionData();    
    },[mount])
   

    const chooseFile = (type) => {
        let options = {
          mediaType: type,
          maxWidth: 300,
          maxHeight: 550,
          quality: 1,
        };
        launchImageLibrary(options, (response) => {
    
          if (response.didCancel) {
            alert('User cancelled camera picker');
            return;
          } else if (response.errorCode == 'camera_unavailable') {
            alert('Camera not available on device');
            return;
          } else if (response.errorCode == 'permission') {
            alert('Permission not satisfied');
            return;
          } else if (response.errorCode == 'others') {
            alert(response.errorMessage);
            return;
          }
          setFilePath(response);
          setIsImagePicker(true)
        });
    };

    const saveUserHandler = async() => {
        let date = new Date(tglLahir);
        let year = date.getFullYear();
        let month = date.getMonth()+1;
        let dt = date.getDate();
        if (dt < 10) {
            dt = '0' + dt;
        }
        if (month < 10) {
            month = '0' + month;
        }

        let tglLahir1 = year+'-' + month + '-'+dt;
        

        setLoading(true)
        let formData  = new FormData();
        formData.append('foto', {
            name: filePath.assets[0].fileName,
            type: filePath.assets[0].type,
            uri:filePath.assets[0].uri
        });
        formData.append('email', email);
        formData.append('password', password);
        formData.append('name', name);
        formData.append('tempatLahir', tempatLahir);
        formData.append('status', 1);
        formData.append('role', 2);
        formData.append('tglLahir', tglLahir1);
        formData.append('no_hp', no_hp);
        formData.append('alamat', alamat);

       
        let res = await fetch(
            `${SERVER_HOST}/api/user/register`,
            {
              method: 'post',
              body: formData,
              headers: {
                'Content-Type': 'multipart/form-data; ',
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


    const ModalResponse = (data) => {
        return (
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="xl">
                <Modal.Content maxWidth="350">
                    <Modal.CloseButton />
                    <Modal.Header style={{flexDirection:'row'}}><Icon name="info" size={15} color={'#289AAD'} style={{marginRight:5}}/>Berhasil Menambah User</Modal.Header>
                    <Modal.Body>
                        <View>
                            <Text fontSize={20}>
                                {isSaved ? 'User baru berhasil di tambahkan' :'Gagal menambahkan user'}
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

    return (
        <NativeBaseProvider>
            <View style={{backgroundColor:'white', flex:1}}>
                <ScrollView style={[Style.container, {backgroundColor:'white'}]}>
                    <View mb={5}>
                        <Text mb={2}>E-mail</Text>
                        <Input  fontSize={16}
                                placeholder="E-mail"
                                onChangeText={(text) => setEmail(text)} 
                                />
                    </View>
                    <View mb={5}>
                        <Text mb={2}>Password</Text>
                        <Input type="password"  fontSize={16}
                                placeholder="Password"
                                onChangeText={(text) => setPassword(text)} 
                                />
                    </View>
                    <View mb={5}>
                        <Text mb={2}>Nama</Text>
                        <Input  fontSize={16}
                                placeholder="Nama"
                                onChangeText={(text) => setName(text)} 
                                />
                    </View>
                    <View mb={5}>
                        <Text mb={2}>Tempat Lahir</Text>
                        <Input  fontSize={16}
                                placeholder="Tempat Lahir"
                                onChangeText={(text) => setTempatLahir(text)} />
                    </View>
                    <View mb={5}>
                        <Text mb={2}>Tgl. Lahir</Text>
                        {/* <Input type="date" fontSize={16}
                                placeholder="Tgl. Lahir"
                                onChangeText={(text) => setTglLahir(text)} /> */}
                                <DateField styleInput={{ fontSize: 20 }} onSubmit={(value) => setTglLahir(value)} />
                    </View>
                    <View mb={5}>
                        <Text mb={2}>No.HP</Text>
                        <Input type="number" fontSize={16}
                                placeholder="No. HP"
                                onChangeText={(text) => setNoHp(text)} />
                    </View>
                    <View mb={5}>
                        <Text mb={2}>Pilih Foto</Text>
                        <Button 
                            colorScheme="secondary" 
                            variant={'solid'}
                            onPress={() => chooseFile('photo')}>Pilih Foto</Button>
                    </View>
                    {
                        isImagePicker && (
                            <View mb={5}>
                                <Center>
                                    <Image source={{uri: filePath.assets[0].uri}} alt={`${filePath.assets[0].uri}}`} size="md" />
                                </Center>
                            </View>
                        )
                    }
                    <View mb={5}>
                        <Text mb={2}>Alamat</Text>
                        <TextArea h={20} placeholder="Alamat" w="100%" maxW="500" onChangeText={(text) => setAlamat(text)} />
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
                                    onPress={() => saveUserHandler()}>Simpan</Button>
                            )
                        }
                    </View>
                </ScrollView>
            </View>
            <ModalResponse/>
        </NativeBaseProvider>
    );
}
export default AddUser;