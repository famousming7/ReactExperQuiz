import React, { Component} from 'react';
import { StyleSheet, Image } from "react-native";
import {Colors,Images} from '@theme';

export default (props) => {
    const {onPress} = props;

    return(
        <Image style={{width:50,height:'100%'}} source = {Images.logo}/>
    )
}

const styles = StyleSheet.create({

});