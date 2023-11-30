import {React, useEffect, useState} from "react";
import {ScrollView, View, Text} from 'react-native'
import ButtonPersonalizado from "./ButtonPersonalizado";
import styles from "../styles/style";
import UsuarioService from "../services/UsuarioService";
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
const chatService = new ChatService
    
const ListaChatsScreen = ({route, navigation}) => {

    const {moradia} = route.params
    const [carregado, setCarregado] = useState(false)
    const [usuarios, setUsuarios] = useState()
    const [msgPage, setMsgPage] = useState()

    const buscaDados = async () => {
        if(!usuarioService.estadoAutenticacaoMudou){
            navigation.navigate('Login');
        }
        await chatService.verificaMensagensNaoLidas(auth, db, async (resposta) => {
            const mensagens = resposta[1]
            setUsuarios(mensagens)
            return true
        })   
        setCarregado(true)
    }

    useEffect(() => {
        buscaDados()        
    }, [carregado])
    
    return (
        carregado ?
        <ScrollView style={styles.container}>
            <Text style={styles.title1}>Chat</Text>
            <Text style={styles.title1}>{msgPage}</Text>
            <Text style={styles.p1}>(*) Nova Mensagem</Text>
            {Object.keys(usuarios).length > 0 ? Object.keys(usuarios).map((usuario, key) => {
                return (
                    <View style={styles.card} key={key}>
                        <Text style={styles.cardTitle}>{usuarios[usuario].mensagens[0].lida ? usuarios[usuario].usuario : `${usuarios[usuario].usuario} *`}</Text>
                        <ButtonPersonalizado
                            title="Ver conversa"
                            onPress={() =>
                                navigation.navigate('Chat Pessoal', {autor: auth.currentUser.uid, sender: usuario})
                            }
                        />
                        <ButtonPersonalizado
                            title="Convidar para Moradia"
                            onPress={() =>
                                usuarioService.convidaMoradia(db, usuarios[usuario].userId, moradia.idDoc, (resposta) => {
                                    setMsgPage("Convite enviado com sucesso!")
                                })
                            }                               
                        />
                    </View>
                );
            }) : <Text style={styles.title1}>Carregando</Text>}
            
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

export default ListaChatsScreen