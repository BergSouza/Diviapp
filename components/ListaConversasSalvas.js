import {React, useEffect, useState} from "react";
import {ScrollView, View, Text} from 'react-native'
import ButtonPersonalizado from "./ButtonPersonalizado";
import styles from "../styles/style";
import UsuarioService from "../services/UsuarioService";
import MoradiaService from "../services/MoradiaService";
import ChatService from "../services/ChatService";
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
const chatService = new ChatService
    
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
            await chatService.buscaConversasHistorico(db, auth.currentUser.uid, async (resposta) => {
                const users = {}
                setConversas(resposta)
                await resposta.forEach(async (conversa) => {
                    let user = {}
                    let moradia = {}
                    await moradiaService.buscaMoradiaUsuario(db, conversa.usuarioMoradia, (resposta2) => {
                        moradia = resposta2
                    })
                    await usuarioService.getInformacoesUsuario(db, conversa.usuarioMoradia, (resposta2) => {
                        resposta2['moradia'] = moradia
                        resposta2['convite'] = res.includes(moradia.idDoc)
                        users[conversa.usuarioMoradia] = resposta2
                    })
                    setCarregado(true)
                })
                setUsuarios(users)
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
            {Object.keys(usuarios).length > 0 ? Object.keys(usuarios).map((usuarioMoradia, key) => {
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
                                    navigation.navigate('Moradia', {moradia: usuarios[usuarioMoradia]['moradia']})
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