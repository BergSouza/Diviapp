import {React, useEffect, useState} from "react";
import {View, Text, TextInput} from 'react-native'
import ButtonPersonalizado from "./ButtonPersonalizado";
import UsuarioService from "../services/UsuarioService";
import styles from "../styles/style";

import app from '../firebase/firebase_config';
import {getAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const auth = getAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)  
});

const usuarioService = new UsuarioService

const LoginScreen = ({route, navigation}) => {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [mensagemLogin, setMensagemLogin] = useState("");

    return (
        
        <View>
            <Text>{mensagemLogin}</Text>
            <TextInput
                style={styles.input}
                onChangeText={setEmail}
                // value={email}
                placeholder="Email"
                keyboardType="text"
            />
            <TextInput
                style={styles.input}
                onChangeText={setSenha}
                // value={senha}
                placeholder="Senha"
                keyboardType="text"
            />
            <ButtonPersonalizado
                title="Logar"
                onPress={() =>
                    usuarioService.logarComEmailESenha(auth, email, senha, (resposta) => {
                        setMensagemLogin(resposta)
                        if(resposta == "Logado com Sucesso!") navigation.navigate('Moradias')
                    })
                }
            />
            <Text style={{textAlign: 'center', fontSize: 30}}>Não possuo conta</Text>
            <ButtonPersonalizado 
                title="Registrar-se"
                onPress={() =>
                navigation.navigate('Cadastro Usuário')
            }/>
        </View>
    );
};

export default LoginScreen