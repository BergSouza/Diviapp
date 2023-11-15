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
    const [usuarioMoradia, setUsuarioMoradia] = useState({})
    const [usuarioMoradiaBool, setUsuarioMoradiaBool] = useState(false)
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

        moradiaService.buscaMoradiaUsuario(db, auth.currentUser.uid, (resposta) => {
            setUsuarioMoradia(resposta)
            try{
                resposta.userId != ""
                setUsuarioMoradiaBool(true)
            }catch{

            }
            
            console.log("MORADIA DO CIDADAO:")
            console.log(resposta)
            setCarregado(true)
        })
                
    }, [])
    
    return (
        carregado ?
        <View>
            <Text>Você está logado!</Text>
            {moradias.length > 0 ? moradias.map((moradia, key) => {
                return (
                    <View key={key}>
                        <Text>Bairro: {moradia.bairro}</Text>
                        <Text>Rua: {moradia.rua}</Text>
                        <Text>Número: {moradia.numero}</Text>
                        <Text>Capacidade: {moradia.capacidade}</Text>
                        <Text>Aluguel: {moradia.aluguel}</Text>
                        <Text>------------------------------------------------------------------</Text>
                    </View>
                );
            }) : <Text>Carregando</Text>} 
            {
            usuarioMoradiaBool ? <ButtonPersonalizado
            title="Editar Endereço"
            onPress={ () => console.log("editar moradia") /*navigation.navigate('Editar Moradia')*/ }
            /> : <ButtonPersonalizado
            title="Adicionar Endereço"
            onPress={ () => navigation.navigate('Cadastrar Moradia') }
            /> 
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