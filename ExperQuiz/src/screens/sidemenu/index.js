import React, { Component } from 'react';
import {
    View,
    TouchableOpacity
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
        logOut()
        this.props.navigation.navigate('Login');
    }

    render() {

        return (
            <View style={Styles.container}>
                <View style={Styles.menuItem}>
                    <TouchableOpacity style={Styles.menuItem} onPress={this.actionLogout.bind(this)}>
                        <View style={Styles.menuIcon}>
                            <Icon name='home' style={{color:Colors.blueColor}}/>
                        </View>
                        <View style={Styles.menuText}>
                            <Text style={Styles.textLogout}>Log Out</Text>
                        </View>
                    </TouchableOpacity>
                </View>

            </View>
        )
    }
};