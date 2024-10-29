import { StyleSheet} from 'react-native';

export default styles = StyleSheet.create({
    text_777:{
      color:'#777'
    },
    card: {
      backgroundColor:"#fff",
      borderRadius: 10,
      elevation: 5,
      shadowColor: '#7'
    },
    input: {
      fontSize: 15,
      borderBottomWidth: 1.5,
      borderBottomColor: '#999',
      padding: 2,
    },
    focused:{
      borderBottomColor: '#6389c9'
    },
    redText:{
      color: '#d13838',
    },
    redBorder:{
      borderBottomColor: '#d13838'
    },
    outlineButton:{
      flexDirection:'row',
      alignItems:'center',
      marginRight: 5,
      borderWidth: 1,
      paddingVertical:6,
      paddingHorizontal:10,
      borderColor: '#333',
      borderRadius: 7,
    },
    outlineButtonTextM:{
      fontSize: 16,
      color:'#333'},
    outlineButtonTextL:{
      fontSize: 18,
      color:'#333'
    },
    outlineButtonCluster:{
      flexDirection:'row',
      flexWrap:'wrap',
      justifyContent:'flex-start',
      alignContent:'flex-start',
      alignItems:'flex-start'
    },
    sectionTitle:{
      fontSize: 18,
      fontWeight: '500',
      color:'#333',
      marginBottom:8
    },
    inputBox:{
      backgroundColor:"#fff",
      borderRadius: 10,
      elevation: 1,
      shadowColor: '#7',
      paddingHorizontal: 15,
      paddingVertical:10
    },
    searchResult:{
      paddingVertical:9, 
      paddingHorizontal:5, 
      borderBottomWidth:0.5, 
      borderColor:'#999'
    },
    popButton:{
      backgroundColor:"#fff",
      elevation: 5,
      shadowColor: '#7',
      padding: 15,
      borderRadius: 18,
      flexDirection:'row', justifyContent:'space-evenly', alignItems:'center'
    },
    seperator:{
      borderBottomColor:'#aaa', 
      borderBottomWidth:1
    },
    avatar: {
      borderRadius: 18,
      width: 36,
      height: 36
    },
  });