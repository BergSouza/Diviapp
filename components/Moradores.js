import {React, useEffect, useState} from "react";
import {View, Text} from 'react-native'
import ButtonPersonalizado from "./ButtonPersonalizado";
import styles from "../styles/style";
import UsuarioService from "../services/UsuarioService";
import app from '../firebase/firebase_config';
import { getFirestore } from "firebase/firestore";
import MoradiaService from "../services/MoradiaService";

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
        let moradores = []
        await moradiaService.buscaMoradores(db, moradia.idDoc, async (resposta) => {
            await resposta.forEach(async (morador, index) => {
                await usuarioService.getInformacoesUsuario(db, morador, (resultado) => {
                    moradores.push(resultado)
                })
                if(index == resposta.length-1){
                    setCarregado(true)
                }
            });
            setMoradores(moradores)
        })
    }

    useEffect(() => {
        buscaDados()
      }, []);
    
    return (
        carregado ?
        <View style={styles.container}>
            {
            <View> 
                {moradores.length > 0 ? moradores.map((morador, key) => {
                return (
                    <View style={styles.card} key={key}>
                        <Text style={styles.title1}>{morador.usuario}</Text><ButtonPersonalizado
                        title="Remover"
                        onPress={ () => chatService.removerMorador(db, moradia.idDoc, morador.userId, (resposta) => {
                            if(resposta){
                                navigation.goBack()
                            }
                        })}
                        />
                    </View>
                );
            }) : <Text style={styles.title1}>Sem Moradores</Text>}
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