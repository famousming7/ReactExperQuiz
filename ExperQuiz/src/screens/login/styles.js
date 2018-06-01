
import {Colors} from '@theme';

export default {

    container: {
        flex: 1, 
        marginTop:20,
        flexDirection: 'column',
        width:'100%'
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
        alignItems:'center'
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
        height:25,
        justifyContent:'center',
        paddingLeft:8,
        backgroundColor: Colors.lightGrayColor
    },
    inputEmail:{

    }
    
};
