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
    
const SemMoradiaScreen = ({route, navigation}) => {

    const [carregado, setCarregado] = useState(false)
    
    const buscaDados = async () => {
        if(!usuarioService.estadoAutenticacaoMudou){
            navigation.navigate('Login');
        }
        await moradiaService.buscarMoradias(db, async (resposta) => {
            await resposta.forEach(moradia => {
                moradiaService.buscaMoradores(db, moradia.idDoc, (resposta2) => {
                    if(resposta2.includes(auth.currentUser.uid)){
                        navigation.navigate('Moradia', {moradia: moradia})
                    }
                })
            });
            
        })
        setCarregado(true)
    }

    useEffect(() => {
        buscaDados()
      }, []);
    
    return (
        carregado ?
        <View style={styles.container}>
            {
                carregado ? <Text style={styles.title1}>Você não possui uma moradia</Text> : <Text style={styles.title1}>Carregando</Text>} 
            {
            <View>
                <ButtonPersonalizado
                title="Adicionar Moradia"
                onPress={ () => navigation.navigate('Cadastrar Moradia') }
                /> 
                <ButtonPersonalizado
                title="Procurar Moradia"
                onPress={ () => navigation.navigate('Moradias') }
                />
                <ButtonPersonalizado
                title="Conversas"
                onPress={ () => navigation.navigate('Lista Conversas Salvas') }
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

export default SemMoradiaScreen