import React, { Component } from 'react';
import {
    View,
    Alert,
    Image,
    BackHandler,
    NetInfo
} from 'react-native';

import { Button, Icon, Text} from 'native-base';
import {Colors,Images} from '@theme';
import { Loader,Strings } from '@components';
import Styles from './styles';
import { postAnswers , savePassedEvaluation} from "@api";
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

const BackIcon = ({ navigate }) => {
    return (
        <Button
            style={{backgroundColor: Colors.whiteColor,margin: 5}}
            onPress={() => navigate('Evallist',{'update':1})}>
            <Icon name='chevron-left'  type="FontAwesome" style={{color:Colors.redColor,fontSize:25}}/>
        </Button>
    );
}

const LogoIcon = ({ navigate }) => {
    return (
            <Image style={{width:50,height:'100%'}} source = {Images.logo}/>
    );
}

export default class ResultPage extends Component {

    static navigationOptions = ({ navigation }) => {
        const {state} = navigation;

        return {
          headerTitle: "Result",
          headerLeft: <BackIcon {...navigation} />,
          headerStyle: { backgroundColor: Colors.whiteColor, height: 55},
          headerRight: <LogoIcon {...navigation}/>
        };
    };

    constructor(props) {
        super(props);
        this.backButtonListener  = null;
        let passed_questions =  props.navigation.getParam('passed_questions')
        let evaluation_id  =  props.navigation.getParam('evaluation_id')

        score = 0
        totalScore = 0
        success = 0
        timespent = 0
        successPercent = 0
        console.log(passed_questions)
        for ( question of passed_questions){

            totalScore += question.real_score

            if (question.correct){
                success++
                score += question.score
            }

            timespent += question.timespent
        }
        successPercent = parseInt((success / passed_questions.length) * 100)

        this.state = ({
            evaluation_id : evaluation_id,
            passed_questions : passed_questions,
            score:score,
            totalScore:totalScore,
            success:successPercent,
            timespent:timespent,
            loaderVisible:false,
            is_onlyview: props.navigation.getParam('is_onlyview')
        });
    }

    async componentDidMount(){
        this.backButtonListener = BackHandler.addEventListener('hardwareBackPress', ()=>{this.handleBackButton(this.props);return true});
        NetInfo.isConnected.fetch().then(async(isConnected) =>{

            if (isConnected) {
               await this.postAnswer()
            }
        });
        if (!this.state.is_onlyview) {
            await savePassedEvaluation(this.state.evaluation_id,this.state.passed_questions)
        }
    }

    componentWillUnmount() {

        this.backButtonListener.remove();
    }

    async postAnswer(){

        if (!this.state.is_onlyview) {
            this.setState({loaderVisible: true})
            let posted = await postAnswers(this.state.evaluation_id,this.state.passed_questions)
            console.log(posted)
            this.setState({loaderVisible:false})
        }
    }

    handleBackButton(props) {
        props.navigation.navigate('Evallist',{'update':1})
        return true;
    }

    onSwipeLeft(gestureState) {

    }

    onSwipeRight(gestureState) {
        this.props.navigation.navigate('Evallist',{'update':1})
    }

    render() {
        const config = {
            velocityThreshold: 0.3,
            directionalOffsetThreshold: 80
        };

        return (
            <GestureRecognizer
                onSwipeLeft={(state) => this.onSwipeLeft(state)}
                onSwipeRight={(state) => this.onSwipeRight(state)}
                config={config}
                style={{
                    flex: 1,
                }}
                >
                <View style={Styles.container}>
                    <Loader loading={this.state.loaderVisible}/>
                    <View style={Styles.viewTop}>
                        <Text style={Styles.textQuestion}>QUESTION</Text>
                    </View>

                    <View style={Styles.viewResult}>
                        <View style={{marginTop:5}}>
                            <Text style={Styles.textResultBig}>{this.state.passed_questions.length}</Text>
                        </View>
                        <View style={{marginTop:0}}>
                            <Text style={Styles.textResultSmall}>/{this.state.passed_questions.length}</Text>
                        </View>
                    </View>

                    <View style={Styles.viewQuestion}>
                        <Text style={Styles.textQuestion}>SCORE</Text>
                    </View>

                    <View style={Styles.viewResult}>
                        <View style={{marginTop:5}}>
                            <Text style={Styles.textResultBig}>{this.state.score}</Text>
                        </View>
                        <View style={{marginTop:0}}>
                            <Text style={Styles.textResultSmall}>/{this.state.totalScore}</Text>
                        </View>
                    </View>

                    <View style={Styles.viewQuestion}>
                        <Text style={Styles.textQuestion}>SUCCESS</Text>
                    </View>
                    <View style={Styles.viewResult}>
                        <View style={{marginTop:5}}>
                            <Text style={Styles.textResultBig}>{this.state.success}</Text>
                        </View>
                        <View style={{marginTop:0}}>
                            <Text style={Styles.textResultSmall}> %</Text>
                        </View>
                    </View>
                    <View style={Styles.viewQuestion}>
                        <Text style={Styles.textQuestion}>TIME SPENT</Text>
                    </View>
                    <View style={Styles.viewResult}>
                        <View style={{marginTop:5}}>
                            <Text style={Styles.textResultBig}>{this.state.timespent}</Text>
                        </View>
                        <View style={{marginTop:0}}>
                            <Text style={Styles.textResultSmall}> SECS</Text>
                        </View>
                    </View>
                </View>
            </GestureRecognizer>
        )
    }

}
