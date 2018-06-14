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
import { getEvalsListFromApi ,getUserInfo, getPassedEvaluations, getPostedEvalutionIds,getEvalsListFromLocal,postUnpostedAnswers,deleteEval} from "@api";
import { copy } from '@utils';

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

        var refreshTimer;
        this.state = ({
            loaderVisible: false,
            evaluationsArray: [],
            sortedEvaluationArray:[],
            enterprise_name:"",
            passedEvaluations:[],
            postedEvaluationIDs:[],
            isOnline : false
        })

        this.props.navigation.setParams({
            enterprise_name:""
        })
    }

    async componentDidMount(){
        NetInfo.isConnected.addEventListener('connectionChange', await this.handleConnectionChange);
        NetInfo.isConnected.fetch().then(async(isConnected) =>{
            
            this.setState({
                isOnline: isConnected
            })

            if(isConnected){
                await this.getNewListFromAPI()
            }
        });

        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        
        userinfo = await getUserInfo()
        this.setState({
            enterprise_name: userinfo.enterprise_name == null ? "My Company": userinfo.enterprise_name,
        })
        this.props.navigation.setParams({
            enterprise_name: userinfo.enterprise_name == null ? "My Company": userinfo.enterprise_name
        })

        await this.getListFromLocal()
        await this.getPassAndPostedEvals()

        this.refreshTimer = setInterval(async()=>{
            if(this.state.isOnline){
                await this.getNewListFromAPI()
            }
        },30000) // 30 seconds
        
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectionChange);
        clearInterval(this.refreshTimer)
    }

    handleConnectionChange = async (isConnected) => {

        this.setState({
            isOnline: isConnected,
        })

        if (isConnected){
            await this.getNewListFromAPI()
            await postUnpostedAnswers()
            
        } else {
            await this.getListFromLocal()
            
        }
        await this.getPassAndPostedEvals()
    }
    
    async getPassAndPostedEvals(){
        this.setState({
            passedEvaluations: await getPassedEvaluations(),
            postedEvaluationIDs: await getPostedEvalutionIds()
        })
    }
    async componentWillReceiveProps(){

        await this.getPassAndPostedEvals() 
        setTimeout(() => {
            this.setState({
                sortedEvaluationArray:this.reOrderEvalList(this.state.evaluationsArray)
            })
        }, 100);
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

    async getNewListFromAPI(){

        this.setState({loaderVisible: true})
        let newList = await getEvalsListFromApi()
        this.setState({
            evaluationsArray:newList,
            sortedEvaluationArray:this.reOrderEvalList(newList),
            loaderVisible:false
        })
    }

    async getListFromLocal(){

        let newList = await getEvalsListFromLocal()
        this.setState({
            evaluationsArray:newList,
            sortedEvaluationArray:this.reOrderEvalList(newList),
            loaderVisible:false
        })
    }

    calcPendings(){
        pendings = 0 
        if(this.state.sortedEvaluationArray.length > 0){
            for (let obj of this.state.sortedEvaluationArray){
                if (!this.checkAlreadyPassed(obj.evaluation_id )){                    
                    pendings++
                }
            }
        } 
        return pendings <= 1 ? pendings + " evalution" : pendings + " evaluations"
    }

    async deleteEvalution(evaluation_id,index) {

        Alert.alert(
            "",
            Strings.sureToRemove,
            [
            {text: 'YES',  onPress: async() => {
                await deleteEval(evaluation_id)
                await this.getListFromLocal()
            }, style: 'cancel'},
            {text: 'NO',  onPress: () => console.log('cancel'), style: 'cancel'},
            ],
            { cancelable: true }
        ) 
    }

    reOrderEvalList(arrays){
        
        let copyArray = copy(arrays)
        var sort1Arr = []
        var sort2Arr = []
        var sort3Arr = []
        if(copyArray.length > 0){
            for (let obj of copyArray){
                if (this.checkAlreadyPosted(obj.evaluation_id )){                    
                    sort3Arr.push(obj)
                } else if (this.checkAlreadyPassed(obj.evaluation_id ) != false){    
                    sort2Arr.push(obj)
                } else {
                    sort1Arr.push(obj)
                }
            }
        } 

        return [...sort1Arr, ...sort2Arr, ...sort3Arr]
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

    pressEvaluation(evaluation) {
        
        var arr = this.checkAlreadyPassed(evaluation.evaluation_id)

        if (arr == false || arr.length == 0 ) {
            this.props.navigation.navigate("TestPage",{eval:evaluation})            
        } else {
            this.props.navigation.navigate("ResultPage",{evalution_id:evaluation.evaluation_id,passed_questions:arr,is_onlyview:true})
        }
    }

    checkAlreadyPassed(evaluation_id){
        
        if(this.state.passedEvaluations.length > 0){
            for (let obj of this.state.passedEvaluations){
                if (obj.evaluation_id == evaluation_id){                    
                    return obj.passed_questions
                }
            }
        }
        return false
    }

    checkAlreadyPosted(evaluation_id){
        return this.state.postedEvaluationIDs.indexOf(evaluation_id)  != -1
    }

    renderListItem({item, index}){

        return (
            <TouchableOpacity style={Styles.viewQuestion} onPress={()=>this.pressEvaluation(item)}>
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
                        { this.checkAlreadyPosted(item.evaluation_id) != false ?
                        <TouchableOpacity style={Styles.deleteIcon} onPress={()=>this.deleteEvalution(item.evaluation_id,index)}>
                            <Icon name="trash" type="FontAwesome" style={{color:Colors.blueColor,fontSize:14}} />
                        </TouchableOpacity>
                        :  this.checkAlreadyPassed(item.evaluation_id) == false ?
                        <Icon name="play" type="FontAwesome" style={{color:Colors.blueColor,fontSize:14}} />
                        : null}
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
                </View>
                <View style={Styles.viewlistCount}>
                    <Text style={Styles.textlistCount}>There are {this.calcPendings()} pending</Text>
                </View>
                <View style={Styles.viewLists}>
                    <FlatList
                        data = {this.state.sortedEvaluationArray}
                        renderItem = {this.renderListItem.bind(this)}
                        keyExtractor = {(item,index) => index.toString()}
                        extraData={this.state}
                    />
                </View>
            </View>
        )
    }
};