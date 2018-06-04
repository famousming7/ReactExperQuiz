import {Colors} from '@theme';

export default {

    container: {
        flex: 1, 
        paddingTop:0,
        flexDirection: 'column',
        width:'100%',
        backgroundColor:Colors.whiteColor
    },

    viewQuestion:{
        padding:10,
        marginBottom:15,
    },

    viewAnswers:{
        marginTop:10,
        width:'100%',
        flex:1
    },

    scrollAnswers:{
        backgroundColor:Colors.whiteColor,
        width:'100%',
        height:'100%'
    },

    viewItemAnswer:{
        marginTop:10,
        marginLeft:10,
        marginRight:10,
        padding:10,
        backgroundColor:Colors.whiteColor,
        borderWidth:0.3,
        borderColor:Colors.grayColor,        
        shadowColor:Colors.blackColor,
        shadowOffset:{width:0,height:0},
        shadowOpacity:0.2,
        flexDirection:'row'
    },
    textItemAnswer:{
        flex:1,
        fontSize:14,
        paddingLeft:5
    },

    viewExplain:{
        marginTop:30,
        paddingLeft:10,
        paddingRight:10,
        width:'100%',
        height:50,
        flexDirection:'row'
    },

    viewRectRed:{
        width:50,
        height:50,
        backgroundColor:Colors.redColor,
        alignItems:"center",
        justifyContent:'center'
    },

    viewRect:{
        flex:1,
        height:'100%',
        backgroundColor:Colors.lightGrayColor,
        justifyContent:'center',
        paddingLeft:30
    },

    textHint:{
        fontSize:15,
        fontWeight:'bold',
        color:Colors.grayColor
    },

    viewExplainDetail:{
        paddingLeft:60,
        paddingTop:10,
        paddingRight:10,
    },
    textExplain:{
        fontSize:15,
    },
    textRule:{
        fontSize:15,
        paddingBottom:30
    },
    viewRectGray:{
        width:50,
        height:50,
        backgroundColor:Colors.grayColor,
        alignItems:"center",
        justifyContent:'center'
    },

    viewNext:{
        right:0,
        height:'100%',
        position:'absolute',
        alignItems:'flex-end',
        justifyContent:'center'
    },

    viewNextButton:{
        width:50,
        height:50,
        alignItems:'center',
        justifyContent:"center",
        backgroundColor:Colors.blueColor
    }
}