import {React, useEffect, useState} from "react";
import {View, Text, TextInput, Modal, Pressable} from 'react-native'
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
    
const MenuScreen = ({route, navigation}) => {

    const [usuarioMoradia, setUsuarioMoradia] = useState(null)
    const [carregado, setCarregado] = useState(false)
    const [mensagensNaoLidas, setMensagensNaoLidas] = useState()
    const [modalExcluirVisible, setModalExcluirVisible] = useState(false)
    
    useEffect(() => {
        const subscribeFocus = navigation.addListener('focus', () => {
            if(!usuarioService.estadoAutenticacaoMudou){
                navigation.navigate('Login');
            }
            usuarioService.verificaMensagensNaoLidas(auth, db, (resposta) => {
                setMensagensNaoLidas(resposta[0])
            })
            moradiaService.buscaMoradiaUsuario(db, auth.currentUser.uid, (resposta) => {
                setUsuarioMoradia(resposta)
                if(resposta == ""){
                    navigation.navigate('Procurar Moradia')
                }else{
                    setCarregado(true)
                }
            });
            
        });
        return subscribeFocus;
      }, []);
    
    return (
        carregado ?
        <View style={styles.container}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalExcluirVisible}
                onRequestClose={() => {
                // Alert.alert('Modal has been closed.');
                setModalExcluirVisible(!modalExcluirVisible);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.title1}>Você realmente deseja remover sua moradia?</Text>
                        <ButtonPersonalizado
                        title="Confirmar"
                        onPress={ () => 
                            {
                                moradiaService.deletarMoradia(db, usuarioMoradia.idDoc, (resposta) => {
                                    if(resposta) navigation.navigate('Procurar Moradia')
                                })
                                setModalExcluirVisible(!modalExcluirVisible)
                            }
                        }
                        />
                        <ButtonPersonalizado
                        title="Cancelar"
                        onPress={() => setModalExcluirVisible(!modalExcluirVisible)}
                        />
                    </View>
                </View>
            </Modal>
            { 
            <View>
                <Text style={styles.p1}>Estado: {usuarioMoradia.estado}</Text>
                <Text style={styles.p1}>Cidade: {usuarioMoradia.cidade}</Text>
                <Text style={styles.p1}>Bairro: {usuarioMoradia.bairro}</Text>
                <Text style={styles.p1}>Rua: {usuarioMoradia.rua}</Text>
                <Text style={styles.p1}>Número: {usuarioMoradia.numero}</Text>
                <Text style={styles.p1}>Capacidade: {usuarioMoradia.capacidade}</Text>
                <Text style={styles.p1}>Aluguel: {usuarioMoradia.aluguel}</Text>
            </View>
            } 
            {
            <View>
                <ButtonPersonalizado
                title={`Mensagens Recebidas: ${mensagensNaoLidas}`}
                onPress={ () => navigation.navigate('Lista Chat', {moradia: usuarioMoradia}) }
                />
                <ButtonPersonalizado
                title="Editar Moradia"
                onPress={ () => navigation.navigate('Editar Moradia') }
                />
                <ButtonPersonalizado
                title="Acessar Conversa"
                onPress={ () => navigation.navigate('Chat Moradia', {moradia: usuarioMoradia.idDoc}) }
                />
                <ButtonPersonalizado
                title="Avisos Moradia"
                onPress={ () => navigation.navigate('Avisos Moradia', {moradia: usuarioMoradia}) }
                />
                <ButtonPersonalizado
                title="Moradores"
                onPress={ () => navigation.navigate('Moradores', {moradia: usuarioMoradia}) }
                />
                <ButtonPersonalizado
                title="Excluir Moradia"
                onPress={ () => {
                    setModalExcluirVisible(true)
                } /*navigation.navigate('Excluir Moradia')*/ }
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
        <View>
        </View>
    );
};

export default MenuScreen