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
import axios from "axios";
import {
    launchCamera,
    launchImageLibrary
} from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';



function AddProduct(){
    const [mount, setMount] = useState(false)
    const [dataUser, setDataUser] = useState({})
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [isSaved, setIsSaved] = useState(null)
    
    const [namProduct, setNamaProduct] = useState(null)
    const [sku, setSKU] = useState(null)
    const [stock, setStock]= useState(null)
    const [harga, setHarga]= useState(null)
    const [deskripsi, setDeskripsi]= useState(null)
    const [filePath, setFilePath] = useState({});
    const [isImagePicker, setIsImagePicker] = useState(false)
    const navigation = useNavigation();
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

    const saveProductHandler = async() => {
        setLoading(true)
        let formData  = new FormData();
        formData.append('foto', {
            name: filePath.assets[0].fileName,
            type: filePath.assets[0].type,
            uri:filePath.assets[0].uri
        });
        formData.append('nama_product', namProduct);
        formData.append('sku', sku);
        formData.append('stock', stock);
        formData.append('harga', harga);
        formData.append('desc', deskripsi);

        let res = await fetch(
            `${SERVER_HOST}/api/product`,
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


    const ModalResponse = (data) => {
        return (
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="xl">
                <Modal.Content maxWidth="350">
                    <Modal.CloseButton />
                    <Modal.Header style={{flexDirection:'row'}}><Icon name="info" size={15} color={'#289AAD'} style={{marginRight:5}}/>Berhasil Menambah User</Modal.Header>
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

    

    return (
        <NativeBaseProvider>
            <View style={{backgroundColor:'white', flex:1}}>
                <ScrollView style={[Style.container, {backgroundColor:'white'}]}>
                    <View mb={5}>
                        <Text mb={2}>Nama Product</Text>
                        <Input  fontSize={16}
                                placeholder="Nama Product"
                                onChangeText={(text) => setNamaProduct(text)} 
                                />
                    </View>
                    <View mb={5}>
                        <Text mb={2}>No. SKU</Text>
                        <Input  fontSize={16}
                                placeholder="No. SKU"
                                onChangeText={(text) => setSKU(text)} />
                    </View>
                    <View mb={5}>
                        <Text mb={2}>Stock</Text>
                        <Input type="number" fontSize={16}
                                placeholder="Stock"
                                onChangeText={(text) => setStock(text)} />
                    </View>
                    <View mb={5}>
                        <Text mb={2}>Harga</Text>
                        <Input type="number" fontSize={16}
                                placeholder="Harga"
                                onChangeText={(text) => setHarga(text)} />
                    </View>
                    <View mb={5}>
                        <Text mb={2}>Pilih Foto</Text>
                        <Button 
                            colorScheme="secondary" 
                            variant={'solid'}
                            onPress={() => chooseFile('photo')}>Pilih Gambar</Button>
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
                        <Text mb={2}>Deskripsi</Text>
                        <TextArea h={20} placeholder="Deskripsi" w="100%" maxW="500" onChangeText={(text) => setDeskripsi(text)} />
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
                                    onPress={() => saveProductHandler()}>Simpan</Button>
                            )
                        }
                    </View>
                </ScrollView>
            </View>
            <ModalResponse/>
        </NativeBaseProvider>
    );
}
export default AddProduct;