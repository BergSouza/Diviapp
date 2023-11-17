import {NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './Login';
import CadastrarUsuario from './CadastrarUsuario';
import ListaMoradias from './ListaMoradias';
import CadastrarMoradia from './CadastrarMoradia';
import Menu from './Menu';
import SemMoradia from './MenuSemMoradia';
import EditarMoradia from './EditarMoradia';

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
        <Stack.Screen name="Editar Moradia" component={EditarMoradia} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>)
}

export default Main