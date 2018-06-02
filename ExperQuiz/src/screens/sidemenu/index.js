import React, { Component } from 'react';
import {
    View,
} from 'react-native';
import { Button, Icon, Text} from 'native-base';
import {Colors,Images} from '@theme';
import Styles from './styles';
import { Loader,Strings } from '@components';
import { logOut} from "@api";

export default class Sidemenu extends Component {

    constructor(props) {
        super(props);

    }

    actionLogout(){
        alert('1')
        logOut()
        this.props.navigation.navigate('Login');
    }

    render() {

        return (
            <View style={Styles.container}>
                <Button 
                    iconLeft 
                    style={{backgroundColor: Colors.grayColor, margin: 8}}
                    onPress={this.actionLogout.bind(this)}>
                    <Icon name='home' />
                    <Text>Log Out</Text>
                </Button>
            </View>
        )
    }
};