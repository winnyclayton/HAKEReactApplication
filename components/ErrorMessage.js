import { View, Text, StyleSheet } from 'react-native'
import { useState, useEffect} from 'react'

export function ErrorMessage( props ) {
  const [ message, setMessage ] = useState

  useEffect( () => {
    switch( props.error ) {
      case "auth/email-already-in-use" :
        setMessage("The email address is already used")
        break
      default:
        break
    }
  }, [ props.error ] )

  return(
    <View>
      <Text>
        {message}
      </Text>
    </View>
  )
}