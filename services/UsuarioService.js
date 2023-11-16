import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";

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

    criarUsuarioComEmailESenha(auth, email, senha, callback){
        createUserWithEmailAndPassword(auth, email, senha)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("CADASTRADO COM SUCESSO!")
            // callback(userCredential)
            callback("CADASTRADO COM SUCESSO!")
            })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // console.log("ERRO AO CADASTRAR: "+errorMessage)
            
            // callback(error)
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
}

export default UsuarioService