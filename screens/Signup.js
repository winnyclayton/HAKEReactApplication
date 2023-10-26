import { StyleSheet, Text, View, TextInput, Pressable } from 'react-native'
import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { useNavigation } from '@react-navigation/native'

import { ErrorMessage } from '../components/ErrorMessage'

export function Signup( props ) {
  const[email,setEmail] = useState('')
  const[password,setPassword] = useState('')

  const[validEmail, setValidEmail ] = useState(false)
  const[validPassword, setValidPassword] = useState(false)

  const[ error, setError ] = useState()

  const navigation = useNavigation()
  const Auth = useContext(AuthContext)

  useEffect( () => {
    if( Auth.currentUser ) {
      navigation.reset( { index: 0, routes: [ {name: "Home"} ] })
    }
  })

  // check the value of email
  useEffect( () => {
    if( email.indexOf('@') > 0 ) {
      setValidEmail( true )
    }
    else {
      setValidEmail( false )
    }
  }, [email])

  // check the value of password
  useEffect( () => {
    if( password.length >= 8 ) {
      setValidPassword( true )
    }
    else {
      setValidPassword( false )
    }
  }, [password])

  const submitHandler = () => {
    props.handler( email, password )
    .then( ( user ) => {
      // sign up successful
    })
    .catch( (error) => {
      console.log( error.code )
      setError( error.code)
    } )
    // reset the fields
    setEmail('')
    setPassword('')
  }

  return(
    <View style={ styles.container }>
      <View style={ styles.form }>
        <Text style={ styles.title }>Register for an account</Text>
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
          style={ (validEmail && validPassword) ? styles.button : styles.disabledButton} 
          onPress={() => submitHandler()}
          disabled={ (validEmail && validPassword) ? false : true }
        >
          <Text style={ styles.button.text }>Sign up</Text>
        </Pressable>
        <Pressable style={styles.authlink} onPress={() => navigation.navigate("Sign in")}>
          <Text style={styles.authlink.text}>Go to sign in</Text>
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
  disabledButton: {
    backgroundColor: '#666666',
    padding: 5,
    text: {
      color: '#eeeeee',
      textAlign: 'center',
    }
  },
  authlink: {
    marginTop: 10,
    text: {
      textAlign: "center"
    }
  }
})