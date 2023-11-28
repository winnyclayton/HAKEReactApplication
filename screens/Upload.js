import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../config/Config';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { AuthContext } from '../contexts/AuthContext';

export function Upload(props) {
  const [user, setUser] = useState();
  const [artist, setArtist] = useState('');
  const [materials, setMaterials] = useState('');
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [price, setPrice] = useState('');
  const [buttonColor, setButtonColor] = useState('#396C4D');
  const [buttonText, setButtonText] = useState('Save to collection');
  const [textColor, setTextColor] = useState('white');
  const [imageUri, setImageUri] = useState(null);
  const [imageName, setImageName] = useState('');

  const Auth = useContext(AuthContext);
  const navigation = useNavigation();

  useEffect(() => {
    if (Auth.currentUser) {
      setUser(Auth.currentUser);
    }
  }, [Auth]);

  const handleSave = async () => {
    console.log(imageUri)
    if (!artist || !materials || !title || !year || !price || !imageUri) {
      alert('Please fill in all fields and upload an image');
      return;
    }
  
    const userEmail = user.email; //get the user's email address

    const artworkData = {
      artist: artist,
      materials: materials,
      title: title,
      year: year,
      price: price,
      email: userEmail,
    };
  
    // Upload the image to Firebase Storage
    const storage = getStorage();
    const imageRef = ref(storage, `artworkImages/${Date.now()}_${user.uid}.png`);
  
    try {
      await uploadString(imageRef, imageUri, 'data_url', { contentType: 'image/png' });
    
      // Get the download URL of the uploaded image
      const downloadURL = await getDownloadURL(imageRef);
      artworkData.image = downloadURL;
    
      // Set the image name
      setImageName(imageRef.name);
  
      // Add the artwork data to Firestore
      const artistDocRef = doc(db, 'artists', user.uid);
      const artworkListCollectionRef = collection(artistDocRef, 'artworkList');
      const docRef = await addDoc(artworkListCollectionRef, artworkData);
  
      console.log('Document written with ID: ', docRef.id);
  
      // Reset input states and clear the input text
      setArtist('');
      setMaterials('');
      setTitle('');
      setYear('');
      setPrice('');
      setImageUri(null);
      setImageName('');
      setButtonColor('#e5edd5');
      setButtonText('Upload successful!');
      setTextColor('black');
  
      setTimeout(() => {
        // Reset the button text and color after a delay (e.g., 2 seconds)
        setButtonText('Save to collection');
        setButtonColor('#396C4D');
        setTextColor('white');
      }, 2000);
  
      //show success alert
      Alert.alert('Success', 'Artwork has been uploaded successfully', [
        {
          text: 'OK',
          onPress: () => {
            //navigate to home
            navigation.navigate('./Home'); 
          },
        },
      ]);
    } catch (error) {
      console.error('Error uploading image or adding document: ', error);
  
      //show an error alert
      Alert.alert('Error', 'Failed to upload artwork. Please try again.');
    }
  };
  
  const handleImageUpload = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    console.log('Media library permissions status:', status);
  
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 0.5,
    });
  
    console.log('Image selection result:', result);
  
    if (!result.cancelled) {
      setImageUri(result.uri);
      setImageName(result.uri.substring(result.uri.lastIndexOf('/') + 1));
    } else {
      alert('Failed to get the selected image. Please try again.');
    }
    
  };
  

  const handleDeleteImage = () => {
    setImageUri(null);
    setImageName('');
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
            placeholder="$0,000.00"
            onChangeText={(text) => setPrice(text)}
            value={price}
          />
           <Pressable
    style={styles.imageUploadButton}
    onPress={handleImageUpload}
  >
    <Text style={styles.buttonText}>
      {imageUri ? 'Change Image' : 'Upload Image of Artwork'}
    </Text>
  </Pressable>
  
  {imageName && (
    <View style={styles.deleteButtonContainer}>
      <Text>Image Name: {imageName}</Text>
      <Pressable
        style={styles.deleteButton}
        onPress={handleDeleteImage}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </Pressable>
    </View>
  )}
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
    alignItems: 'center',
  },
  saveButton: {
    marginVertical: 15,
    padding: 8,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  saveButtonText: {
    textAlign: 'center',
  },
  deleteButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  deleteButton: {
    marginLeft: 10,
    padding: 8,
    backgroundColor: '#396C4D',
    borderRadius: 6,
  },
});
