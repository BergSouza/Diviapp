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

    async cancelarConvidaMoradia(db, user, moradia, callback){
        const querySnapshot = await getDocs(query(collection(db, `convitesMoradia`), 
            where("usuario", "==", user),
            where("moradia", "==", moradia)
        ));
        querySnapshot.forEach((document) => {
            const docRef = doc(db, `convitesMoradia`, document.id);
            deleteDoc(docRef).then(() => {    
                console.log("Convite deletado com sucesso!")
                callback(true)
            })
        })
    }

    async aceitarConvite(db, user, moradia, callback){
        this.cancelarConvidaMoradia(db, user, moradia, async (resposta) => {
            addDoc(collection(db, `moradores/${moradia}/usuario`), {
                usuario: user,
            });
            console.log("CONVITE ACEITO COM SUCESSO!")
            callback(true)
        })
    }

    async buscaConvitesMoradiaUsuario(db, user, callback){
        let resposta = []
        const querySnapshot = await getDocs(query(collection(db, `convitesMoradia`), 
            where("usuario", "==", user),
            where("situacao", "==", "pendente")
        ));
        await querySnapshot.forEach((doc) => {
            console.log("FUNC BUSCA CONVITES")
            console.log(doc.data())
            resposta.push(doc.data().moradia);
        })
        callback(resposta)
    }

    async buscaConviteMoradiaUsuario(db, user, moradia, callback){
        let resposta = "nao enviado";
        const querySnapshot = await getDocs(query(collection(db, `convitesMoradia`), 
            where("usuario", "==", user),
            where("moradia", "==", moradia)
        ));
        await querySnapshot.forEach((doc) => {
            console.log(doc)
            resposta = (doc.data().situacao);
        })
        callback(resposta)
    }

    async convidaMoradia(db, user, moradia, callback){
        await this.buscaConviteMoradiaUsuario(db, user, moradia, (resultado) => {
            if(resultado == "nao enviado"){
                addDoc(collection(db, `convitesMoradia`), {
                    usuario: user,
                    moradia: moradia,
                    situacao: 'pendente'
                });
            }
        })
        console.log("Convite enviado com sucesso!")
        callback(true)
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
        let usuario = {}
        await getDocs(query(collection(db, "users"), where("userId", "==", userId))).
        then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                usuario = {
                    nome: doc.data().nome,
                    sobrenome: doc.data().sobrenome,
                    userId: doc.data().userId,
                    usuario: doc.data().usuario,
                }
            })
            // console.log(usuario)
            callback(usuario)
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