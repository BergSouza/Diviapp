import {React, useEffect, useState} from "react";
import {ScrollView, View, Text, TextInput} from 'react-native'
import ButtonPersonalizado from "./ButtonPersonalizado";
import styles from "../styles/style";
import UsuarioService from "../services/UsuarioService";
import MoradiaService from "../services/MoradiaService";

import app from '../firebase/firebase_config';
import { getAuth, getReactNativePersistence } from 'firebase/auth';
import { ReactNativeAsyncStorage } from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

const auth = getAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)  
});
const db = getFirestore(app);

const usuarioService = new UsuarioService
const moradiaService = new MoradiaService    
    
const ListaChatsScreen = ({route, navigation}) => {

    const [moradias, setMoradias] = useState([])
    const [carregado, setCarregado] = useState(false)
    const [usuarios, setUsuarios] = useState()

    useEffect(() => {
        if(!usuarioService.estadoAutenticacaoMudou){
            navigation.navigate('Login');
        }
        usuarioService.verificaMensagensNaoLidas(auth, db, (resposta) => {
            setUsuarios(resposta[1])
            setCarregado(true)
        })
        // console.log(usuarios[1])                
    }, [])
    
    return (
        carregado ?
        // Object.keys(usuarios).forEach((objeto) => {
        //     console.log(objeto)
        //     usuarios[objeto].forEach((a) => {
        //         console.log(a)
        //     })
        // })
        <ScrollView style={styles.container}>
            <Text style={styles.title1}>Chat</Text>
            <Text style={styles.p1}>(*) Nova Mensagem</Text>
            {Object.keys(usuarios).length > 0 ? Object.keys(usuarios).map((usuario, key) => {
                console.log(usuarios[usuario])
                return (
                    <View key={key}>
                        <ButtonPersonalizado
                            title={usuarios[usuario].mensagens[0].lida ? usuarios[usuario].usuario : `${usuarios[usuario].usuario} *`}
                            onPress={() =>
                                navigation.navigate('Chat Pessoal', {autor: auth.currentUser.uid, sender: usuario})
                            }
                        />
                    </View>
                );
            }) : <Text style={styles.title1}>Carregando</Text>}
            
            <ButtonPersonalizado
            title="Voltar"
            onPress={ () => navigation.goBack() }
            /> 
        </ScrollView>
        :
        <View>
        </View>
    );
};

export default ListaChatsScreen