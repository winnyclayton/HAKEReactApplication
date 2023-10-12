import { StyleSheet, Text, View, TextInput, Pressable } from 'react-native'
import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { useNavigation } from '@react-navigation/native'

export function Signup( props ) {
  const[email,setEmail] = useState()
  const[password,setPassword] = useState()

  const navigation = useNavigation()
  const auth = useContext(AuthContext)

  // useEffect(() => { console.log(email) }, [email])
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
        <Pressable style={ styles.button } onPress={() => submitHandler() }>
          <Text style={ styles.button.text }>Sign up</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate("Sign in")}>
          <Text>Go to sign in</Text>
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
  }
})