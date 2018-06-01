
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  StatusBar
} from 'react-native';

import {LoginNav} from "./Router";
import {Colors,Images} from '@theme';

class App extends Component {

  componentDidMount() {
      //StatusBar.setHidden(true);
      StatusBar.setBarStyle("dark-content");
      
  }

  render() {
    return (
        <LoginNav />
    );
  }
}
 export default App;