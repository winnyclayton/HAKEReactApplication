import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../config/Config';
import { useNavigation } from '@react-navigation/native';

import { AuthContext } from '../contexts/AuthContext';

export function Upload(props) {
  const [user, setUser] = useState();
  const [artist, setArtist] = useState('');
  const [materials, setMaterials] = useState('');
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [price, setPrice] = useState('');
  const [buttonColor, setButtonColor] = useState('green');
  const [buttonText, setButtonText] = useState('Save to collection');
  const [textColor, setTextColor] = useState('white');

  const Auth = useContext(AuthContext);
  const navigation = useNavigation();

  useEffect(() => {
    if (Auth.currentUser) {
      setUser(Auth.currentUser);
    }
  }, [Auth]);

  const handleSave = async () => {
    if (!artist || !materials || !title || !year || !price) {
      alert('Please fill in all fields');
      return;
    }

    const artworkData = {
      artist: artist,
      materials: materials,
      title: title,
      year: year,
      price: price,
    };

    const artistDocRef = doc(db, 'artists', user.uid);

    const artistDocSnapshot = await getDoc(artistDocRef);
    if (artistDocSnapshot.exists()) {
      const artworkListCollectionRef = collection(artistDocRef, 'artworkList');
      try {
        const docRef = await addDoc(artworkListCollectionRef, artworkData);
        console.log('Document written with ID: ', docRef.id);

        //reset input states and clear the input text
        setArtist('');
        setMaterials('');
        setTitle('');
        setYear('');
        setPrice('');

        setButtonColor('#e5edd5');
        setButtonText('Upload successful!');
        setTextColor('black');

        setTimeout(() => {
          //reset the button text and color after a delay (eg 2 seconds)
          setButtonText('Save to collection');
          setButtonColor('green');
          setTextColor('white');
        }, 2000);

        //show a success alert
        Alert.alert('Success', 'Artwork has been uploaded successfully', [
          {
            text: 'OK',
            onPress: () => {
              //navigate to the Home screen
              navigation.navigate('./Home'); // replace 'Home' with the correct screen name
            },
          },
        ]);
      } catch (error) {
        console.error('Error adding document: ', error);
        //show an error alert
        Alert.alert('Error', 'Failed to upload artwork. Please try again.');
      }
    } else {
      console.error('Artist document does not exist.');
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Getting user data...</Text>
      </View>
    );
  } else {
    return (
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        style={{ backgroundColor: '#FDF9EE' }} // set background color to #FDF9EE
      >
        <View style={styles.formContainer}>
          <Text>Please upload a new artwork.</Text>
          <Text>Artist:</Text>
          <TextInput
            style={styles.inputField}
            placeholder="Enter artist name"
            onChangeText={(text) => setArtist(text)}
            value={artist} // controlled component with value
          />
          <Text>Materials:</Text>
          <TextInput
            style={styles.inputField}
            placeholder="Enter materials used"
            onChangeText={(text) => setMaterials(text)}
            value={materials}
          />
          <Text>Title:</Text>
          <TextInput
            style={styles.inputField}
            placeholder="Enter artwork title"
            onChangeText={(text) => setTitle(text)}
            value={title}
          />
          <Text>Year:</Text>
          <TextInput
            style={styles.inputField}
            placeholder="Enter artwork year"
            onChangeText={(text) => setYear(text)}
            value={year}
          />
          <Text>Price:</Text>
          <TextInput
            style={styles.inputField}
            placeholder="Enter artwork price"
            onChangeText={(text) => setPrice(text)}
            value={price}
          />
          <Pressable
            style={styles.imageUploadButton}
            onPress={() => {
              // handle image upload here
            }}
          >
            <Text style={styles.buttonText}>Upload image of artwork</Text>
          </Pressable>
        </View>
        <Pressable
          style={[styles.saveButton, { backgroundColor: buttonColor }]}
          onPress={handleSave}
        >
          <Text style={[styles.saveButtonText, { color: textColor }]}>
            {buttonText}
          </Text>
        </Pressable>
      </ScrollView>
    );
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
    backgroundColor: 'white'
  },
  imageUploadButton: {
    marginVertical: 8,
    padding: 8,
    backgroundColor: '#E5EDD5',
    borderRadius: 6,
  },
  saveButton: {
    marginVertical: 15,
    padding: 8,
    borderRadius: 6,
  },
  buttonText: {
    color: 'black',
    textAlign: 'center',
  },
  saveButtonText: {
    textAlign: 'center',
  },
});
