/**
 * @providesModule @api
 */

import React, { Component } from 'react';
import {
    Platform,
    AsyncStorage,
} from 'react-native';

const API_ROOT = "http://backup.experquiz.com/mobile"
const API_SIGNIN = API_ROOT + "/signin"
const API_LOGOUT = API_ROOT + "/lotout/"
const API_EVALUTION_LIST= API_ROOT + "/evals/"
const mobileToken = "mobile_token"
const key_evaluationList = "evaluation_list"

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

export async function postJSONwithFormData(url, formData) {

    try {
        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        });
        let responseJson = await response.json() 
        
        if (responseJson.status = "ok") {
            /// Save Token in app syncStorage
            AsyncStorage.setItem(mobileToken, responseJson.mobile_token)
        }
        console.log(responseJson)
        return responseJson
        
    } catch (error) {
        console.log("error", error)
    }

    return null        
}

export async function checkLogin(email,password, fromCached = false) {

    let formdata = new FormData();
    formdata.append("email",email);
    formdata.append("password",password);
    return await postJSONwithFormData(API_SIGNIN, formdata)
}

export async function checkLoginToken(){

    const myToken = await AsyncStorage.getItem(mobileToken)
    if (!myToken || myToken == ""){
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
        
        //let timeStamp = Date.now()
        let timeStamp = "1527932622"
        let url = API_EVALUTION_LIST + myToken + "/" + timeStamp
        console.log(url)

        let newItems = await getJSONwithCache(url);
        let arrays =  await getEvalsArrayFrom(newItems)
        console.log("questions",arrays)
        AsyncStorage.setItem(key_evaluationList,JSON.stringify(arrays))

        return arrays
    }
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