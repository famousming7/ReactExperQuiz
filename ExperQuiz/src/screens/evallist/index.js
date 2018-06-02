import React, { Component } from 'react';
import {
    View,
    Text,
    Button,
    FlatList
} from 'react-native';

import {Colors,Images} from '@theme';
import Styles from './styles';
import { Loader,Strings } from '@components';
import { getEvalsListFromApi} from "@api";
import { DrawerNavigator } from "react-navigation";

export default class Evallist extends Component {

    constructor(props) {
        super(props);

        this.state = ({
            loaderVisible: false,
            evaluationsArray: [],
        })

        //this.getNewList()
    }

    async componentDidMount(){

        this.getNewList()
    }
    
    async getNewList(){

        this.setState({loaderVisible: true})
        let newList = await getEvalsListFromApi()
        console.log(newList)
        this.setState({
            evaluationsArray:newList,
            loaderVisible:false
        })

    }

    renderListItem({item, index}){

        const {navigate} = this.props.navigation

        return (
            <View style={Styles.listitem}>
            </View>
        )
    }

    render() {

        return (
            <View style={Styles.container}>
                <Loader loading={this.state.loaderVisible}/>
                <View style={Styles.viewTitle}>
                    <Text style={Styles.textTitle}>Your evaluations</Text>
                    {/* <Button title="getNewList" onPress={this.getNewList.bind(this)} /> */}
                </View>
                <View style={Styles.viewlistCount}>
                    <Text style={Styles.textlistCount}>There are {this.state.evaluationsArray.length} ratings pending</Text>
                </View>
                <View style={Styles.viewLists}>
                    <FlatList
                        data = {this.state.evaluationsArray}
                        renderItem = {this.renderListItem.bind(this)}
                        keyExtractor = {(item,index) => index.toString()}
                    />
                </View>
            </View>
        )
    }
};