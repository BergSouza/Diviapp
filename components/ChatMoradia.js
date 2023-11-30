import { GiftedChat } from 'react-native-gifted-chat'
import { useEffect, useState } from "react";
import { View, Text } from 'react-native'
import { getAuth } from 'firebase/auth';
import { collection, addDoc,onSnapshot, query,orderBy } from "firebase/firestore";
import app from '../firebase/firebase_config';
import { getFirestore } from "firebase/firestore";
import UsuarioService from '../services/UsuarioService';

const auth = getAuth(app);
const db = getFirestore(app);
const usuarioService = new UsuarioService()

const ChatScreen = ({route, navigation}) => {
    
    const {moradia} = route.params
    const [messages, setMessages] = useState([]);
    const [usuario, setUsuario] = useState();
    const [carregado, setCarregado] = useState(false)

    useEffect(() => {
        usuarioService.getInformacoesUsuario(db, auth.currentUser.uid, (resposta) => {
            setUsuario(resposta)
            setCarregado(true)
        })
        const unsubscribe = onSnapshot(query(collection(db, `chatsMoradia/${moradia}/chat`), orderBy('createdAt', 'desc')), (snapshot) => {
          setMessages(
            snapshot.docs.map(doc => ({
              _id: doc.id,
              createdAt: doc.data().createdAt.toDate(),
              text: doc.data().text,
              user: {
                _id: doc.data().user._id,
                name: doc.data().user.name,
              },
            }))
          );
        });
    
        return () => unsubscribe();
      }, []);
    
      const onSend = async (newMessages = []) => {
        const { _id, createdAt, text, user } = newMessages[0];
        await addDoc(collection(db, `chatsMoradia/${moradia}/chat`), {
          _id,
          createdAt,
          text,
          user,
        });
      };
    
      return (
        carregado ?
        <GiftedChat
          renderUsernameOnMessage 
          messages={messages}
          onSend={(newMessages) => onSend(newMessages)}
          user={{
            _id: auth.currentUser.uid,
            name: usuario.usuario,
          }}
        />
        :
        <View>
          <Text>Carregando...</Text>
        </View>
      );
}

export default ChatScreen;