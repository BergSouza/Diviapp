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
        
        <View style={styles.container}>
            <Text style={styles.title1}>{mensagemLogin}</Text>
            <TextInput
                style={styles.input}
                onChangeText={setEmail}
                // value={email}
                placeholder="Email"
                
            />
            <TextInput
                style={styles.input}
                onChangeText={setSenha}
                // value={senha}
                placeholder="Senha"
                secureTextEntry
            />
            <ButtonPersonalizado
                title="Logar"
                onPress={() =>
                    usuarioService.logarComEmailESenha(auth, email, senha, (resposta) => {
                        if(resposta == true){
                            setMensagemLogin("")
                            navigation.navigate('Sua Moradia')
                        }else{
                            setMensagemLogin(resposta)
                        }
                    })
                }
            />
            <Text style={{textAlign: 'center', fontSize: 30}}>Não possui conta?</Text>
            <ButtonPersonalizado 
                title="Registrar-se já"
                onPress={() => {
                    navigation.navigate('Cadastro Usuário')
                }
            }/>
        </View>
    );
};

export default LoginScreen