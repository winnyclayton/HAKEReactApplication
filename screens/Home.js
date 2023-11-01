import { View, Text, StyleSheet } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useNavigation } from '@react-navigation/native'
import IonIcons from '@expo/vector-icons/Ionicons'

import { AuthContext } from '../contexts/AuthContext'
import { useContext, useState, useEffect } from 'react'

import { Data } from './Data'
import { Profile } from './Profile'
import { Upload } from './Upload'

const Tab = createBottomTabNavigator()

export function Home( props ) {
  const [ email, setEmail ] = useState()

  const Auth = useContext(AuthContext)
  const navigation = useNavigation()

  useEffect( () => {
    if( Auth.currentUser ) {
      setEmail( Auth.currentUser.email )
    }
    else {
      navigation.reset( { index: 0, routes: [ {name: "Sign in"} ] })
    }
  })

  const UploadOptions = {
    tabBarLabel: "Upload",
    tabBarIcon: ({ color }) => <IonIcons name="add-outline" color={color} size={20} />,
    title: "Upload Portal"
    }

  const DataOptions = {
    tabBarLabel: "Home",
    tabBarIcon: ({ color }) => <IonIcons name="home" color={color} size={20} />,
    title: "Home"
  }

  const ProfileOptions = {
    tabBarLabel: "Profile",
    tabBarIcon: ({ color }) => <IonIcons name="person" color={color} size={20} />,
    title: email
  }

  return (
    <Tab.Navigator initialRouteName="Data">
      <Tab.Screen name="Upload" component={Upload} options={UploadOptions} />
      <Tab.Screen name="Data" component={Data} options={ DataOptions } />
      <Tab.Screen name="Profile" component={Profile} options={ProfileOptions} />
    </Tab.Navigator>
  )
}