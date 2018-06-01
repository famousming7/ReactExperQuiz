import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Button,
    Alert,
} from 'react-native';

import {Colors,Images} from '@theme';
import Styles from './styles';
import { Loader,Strings } from '@components';
import { checkLogin} from "@api";

export default class Sidemenu extends Component {

    constructor(props) {
        super(props);

        this.state = ({
            loaderVisible: false,
        })
    }

    render() {

        return (
            <View style={Styles.container}>
                <Text>LogOut</Text>
            </View>
        )
    }
};