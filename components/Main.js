import {NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './Login';
import CadastrarUsuario from './CadastrarUsuario';
import ListaMoradias from './ListaMoradias';
import CadastrarMoradia from './CadastrarMoradia';
import Menu from './Menu';

const Stack = createNativeStackNavigator();

const Main = () => {
    return (<NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Moradias" component={ListaMoradias} />
        <Stack.Screen name="Cadastro Usuário" component={CadastrarUsuario} />
        <Stack.Screen name="Cadastrar Moradia" component={CadastrarMoradia} />
        <Stack.Screen name="Sua Moradia" component={Menu} />
      </Stack.Navigator>
    </NavigationContainer>)
}

export default Main