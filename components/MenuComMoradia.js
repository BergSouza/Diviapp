import {React, useEffect, useState} from "react";
import {View, Text} from 'react-native'
import ButtonPersonalizado from "./ButtonPersonalizado";
import styles from "../styles/style";
import UsuarioService from "../services/UsuarioService";
import app from '../firebase/firebase_config';
import { getAuth, getReactNativePersistence } from 'firebase/auth';
import { ReactNativeAsyncStorage } from "@react-native-async-storage/async-storage";
import MoradiaService from "../services/MoradiaService";
import { getFirestore } from "firebase/firestore";

const auth = getAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)  
});

const db = getFirestore(app);

const usuarioService = new UsuarioService  
const moradiaService = new MoradiaService
    
const ComMoradiaScreen = ({route, navigation}) => {

    const {moradia} = route.params 
    const [carregado, setCarregado] = useState(false)
    
    const buscaDados = async() => {
        if(!usuarioService.estadoAutenticacaoMudou){
            navigation.navigate('Login');
        }
        setCarregado(true)
    }

    useEffect(() => {
        buscaDados()
      }, []);
    
    return (
        carregado ?
        <View style={styles.container}>
            {
                carregado ? <Text style={styles.title1}>Você possui uma moradia</Text> : <Text style={styles.title1}>Carregando</Text>} 
            {
            <View> 
                <View>
                    <Text style={styles.p1}>Estado: {moradia.estado}</Text>
                    <Text style={styles.p1}>Cidade: {moradia.cidade}</Text>
                    <Text style={styles.p1}>Bairro: {moradia.bairro}</Text>
                    <Text style={styles.p1}>Rua: {moradia.rua}</Text>
                    <Text style={styles.p1}>Número: {moradia.numero}</Text>
                    <Text style={styles.p1}>Capacidade: {moradia.capacidade}</Text>
                    <Text style={styles.p1}>Aluguel: {moradia.aluguel}</Text>
                </View>
                <ButtonPersonalizado
                title="Acessar Conversa"
                onPress={ () => navigation.navigate('Chat Moradia', {moradia: moradia.idDoc}) }
                />
                <ButtonPersonalizado
                title="Sair da Moradia"
                onPress={ () => moradiaService.removerMorador(db, moradia.idDoc, auth.currentUser.uid, (resposta) => {
                    navigation.navigate('Procurar Moradia')
                }) }
                />
                <ButtonPersonalizado
                title="Avisos Moradia"
                onPress={ () => navigation.navigate('Avisos Moradia', {moradia: moradia}) }
                />
            </View>
            }
            <ButtonPersonalizado
            title="Sair"
            onPress={ () => usuarioService.deslogarUsuario(auth, (resposta) => {
                if(resposta) navigation.navigate('Login');
            })}
            />
            
        </View>
        :

        <Text>CARREGANDO</Text>
    );
};

export default ComMoradiaScreen