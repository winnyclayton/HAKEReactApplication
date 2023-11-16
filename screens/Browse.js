import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Image, FlatList, StyleSheet, ScrollView, Pressable, Modal, TextInput } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import { DbContext } from '../contexts/DbContext';
import {
  collectionGroup,
  getDocs,
  query,
} from 'firebase/firestore';
import { Linking } from 'react-native';

export function Browse(props) {
  const [user, setUser] = useState();
  const [data, setData] = useState([]); //data for all artists' artworkLists

  const Auth = useContext(AuthContext);
  const db = useContext(DbContext);

  useEffect(() => {
    if (Auth.currentUser) {
      setUser(Auth.currentUser);
    } else {
      setUser(null);
    }
  }, [Auth]);

  useEffect(() => {
    if (user) {
      // Fetch data from the artworkList collection for all users
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

  const handleEnquire = (recipientEmail) => {
    // Construct the mailto link with the recipient's email
    const mailtoLink = `mailto:${recipientEmail}`;
  
    // Open the user's email client
    Linking.openURL(mailtoLink).catch((err) => console.error('Error opening email client:', err));
  };
  

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
  onPress={() => handleEnquire(item.email)}
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
    padding: 10,
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
    alignItems: 'center',
    borderWidth: 2,
  },
});
