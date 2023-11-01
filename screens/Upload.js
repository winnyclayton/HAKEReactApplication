import { View, Text, Pressable, TextInput, StyleSheet, ScrollView } from 'react-native'
import { useContext, useState, useEffect } from 'react'
import { signOut } from 'firebase/auth'

import { AuthContext } from '../contexts/AuthContext'

export function Upload(props) {
  const [user, setUser] = useState()

  const Auth = useContext(AuthContext)

  useEffect(() => {
    if (Auth.currentUser) {
      setUser(Auth.currentUser)
    }
  }, [Auth])

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Getting user data...</Text>
      </View>
    )
  } else {
    return (
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.formContainer}>
          <Text>Please upload a new artwork.</Text>
          <Text>Artist:</Text>
          <TextInput
            style={styles.inputField}
            placeholder="Enter artist name"
            onChangeText={(text) => {
              // Handle artist input here
            }}
          />
          
          <Text>Materials:</Text>
          <TextInput
            style={styles.inputField}
            placeholder="Enter materials used"
            onChangeText={(text) => {
              // Handle materials input here
            }}
          />
          <Text>Title:</Text>
          <TextInput
            style={styles.inputField}
            placeholder="Enter artwork title"
            onChangeText={(text) => {
              // Handle title input here
            }}
          />
          <Text>Year:</Text>
          <TextInput
            style={styles.inputField}
            placeholder="Enter artwork year"
            onChangeText={(text) => {
              // Handle year input here
            }}
          />
          <Pressable
            style={styles.imageUploadButton}
            onPress={() => {
              // Handle image upload here
            }}
          >
            <Text style={styles.buttonText}>Upload image of artwork</Text>
          </Pressable>
        </View>
        <Pressable
          style={styles.saveButton}
          onPress={() => {
            // Store artwork to the list here
          }}
        >
          <Text style={styles.saveButtonText}>Save to collection</Text>
        </Pressable>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  formContainer: {
    padding: 10,
  },
  inputField: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 6,
    marginVertical: 8,
    padding: 8,
  },
  imageUploadButton: {
    marginVertical: 8,
    padding: 8,
    backgroundColor: '#e5edd5',
    borderRadius: 6,
  },
  saveButton: {
    marginVertical: 15,
    padding: 8,
    backgroundColor: 'green',
    borderRadius: 6,
  },
  buttonText: {
    color: 'black',
    textAlign: 'center',
  },
  saveButtonText: {
    color: 'white',
    textAlign: 'center',
  },
})
