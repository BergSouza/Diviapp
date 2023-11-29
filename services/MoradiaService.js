import { collection, addDoc, doc, getDocs, query, where, updateDoc, deleteDoc } from "firebase/firestore";
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
                    console.log("Documento cadastrado com id: ", docRef.id);
                    console.log(docRef)
                    callback(true)
                }).catch((e) => {
                    console.error("Error ao adicionar: ", e);
                    callback("Erro!");
                })
            })
        })
    }

    editarMoradia(db, id, idEstado, idCidade, bairro, rua, numero, capacidade, aluguel , callback){
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
                updateDoc(doc(db, "moradia", id), {
                    idEstado: idEstado,
                    idCidade: idCidade,
                    estado: respostaEstado,
                    cidade: respostaCidade,
                    bairro: bairro,
                    rua: rua,
                    numero: numero,
                    capacidade: capacidade,
                    aluguel: aluguel,
                }).then(() => {
                    console.log("Documento atualizado!");
                    callback(true)
                }).catch((e) => {
                    console.error("Error ao editar: ", e);
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
                    idDoc: doc.id,
                    userId: doc.data().userId,
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

    async buscaAvisos(db, moradia, callback){
        let resposta = []
        const querySnapshot = await getDocs(collection(db, `avisosMoradia/${moradia}/avisos`)
        );
        await querySnapshot.forEach((doc) => {
            resposta.push({
                id: doc.id,
                titulo: doc.data().titulo,
                texto: doc.data().texto
            })
        })
        callback(resposta)
    }

    async removerAviso(db, moradia, aviso, callback){
        deleteDoc(doc(db, `avisosMoradia/${moradia}/avisos`, aviso)).
        then(()=>{
            callback(true)
        }).
        catch(() => {
            callback("Não foi possível excluir!")
        });
    }

    async adicionarAviso(db, moradia, titulo, texto, callback){
        if(!titulo){
            callback("Por favor, digite um título!");
            return false
        }
        if(!texto){
            callback("Por favor, digite um texto!");
            return false
        }
        addDoc(collection(db, `avisosMoradia/${moradia}/avisos`), {
            titulo: titulo,
            texto: texto
        }).then(() => {
            console.log("AVISO ADICIONIADO COM SUCESSO!")
            callback("Adicionado com Sucesso!")
        }).catch((error) => {
            console.log("OCORREU UM ERRO AO ADICIONAR O AVISO: "+error)
            callback("Erro ao Adicionar!")
        });
    }

    async buscaMoradiaUsuario(db, userId, callback){
        // console.log(userId)
        let moradia = "";
        await getDocs(query(collection(db, "moradia"), where("userId", "==", userId))).
        then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                moradia = {
                    idDoc: doc.id,
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

    deletarMoradia(db, id, callback){
        deleteDoc(doc(db, "moradia", id)).
        then(()=>{
            callback(true)
        }).
        catch(() => {
            callback("Não foi possível excluir!")
        });
    }
}

export default MoradiaService