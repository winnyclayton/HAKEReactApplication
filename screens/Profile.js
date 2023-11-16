import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { useContext, useState, useEffect } from 'react';
import { signOut, deleteUser } from 'firebase/auth'; 

import { AuthContext } from '../contexts/AuthContext';

export function Profile(props) {
  const [user, setUser] = useState();

  const Auth = useContext(AuthContext);

  useEffect(() => {
    if (Auth.currentUser) {
      setUser(Auth.currentUser);
    }
  }, [Auth]);

  const handleDeleteAccount = async () => {
    try {
      await deleteUser(user);
      console.log('Account deleted successfully');
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: '#FDF9EE' }]}>
        <Text>Getting user data...</Text>
      </View>
    );
  } else {
    return (
      <View style={[styles.container, { backgroundColor: '#FDF9EE' }]}>
        <Text style={styles.greetingText}>Hello {user.email}</Text>
        <Pressable
          style={styles.signoutButton}
          onPress={() => {
            signOut(Auth).then(() => {
              //user signed out
              console.log('User signed out');
            });
          }}
        >
          <Text style={styles.buttonText}>Sign out</Text>
        </Pressable>
        <Pressable
          style={styles.deleteaccButton}
          onPress={handleDeleteAccount}
        >
          <Text style={styles.buttonText}>Delete account</Text>
        </Pressable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  signoutButton: {
    marginVertical: 5,
    padding: 8,
    backgroundColor: 'grey',
    borderRadius: 6,
  },
  deleteaccButton: {
    marginVertical: 5,
    padding: 8,
    backgroundColor: 'black',
    borderRadius: 6,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  greetingText: {
    textAlign: 'center',
    marginVertical: 20,
  },
});

