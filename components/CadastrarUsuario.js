import {React, useState} from "react";
import {View, Text, TextInput} from 'react-native'
import ButtonPersonalizado from "./ButtonPersonalizado";
import styles from "../styles/style";

import UsuarioService from "../services/UsuarioService";
import app from '../firebase/firebase_config';
import { getAuth, getReactNativePersistence } from 'firebase/auth';
import { ReactNativeAsyncStorage } from "@react-native-async-storage/async-storage";

import { getFirestore } from "firebase/firestore";

const auth = getAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)  
});

const db = getFirestore(app);

const usuarioService = new UsuarioService();

const CadastrarUsuarioScreen  = ({route, navigation}) => {
    const [mensagemLogin, setMensagemLogin] = useState("");
    const [nome, setNome] = useState("");
    const [sobrenome, setSobrenome] = useState("");
    const [usuario, setUsuario] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    return (
        <View style={styles.container}>
            <Text style={styles.title1}>{mensagemLogin}</Text>
            <Text style={styles.label}> Usuário:</Text>
            <TextInput
                style={styles.input}
                onChangeText={setUsuario}
                value={usuario}
                placeholder="Usuário"
            />
            <Text style={styles.label}> Nome:</Text>
            <TextInput
                style={styles.input}
                onChangeText={setNome}
                value={nome}
                placeholder="Nome"
            />
            <Text style={styles.label}> Sobrenome:</Text>
            <TextInput
                style={styles.input}
                onChangeText={setSobrenome}
                value={sobrenome}
                placeholder="Sobrenome"
            />
            <Text style={styles.label}> Email:</Text>
            <TextInput
                style={styles.input}
                onChangeText={setEmail}
                value={email}
                placeholder="Email"
            />
            <Text style={styles.label}> Senha:</Text>
            <TextInput
                style={styles.input}
                onChangeText={setSenha}
                value={senha}
                placeholder="Senha"
                secureTextEntry
            />
        <ButtonPersonalizado
            title="Cadastrar"
            onPress={() =>
                usuarioService.criarUsuarioComEmailESenha(auth, db, usuario, nome, sobrenome, email, senha, (resposta) => {
                    setMensagemLogin(resposta)
                    if(resposta == true){
                        navigation.navigate('Sua Moradia')
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

export default CadastrarUsuarioScreen