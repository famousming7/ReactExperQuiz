import {Colors} from '@theme';

export default {

    container: {
        flex: 1, 
        paddingTop:70,
        flexDirection: 'column',
        width:'100%',
        backgroundColor:Colors.lightGrayColor
    },

    menuItem:{
        flexDirection: 'row',
        width:'100%',
        height:50,
        backgroundColor:Colors.whiteColor,
        justifyContent:"center",
        alignItems:'center'
    },

    menuIcon:{
        height:'100%',
        width:50,
        alignItems:'center',
        justifyContent:'center'
    },
    menuText:{
        height:'100%',
        justifyContent:'center',
        flex:1
    },
    textLogout:{
        color:Colors.blueColor,
        fontWeight:'bold'
    }

}