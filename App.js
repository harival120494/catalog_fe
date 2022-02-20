// In App.js in a new project

import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Started from './android/src/Started/index';
import LoginPage from './android/src/Login/index';
import MainLayoutPage from './android/src/MainLayout/index';
import AddProduct from './android/components/Products/AddProduct';
import EditProduct from './android/components/Products/EditProduct';
import AddUser from './android/components/User/AddUser';
import EditUser from './android/components/User/EditUser';
import AddTransaksi from './android/components/Transaksi/AddTransaksi';


const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* <Stack.Screen name="Getstarted" component={LoginPage} options={{headerShown: false}} /> */}
        <Stack.Screen name="LoginPage" component={LoginPage} options={{headerShown: false}}/>
        <Stack.Screen name="MainLayoutPage" component={MainLayoutPage} options={{headerShown: false}}/>
        <Stack.Screen name="AddProduct" component={AddProduct} options={{headerShown: true, title:"Tambah Produk"}}/>
        <Stack.Screen name="EditProduct" component={EditProduct} options={{headerShown: true, title:"Edit Produk"}}/>
        <Stack.Screen name="AddUser" component={AddUser} options={{headerShown: true, title:"Tambah Pengguna"}}/>
        <Stack.Screen name="EditUser" component={EditUser} options={{headerShown: true, title:"Edit Pengguna"}}/>
        <Stack.Screen name="AddTransaksi" component={AddTransaksi} options={{headerShown: true, title:"Buat Transaksi"}}/>


      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;