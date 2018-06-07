import React, { Component } from 'react';
import {
  View,
  StatusBar
} from 'react-native';
import {LoginNav,LoggedinNav} from "./Router";
import {checkLoginToken} from '@api';

export default class App extends Component {

  constructor(props) {
    super(props);

    this.state=({
        isLoggedin: 0
    })    

  }

  async componentWillMount(){
    let token =  await checkLoginToken()
    this.setState({
      isLoggedin : token == "" ? 1 : 2
    })
  }
  componentDidMount() {
      //StatusBar.setHidden(true);
      StatusBar.setBarStyle("dark-content");
      
  }

  render() {

    return (
          <View style={{width:'100%',height:'100%'}}> 

            { this.state.isLoggedin == 1?
              <LoginNav /> : null
            }
            { this.state.isLoggedin == 2?
              <LoggedinNav /> : null
            }
          </View>
    );
  }
}
