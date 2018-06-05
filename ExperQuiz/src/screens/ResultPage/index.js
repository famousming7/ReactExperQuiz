import React, { Component } from 'react';
import {
    View,
    Alert,
    Image
} from 'react-native';

import { Button, Icon, Text} from 'native-base';
import {Colors,Images} from '@theme';
import Styles from './styles';

const BackIcon = ({ navigate }) => {
    return (
        <Button  
            style={{backgroundColor: Colors.redColor,margin: 5}}
            onPress={() => navigate('Evallist')}>
            <Icon name='arrow-left'  type="FontAwesome" style={{color:Colors.whiteColor,fontSize:20}}/>
        </Button>
    );
}

const LogoIcon = ({ navigate }) => {
    return (
            <Image style={{width:45,height:40}} source = {Images.logo}/>
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

        let passed_questions =  props.navigation.getParam('passed_questions')
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
            evaluation_id : props.navigation.getParam('evaluation_id'),
            passed_questions : passed_questions,
            score:score,
            totalScore:totalScore,
            success:successPercent,
            timespent:timespent
        });
    }

    render() {

        return (
            <View style={Styles.container}>

                <View style={Styles.viewQuestion}>
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
        )
    }

}