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
    
const AvisosMoradiaScreen = ({route, navigation}) => {

    const {moradia} = route.params

    const [avisos, setAvisos] = useState()
    const [carregado, setCarregado] = useState(false)
    
    const buscaDados = async() => {
        if(!usuarioService.estadoAutenticacaoMudou){
            navigation.navigate('Login');
        }
        moradiaService.buscaAvisos(db, moradia.idDoc, (resposta) => {
            setAvisos(resposta)
            setCarregado(true)
        })
    }

    useEffect(() => {
        buscaDados()
      }, []);
    
    return (
        carregado ?
        <View style={styles.container}>
            {
                carregado ? <Text style={styles.title1}>Você possui uma moradia</Text> : <Text style={styles.title1}>Carregando</Text>} 
            {
            <View> 
                {avisos.length > 0 ? avisos.map((aviso, key) => {
                return (
                    <View style={styles.card} key={key}>
                        <Text style={styles.cardTitle}>{aviso.titulo}</Text>
                        <Text style={styles.cardTexto}>{aviso.texto}</Text>
                        <ButtonPersonalizado
                            title="Remover Aviso"
                            onPress={() =>
                                moradiaService.removerAviso(db, moradia.idDoc, aviso.id, (resposta) => {
                                    navigation.goBack()
                                })
                            }
                        />
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

export default AvisosMoradiaScreen