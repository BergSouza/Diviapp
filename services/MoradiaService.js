import { collection, addDoc, getDocs, query, where, } from "firebase/firestore";

class MoradiaService{
    cadastrarMoradia(db, userId, bairro, rua, numero, capacidade, aluguel , callback){
    addDoc(collection(db, "moradia"), {
            userId: userId,
            bairro: bairro,
            rua: rua,
            numero: numero,
            capacidade: capacidade,
            aluguel: aluguel,
        }).then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
            console.log(docRef)
            callback("Cadastrado com Sucesso!")
        }).catch((e) => {
            console.error("Error adding document: ", e);
            callback("Erro!");
         })
    }

    async buscarMoradias(db, callback){
        await getDocs(collection(db, "moradia")).
        then((querySnapshot) => {
            const moradias = []
            querySnapshot.forEach((doc) => {
                moradias.push({
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
        console.log(userId)
        await getDocs(query(collection(db, "moradia")), where("userId", "==", `${userId}asd`)).
        then((querySnapshot) => {
            let moradia = {};
            querySnapshot.forEach((doc) => {
                moradia = {
                    bairro: doc.data().bairro,
                    rua: doc.data().rua,
                    numero: doc.data().numero,
                    capacidade: doc.data().capacidade,
                    aluguel: doc.data().aluguel,
                }
                // console.log(`${doc.id} => ${doc.data().rua}`);
            })
            // console.log(moradias)
            callback(moradia)
        })
        .catch((e => {
            console.log("Erro ao carregar: "+e )
        }));
        ;
    }
}

export default MoradiaService