
import {Colors} from '@theme';

export default {

    container: {
        flex: 1, 
        marginTop:0,
        flexDirection: 'column',
        width:'100%',
        backgroundColor:Colors.whiteColor
    },

    viewlogo:{
        marginTop:100,
        width:'100%',
        height:100,
        alignItems:'center'
    },

    imgLogo:{        
        width:100,
        height:100,
    },

    viewSign:{
        margin:30,
        //alignItems:'center'
    },
    textSignin:{
        fontSize: 20,
        fontWeight:'bold',
        color: Colors.blueColor
    },
    viewEmail:{
        marginLeft:30,
        marginBottom:10,
    },
    textEmail:{
        fontSize: 15,
        fontWeight:'bold',
        color: Colors.grayColor
    },
    viewInput:{
        marginLeft:30,
        marginRight:30,
        height:35,
        justifyContent:'center',
        paddingLeft:8,
        backgroundColor: Colors.lightGrayColor
    },

    inputEmail:{

    },

    viewPass:{
        marginLeft:30,
        marginBottom:10,
        marginTop:20,
        
    },
    textPass:{
        fontSize: 15,
        fontWeight:'bold',
        color: Colors.grayColor
    },

    viewForgot:{
        marginBottom:10,
        marginTop:10,
        flexDirection:"row",
        justifyContent:'center'
    },
    textForgot:{
        fontSize:15,
        color:Colors.blackColor
    },
    textReset:{
        marginLeft:10,
        fontSize:15,
        color:Colors.redColor
    },

    viewCenter:{
        marginTop:20,
        alignItems:'center'
    },

    viewBtnSignin:{
        
        alignItems:'center',
        justifyContent:'center',
        height:40,
        width:120,
        backgroundColor:Colors.blueColor
    },

    btnSignin:{
        justifyContent:'center',
        fontSize:15,
        fontWeight:'bold',
        alignItems:'center',
        
        color:Colors.whiteColor
    }
    
};
