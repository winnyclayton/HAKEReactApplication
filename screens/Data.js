import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Image, FlatList, StyleSheet, ScrollView, Pressable, Modal, TextInput } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import { DbContext } from '../contexts/DbContext';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  deleteDoc,
} from 'firebase/firestore';

export function Data(props) {
  const db = useContext(DbContext);
  const Auth = useContext(AuthContext);

  const [data, setData] = useState([]);
  const [user, setUser] = useState(null);

  //state variables for the form fields
  const [artist, setArtist] = useState(''); //init with an empty string
  const [materials, setMaterials] = useState('');
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [price, setPrice] = useState('');

  const [editModalVisible, setEditModalVisible] = useState(false); //state to control the edit modal visibility
  const [selectedItem, setSelectedItem] = useState(null);

//function to delete an item
const deleteItem = async (itemId) => {
  try {
    const collectionRef = collection(db, 'artists', user.uid, 'artworkList');
    const docRef = doc(collectionRef, itemId);

    //remove the item from the Firebase Firestore collection
    await deleteDoc(docRef);

    //update the state to remove the deleted item
    setData((prevData) => prevData.filter((item) => item.id !== itemId));
  } catch (error) {
    console.error('Error deleting item:', error);
  }
};

  
  useEffect(() => {
    if (Auth.currentUser) {
      setUser(Auth.currentUser);
    } else {
      setUser(null);
    }
  }, [Auth]);

  useEffect(() => {
    if (user) {
      //fetch data from the artworkList collection for the currently logged in user
      const q = query(collection(db, 'artists', user.uid, 'artworkList'));

      //fetch data
      getDocs(q)
        .then((querySnapshot) => {
          const artworks = [];
          querySnapshot.forEach((doc) => {
            const artworkData = doc.data();
            artworks.push({ id: doc.id, ...artworkData });
          });
          setData(artworks);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }
  }, [user, db]);

  return (
    <ScrollView style={[styles.container, { backgroundColor: '#FDF9EE' }]}>
      <Text style={styles.homeTitle}>Your artworks</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.infoContainer}>
              <Text>Artist: {item.artist}</Text>
              <Text>Title: {item.title}</Text>
              <Text>Year: {item.year}</Text>
              <Text>Materials: {item.materials}</Text>
              <Text>Price: {item.price}</Text>
            </View>
            <View style={styles.buttonContainer}>
              <Pressable
                style={[styles.button, { backgroundColor: '#DAF6B2', width: 100, borderColor: 'black', borderWidth: 0.5 }]}
                onPress={() => {
                  setSelectedItem(item); //set the selected item for editing
                  setEditModalVisible(true); //open the edit modal
                }}
              >
                <Text style={{ color: 'black' }}>Edit</Text>
              </Pressable>
              <Pressable
                style={[styles.button, { backgroundColor: '#396C4D', width: 100, borderColor: 'black', borderWidth: 0.5 }]}
                onPress={() => deleteItem(item.id)} // call deleteItem function when the button is pressed
              >
                <Text style={styles.buttonText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        )}
      />

 {/* Edit Modal */}
 <Modal
  animationType="slide"
  transparent={true}
  visible={editModalVisible}
>
  <View style={styles.modalContainer}>
    <View style={[styles.modalContent, { backgroundColor: '#FDF9EE', borderWidth: 1, borderColor: 'black' }]}>
      <Text style={styles.editItemText}>Edit Item</Text>
      <View style={styles.formContainer}>
        <Text>Artist:</Text>
        <TextInput
          style={styles.inputField}
          onChangeText={(text) => setArtist(text)}
          value={selectedItem ? selectedItem.artist : artist}
        />
        <Text>Title:</Text>
        <TextInput
          style={styles.inputField}
          onChangeText={(text) => setTitle(text)}
          value={selectedItem ? selectedItem.title : title}
        />
        <Text>Materials:</Text>
        <TextInput
          style={styles.inputField}
          onChangeText={(text) => setMaterials(text)}
          value={selectedItem ? selectedItem.materials : materials}
        />
        <Text>Year:</Text>
        <TextInput
          style={styles.inputField}
          onChangeText={(text) => setYear(text)}
          value={selectedItem ? selectedItem.year : year}
        />
        <Text>Price:</Text>
        <TextInput
          style={styles.inputField}
          onChangeText={(text) => setPrice(text)}
          value={selectedItem ? selectedItem.price : price}
        />
      </View>
      <View style={styles.imageNameContainer}>
        <Text style={styles.imageNameText}>Image Name: image2045.jpeg</Text>
      </View>
      <View style={styles.buttonGroup}>
        <Pressable
          style={styles.changeImageButton}
          onPress={() => setEditModalVisible(false)}
        >
          <Text style={styles.changeImageButtonText}>Change Image</Text>
        </Pressable>
        <Pressable
          style={styles.deleteImageButton}
          onPress={() => setEditModalVisible(false)}
        >
          <Text style={styles.deleteImageButtonText}>Delete Image</Text>
        </Pressable>
      </View>
      <View style={styles.buttonGroup}>
        <Pressable
          style={styles.saveChangesButton}
          onPress={() => setEditModalVisible(false)}
        >
          <Text style={styles.saveChangesButtonText}>Save Changes</Text>
        </Pressable>
        <Pressable
          style={styles.closeButton}
          onPress={() => setEditModalVisible(false)}
        >
          <Text style={styles.closeButtonText}>Close</Text>
        </Pressable>
      </View>
    </View>
  </View>
</Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF9EE',
  },
  itemContainer: {
    backgroundColor: '#E5EDD5', //item container colour
    padding: 10, // padding on each side
    marginBottom: 10, //margin at bottom of each item
    flexDirection: 'row', //display items in a row
  },
  infoContainer: {
    flex: 1, //take up the remaining available space
    justifyContent: 'center', //center content vertically
  },
  image: {
    width: 200, //set image width to 200px
    height: 200, //set image height to 200px (adjust as needed)
  },
  homeTitle: {
    padding: 10,
    fontSize: 30,
    textAlign: 'center',
    marginBottom: 10,
  },
  buttonContainer: {
    justifyContent: 'center', //center the buttons vertically
  },
  button: {
    padding: 10,
    borderRadius: 6,
    marginVertical: 5,
    alignItems: 'center', //center the button content horizontally
    borderWidth: 2, // add black border
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: 'left',
  },
  editItemText: {
    fontSize: 25,
    textAlign: 'center'
  },
  closeButton: {
    padding: 10,
    backgroundColor: 'gray',
    borderRadius: 6,
    marginTop: 10,
  },
  saveChangesButton: {
    padding: 10,
    backgroundColor: 'gray',
    borderRadius: 6,
    marginTop: 10,
  },
  changeImageButton: {
    padding: 10,
    backgroundColor: 'gray',
    borderRadius: 6,
    marginTop: 10,
  },
  deleteImageButton: {
    padding: 10,
    backgroundColor: 'gray',
    borderRadius: 6,
    marginTop: 10,
  },
  closeButtonText: {
    color: 'white',
  },
});