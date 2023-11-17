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
    
const ListaMoradiasScreen = ({route, navigation}) => {

    const [moradias, setMoradias] = useState([])
    const [carregado, setCarregado] = useState(false)

    useEffect(() => {
        if(!usuarioService.estadoAutenticacaoMudou){
            navigation.navigate('Login');
        }
        moradiaService.buscarMoradias(db, (resposta) => {
            setMoradias(resposta);
        })
        
        console.log("moradias")
        console.log(moradias)
        setCarregado(true)
                
    }, [])
    
    return (
        carregado ?
        <View style={styles.container}>
            {moradias.length > 0 ? moradias.map((moradia, key) => {
                return (
                    <View key={key}>
                        <Text style={styles.p1}>Estado: {moradia.estado}</Text>
                        <Text style={styles.p1}>Cidade: {moradia.cidade}</Text>
                        <Text style={styles.p1}>Bairro: {moradia.bairro}</Text>
                        <Text style={styles.p1}>Rua: {moradia.rua}</Text>
                        <Text style={styles.p1}>Número: {moradia.numero}</Text>
                        <Text style={styles.p1}>Capacidade: {moradia.capacidade}</Text>
                        <Text style={styles.p1}>Aluguel: R$ {moradia.aluguel}</Text>
                        <Text style={styles.p1}>------------------------------------------------------------------</Text>
                    </View>
                );
            }) : <Text style={styles.title1}>Carregando</Text>}
            
            <ButtonPersonalizado
            title="Voltar"
            onPress={ () => navigation.goBack() }
            /> 
        </View>
        :
        <View>
        </View>
    );
};

export default ListaMoradiasScreen