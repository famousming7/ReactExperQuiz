import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image
} from 'react-native';

import {Colors,Images} from '@theme';
import Styles from './styles';

export default class Login extends Component {

    constructor(props) {
        super(props);

    }

    render() {
        const {navigate} = this.props.navigation
        
        return (
            <View style={Styles.container}>
                <View style={Styles.viewlogo}>
                    <Image style={Styles.imgLogo} source={Images.logo}/>
                </View>
                <View style={Styles.viewSign}>
                    <Text style={Styles.textSignin}>Sign-in</Text>
                </View>

                <View style={Styles.viewEmail}>
                    <Text style={Styles.textEmail}>Your email address or mobile phone *</Text>
                </View>

                <View style={Styles.viewInput}>
                    <TextInput style={Styles.inputEmail}></TextInput>
                </View>

                <View style={Styles.itemRow}>
                    <View style={Styles.itemLabel}>
                        <Text >Password :</Text>
                    </View>
                    <View style={Styles.itemInput}>
                        <TextInput ></TextInput>
                    </View>
                </View>
                <View style={Styles.loginRow}>


                </View>
            </View>
        );
    }
    
};