import { View, Text, Pressable, TextInput, StyleSheet, ScrollView } from 'react-native';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { DbContext } from '../contexts/DbContext';
import { collection, getDocs } from 'firebase/firestore';

export function Browse(props) {
  const [user, setUser] = useState();
  const [data, setData] = useState([]); //data for all artists' artworkLists

  const Auth = useContext(AuthContext);
  const db = useContext(DbContext);

  useEffect(() => {
    if (Auth.currentUser) {
      setUser(Auth.currentUser);
    }
  }, [Auth]);

  useEffect(() => {
    if (user) {
      //create a query to fetch data from the 'allArtworks' collection
      const q = collection(db, 'allArtworks');

      //fetch the data
      getDocs(q)
        .then((querySnapshot) => {
          const artworks = [];
          querySnapshot.forEach((doc) => {
            //assuming your documents have fields like 'artist', 'title', and 'year'
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
      <Text style={styles.homeTitle}>All Artists' Artworks</Text>
      {/* Render the list of all artists' artworks here */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  homeTitle: {
    fontSize: 30,
    textAlign: 'center',
    marginBottom: 10,
  },

});
