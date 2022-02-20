import React, { useState, useEffect} from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
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
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Style from "../../styles/Style";
import Products from "../Products";
import User from "../User";
import Transaksi from "../Transaksi";
import { useNavigation } from '@react-navigation/native';



const Tab = createBottomTabNavigator();
function MainLayout(){
    const navigation = useNavigation();
    const [dataUser, setDataUser] = useState({})
    const [mount, setMount] = useState(false)
    useEffect(() => {
        let isMounted = true;    
        const asyncFunctionData = async () => {
            try {
                const storageData = JSON.parse(await AsyncStorage.getItem('data_login'))
                setDataUser(storageData)
                setMount(true)
            } catch (e) {}
        }
        asyncFunctionData();    
        return () => { isMounted = false };
    },[])
    return (
        <Tab.Navigator>
            <Tab.Screen name="Produccts" component={Products} options={{
                tabBarLabel: 'Product',
                headerShown:false,
                tabBarLabel:({ focused,color })=>(<Text style={{color:focused?"#06B6D4":"grey"}}>Product</Text>),
                 tabBarIcon: ({ focused, color, size }) => (
                    <Icon name="book-open" color={focused ? "#06B6D4":"grey"} size={size} />
                ),
            }}/>
            {
                dataUser.role == 1 && (
                    <Tab.Screen name="User" component={User} options={{
                        tabBarLabel: 'User',
                        headerShown:false,
                        tabBarLabel:({ focused,color })=>(<Text style={{color:focused?"#06B6D4":"grey"}}>User</Text>),
                         tabBarIcon: ({ focused, color, size }) => (
                            <Icon name="users" color={focused ? "#06B6D4":"grey"} size={size} />
                        ),
                    }}/>
                )
            }
            <Tab.Screen name="Transaction" component={Transaksi} options={{
                tabBarLabel: 'Transaksi',
                headerShown:false,
                tabBarLabel:({ focused,color })=>(<Text style={{color:focused?"#06B6D4":"grey"}}>Transaksi</Text>),
                 tabBarIcon: ({ focused, color, size }) => (
                    <Icon name="download" color={focused ? "#06B6D4":"grey"} size={size} />
                ),
            }}/>

            <Tab.Screen name="Logout" component={Transaksi} options={{
                tabBarLabel: 'Logout',
                headerShown:false,
                tabBarLabel:({ focused,color })=>(<Text style={{color:focused?"#06B6D4":"grey"}}>Logout</Text>),
                 tabBarIcon: ({ focused, color, size }) => (
                    <Icon name="log-out" color={focused ? "#06B6D4":"grey"} size={size} />
                ),
                
            }}
            listeners={{
                tabPress: e => {
                  // Prevent default action
                  e.preventDefault();
                  AsyncStorage.getAllKeys()
                    .then(keys => AsyncStorage.multiRemove(keys))
                    .then(navigation.navigate('LoginPage'));
                },
              }}
            
            />
        </Tab.Navigator>
      );
}
export default MainLayout;