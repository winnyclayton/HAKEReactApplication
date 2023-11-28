import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Image } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

export function Signup(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [validEmail, setValidEmail] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const [signupError, setSignupError] = useState(null);

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
        // sign up successful
        setSignupError(null); // Clear any previous error message
      })
      .catch((error) => {
        console.log(error.code);
        // Handle the specific error for "auth/email-already-in-use"
        if (error.code === 'auth/email-already-in-use') {
          setSignupError('You have already signed up. Please go to the sign-in page.');
        } else {
          setSignupError('An error occurred during sign up. Please try again.');
        }
      });
    // reset the fields
    setEmail('');
    setPassword('');
  };


  {signupError && (
    <Text style={styles.errorMessage}>
      {signupError}
    </Text>
  )}
  return (
    <View style={styles.container}>

<Image
  source={require('../assets/HAKElogo.png')} 
  style={styles.logo}
/>
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
      {signupError && (
        <Text style={styles.errorMessage}>
          {signupError}
        </Text>
      )}
    </View>
  </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#396C4D', 
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
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
  logo: {
    width: 100, //adjust the width as needed
    marginBottom: 20, //margin between the logo and the form
  },
  errorMessage: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  }
});
