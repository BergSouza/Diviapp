import {StyleSheet} from 'react-native'

const styles = StyleSheet.create({
    container: {
        paddingLeft: 20,
        paddingRight: 20
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
});

export default styles;