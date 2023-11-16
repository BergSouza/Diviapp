import {React, useState} from "react";
import {View, Text, TextInput} from 'react-native'
import ButtonPersonalizado from "./ButtonPersonalizado";
import styles from "../styles/style";

import UsuarioService from "../services/UsuarioService";
import app from '../firebase/firebase_config';
import { getAuth, getReactNativePersistence } from 'firebase/auth';
import { ReactNativeAsyncStorage } from "@react-native-async-storage/async-storage";

const auth = getAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)  
});

const usuarioService = new UsuarioService();

const CadastrarUsuarioScreen  = ({route, navigation}) => {
    const [mensagemLogin, setMensagemLogin] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
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
            title="Cadastrar"
            onPress={() =>
                usuarioService.criarUsuarioComEmailESenha(auth, email, senha, (resposta) => {
                    setMensagemLogin(resposta)
                    navigation.navigate('Moradias')
                })
            }
        />
        </View>
    );
};

export default CadastrarUsuarioScreen