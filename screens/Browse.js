import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Image, FlatList, StyleSheet, ScrollView, Pressable, Modal, TextInput } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import { DbContext } from '../contexts/DbContext';
import {
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  documentId,
} from 'firebase/firestore';

export function Browse(props) {
  const [user, setUser] = useState();
  const [data, setData] = useState([]); //data for all artists' artworkLists

  const Auth = useContext(AuthContext);
  const db = useContext(DbContext);

  useEffect(() => {
    console.log('Auth.currentUser:', Auth.currentUser);
    if (Auth.currentUser) {
      setUser(Auth.currentUser);
    } else {
      setUser(null);
    }
  }, [Auth]);
  

  useEffect(() => {
    console.log('user:', user);
    if (user) {
      //fetch data from the artworkList collection for all users
      console.log('Querying data...');
      const q = query(collectionGroup(db, 'artworkList'));

      getDocs(q)
        .then((querySnapshot) => {
          const allArtworks = [];
          querySnapshot.forEach((doc) => {
            const artworkData = doc.data();
            allArtworks.push({ id: doc.id, ...artworkData });
          });
          setData(allArtworks);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
       
    }
  }, [user, db]);

  return (
    <ScrollView style={[styles.container, { backgroundColor: '#FDF9EE' }]}>
      <Text style={styles.homeTitle}>All Artists' Artworks</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
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
                }}
              >
                <Text style={{ color: 'black' }}>Enquire</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  itemContainer: {
    backgroundColor: '#E5EDD5', 
    padding: 10, 
    marginBottom: 10, 
    flexDirection: 'row', 
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center', 
  },
  image: {
    width: 200,
    height: 200, 
  },
  homeTitle: {
    fontSize: 30,
    textAlign: 'center',
    marginBottom: 10,
  },
  button: {
    padding: 10,
    borderRadius: 6,
    marginVertical: 5,
    alignItems: 'center', //center the button content horizontally
    borderWidth: 2, // add black border
  },
});


