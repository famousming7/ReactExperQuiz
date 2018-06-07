import React, { Component } from 'react';
import {Image,View} from 'react-native';
import { createStackNavigator, createDrawerNavigator} from 'react-navigation';
import { Button, Icon, Text} from 'native-base';
import {Colors,Images} from '@theme';

import Login from './screens/login'
import Evallist from './screens/evallist'
import Sidemenu from './screens/sidemenu'
import TestPage from './screens/TestPage'
import ResultPage from './screens/ResultPage'


const EvallistStack = createStackNavigator({
    
    Evallist : {
        screen : Evallist,
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

export const LoggedinNav = createStackNavigator({
    Login : {screen : Login},
    EvallistMenu : {screen : EvalListWithMenu},
    
},{
    index: 0,
    initialRouteName: 'EvallistMenu',
    headerMode: 'none',
    navigationOptions: {
      gesturesEnabled: false
    }
})