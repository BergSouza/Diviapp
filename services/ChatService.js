import { collection, addDoc, doc, getDocs, query, where, updateDoc, deleteDoc } from "firebase/firestore";

class ChatService{
    async salvarConversa(db, user, moradiaUser){
        let existe = false;
        const querySnapshot = await getDocs(query(collection(db, `historicoConversas/${user}/usuario`), 
            where("usuarioMoradia", "==", moradiaUser)
        ));
        await querySnapshot.forEach((doc) => {
            console.log("HISTóRICO de CONVERSA JA EXISTIA")
            existe = true
        })
        if(!existe){
            addDoc(collection(db, `historicoConversas/${user}/usuario`), {
                usuarioMoradia: moradiaUser,
            });
        }
        
        console.log("HISTóRICO DE CONVERSA SALVO COM SUCESSO!")
    }

    async buscaConversasHistorico(db, user, feedback){
        await getDocs(collection(db, `historicoConversas/${user}/usuario`)).
        then((querySnapshot) => {
            const conversas = []
            querySnapshot.forEach((doc) => {
                conversas.push(doc.data())
            })
            // console.log(moradias)
            feedback(conversas)
        })
    }

    async verificaMensagensNaoLidas(auth, db, callback){
        const querySnapshotNaoLidas = await getDocs(query(collection(db, `mensagensNotificacoes/${auth.currentUser.uid}/usuario`), 
            where("lida", "==", false),
            where("user._id", "!=", auth.currentUser.uid)
        ));
        const querySnapshotTodas = await getDocs(query(collection(db, `mensagensNotificacoes/${auth.currentUser.uid}/usuario`), 
            where("user._id", "!=", auth.currentUser.uid)
        ));

        let mensagens = {}
            querySnapshotTodas.forEach((doc) => {
                // console.log(doc.data())
                try{
                    mensagens[doc.data().user._id]['mensagens'].push({
                        id: doc.data()._id,
                        lida: doc.data().lida
                    })
                }catch(e){
                    mensagens[doc.data().user._id] = {
                        usuario: doc.data().user.name,
                        userId: doc.data().user._id,
                        mensagens:[]
                    }
                    mensagens[doc.data().user._id]['mensagens'].push({
                        id: doc.data()._id,
                        lida: doc.data().lida
                    })
                }
            })
            // console.log(mensagens)
            callback([querySnapshotNaoLidas.size, mensagens]);
    }
}

export default ChatService;
