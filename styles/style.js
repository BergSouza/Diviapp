import { reload } from 'firebase/auth';
import {StyleSheet} from 'react-native'

const styles = StyleSheet.create({
    container: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 50,
    },
    title: {
        fontSize: 50,
        backgroundColor: '#0fe',
        alignSelf: 'stretch',
        textAlign: 'center',
    },
    input: {
        margin: 5,
        height: 50,
        fontSize: 25,
        textAlign: 'center',
        color: '#088',
        borderColor: '#aaa',
        borderWidth: 1,
        borderRadius: 10
    },
    picker: {
        margin: 5,
        height: 50,
        backgroundColor: 'rgba(0,0,0,0)',
        width: '97%',
        borderColor: '#aaa',
        borderWidth: 1,
        borderRadius: 10,
    },
    picketText: {
        fontSize: 25,
        textAlign: 'center',
        color: '#088',
    },
    title1: {
        textAlign: "center", 
        fontSize: 30
    },
    p1: {
        fontSize: 20
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
      centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
      },
      label: {
        fontSize: 25,
        marginLeft: 10,
        color: 'rgba(0,0,0,0.5)'
      },
      card:{
        borderWidth: 2,
        borderColor: 'rgba(0,0,0,0.5)',
        marginBottom: 10,
        borderRadius: 10,
        backgroundColor: '#C3FFF5'
      },
      cardTitle:{
        textAlign: 'center',
        fontSize: 35
      },
      cardTexto: {
        textAlign: 'center',
        fontSize: 20
      }
});

export default styles;