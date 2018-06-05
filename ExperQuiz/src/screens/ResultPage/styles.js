import {Colors} from '@theme';

export default {

    container: {
        flex: 1, 
        paddingTop:0,
        flexDirection: 'column',
        width:'100%',
        backgroundColor:Colors.lightGrayColor
    },

    viewQuestion:{
        marginTop:25,
        width:'100%',
        alignItems:'center'
    },

    textQuestion:{
        color:Colors.grayColor,
        fontSize:12,
        fontWeight:'bold'
    },

    viewResult:{
        marginTop:5,
        width:'100%',
        alignItems:'center',
        justifyContent:'center',
        flexDirection:"row"
    },
    textResultBig:{
       
        color:Colors.blueColor,
        fontSize:23,
        fontWeight:'bold',
    },
    textResultSmall:{
        marginTop:9,
        color:Colors.blueColor,
        fontSize:15,
    }
}