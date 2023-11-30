import {React, useEffect, useState} from "react";
import {ScrollView, Text, TextInput} from 'react-native'
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
    const [numero, setNumero] = useState("");
    const [capacidade, setCapacidade] = useState("");
    const [aluguel, setAluguel] = useState("");
    const [estados, setEstados] = useState([]);
    const [openEstados, setOpenEstados] = useState(false);
    const [valueEstados, setValueEstados] = useState(null);
    const [cidades, setCidades] = useState([]);
    const [openCidades, setOpenCidades] = useState(false);
    const [valueCidades, setValueCidades] = useState(null);

    useEffect(() => {
        if(!usuarioService.estadoAutenticacaoMudou){
            navigation.navigate('Login');
        }
        ibgeService.getEstados((resposta) => {
            setEstados(resposta)
        })
    }, [])

    useEffect( () => {
        if(valueEstados != null){
            ibgeService.getCidadesPorEstado(valueEstados, (resposta) => {
                setCidades(resposta)                
            })
        }
    }, [valueEstados])

    
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title1}>{mensagemCadastro}</Text> 
            <Text style={styles.label}>(*) Obrigatório</Text>
            <Text style={styles.label}>* Estado:</Text>
            <DropDownPicker
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
            <Text style={styles.label}>* Cidade:</Text>
            <DropDownPicker
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

            <Text style={styles.label}>* Bairro:</Text>
            <TextInput
                style={styles.input}
                onChangeText={setBairro}
                value={bairro}
                placeholder="Bairro"
            />
            <Text style={styles.label}>* Rua:</Text>
            <TextInput
                style={styles.input}
                onChangeText={setRua}
                value={rua}
                placeholder="Rua"
            />
            <Text style={styles.label}>* Número:</Text>
            <TextInput
                style={styles.input}
                onChangeText={setNumero}
                value={numero}
                placeholder="Número"
                keyboardType="numeric"
            />
            <Text style={styles.label}>* Capacidade Pessoas:</Text>
            <TextInput
                style={styles.input}
                onChangeText={setCapacidade}
                value={capacidade}
                placeholder="Capacidade Pessoas"
                keyboardType="numeric"
            />
            <Text style={styles.label}>* Preço Aluguel R$:</Text>
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
            <ButtonPersonalizado
            title="Voltar"
            onPress={ () => navigation.goBack() }
            />
            
        </ScrollView>
    );
};

export default CadastrarMoradiaScreen