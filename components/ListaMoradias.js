import {React, useEffect, useState} from "react";
import {ScrollView, View, Text} from 'react-native'
import ButtonPersonalizado from "./ButtonPersonalizado";
import styles from "../styles/style";
import UsuarioService from "../services/UsuarioService";
import MoradiaService from "../services/MoradiaService";
import app from '../firebase/firebase_config';
import { getFirestore } from "firebase/firestore";

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
        setCarregado(true)
                
    }, [])
    
    return (
        carregado ?
        <ScrollView style={styles.container}>
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
                        <ButtonPersonalizado
                            title="Entrar em contato"
                            onPress={() =>
                                navigation.navigate('Contato Moradia', {userIdParams: moradia.userId, moradiaParams: moradia})
                            }
                        />
                        <Text style={styles.p1}>------------------------------------------------------------------</Text>
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

export default ListaMoradiasScreen