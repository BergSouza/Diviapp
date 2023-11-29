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
    
const ContatoMoradiacreen = ({route, navigation}) => {

    const {userIdParams, moradiaParams} = route.params
    const [moradia, setMoradia] = useState(moradiaParams)
    const [usuario, setUsuario] = useState()
    const [carregado, setCarregado] = useState(false)

    useEffect(() => {
        // setMoradia(moradiaParams)
        if(!usuarioService.estadoAutenticacaoMudou){
            navigation.navigate('Login');
        }
        usuarioService.getInformacoesUsuario(db, userIdParams, (resposta) => {
            setUsuario(resposta)
            setCarregado(true)
        })
                
    }, [route])
    
    return (
        carregado ?
        <ScrollView style={styles.container}>
        <Text style={styles.p1}>Usuário: {usuario.usuario}</Text>
        <Text style={styles.p1}>Nome: {usuario.nome} {usuario.sobrenome}</Text>
        <Text style={styles.p1}>Estado: {moradia.estado}</Text>
        <Text style={styles.p1}>Cidade: {moradia.cidade}</Text>
        <Text style={styles.p1}>Bairro: {moradia.bairro}</Text>
        <Text style={styles.p1}>Rua: {moradia.rua}</Text>
        <Text style={styles.p1}>Número: {moradia.numero}</Text>
        <Text style={styles.p1}>Capacidade: {moradia.capacidade}</Text>
        <Text style={styles.p1}>Aluguel: R$ {moradia.aluguel}</Text>
        <Text style={styles.p1}>------------------------------------------------------------------</Text>
        <ButtonPersonalizado
            title="Enviar Mensagem"
            onPress={ () => navigation.navigate('Chat Pessoal', {autor: userIdParams, sender: auth.currentUser.uid}) }
        /> 
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

export default ContatoMoradiacreen