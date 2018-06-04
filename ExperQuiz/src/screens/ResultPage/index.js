import React, { Component } from 'react';
import {
    View,
    Alert,
    Image
} from 'react-native';

import { Button, Icon, Text} from 'native-base';
import {Colors,Images} from '@theme';
import Styles from './styles';

const BackIcon = ({ navigate }) => {
    return (
        <Button  
            style={{backgroundColor: Colors.redColor,margin: 5}}
            onPress={() => navigate('Evallist')}>
            <Icon name='arrow-left'  type="FontAwesome" style={{color:Colors.whiteColor,fontSize:20}}/>
        </Button>
    );
}

const LogoIcon = ({ navigate }) => {
    return (
            <Image style={{width:45,height:40}} source = {Images.logo}/>
    );
}

export default class ResultPage extends Component {

    static navigationOptions = ({ navigation }) => {
        const {state} = navigation;

        return {
          headerTitle: "Result",
          headerLeft: <BackIcon {...navigation} />,
          headerStyle: { backgroundColor: Colors.whiteColor, height: 55},
          headerRight: <LogoIcon {...navigation}/>
        };
    };

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <View style={Styles.container}>
            </View>
        )
    }

}