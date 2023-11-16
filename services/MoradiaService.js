import { collection, addDoc, getDocs, query, where, } from "firebase/firestore";
import IBGEService from "./IBGEService";

const ibgeService = new IBGEService;

class MoradiaService{
    cadastrarMoradia(db, userId, idEstado, idCidade, bairro, rua, numero, capacidade, aluguel , callback){
        if(!idEstado){
            callback("Por favor, selecione um estado!");
            return false
        }
        if(!idCidade){
            callback("Por favor, selecione uma cidade!");
            return false
        }
        if(!bairro){
            callback("Por favor, digite um bairro!");
            return false
        }
        if(!rua){
            callback("Por favor, digite uma rua!");
            return false
        }
        if(!numero){
            callback("Por favor, digite um número");
            return false
        }
        if(!capacidade){
            callback("Por favor, digite a capacidade");
            return false
        }
        if(!aluguel){
            callback("Por favor, digite o aluguel");
            return false
        }

        ibgeService.getEstadoPorId(idEstado, (respostaEstado) => {
            ibgeService.getCidadePorId(idCidade, (respostaCidade) => {
                addDoc(collection(db, "moradia"), {
                    userId: userId,
                    idEstado: idEstado,
                    estado: respostaEstado,
                    idCidade: idCidade,
                    cidade: respostaCidade,
                    bairro: bairro,
                    rua: rua,
                    numero: numero,
                    capacidade: capacidade,
                    aluguel: aluguel,
                }).then((docRef) => {
                    console.log("Document written with ID: ", docRef.id);
                    console.log(docRef)
                    callback(true)
                }).catch((e) => {
                    console.error("Error adding document: ", e);
                    callback("Erro!");
                })
            })
        })
    }

    async buscarMoradias(db, callback){
        await getDocs(collection(db, "moradia")).
        then((querySnapshot) => {
            const moradias = []
            querySnapshot.forEach((doc) => {
                moradias.push({
                    idEstado: doc.data().idEstado,
                    idCidade: doc.data().idCidade,
                    estado: doc.data().estado,
                    cidade: doc.data().cidade,
                    bairro: doc.data().bairro,
                    rua: doc.data().rua,
                    numero: doc.data().numero,
                    capacidade: doc.data().capacidade,
                    aluguel: doc.data().aluguel,
                })
                // console.log(`${doc.id} => ${doc.data().rua}`);
            })
            // console.log(moradias)
            callback(moradias)
        })
        .catch((e => {
            console.log("Erro ao carregar: "+e )
        }));
        ;
    }

    async buscaMoradiaUsuario(db, userId, callback){
        // console.log(userId)
        let moradia = "";
        await getDocs(query(collection(db, "moradia"), where("userId", "==", userId))).
        then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                moradia = {
                    idEstado: doc.data().idEstado,
                    idCidade: doc.data().idCidade,
                    estado: doc.data().estado,
                    cidade: doc.data().cidade,
                    bairro: doc.data().bairro,
                    rua: doc.data().rua,
                    numero: doc.data().numero,
                    capacidade: doc.data().capacidade,
                    aluguel: doc.data().aluguel,
                }
                // console.log(`${doc.id} => ${doc.data().rua}`);
            })
            // console.log(moradias)
        })
        .catch((e => {
            console.log("Erro ao carregar: "+e )
        }));
        callback(moradia)
    }
}

export default MoradiaService