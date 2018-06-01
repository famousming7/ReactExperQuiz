import React, { Component } from 'react';
import { createStackNavigator, createDrawerNavigator} from 'react-navigation';
import { Button, Icon, Text} from 'native-base';
import {Colors} from '@theme';
import Login from './screens/login'
import Evallist from './screens/evallist'
import Sidemenu from './screens/sidemenu'

const MenuIcon = ({ navigate , openDrawer}) => {
    return (
        <Button  
            style={{backgroundColor: Colors.redColor,margin: 5}}
            onPress={() => openDrawer()}>
            <Icon name='menu'/>
        </Button>
    );
}

const EvallistStack = createStackNavigator({
    
    Evallist : {
        screen : Evallist,
        navigationOptions: ({ navigation }) => ({
            headerTitle: <Text style={{fontSize: 20, fontWeight: 'bold'}}>Dying To Talk</Text>  ,
            headerStyle: { backgroundColor: Colors.whiteColor, height: 60},
            headerTitleStyle: {color: '#a7c3f2'},
            headerLeft: <MenuIcon {...navigation} />,
        }),
    },
});

const EvalListWithMenu = createDrawerNavigator(
    {
        Evallist: { screen: EvallistStack }
    },
    {
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