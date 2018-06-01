
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  StatusBar
} from 'react-native';

import {LoginNav} from "./Router";

class App extends Component {

  componentDidMount() {
    StatusBar.setHidden(true);
  }

  render() {
    return (
        <LoginNav />
    );
  }
}
 export default App;