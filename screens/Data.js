import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import { DbContext } from '../contexts/DbContext';
import {
  collection,
  doc,
  getDoc,
  query,
  where,
} from 'firebase/firestore';

export function Data(props) {
  const db = useContext(DbContext);
  const Auth = useContext(AuthContext);

  const [data, setData] = useState([]);
  const [user, setUser] = useState();

  const getData = async () => {
    if (user) {
      console.log('User exists:', user);
      const artistDocRef = doc(db, 'artists', user.uid);
      console.log('Artist Doc Ref:', artistDocRef);
  
      try {
        const artistDocSnapshot = await getDoc(artistDocRef);
        console.log('Artist Doc Snapshot:', artistDocSnapshot);
  
        if (artistDocSnapshot.exists()) {
          const artistData = artistDocSnapshot.data();
          console.log('Artist Data:', artistData);
  
          if (artistData.artworkList) {
            console.log('Artwork List:', artistData.artworkList);
            setData(artistData.artworkList);
          }
        }
      } catch (error) {
        console.error('Error fetching artist data:', error);
      }
    }
  };
  

  useEffect(() => {
    if (Auth.currentUser) {
      setUser(Auth.currentUser);
      getData();
    } else {
      setUser(null);
    }
  }, [Auth]);

  return (
    <View style={styles.container}>
      <Text>Your artworks</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <Text>Artist: {item.artist}</Text>
            <Text>Title: {item.title}</Text>
            <Text>Year: {item.year}</Text>
            {/* Add more fields as needed */}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
  },
});
