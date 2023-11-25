import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, sendPasswordResetEmail } from "firebase/auth";
import { collection, addDoc, doc, getDocs, query, where, updateDoc, deleteDoc } from "firebase/firestore";

class UsuarioService{
    estadoAutenticacaoMudou(auth){
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // const uid = user.uid;
                return true;
            } else {
                return false;
            }
        });
    }

    async atualizaMensagensNaoLidas(auth, db, sender){
        const querySnapshot = await getDocs(
            query(collection(db, `mensagensNotificacoes/${auth.currentUser.uid}/usuario`), where("user._id", "==", sender))
        );
    
        querySnapshot.forEach(async (document) => {
            const docRef = doc(db, `mensagensNotificacoes/${auth.currentUser.uid}/usuario`, document.id);
            await updateDoc(docRef, {
                lida: true
            });
            console.log(`Documento ${document.id} atualizado!`);
        });
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

    async criarUsuarioComEmailESenha(auth, db, usuario, nome, sobrenome, email, senha, callback){
        if(!usuario){
            callback("Por favor, digite um nome de usuário!");
            return false
        }
        if(!nome){
            callback("Por favor, digite um nome!");
            return false
        }
        if(!sobrenome){
            callback("Por favor, digite um sobrenome!");
            return false
        }
        await getDocs(query(collection(db, "users"), where("usuario", "==", usuario))).
        then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                callback("Nome de Usuário já está em uso!")
                return false
            })
        })
        .catch((e => {
            console.log("Erro ao carregar: "+e )
        }));
        createUserWithEmailAndPassword(auth, email, senha)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("CADASTRADO COM SUCESSO!")
            addDoc(collection(db, "users"), {
                userId: user.uid,
                usuario: usuario,
                nome: nome,
                sobrenome: sobrenome,
            }).then((docRef) => {
                console.log("informações do usuário cadastrado: ", docRef.id);
                console.log(docRef)
                callback(true)
            }).catch((e) => {
                console.error("Error ao adicionar: ", e);
                callback("Erro!");
            })
            callback(true)
            })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // console.log("ERRO AO CADASTRAR: "+errorMessage)
            
            if(errorMessage == "Firebase: Error (auth/invalid-email)."){
                callback("Email Inválido");
            }
            if(errorMessage == "Firebase: Error (auth/missing-password)."){
                callback("Senha Vazia");
            }
            if(errorMessage == "Firebase: Error (auth/email-already-in-use)."){
                callback("Email já está em uso");
            }
        });
    }

    async getInformacoesUsuario(db, userId, callback){
        let usuario = null
        await getDocs(query(collection(db, "users"), where("userId", "==", userId))).
        then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // usuario = doc.data().usuario
                callback(doc.data())
                return true
            })
        })
        .catch((e => {
            console.log("Erro ao carregar: "+e )
        }));
        
    }

    logarComEmailESenha(auth, email, senha, callback){
        signInWithEmailAndPassword(auth, email, senha)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("LOGADO COM SUCESSO!")
            callback(true)
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("ERRO AO LOGAR: "+errorMessage)
            if(errorMessage == "Firebase: Error (auth/invalid-email)."){
                callback("Email Inválido");
            }
            if(errorMessage == "Firebase: Error (auth/missing-password)." || errorMessage == "Firebase: Error (auth/invalid-login-credentials)."){
                callback("Senha Inválida");
            }
        });
    }

    deslogarUsuario(auth, callback){
        signOut(auth)
        .then(function() {
            // Sign-out successful.
            console.log("Deslogado com sucesso!");
            callback(true);
        })
        .catch(function(error) {
            // An error happened
            console.log("Erro ao desloga!");
        });
    }

    enviarEmailEsqueciSenha(auth, email, callback){
        sendPasswordResetEmail(auth, email)
        .then(() => {
            callback(true)
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // ..
            // console.log(errorMessage)
            if(errorMessage == "Firebase: Error (auth/missing-email)."){
                callback("Digite um Email!")
            }
            if(errorMessage == "Firebase: Error (auth/invalid-email)."){
                callback("Email Inválido!")
            }
        });
    }
}

export default UsuarioService