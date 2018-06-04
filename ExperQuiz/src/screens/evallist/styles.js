import {Colors} from '@theme';

export default {

    container: {
        flex: 1, 
        marginTop:0,
        paddingTop:20,
        paddingBottom:10,
        flexDirection: 'column',
        width:'100%',
        backgroundColor:Colors.lightGrayColor
    },

    viewTitle:{
        paddingLeft:10,
        marginTop:5,
        marginBottom:5
    },
    textTitle:{
        fontSize:20,
        fontWeight:'bold'
    },

    viewlistCount:{
        paddingLeft:10,
        marginTop:5,
        marginBottom:5
    },
    textlistCount:{
        fontSize:16,
        fontWeight:'bold'
    },

    viewLists:{
        flex:1,
        marginTop:10,
        width:'100%',
        backgroundColor:Colors.lightGrayColor
    },

    listitem:{
        width:'100%',
        marginTop:10,
        paddingLeft:10,
        paddingRight:10,
        height:50,
        backgroundColor:Colors.whiteColor,
        justifyContent:'center',
        alignItems:'center',
        flexDirection:"row"
    },

    viewTopic:{
        width:40,
        height:40,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:Colors.blueColor,
    },

    textTopic:{
        color:Colors.whiteColor,
        fontSize:16
    },

    viewQuestionType:{
        flex:1,
        height:40,
        justifyContent:'center',
        
    },
    textQuestionType:{
        marginLeft:20,
        color:Colors.blueColor,
        fontSize:16,
        fontWeight:'bold'
    },

    viewRightArrow:{
        width:40,
        height:40,
        justifyContent:'center',
        alignItems:'center',
    }
}