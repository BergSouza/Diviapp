import {React, useEffect, useState} from "react";
import {View, Text} from 'react-native'
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

const usuarioService = new UsuarioService  
    
const SemMoradiaScreen = ({route, navigation}) => {

    const [carregado, setCarregado] = useState(false)
    
    useEffect(() => {
        if(!usuarioService.estadoAutenticacaoMudou){
            navigation.navigate('Login');
        }
        setCarregado(true)
      }, []);
    
    return (
        carregado ?
        <View style={styles.container}>
            {
                setCarregado ? <Text style={styles.title1}>Você não possui uma moradia</Text> : <Text style={styles.title1}>Carregando</Text>} 
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