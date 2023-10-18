import { StyleSheet, Text, View, TextInput, Pressable } from 'react-native'
import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { useNavigation } from '@react-navigation/native'


export function Signin( props ) {
  const[email,setEmail] = useState('')
  const[password,setPassword] = useState('')

  const[ validEmail, setValidEmail ] = useState(false)
  const[ validPassword, setValidPassword ] = useState(false)

  const auth = useContext(AuthContext)
  const navigation = useNavigation()

 //check the value of email
 useEffect( () => {
  if( email.indexOf('@') > 0 ) {
  setValidEmail( true )
  }
  else {
    setValidEmail( false )
    //code an alert here for the user 'please enter a valid email'
  }
  }, [email])
  
  //check the value of password
  useEffect( () => {
  if ( password.length >= 8 ) {
    setValidPassword(true)
  }
  else {
    setValidPassword(false)
    //code an alert here for the user 'please enter 8 digits or more'
  }
  }, [password])
  
  const submitHandler = () => {
    props.handler( email, password )
    .then( ( user ) => {
      // sign up successful
    })
    .catch( (error) => {
      console.log( error )
    } )
  }

  return(
    <View style={ styles.container }>
      <View style={ styles.form }>
        <Text style={ styles.title }>Login to your account</Text>
        <Text>Email</Text>
        <TextInput 
          style={styles.input} 
          placeholder="you@example.com"
          value={email}
          onChangeText={(val) => setEmail(val)}
        />
        <Text>Password</Text>
        <TextInput 
          style={styles.input} 
          placeholder="minimum 8 characters"
          secureTextEntry={true}
          value={password}
          onChangeText={(val) => setPassword(val)}
        />
        <Pressable
        style={ (validEmail && validPassword) ? styles.button : styles.disabledButton }
        onPress={() => submitHandler() }
        disabled={(validEmail && validPassword) ? false :true}
        >
          <Text style={ styles.button.text }>Login</Text>
        </Pressable>
        <Pressable
        style={styles.authLink}
        onPress={() => navigation.navigate("Sign up")}
        >
        <Text style={styles.authLink.text}>Don't have an account? Sign up</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'start',
  },
  title: {
    fontSize: 18,
    marginVertical: 10,
  },
  form: {
    marginHorizontal: 10,
    backgroundColor: '#cccccc',
    marginTop: 30,
    padding: 5,
  },
  input: {
    backgroundColor: '#eeeeee',
    minWidth: 250,
    padding: 5,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#333333',
    padding: 5,
    text: {
      color: '#eeeeee',
      textAlign: 'center',
    }
  },
  authLink: {
    marginTop: 10,
    text: {
      textAlign: 'center'
    }
  },
  disabledButton: {
    backgroundColor: '#666666',
    padding: 5,
    text: {
      color: '#eeeeee',
      textAlign: 'center',
    }
  },
})