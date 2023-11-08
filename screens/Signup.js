import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

export function Signup(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [validEmail, setValidEmail] = useState(false);
  const [validPassword, setValidPassword] = useState(false);

  const Auth = useContext(AuthContext);
  const navigation = useNavigation();

  useEffect(() => {
    if (email.indexOf('@') > 0) {
      setValidEmail(true);
    } else {
      setValidEmail(false);
    }
  }, [email]);

  useEffect(() => {
    if (password.length >= 8) {
      setValidPassword(true);
    } else {
      setValidPassword(false);
    }
  }, [password]);

  useEffect(() => {
    if (Auth.currentUser) {
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    }
  }, [Auth.currentUser, navigation]);

  const submitHandler = () => {
    props.handler(email, password)
      .then((user) => {
        //sign up successful
      })
      .catch((error) => {
        console.log(error.code);
      });
    //reset the fields
    setEmail('');
    setPassword('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Register for an account</Text>
        <Text style={styles.emailText}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="you@example.com"
          value={email}
          onChangeText={(val) => setEmail(val)}
        />
        <Text style={styles.passwordText}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="minimum 8 characters"
          secureTextEntry={true}
          value={password}
          onChangeText={(val) => setPassword(val)}
        />
        <Pressable
          style={validEmail && validPassword ? styles.button : styles.disabledButton}
          onPress={() => submitHandler()}
          disabled={!(validEmail && validPassword)}
        >
          <Text style={styles.buttonText}>Sign up</Text>
        </Pressable>
        <Pressable style={styles.authlink} onPress={() => navigation.navigate('Sign in')}>
          <Text style={styles.authlinkText}>Go to sign in</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF9EE', 
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    marginVertical: 10,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emailText: {
    color: 'white',
    paddingBottom: 5,
  },
  passwordText: {
    color: 'white',
    paddingBottom: 5,
  },
  form: {
    backgroundColor: '#396C4D', 
    padding: 30,
    borderRadius: 10, 
  },
  input: {
    backgroundColor: '#eeeeee',
    minWidth: 250,
    padding: 5,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#779E41',
    padding: 5,
  },
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
  },
  disabledButton: {
    backgroundColor: '#E5EDD5',
    padding: 5,
  },
  authlink: {
    marginTop: 10,
  },
  authlinkText: {
    textAlign: 'center',
    color: 'white',
    textDecorationLine: 'underline',
  },
});
