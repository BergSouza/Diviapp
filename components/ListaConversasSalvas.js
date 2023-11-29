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
    
const ConversasSalvasScreen = ({route, navigation}) => {

    const [carregado, setCarregado] = useState(false)
    const [conversas, setConversas] = useState([])
    const [usuarios, setUsuarios] = useState({})
    const [msgPage, setMsgPage] = useState()

    const buscaDados = async () => {
        if(!usuarioService.estadoAutenticacaoMudou){
            navigation.navigate('Login');
        }
        await usuarioService.buscaConvitesMoradiaUsuario(db, auth.currentUser.uid, async (res) => {
            console.log("convites")
            console.log(res)
            console.log(res.length)
            console.log(res.includes("3KjVfvUsDIb2bDZNqDIY"))
            // console.log(res.includes(conversa.usuarioMoradia))
            await usuarioService.buscaConversasHistorico(db, auth.currentUser.uid, async (resposta) => {
                const users = {}
                setConversas(resposta)
                await resposta.forEach(async (conversa) => {
                    let user = {}
                    let moradia = {}
                    await moradiaService.buscaMoradiaUsuario(db, conversa.usuarioMoradia, (resposta2) => {
                        console.log("moradia")
                        console.log(resposta2)
                        moradia = resposta2
                    })
                    await usuarioService.getInformacoesUsuario(db, conversa.usuarioMoradia, (resposta2) => {
                        console.log( `resposta2 ${resposta2}`) 
                        // user = {
                        //     resposta2,
                        //     moradia: moradia
                        // }
                        resposta2['moradia'] = moradia
                        console.log("MORADIA")
                        console.log(moradia.idDoc)
                        resposta2['convite'] = res.includes(moradia.idDoc)
                        // await usuarioService.buscaConviteMoradiaUsuario(db, auth.currentUser.uid, moradia.idDoc, (resposta3 => {
                        //     console.log("CONVITE DO USUARIO")
                        //     console.log(resposta3)
                        //     resposta2['convite'] = resposta3
                        // }))
                        users[conversa.usuarioMoradia] = resposta2
                    })
                    setCarregado(true)
                })
                setUsuarios(users)
                // console.log(users)
            })   
        })
        
    }

    useEffect(() => {
        buscaDados()        
    }, [])
    
    return (
        carregado ?
        <ScrollView style={styles.container}>
            <Text style={styles.title1}>Conversas Salvas</Text>
            <Text style={styles.title1}>{msgPage}</Text>
            <Text style={styles.p1}>(*) Nova Mensagem</Text>
            {console.log("USERWS")}
            {Object.keys(usuarios).length > 0 ? Object.keys(usuarios).map((usuarioMoradia, key) => {
                console.log(usuarios[usuarioMoradia]['convite'])
                return (
                    <View style={styles.card} key={key}>
                        <Text style={styles.cardTitle}>{usuarios[usuarioMoradia].usuario}</Text>
                        <ButtonPersonalizado
                            title="Ver conversa"
                            onPress={() => 
                                navigation.navigate('Chat Pessoal', {autor: usuarioMoradia, sender: auth.currentUser.uid})
                            }
                        />
                        <ButtonPersonalizado
                            title="Contato Moradia"
                            onPress={() => navigation.navigate('Contato Moradia', {userIdParams: usuarioMoradia, moradiaParams: usuarios[usuarioMoradia]['moradia']})}                               
                        />                        
                        <ButtonPersonalizado
                            disabled={!usuarios[usuarioMoradia].convite}
                            title={usuarios[usuarioMoradia].convite ? "Aceitar Convite" : "Esperando Convite"}
                            onPress={() => {
                                usuarioService.aceitarConvite(db, auth.currentUser.uid, usuarios[usuarioMoradia]['moradia'].idDoc, (resposta) => {
                                    navigation.navigate('Moradia')
                                })
                            }}                               
                            />                       
                    </View>
                );
            })
             : <Text style={styles.title1}>Procurando Conversas</Text>}
            
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

export default ConversasSalvasScreen