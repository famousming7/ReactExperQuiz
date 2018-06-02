import React, { Component } from 'react';
import {Image} from 'react-native';
import { createStackNavigator, createDrawerNavigator} from 'react-navigation';
import { Button, Icon, Text} from 'native-base';
import {Colors,Images} from '@theme';
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
const LogoIcon = ({ navigate , openDrawer}) => {
    return (
            <Image style={{width:50,height:'100%'}} source = {Images.logo}/>
    );
}

const EvallistStack = createStackNavigator({
    
    Evallist : {
        screen : Evallist,
        navigationOptions: ({ navigation }) => ({
            headerTitle: <Text style={{fontSize: 20, fontWeight: 'bold'}}>My Company</Text>  ,
            headerStyle: { backgroundColor: Colors.whiteColor, height: 60},
            headerTitleStyle: {color: '#a7c3f2'},
            headerLeft: <MenuIcon {...navigation} />,
            headerRight: <LogoIcon {...navigation} />,
        }),
    },
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