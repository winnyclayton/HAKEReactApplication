import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'
import { useState } from 'react'
// contexts
import { AuthContext } from './contexts/AuthContext'
import { DbContext } from './contexts/DbContext'
// firebase
import { firebaseConfig } from './config/Config'
import { initializeApp } from 'firebase/app'
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword
} from "firebase/auth"
import { getFirestore } from 'firebase/firestore'
// react navigation
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
// screens
import { Signup } from './screens/Signup'
import { Signin } from './screens/Signin'
import { Home } from './screens/Home'

const Stack = createNativeStackNavigator()

export default function App() {
  const FBapp = initializeApp(firebaseConfig)
  const FBauth = getAuth(FBapp)
  const FBdb = getFirestore(FBapp)
  // state
  const [auth, setAuth] = useState()

  // authentication observer
  onAuthStateChanged(FBauth, (user) => {
    if (user) {
      // user is authenticated
      setAuth(user)
    }
    else {
      // user is not authenticated
      setAuth(null)
    }
  })

  const Register = (email, password) => {
    return new Promise((resolve, reject) => {
      createUserWithEmailAndPassword(FBauth, email, password)
        .then((response) => resolve(response))
        .catch((err) => reject(err))
    })
  }

  const Login = (email, password) => {
    return new Promise((resolve, reject) => {
      signInWithEmailAndPassword(FBauth, email, password)
        .then((response) => resolve(response))
        .catch((err) => reject(err))
    })
  }

  return (
    <AuthContext.Provider value={FBauth}>
      <DbContext.Provider value={FBdb}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Sign up">
              {(props) => <Signup handler={Register} />}
            </Stack.Screen>
            <Stack.Screen name="Sign in">
              {(props) => <Signin handler={Login} />}
            </Stack.Screen>
            <Stack.Screen name="Home" options={{ headerShown: false }}>
              {(props) => <Home />}
            </Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      </DbContext.Provider>
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});