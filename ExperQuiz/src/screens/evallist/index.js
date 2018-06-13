import React, { Component } from 'react';
import {
    View,
    Text,
    Alert,
    FlatList,
    TouchableOpacity,
    BackHandler,
    NetInfo
} from 'react-native';


import { Icon,Button} from 'native-base';
import {Colors} from '@theme';
import Styles from './styles';
import { Loader,Strings ,LogoIcon} from '@components';
import { getEvalsListFromApi ,getUserInfo, getPassedEvaluations, checkNetworkStatus} from "@api";


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
            enterprise_name:"",
            passedEvaluations:[],
            isOnline : false
        })

        this.props.navigation.setParams({
            enterprise_name:""
        })
    }

    async componentDidMount(){
        
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);
        NetInfo.isConnected.fetch().then(isConnected =>{
            this.setState({
                isOnline: isConnected
            })
        });

        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        
        userinfo = await getUserInfo()
        this.setState({
            enterprise_name: userinfo.enterprise_name == null ? "My Company": userinfo.enterprise_name
        })
        this.props.navigation.setParams({
            enterprise_name: userinfo.enterprise_name == null ? "My Company": userinfo.enterprise_name
        })

        await this.getNewList()
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectionChange);
    }

    handleConnectionChange = (isConnected) => {

        this.setState({
            isOnline: isConnected
        })
    }
    
    async componentWillReceiveProps(){

        this.setState({
            passedEvaluations: await getPassedEvaluations()
        })  

    }

    handleBackButton() {
        //ToastAndroid.show('Back button is pressed', ToastAndroid.SHORT);
        Alert.alert(
            "",
            Strings.exitApp,
            [
                {text: 'YES',  onPress: () => {
                    BackHandler.exitApp();
                }, style: 'cancel'},
                {text: 'NO',  onPress: () => console.log('cancel'), style: 'cancel'},
            ],
            { cancelable: true }
        )         
        return true;
    }

    async getNewList(){

        this.setState({loaderVisible: true})
        let newList = await getEvalsListFromApi()
        this.setState({
            evaluationsArray:newList,
            loaderVisible:false
        })
    }


    deleteEvalution(evaluation,index) {

        Alert.alert(
            "",
            Strings.sureToRemove,
            [
            {text: 'YES',  onPress: () => {
                this.setState({
                    evaluationsArray: this.state.evaluationsArray.filter((_, i) => i !== index)
                });
            }, style: 'cancel'},
            {text: 'NO',  onPress: () => console.log('cancel'), style: 'cancel'},
            ],
            { cancelable: true }
        ) 
    }

    calcPassedScore(evaluation){
        var arr = this.checkAlreadyPassed(evaluation.evaluation_id)
        var score = 0
        var totalScore = 0
        for ( question of arr){

            totalScore += question.real_score

            if (question.correct){
                score += question.score
            }
        }

        return "completed with " + score + "/" + totalScore
    }

    pressEvaluation(evaluation,index) {
        
        var arr = this.checkAlreadyPassed(evaluation.evaluation_id)

        if (arr == false || arr.length == 0 ) {
            this.props.navigation.navigate("TestPage",{eval:evaluation})            
        } else {
            this.props.navigation.navigate("ResultPage",{evalution_id:evaluation.evaluation_id,passed_questions:arr,is_onlyview:true})
        }
    }

    checkAlreadyPassed(evaluation_id){

        if(this.state.passedEvaluations.length > 0){
            for (obj of this.state.passedEvaluations){
                if (obj.evaluation_id == evaluation_id){                    
                    return obj.passed_questions
                }
            }
        }
        return false
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
                        { this.checkAlreadyPassed(item.evaluation_id) != false ?
                        <Text style={Styles.textPassResult}>{this.calcPassedScore(item)}</Text>
                        : null}
                    </View>
                    <View style={Styles.viewRightArrow}>
                        { this.checkAlreadyPassed(item.evaluation_id) != false ?
                        <TouchableOpacity style={Styles.deleteIcon} onPress={()=>this.deleteEvalution(item,index)}>
                            <Icon name="trash" type="FontAwesome" style={{color:Colors.blueColor,fontSize:14}} />
                        </TouchableOpacity>
                        :
                        <Icon name="play" type="FontAwesome" style={{color:Colors.blueColor,fontSize:14}} />
                        }
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
                        extraData={this.state}
                    />
                </View>
            </View>
        )
    }
};