import { StyleSheet } from 'react-native';
import { Dimensions } from "react-native";
const {width, height} = Dimensions.get('window');

export default StyleSheet.create({
    container : {
        padding:15,
        flex: 1
    },
    middleOfScreen: {
        flex: 1,
        position: 'relative',
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0,
    },
    boxShadow : {
        shadowColor: "#cecece",
        borderRadius:30,
        shadowOffset:{
            width: 1,
            height: 10,
        },
        shadowOpacity: 1,
        shadowRadius: 50,
        elevation: 10
    }
});