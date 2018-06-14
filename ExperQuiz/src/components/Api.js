/**
 * @providesModule @api
 */

import React, { Component } from 'react';
import {
    Platform,
    AsyncStorage,
} from 'react-native';

//const API_ROOT = "http://www.experquiz.com/mobile"
const API_ROOT = "http://backup.experquiz.com/mobile"
const API_SIGNIN            = API_ROOT + "/signin"
const API_LOGOUT            = API_ROOT + "/logout/"
const API_EVALUTION_LIST    = API_ROOT + "/evals/"
const API_POST_ANSWERS      = API_ROOT + "/evals/"
export const API_URL_SIGNIN        = "http://www.experquiz.com/en/?signin=true"

const mobileToken = "mobile_token"
const emailAddress = "email_address"
const userInfo = "user_info"
const key_evaluationList = "evaluation_list"
const PASSED_EVALUATIONS = "passed_evaluations"
const POSTED_EVALUATIONS = "posted_evaluations"

export async function getJSONwithCache(url, fromCached = false){
    if (fromCached) {
        const cached = await AsyncStorage.getItem(url)
        return JSON.parse(cached)                        
    }else{
        try {
            let response = await fetch(url)
            let json = await response.json() 
            await AsyncStorage.setItem(url, JSON.stringify(json))            
            return json
        } catch (error) {
            try {
                const cached = await AsyncStorage.getItem(url)
                return JSON.parse(cached)                    
            } catch (error) {
                return null
            }
        }    
    }
}

export async function postJSON(url, json) {

    try {
        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(json),
        });
        let responseJson = await response.json() 
        return responseJson
    } catch (error) {
        console.log("error", error)
        return null
    }
    return null        
}

export async function postJSONwithFormData(url, formData) {

    try {
        let response = await fetch(url, {
            method: 'POST',
            timeout: 10000,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        });
        let responseJson = await response.json() 
        return responseJson
    } catch (error) {
        console.log("error", error)
        return null
    }
    return null        
}

export async function checkLogin(email,password, fromCached = false) {

    let formdata = new FormData();
    formdata.append("email",email);
    formdata.append("password",password);
    let response =  await postJSONwithFormData(API_SIGNIN, formdata);
    console.log(response)
    if (response != null && response.status == "ok") {
        /// Save Token in app syncStorage
        AsyncStorage.setItem(mobileToken, response.mobile_token)
        AsyncStorage.setItem(userInfo, JSON.stringify(response))
        AsyncStorage.setItem(emailAddress, email)
    }
    return response

}

export async function getEmail(){

    return await AsyncStorage.getItem(emailAddress) ?  AsyncStorage.getItem(emailAddress) : ""
}

export async function getUserInfo(){

    let userinfo = JSON.parse(await AsyncStorage.getItem(userInfo))
    return userinfo == null ? {enterprise_name:"My Company",first_name:"First",last_name:"last"} : userinfo
}

export async function checkLoginToken(){

    myToken = await AsyncStorage.getItem(mobileToken)
    if (myToken == null){
        return ""
    } else {
        return myToken
    }
}

export async function logOut(){

    let myToken = await AsyncStorage.getItem(mobileToken);
    let url = API_LOGOUT + myToken
    await getJSONwithCache(url);
    AsyncStorage.setItem(mobileToken, "")
}

export async function getEvalsListFromApi(){
    
    let myToken = await AsyncStorage.getItem(mobileToken);
    if (!myToken || myToken == ""){
        return []
    } else {
        
        let timeStamp = parseInt( Date.now() / 1000)
       // let timeStamp = "1527932622"
        let url = API_EVALUTION_LIST + myToken + "/" + timeStamp
        console.log(url)

        let newItems = await getJSONwithCache(url);
        let arrays =  await getEvalsArrayFrom(newItems)
        
        var evalsList = []
        let evals = await AsyncStorage.getItem(key_evaluationList)
        if (evals != null){
            evalsList = JSON.parse(evals)
            for (let oneObj of arrays){
                evalsList.push(oneObj)
            }
        }
        AsyncStorage.setItem(key_evaluationList,JSON.stringify(evalsList))
        return evalsList
    }
}

export async function getEvalsListFromLocal(){

    var evalsList = []
    let evals = await AsyncStorage.getItem(key_evaluationList)
    if (evals != null){
        evalsList = JSON.parse(evals)
    }
    return evalsList
}

export async function getEvalsArrayFrom(obj){

    if (obj.status == "ok"){
        if (obj.evaluations == null){
            return []
        } else {

            var contents = [];
            Object.keys(obj.evaluations).map(function(key){
                var question = obj.evaluations[key]
                question.timestamp = key
                contents.push(question) 
            })
            
            return contents
        }
    } else {
        return []
    }

}

export async function postAnswers(evalution_id,passed_questions, fromCached = false) {
    const myToken = await AsyncStorage.getItem(mobileToken)
    let postData = {
        "evaluation":{
            "evaluation_id":evalution_id,
            "mobile_token":myToken,
            "passed_questions":passed_questions
        }
    };

    let url = API_POST_ANSWERS + myToken
    let response =  await postJSON(url, postData);

    if (response != null && response.status =="ok"){
        savePostedEvalutionId(evalution_id)
    }
    return response
}

async function savePostedEvalutionId(evalution_id){
    evalsList = []
    let evals = await AsyncStorage.getItem(POSTED_EVALUATIONS)
    if (evals != null){
        evalsList = JSON.parse(evals)
    }
    evalsList.push(evalution_id)
    AsyncStorage.setItem(POSTED_EVALUATIONS,JSON.stringify(evalsList))
}

export async function getPostedEvalutionIds(){

    evalsList = []
    let evals = await AsyncStorage.getItem(POSTED_EVALUATIONS)
    if (evals != null){
        evalsList = JSON.parse(evals)
    }
    return evalsList
}

export async function savePassedEvaluation(evalution_id,passed_questions) {

    const myToken = await AsyncStorage.getItem(mobileToken)
    let postData = {
        "evaluation_id":evalution_id,
        "mobile_token":myToken,
        "passed_questions":passed_questions
    };

    var passedEvals = []
    let evals = await AsyncStorage.getItem(PASSED_EVALUATIONS)
    if (evals != null){
        passedEvals = JSON.parse(evals)
    }
    passedEvals.push(postData)
    await AsyncStorage.setItem(PASSED_EVALUATIONS,JSON.stringify(passedEvals))
}

export async function getPassedEvaluations() {
    var passedEvals = []
    let evals = await AsyncStorage.getItem(PASSED_EVALUATIONS)
    if (evals != null){
        passedEvals = JSON.parse(evals)
    }

    return passedEvals
}

export async function postUnpostedAnswers(){

    var passedEvals = []
    let evals = await AsyncStorage.getItem(PASSED_EVALUATIONS)
    if (evals != null){
        passedEvals = JSON.parse(evals)
    }
    let postedIDs = await getPostedEvalutionIds()
    for (let answer of passedEvals){
        if(postedIDs.indexOf(answer.evaluation_id)  == -1){

            await postAnswers(answer.evaluation_id,answer.passed_questions)
        }
    }
}

export async function deleteEval(evaluation_id){
    var evalsList = await getEvalsListFromLocal()
    var newList = []
    for (let obj of evalsList){
        if (obj.evaluation_id != evaluation_id){
            newList.push(obj)
        }
    }
    await AsyncStorage.setItem(key_evaluationList,JSON.stringify(newList))
}