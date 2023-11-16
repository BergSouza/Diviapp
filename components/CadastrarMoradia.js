import {React, useEffect, useState} from "react";
import {View, Text, TextInput} from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker';
import ButtonPersonalizado from "./ButtonPersonalizado";
import styles from "../styles/style";
import UsuarioService from "../services/UsuarioService";
import MoradiaService from "../services/MoradiaService";
import IBGEService from "../services/IBGEService";

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
const ibgeService = new IBGEService    

const CadastrarMoradiaScreen = ({route, navigation}) => {

    const [mensagemCadastro, setMensagemCadastro] = useState("");
    const [rua, setRua] = useState("");
    const [bairro, setBairro] = useState("");
    const [numero, setNumeo] = useState("");
    const [capacidade, setCapacidade] = useState("");
    const [aluguel, setAluguel] = useState("");
    const [estados, setEstados] = useState([]);
    const [openEstados, setOpenEstados] = useState(false);
    const [valueEstados, setValueEstados] = useState(null);
    const [cidades, setCidades] = useState([]);
    const [openCidades, setOpenCidades] = useState(false);
    const [valueCidades, setValueCidades] = useState(null);
    // const [pickerCidadesDisable, setPickerCidadesDisable] = useState(false);

    useEffect(() => {
        if(!usuarioService.estadoAutenticacaoMudou){
            navigation.navigate('Login');
        }
        ibgeService.getEstados((resposta) => {
            // console.log(resposta)
            // setEstados(resposta)
            // const estadosList = []
            // estados.forEach(estado => {
            //     estadosList.push({
            //         label: estado,
            //         value: estado
            //     })
            // })
            // setItems(estadosList)
            setEstados(resposta)
        })
    }, [])

    useEffect( () => {
        if(valueEstados != null){
            ibgeService.getCidadesPorEstado(valueEstados, (resposta) => {
                setCidades(resposta)
                // console.log(resposta)
                
            })
        }
    }, [valueEstados])

    // useEffect( () => {
    //     openEstados ?  setPickerCidadesDisable(true) : setPickerCidadesDisable(false)
    // }, [openEstados])
    
    return (
        <View style={styles.container}>
            <Text style={styles.title1}>{mensagemCadastro}</Text> 

            <DropDownPicker
                // searchable={true}
                listMode="MODAL"
                style={styles.picker}
                textStyle={styles.picketText}
                placeholder="Selecione um Estado"
                open={openEstados}
                value={valueEstados}
                items={estados}
                setOpen={setOpenEstados}
                setValue={setValueEstados}
                setItems={setEstados}
            />
            <DropDownPicker
                // disabled={pickerCidadesDisable}
                // disabledStyle={{
                //     opacity: 0
                //   }}
                searchable={true}
                listMode="MODAL"
                style={styles.picker}
                textStyle={styles.picketText}
                placeholder="Selecione uma Cidade"
                searchPlaceholder="Digite o nome da Cidade"
                open={openCidades}
                value={valueCidades}
                items={cidades}
                setOpen={setOpenCidades}
                setValue={setValueCidades}
                setItems={setCidades}
            />

            <TextInput
                style={styles.input}
                onChangeText={setBairro}
                value={bairro}
                placeholder="Bairro"
            />
            <TextInput
                style={styles.input}
                onChangeText={setRua}
                value={rua}
                placeholder="Rua"
            />
            <TextInput
                style={styles.input}
                onChangeText={setNumeo}
                value={numero}
                placeholder="Número"
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                onChangeText={setCapacidade}
                value={capacidade}
                placeholder="Capacidade Pessoas"
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                onChangeText={setAluguel}
                value={aluguel}
                placeholder="Aluguel"
                keyboardType="numeric"
            />
            
            <ButtonPersonalizado
            title="Adicionar"
            onPress={ () => moradiaService.cadastrarMoradia(db, auth.currentUser.uid, valueEstados, valueCidades, bairro, rua, numero, capacidade, aluguel, (resposta) => {
                setMensagemCadastro(resposta)
                if(resposta == true){
                    navigation.navigate('Sua Moradia')
                }
            })}
            />
            
        </View>
    );
};

export default CadastrarMoradiaScreen