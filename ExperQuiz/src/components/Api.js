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
const API_EVALUTION_LIST= API_ROOT + "/evals/"
const mobileToken = "mobile_token"

export async function getJSONwithCache(url, fromCached){
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
    
    const mobileToken = "mobile_token"

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
            AsyncStorage.setItem(mobileToken, responseJson.status)
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
    if (!myToken || myToken != ""){
        return ""
    } else {
        return myToken
    }
}

export async function logOut(){

    await AsyncStorage.setItem(mobileToken, "")
}