import React, { Component } from 'react';
import {
    Platform,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    Button,
    Alert,
    NetInfo,
    KeyboardAvoidingView,
    Linking
} from 'react-native';

import {Colors,Images} from '@theme';
import Styles from './styles';
import { ModalLoader,Strings } from '@components';
import { checkLogin, getEmail,API_URL_SIGNIN} from "@api";

export default class Login extends Component {

    constructor(props) {
        super(props);

        this.state = ({
            loaderVisible: false,
            email:"patrice@experquiz.com",
            password:"Aebuu6ai"
        })
    }

    async componentDidMount(){
        this.setState({
            email: await getEmail()
        })
    }
    changeEmail(text){
        this.setState({
            email:text
        })
    }

    changePassword(text){
        this.setState({
            password:text
        })

    }

    onPressRest(){
        Linking.openURL(API_URL_SIGNIN)
    }

    async onPressSignIn(){
        this.setState({loaderVisible: true})
        console.log("email: ",this.state.email);
        console.log("password: ",this.state.password);
        let response = await checkLogin(this.state.email, this.state.password)
        this.setState({loaderVisible: false})

        setTimeout(()=>{            
            if (response == null){

                Alert.alert(
                    Strings.alertTitle,
                    Strings.networkError,
                    [
                    {text: 'OK',  onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                    ],
                    { cancelable: true }
                )
            } else {

                if (response.status == "ok" && response.message==null) {
                    
                    this.props.navigation.navigate("EvallistMenu")

                } else {

                    Alert.alert(
                        'ExpertQuiz',
                        Strings.loginFailed,
                        [
                        {text: 'OK',  onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                        ],
                        { cancelable: true }
                    )
                }
            }
        }, 200);
    }

    render() {

        return (
            <KeyboardAvoidingView keyboardVerticalOffset={Platform.select({ios: -100, android: 500})} behavior={(Platform.OS === 'ios')? "padding" : null}>
                <View style={Styles.container}>
                    
                    <ModalLoader loading={this.state.loaderVisible}/>                     
                    <View style={Styles.viewlogo}>
                        <Image style={Styles.imgLogo} source={Images.logo}/>
                    </View>

                    <View style={Styles.mainView}>
                    
                        <View style={Styles.viewSign}>
                            <Text style={Styles.textSignin}>Sign-in</Text>
                        </View>

                        <View style={Styles.viewEmail}>
                            <Text style={Styles.textEmail}>Your email address or mobile phone *</Text>
                        </View>

                        <View style={Styles.viewInput}>
                            <TextInput value={this.state.email} style={Styles.inputEmail} maxLength={50} onChangeText={(text)=> this.changeEmail(text)}></TextInput>
                        </View>

                        <View style={Styles.viewPass}>
                            <Text style={Styles.textPass}>Your password *</Text>
                        </View>

                        <View style={Styles.viewInput}>
                            <TextInput value={this.state.password} style={Styles.inputPass} maxLength={30} onChangeText={(text)=> this.changePassword(text)} secureTextEntry={true} ></TextInput>
                        </View>
                    
                        <View style={Styles.viewForgot}>
                            <Text style={Styles.textForgot}>Forgot your password?</Text>
                            <TouchableOpacity onPress={this.onPressRest.bind(this)}>
                                <Text style={Styles.textReset}>Click here to reset it</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={Styles.viewCenter}>
                            <View style={Styles.viewBtnSignin}>
                                <TouchableOpacity onPress={this.onPressSignIn.bind(this)}>
                                    <Text style={Styles.btnSignin}>SIGN-IN</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        
                    </View>
                    
                </View>
            </KeyboardAvoidingView>
        );
    }
    
};