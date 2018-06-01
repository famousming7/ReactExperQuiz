/**
 * @providesModule @api
 */

import React, { Component } from 'react';
import {
    Platform,
    AsyncStorage
} from 'react-native';

const API_ROOT = "http://backup.experquiz.com/mobile"
const API_SIGNIN = API_ROOT + "/signin"
const API_EVALUTION_LIST= API_ROOT + "/evals/"

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

export async function postJSONwithCache(url, json) {
    
    const cachedPostsKey = "cached_posts"
    const cached = await AsyncStorage.getItem(cachedPostsKey)
    let cachedPosts =  JSON.parse(cached)
    let newCachedPosts = []

    if(cachedPosts != null)
        for (const cachedPost of cachedPosts) {
            try {
                await fetch(cachedPost.url, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(cachedPost.json),
                });
            } catch (error) {
                newCachedPosts.push(cachedPost)
            }        
        }

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
        console.log(responseJson)
        return responseJson
        
    } catch (error) {
        console.log("error", error)
        var cachedPost = {}
        cachedPost.url = url
        cachedPost.json = json
        newCachedPosts.push(cachedPost)        
    }
    await AsyncStorage.setItem(cachedPostsKey, JSON.stringify(newCachedPosts))    
    return null        
}

export async function checkLogin(email,password, fromCached = false) {
    var bindData = {
        'email' : email,
        'password': password
    }
    return await postJSONwithCache(API_SIGNIN, bindData)
}