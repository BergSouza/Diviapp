import {React, useState} from "react";
import {View, Text, TextInput} from 'react-native'
import ButtonPersonalizado from "./ButtonPersonalizado";
import styles from "../styles/style";

import UsuarioService from "../services/UsuarioService";
import app from '../firebase/firebase_config';
import { getAuth, getReactNativePersistence } from 'firebase/auth';
import { ReactNativeAsyncStorage } from "@react-native-async-storage/async-storage";

import { getFirestore } from "firebase/firestore";
import MoradiaService from "../services/MoradiaService";

const auth = getAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)  
});

const db = getFirestore(app);

const moradiaService = new MoradiaService();

const CadastraAvisoScreen  = ({route, navigation}) => {

    const {moradia} = route.params;
    const [mensagem, setMensagem] = useState("");
    const [titulo, setTitulo] = useState("");
    const [texto, setTexto] = useState("");
    return (
        <View style={styles.container}>
            <Text style={styles.title1}>{mensagem}</Text>
            <Text style={styles.label}> Titulo:</Text>
            <TextInput
                style={styles.input}
                onChangeText={setTitulo}
                value={titulo}
                placeholder="Título"
            />
            <Text style={styles.label}> Texto:</Text>
            <TextInput
                multiline = {true}
                numberOfLines = {4}
                style={styles.input}
                onChangeText={setTexto}
                value={texto}
                placeholder="Texto"
            />
        <ButtonPersonalizado
            title="Adicionar"
            onPress={() =>
                moradiaService.adicionarAviso(db, moradia, titulo, texto, (resposta) => {
                    setMensagem(resposta)
                    if(resposta == "Adicionado com Sucesso!"){
                        navigation.goBack()
                    }
                })
            }
        />
        <ButtonPersonalizado
            title="Voltar"
            onPress={ () => navigation.goBack() }
            /> 
        </View>
    );
};

export default CadastraAvisoScreen