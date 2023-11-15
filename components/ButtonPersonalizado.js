import {TouchableOpacity, Text} from 'react-native'
import styleButton from '../styles/buttonPersonalizado'

const ButtonPersonalizado = (props) => {
    return (
        <TouchableOpacity {...props} style={styleButton.button}>
            <Text style={styleButton.textButton}>{props.title}</Text>
        </TouchableOpacity>
    )
}

export default ButtonPersonalizado