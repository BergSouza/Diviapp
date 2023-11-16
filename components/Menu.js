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
    
const ListaMoradiasScreen = ({route, navigation}) => {

    const [usuarioMoradia, setUsuarioMoradia] = useState(null)
    const [carregado, setCarregado] = useState(false)
    const [modalExcluirVisible, setModalExcluirVisible] = useState(false)

    useEffect(() => {
        if(!usuarioService.estadoAutenticacaoMudou){
            navigation.navigate('Login');
        }

        moradiaService.buscaMoradiaUsuario(db, auth.currentUser.uid, (resposta) => {
            setUsuarioMoradia(resposta)
            setCarregado(true)
        })
                
    }, [])
    
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
                                console.log("excluir moradia") /*navigation.navigate('Moradia')*/
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
            usuarioMoradia != "" ? 
                <View>
                    <Text style={styles.p1}>Estado: {usuarioMoradia.estado}</Text>
                    <Text style={styles.p1}>Cidade: {usuarioMoradia.cidade}</Text>
                    <Text style={styles.p1}>Bairro: {usuarioMoradia.bairro}</Text>
                    <Text style={styles.p1}>Rua: {usuarioMoradia.rua}</Text>
                    <Text style={styles.p1}>Número: {usuarioMoradia.numero}</Text>
                    <Text style={styles.p1}>Capacidade: {usuarioMoradia.capacidade}</Text>
                    <Text style={styles.p1}>Aluguel: {usuarioMoradia.aluguel}</Text>
                </View>
                
             : setCarregado ? <Text style={styles.title1}>Você não possui uma moradia</Text> : <Text style={styles.title1}>Carregando</Text>} 
            {
            usuarioMoradia != "" ? 
            <View>
                <ButtonPersonalizado
                title="Editar Moradia"
                onPress={ () => console.log("editar moradia") /*navigation.navigate('Editar Moradia')*/ }
                />
                <ButtonPersonalizado
                title="Acessar Moradia"
                onPress={ () => console.log("acessar moradia") /*navigation.navigate('Moradia')*/ }
                />
                <ButtonPersonalizado
                title="Excluir Moradia"
                onPress={ () => {
                    setModalExcluirVisible(true)
                } /*navigation.navigate('Excluir Moradia')*/ }
                />
            </View>
             : 
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
        <View>
        </View>
    );
};

export default ListaMoradiasScreen