import React, { Component } from 'react';
import {
    View,
    Alert,
    ScrollView,
    TouchableOpacity,
    Image
} from 'react-native';
import * as Progress from 'react-native-progress';
import { Button, Icon, Text} from 'native-base';
import {Colors,Images} from '@theme';
import Styles from './styles';
import { Loader,Strings } from '@components';
import TimerCountdown from 'react-native-timer-countdown'

const ANIMATION_TIMEOUT = 50;

const BackIcon = ({ goBack }) => {
    return (
        <Button  
            style={{backgroundColor: Colors.redColor,margin: 5}}
            onPress={() => goBack()}>
            <Icon name='arrow-left'  type="FontAwesome" style={{color:Colors.whiteColor,fontSize:20}}/>
        </Button>
    );
}

const TitleView =  ({ index,total ,remaining,timing}) => {
    return (
        <View style={{width:'100%',height:'100%',justifyContent:'center',alignItems:"center"}}>
            <View style={{flex:1,justifyContent:'center'}}>
                <Text style={{fontSize:20,color:Colors.blueColor,fontWeight:'bold'}}>{index>=0 ?index+1:""} / {total>=0 ? total:""}</Text>
            </View>            
            <View style={{height:13,width:'100%'}}>
                <Progress.Bar progress={timing>0 ? (timing-remaining)/timing: 0.01} width={null} color = {Colors.blueColor} borderRadius = {2}/>
            </View>
            <View style={{position:'absolute',right:0,bottom:15,alignItems:'flex-end',justifyContent:"flex-end"}}>
                    <Text style={{fontSize:16,color:Colors.blueColor}}>{remaining}</Text>
            </View>
        </View>
    );
}

const LogoIcon = ({ navigate }) => {
    return (
            <Image style={{width:45,height:40}} source = {Images.logo}/>
    );
}

export default class TestPage extends Component {

    
    static navigationOptions = ({ navigation }) => {
        const {state} = navigation;

        return {
          headerTitle: <TitleView index={state.params.index} total={state.params.totalCount} remaining={state.params.remaining} timing={state.params.timing}/> ,
          headerLeft: <BackIcon {...navigation} />,
          headerStyle: { backgroundColor: Colors.whiteColor, height: 55},
          headerRight: <LogoIcon {...navigation}/>
        };
    };

    constructor(props) {
        super(props);
        var countTimer;

        this.state=({
            cQIndex: 0,
            cQTiming : 0,
            cQRemaining: 0,
            cQuestion:{
                explain:"",
                nanswers:[],
                question_id:"",
                question_text:"",
                rule:"",
                score:0,
                timing:0,
                title:""
            },
            cQAnswer:{},
            cQAnswered:false,
            evalution: props.navigation.getParam('eval'),
            passed_questions:[]
        })

    }

    componentWillMount(){
        
        if(this.state.evalution.questions.length > 0){

            this.setState({
                cQuestion:this.state.evalution.questions[0],
                cQIndex:0,
                cQTiming:this.state.evalution.questions[0].timing,
                cQRemaining:this.state.evalution.questions[0].timing
            });
            setTimeout(() => {
              
                this.setNavigationValues()
                this.startTimer()
            }, ANIMATION_TIMEOUT);

        } else {

            Alert.alert(
                Strings.alertTitle,
                Strings.noQuestion,
                [
                  {text: 'Back',  onPress: () => this.props.navigation.goBack(), style: 'cancel'},
                ],
                { cancelable: true }
            )            
        }
    }

    setNavigationValues(){

        this.props.navigation.setParams({
            totalCount:this.state.evalution.questions.length,
            index:this.state.cQIndex,
            remaining:this.state.cQRemaining,
            timing:this.state.cQTiming,
        })
    }

    startTimer(){

        if (this.state.cQTiming > 0){
            this.countTimer = setInterval(()=>{
                if(this.state.cQRemaining<=0){

                    clearInterval(this.countTimer)
                    alert("end")
                } else{
                    this.setState({
                        cQRemaining : this.state.cQRemaining - 1
                    })

                    setTimeout(() => {                    
                        this.setNavigationValues()
                    }, ANIMATION_TIMEOUT)
                }
            },1000)
        }
    }

    youFailed(){

    }

    selectAnswer(answer){
        
        if (!this.state.cQAnswered) {
            this.setState({
                cQAnswer :answer,
                cQAnswered: true
            })
            clearInterval(this.countTimer)
        }
    }

    getAnswersListView(){

        const listItems = []
        for (answer of this.state.cQuestion.nanswers){

            let mAnswer = answer
            backColor = Colors.whiteColor
            leftBorderWidth = 0.3
            if (this.state.cQAnswered){
                if (answer.correct){
                    leftBorderWidth = 3
                    backColor = Colors.greenColor
                } else {
                    if(answer.answer_text == this.state.cQAnswer.answer_text){
                        backColor = Colors.redColor
                        leftBorderWidth = 3
                    }
                }
            }

            listItems.push(

                <TouchableOpacity onPress={()=>this.selectAnswer(mAnswer)} key={answer.answer_text}>
                    <View style={[Styles.viewItemAnswer,{borderLeftWidth:leftBorderWidth,borderLeftColor:backColor}]} key={answer.answer_text}>               
                                
                        <Text style={Styles.textItemAnswer} >{answer.answer_text}</Text>
                    </View>
                </TouchableOpacity>
            )
        }
        return listItems
    }

    render() {

        return (
            <View style={Styles.container}>
                
                <View style={Styles.viewAnswers}>
                    <ScrollView style={Styles.scrollAnswers}>

                        <View style={Styles.viewQuestion}>
                            <Text >{this.state.cQuestion.question_text}</Text>
                        </View>

                        <View style={Styles.viewListAnswers}>
                            {this.getAnswersListView()}
                        </View>

                        { this.state.cQAnswered == false ? null :
                            <View>
                                <View style={Styles.viewExplain}>
                                    <View style={Styles.viewRectRed}>
                                        <Icon name='times'  type="FontAwesome" style={{color:Colors.whiteColor,fontSize:25}}/>
                                    </View>
                                    <View style={Styles.viewRect}>
                                        <Text style={Styles.textHint}>EXPLAIN</Text>
                                    </View>
                                </View>                      
                            
                                <View style={Styles.viewExplainDetail}>
                                    <Text style={Styles.textExplain}>{this.state.cQuestion.explain}</Text>
                                </View>

                                <View style={Styles.viewExplain}>
                                    <View style={Styles.viewRectGray}>
                                        <Icon name='times'  type="FontAwesome" style={{color:Colors.whiteColor,fontSize:25}}/>
                                    </View>
                                    <View style={Styles.viewRect}>
                                        <Text style={Styles.textHint}>RULE</Text>
                                    </View>
                                </View>

                                <View style={Styles.viewExplainDetail}>
                                    <Text style={Styles.textRule}>{this.state.cQuestion.rule}</Text>
                                </View>
                            </View>
                        }
                    </ScrollView>
                </View>
            </View>
        )
    }
};