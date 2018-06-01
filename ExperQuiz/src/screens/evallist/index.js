import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Button,
    Alert,
    Icon
} from 'react-native';

import {Colors,Images} from '@theme';
import Styles from './styles';
import { Loader,Strings } from '@components';
import { checkLogin} from "@api";
import { DrawerNavigator } from "react-navigation";

export default class Evallist extends Component {

    constructor(props) {
        super(props);

        this.state = ({
            loaderVisible: false,
        })
    }

    render() {

        return (
            <View style={Styles.container}>
            
            </View>
        )
    }
};