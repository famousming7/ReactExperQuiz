import React, { Component } from 'react';
import {Image} from 'react-native';
import { createStackNavigator, createDrawerNavigator} from 'react-navigation';
import { Button, Icon, Text} from 'native-base';
import {Colors,Images} from '@theme';

import Login from './screens/login'
import Evallist from './screens/evallist'
import Sidemenu from './screens/sidemenu'
import TestPage from './screens/TestPage'
import ResultPage from './screens/ResultPage'

const MenuIcon = ({ navigate , openDrawer}) => {
    return (
        <Button  
            style={{backgroundColor: Colors.redColor,margin: 5}}
            onPress={() => openDrawer()}>
            <Icon name='bars' type="FontAwesome" color={Colors.redColor} fontSize={13}/>
        </Button>
    );
}
const BackIcon = ({ goBack }) => {
    return (
        <Button  
            style={{backgroundColor: Colors.redColor,margin: 5}}
            onPress={() => goBack()}>
            <Icon name='arrow-left'  type="FontAwesome" color={Colors.redColor}/>
        </Button>
    );
}
const LogoIcon = ({ navigate }) => {
    return (
            <Image style={{width:45,height:40}} source = {Images.logo}/>
    );
}

const EvallistStack = createStackNavigator({
    
    Evallist : {
        screen : Evallist,
        navigationOptions: ({ navigation }) => ({
            headerTitle: <Text style={{fontSize: 20, fontWeight: 'bold'}}>My Company</Text>  ,
            headerStyle: { backgroundColor: Colors.whiteColor, height: 55},
            headerTitleStyle: {color: '#a7c3f2'},
            headerLeft: <MenuIcon {...navigation} />,
            headerRight: <LogoIcon {...navigation} />,
        }),
    },
    TestPage : {
        screen : TestPage,
    },
    ResultPage:{
        screen : ResultPage
    }
});

const EvalListWithMenu = createDrawerNavigator(
    {
        Evallist: { screen: EvallistStack }
    },
    {
        drawerWidth: 200,
        contentComponent: props => <Sidemenu {...props} />
    }
);

export const LoginNav = createStackNavigator({
    
    Login : {screen : Login},
    EvallistMenu : {screen : EvalListWithMenu},
},{
    index: 0,
    initialRouteName: 'Login',
    headerMode: 'none',
    navigationOptions: {
      gesturesEnabled: false
    }
})