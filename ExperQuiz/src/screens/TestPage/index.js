import React, { Component } from 'react';
import {
    View,
    Alert,
    ScrollView,
    TouchableOpacity,
    Image,
    BackHandler
} from 'react-native';
import * as Progress from 'react-native-progress';
import { Button, Icon, Text} from 'native-base';
import {Colors,Images} from '@theme';
import Styles from './styles';
import { Loader,Strings } from '@components';
import TimerCountdown from 'react-native-timer-countdown'
import { copy } from '@utils';

const ANIMATION_TIMEOUT = 50;

const BackIcon = ({ giveUp }) => {
    return (
        <Button  
            style={{backgroundColor: Colors.whiteColor,margin: 5}}
            onPress={() => 
                Alert.alert(
                    Strings.alertTitle,
                    Strings.giveUp,
                    [
                    {text: 'YES',  onPress: () => giveUp(), style: 'cancel'},
                    {text: 'NO',  onPress: () => console.log('cancel'), style: 'cancel'},
                    ],
                    { cancelable: true }
                ) 
            }>
            <Icon name='chevron-left'  type="FontAwesome" style={{color:Colors.redColor,fontSize:25}}/>
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
            <Image style={{width:50,height:'100%'}} source = {Images.logo}/>
    );
}

export default class TestPage extends Component {

    
    static navigationOptions = ({ navigation }) => {
        const {state} = navigation;

        return {
          headerTitle: <TitleView index={state.params.index} total={state.params.totalCount} remaining={state.params.remaining} timing={state.params.timing}/> ,
          headerLeft: <BackIcon {...navigation} giveUp={state.params.giveUp}/>,
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
            cQISTimeout: false,
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
        BackHandler.addEventListener('hardwareBackPress', () => {return true});
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

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton() {
        ToastAndroid.show('Back button is pressed', ToastAndroid.SHORT);
        return true;
    }

    giveUp(){

        clearInterval(this.countTimer)
        this.props.navigation.goBack()
    }

    setNavigationValues(){

        this.props.navigation.setParams({
            totalCount:this.state.evalution.questions.length,
            index:this.state.cQIndex,
            remaining:this.state.cQRemaining,
            timing:this.state.cQTiming,
            giveUp:this.giveUp.bind(this)
        })
    }

    startTimer(){

        if (this.state.cQTiming > 0){
            this.countTimer = setInterval(()=>{
                if(this.state.cQRemaining<=0){

                    clearInterval(this.countTimer)
                    alert("Time over")
                    this.setState({
                        cQAnswered: true,
                        cQISTimeout: true
                    })
                    this.saveAnswers("",false)

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

    saveAnswers(answer_text,isCorrect){

        let result = {
            question_id:this.state.cQuestion.question_id,
            answer_given:answer_text,
            correct:isCorrect,
            real_score: this.state.cQuestion.score,
            score:isCorrect ? this.state.cQuestion.score : 0 ,
            timespent:this.state.cQTiming - this.state.cQRemaining
        }
        let passed = copy(this.state.passed_questions)
        passed.push(result)

        this.setState({
            passed_questions: passed
        })
        
        setTimeout(() => {
            console.log(this.state.passed_questions)
        }, ANIMATION_TIMEOUT);
    }


    selectAnswer(answer){
        
        if (!this.state.cQAnswered) {
            this.setState({
                cQAnswer :answer,
                cQAnswered: true
            })
            clearInterval(this.countTimer)

            this.saveAnswers(answer.answer_text,answer.correct)
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
                    <View style={[Styles.viewItemAnswer,{borderLeftWidth:leftBorderWidth,borderColor:backColor}]} key={answer.answer_text}>               
                                
                        <Text style={Styles.textItemAnswer} >{answer.answer_text}</Text>
                    </View>
                </TouchableOpacity>
            )
        }
        return listItems
    }

    pressNext(){

        if (this.state.cQAnswered){
                    
            if(this.state.evalution.questions.length > this.state.cQIndex + 1){

                let qIndex = this.state.cQIndex + 1
                this.setState({
                    cQuestion:this.state.evalution.questions[qIndex],
                    cQIndex:qIndex,
                    cQTiming:this.state.evalution.questions[qIndex].timing,
                    cQRemaining:this.state.evalution.questions[qIndex].timing,
                    cQAnswered:false,   
                    cQISTimeout:false                 
                });

                setTimeout(() => {
                
                    this.startTimer()
                }, ANIMATION_TIMEOUT);

            } else {

                Alert.alert(
                    Strings.alertTitle,
                    Strings.finishedQuestion,
                    [
                    {text: 'OK',  onPress: () => this.props.navigation.navigate("ResultPage",{'evaluation_id':this.state.evalution.evaluation_id,'passed_questions':this.state.passed_questions}), style: 'cancel'},
                    ],
                    { cancelable: true }
                )            
            }
        }
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
                                    <View style={[Styles.viewRectRed,{backgroundColor: this.state.cQAnswer.correct ? Colors.greenColor:Colors.redColor}]}>
                                        <Icon name='times'  type="FontAwesome" style={{color:Colors.whiteColor,fontSize:25}}/>
                                    </View>
                                    <View style={Styles.viewRect}>
                                        <Text style={Styles.textHint}>{this.state.cQISTimeout ? "TIME OUT" : this.state.cQAnswer.correct ? "GREAT!" :"NOT QUITE"}</Text>
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
                    { this.state.cQAnswered == false ? null :
                    <View style={Styles.viewNext}>
                        <TouchableOpacity onPress={this.pressNext.bind(this)}>
                            <View style={Styles.viewNextButton}>
                                <Icon name='angle-right'  type="FontAwesome" style={{color:Colors.whiteColor,fontSize:25}}/>
                            </View>
                        </TouchableOpacity>
                    </View>
                    }
                </View>
            </View>
        )
    }
};