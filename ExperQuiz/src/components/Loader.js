import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator
} from 'react-native';
import Spinner from "react-native-spinkit";
import {Colors} from '@theme';
const Loader = props => {
    const {
        loading,
        ...attributes
    } = props;

    return (
        <View>
            { loading ? 
            <View style={styles.modalBackground}>
                <View style={styles.activityIndicatorWrapper}>
                    <Spinner isVisible={loading} size={30} type='FadingCircle'/>
                </View>
            </View> 
            : null}
        </View>
    )
}

const styles = StyleSheet.create({
    modalBackground: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    activityIndicatorWrapper: {
        height: 50,
        width: 50,
        borderRadius: 5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around'
    }
});

export default Loader;