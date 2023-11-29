import {NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './Login';
import CadastrarUsuario from './CadastrarUsuario';
import ListaMoradias from './ListaMoradias';
import CadastrarMoradia from './CadastrarMoradia';
import Menu from './Menu';
import SemMoradia from './MenuSemMoradia';
import ComMoradia from './MenuComMoradia';
import EditarMoradia from './EditarMoradia';
import ContatoMoradia from './ContatoMoradia';
import ChatPessoal from './ChatPessoal';
import ChatMoradia from './ChatMoradia'
import ListaChat from './ListaChat';
import ListaConversasSalvas from './ListaConversasSalvas';
import CadastrarAviso from './CadastrarAviso';
import AvisosMoradia from './AvisosMoradia';
import Moradores from './Moradores';

const Stack = createNativeStackNavigator();

const Main = () => {
    return (<NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Moradias" component={ListaMoradias} options={{ headerShown: false }} />
        <Stack.Screen name="Cadastro Usuário" component={CadastrarUsuario} options={{ headerShown: false }} />
        <Stack.Screen name="Cadastrar Moradia" component={CadastrarMoradia} options={{ headerShown: false }} />
        <Stack.Screen name="Sua Moradia" component={Menu} options={{ headerShown: false }} />
        <Stack.Screen name="Procurar Moradia" component={SemMoradia} options={{ headerShown: false }} />
        <Stack.Screen name="Moradia" component={ComMoradia} options={{ headerShown: false }}/>
        <Stack.Screen name="Editar Moradia" component={EditarMoradia} options={{ headerShown: false }} />
        <Stack.Screen name="Contato Moradia" component={ContatoMoradia} options={{ headerShown: false }} />
        <Stack.Screen name="Chat Pessoal" component={ChatPessoal} />
        <Stack.Screen name="Chat Moradia" component={ChatMoradia} />
        <Stack.Screen name="Lista Chat" component={ListaChat} options={{ headerShown: false }}/>
        <Stack.Screen name="Lista Conversas Salvas" component={ListaConversasSalvas} options={{ headerShown: false }}/>
        <Stack.Screen name="Adicionar Aviso" component={CadastrarAviso} options={{ headerShown: false }}/>
        <Stack.Screen name="Avisos Moradia" component={AvisosMoradia} options={{ headerShown: false }}/>
        <Stack.Screen name="Moradores" component={Moradores} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>)
}

export default Main