import {React, useEffect, useState} from "react";
import {View, Text} from 'react-native'
import ButtonPersonalizado from "./ButtonPersonalizado";
import styles from "../styles/style";
import UsuarioService from "../services/UsuarioService";
import app from '../firebase/firebase_config';
import { getAuth, getReactNativePersistence } from 'firebase/auth';
import { ReactNativeAsyncStorage } from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import MoradiaService from "../services/MoradiaService";

const auth = getAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)  
});

const db = getFirestore(app);

const usuarioService = new UsuarioService  
const moradiaService = new MoradiaService
    
const MoradoresScreen = ({route, navigation}) => {

    const {moradia} = route.params

    const [moradores, setMoradores] = useState()
    const [carregado, setCarregado] = useState(false)
    
    const buscaDados = async() => {
        if(!usuarioService.estadoAutenticacaoMudou){
            navigation.navigate('Login');
        }
        await usuarioService.buscaMoradores(db, moradia.idDoc, async (resposta) => {
            let moradores = {}
            console.log("resposta")
            console.log(resposta)
            await resposta.forEach(async (morador) => {
                await usuarioService.getInformacoesUsuario(db, morador, (resultado) => {
                    console.log(resultado)
                    moradores[resultado.userId] = resultado
                    setCarregado(true)
                })
            });
            setMoradores(moradores)
        })
    }

    useEffect(() => {
      }, [carregado]);
    
    return (
        carregado ?
        <View style={styles.container}>
            {
            <View> 
                {Object.keys(moradores).length > 0 ? Object.keys(moradores).map((morador, key) => {
                    console.log((moradores))
                return (
                    <View style={styles.card} key={key}>
                        <Text>aosmdoamsd</Text>
                    </View>
                );
            }) : <Text style={styles.title1}>Sem Avisos</Text>}
                <ButtonPersonalizado
                title="Adicionar Aviso"
                onPress={ () => navigation.navigate('Adicionar Aviso', {moradia: moradia.idDoc}) }
                />
            </View>
            }
            <ButtonPersonalizado
                title="Voltar"
                onPress={ () => navigation.goBack()}
                />
        </View>
        :

        <Text>CARREGANDO</Text>
    );
};

export default MoradoresScreen