import React, { Component } from 'react';
import {
    View,
    Text,

    FlatList,
    TouchableOpacity,
    BackHandler
} from 'react-native';


import { Icon,Button} from 'native-base';
import {Colors,Images} from '@theme';
import Styles from './styles';
import { Loader,Strings ,LogoIcon} from '@components';
import { getEvalsListFromApi ,getUserInfo} from "@api";
import { DrawerNavigator } from "react-navigation";


const MenuIcon = ({ navigate , openDrawer}) => {
    return (
        <Button  
            style={{backgroundColor: Colors.whiteColor,margin: 5}}
            onPress={() => openDrawer()}>
            <Icon name='bars' type="FontAwesome" style={{color:Colors.redColor}} fontSize={13}/>
        </Button>
    );
}

export default class Evallist extends Component {

    static navigationOptions = ({ navigation }) => {
        const {state} = navigation;
        console.log(state)
        return {
          headerTitle: <View style={{alignItems:'center',width:'100%',height:'100%',justifyContent:'center'}}><Text style={{fontSize: 20, fontWeight: 'bold'}}>{state.params == null? "":state.params.enterprise_name}</Text></View>  ,
          headerLeft:  <MenuIcon {...navigation} />,
          headerStyle: { backgroundColor: Colors.whiteColor, height: 55},
          headerRight: <LogoIcon {...navigation}/>
        };
    };

    constructor(props) {
        super(props);

        this.state = ({
            loaderVisible: false,
            evaluationsArray: [],
            enterprise_name:""
        })

        this.props.navigation.setParams({
            enterprise_name:""
        })
        //this.getNewList()
    }

    async componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        this.getNewList()
        userinfo = await getUserInfo()
        
        this.setState({
            enterprise_name: userinfo.enterprise_name == null ? "My Company": userinfo.enterprise_name
        })
        this.props.navigation.setParams({
            enterprise_name: userinfo.enterprise_name == null ? "My Company": userinfo.enterprise_name
        })
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton() {
        ToastAndroid.show('Back button is pressed', ToastAndroid.SHORT);
        return true;
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

    pressEvaluation(evaluation,index) {

        this.props.navigation.navigate("TestPage",{eval:evaluation})
    }

    renderListItem({item, index}){

        const {navigate} = this.props.navigation

        return (
            <TouchableOpacity style={Styles.viewQuestion} onPress={()=>this.pressEvaluation(item,index)}>
            <View style={Styles.listitem}>
                
                    <View style={[Styles.viewTopic,{'backgroundColor':item.topic_color}]}>
                        <Text style={Styles.textTopic}>{item.topic_short}</Text>
                    </View>
                    <View style={Styles.viewQuestionType}>
                        <Text style={Styles.textQuestionType}>{item.questionnaire_name}</Text>
                    </View>
                    <View style={Styles.viewRightArrow}>
                        <Icon name="play" color={Colors.blueColor} size={18}/>
                    </View>
                
                </View>
            </TouchableOpacity>
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
                    <Text style={Styles.textlistCount}>There are {this.state.evaluationsArray.length} evaluations pending</Text>
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