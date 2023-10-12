import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
//firebase
import { firebaseConfig } from './config/Config';
import { initializeApp } from 'firebase/app';

export default function App() {
  const FBapp = initializeApp( firebaseConfig )
  return (
    <View style={styles.container}>
      <Text>Hello Winny!</Text>
      <StatusBar style="auto" />
    </View>
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
