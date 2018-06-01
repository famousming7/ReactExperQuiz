import React, { Component } from 'react';
import { createStackNavigator} from 'react-navigation';

import Login from './screens/login'

export const LoginNav = createStackNavigator({
    Login : {screen : Login}
},{
    headerMode:'none'
})