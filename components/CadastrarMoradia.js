import {React, useEffect, useState} from "react";
import {View, Text, TextInput} from 'react-native'
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
    
const CadastrarMoradiaScreen = ({route, navigation}) => {

    const [mensagemCadastro, setMensagemCadastro] = useState("");
    const [rua, setRua] = useState("");
    const [bairro, setBairro] = useState("");
    const [numero, setNumeo] = useState("");
    const [capacidade, setCapacidade] = useState("");
    const [aluguel, setAluguel] = useState("");

    useEffect(() => {
        if(!usuarioService.estadoAutenticacaoMudou){
            navigation.navigate('Login');
        }
    }, [])
    
    return (
        <View>
            <Text>Você está logado!</Text> 
            <Text>{mensagemCadastro}</Text> 
            <TextInput
                style={styles.input}
                onChangeText={setBairro}
                // value={email}
                placeholder="Bairro"
                keyboardType="text"
            />
            <TextInput
                style={styles.input}
                onChangeText={setRua}
                // value={email}
                placeholder="Rua"
                keyboardType="text"
            />
            <TextInput
                style={styles.input}
                onChangeText={setNumeo}
                // value={email}
                placeholder="Número"
                keyboardType="text"
            />
            <TextInput
                style={styles.input}
                onChangeText={setCapacidade}
                // value={email}
                placeholder="Capacidade Pessoas"
                keyboardType="text"
            />
            <TextInput
                style={styles.input}
                onChangeText={setAluguel}
                // value={email}
                placeholder="Aluguel"
                keyboardType="text"
            />
            <ButtonPersonalizado
            title="Adicionar"
            onPress={ () => moradiaService.cadastrarMoradia(db, auth.currentUser.uid, bairro, rua, numero, capacidade, aluguel, (resposta) => {
                setMensagemCadastro(resposta)
            })}
            />
            
        </View>
    );
};

export default CadastrarMoradiaScreen