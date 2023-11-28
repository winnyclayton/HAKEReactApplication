import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  ScrollView,
  Pressable,
  Modal,
  Dimensions,
} from "react-native";
import { AuthContext } from "../contexts/AuthContext";
import { DbContext } from "../contexts/DbContext";
import { collectionGroup, getDocs, query } from "firebase/firestore";
import { Linking } from "react-native";

const windowWidth = Dimensions.get("window").width;

export function Browse(props) {
  const [user, setUser] = useState();
  const [data, setData] = useState([]); //data for all artists' artworkLists
  const [selectedItem, setSelectedItem] = useState(null); // state to track the selected item
  const [modalVisible, setModalVisible] = useState(false);

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
      const q = query(collectionGroup(db, "artworkList"));

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
          console.error("Error fetching data:", error);
        });
    }
  }, [user, db]);

  //handle the enquiry button
  const handleEnquire = (recipientEmail) => {
    if (recipientEmail) {
      // Construct the mailto link with the recipient's email
      const mailtoLink = `mailto:${recipientEmail}`;

      // Open the user's email client
      Linking.openURL(mailtoLink).catch((err) =>
        console.error("Error opening email client:", err)
      );
    } else {
      console.error("Recipient email is missing or invalid:", recipientEmail);
    }
  };

  // Open the modal when an item is pressed
  const handleItemPress = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  // Close the modal
  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: "#FDF9EE" }]}>
      <Text style={styles.homeTitle}>All Artists' Artworks</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => handleItemPress(item)}
            style={styles.itemContainer}
          >
             <Image
              source={{ uri: item.image }}
              style={[
                styles.image,
                windowWidth < 600 ? { width: "50%" } : null,
              ]}
            />
             <View style={styles.infoContainer}>
              <View style={styles.row}>
                <Text style={styles.label}>Artist:</Text>
                <Text style={styles.infoText}>{item.artist}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Title:</Text>
                <Text style={styles.infoText}>{item.title}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Year:</Text>
                <Text style={styles.infoText}>{item.year}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Materials:</Text>
                <Text style={styles.infoText}>{item.materials}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Price:</Text>
                <Text style={styles.infoText}>{item.price}</Text>
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <Pressable
                style={[
                  styles.enquireButton
                ]}
                onPress={() => handleEnquire(item.email)}
              >
                <Text style={{ color: "black" }}>Enquire</Text>
              </Pressable>
            </View>
          </Pressable>
        )}
      />

      {/* Modal for detailed view */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Image
              source={{ uri: selectedItem?.image }}
              style={styles.modalImage}
            />
            <View style={styles.modalTextContainer}>
              <View style={styles.row}>
                <Text style={styles.label}>Artist:</Text>
                <Text style={styles.infoText}>{selectedItem?.artist}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Title:</Text>
                <Text style={styles.infoText}>{selectedItem?.title}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Year:</Text>
                <Text style={styles.infoText}>{selectedItem?.year}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Materials:</Text>
                <Text style={styles.infoText}>{selectedItem?.materials}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Price:</Text>
                <Text style={styles.infoText}>{selectedItem?.price}</Text>
              </View>

              {/* Close button */}
              <Pressable style={styles.closeButton} onPress={closeModal}>
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
    padding: 10,
  },
  itemContainer: {
    backgroundColor: "#E5EDD5",
    padding: 10,
    marginBottom: 10,
    flexDirection: "row",
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 10,
    marginLeft: windowWidth < 600 ? 10 : 0, // Add margin for better spacing on small screens
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
    alignItems: "center",
  },
  label: {
    fontWeight: "bold",
    marginRight: 5,
  },
  infoText: {
    flex: 1,
    maxWidth: "100%",
  },
  image: {
    width: "20%",
    height: "100%",
    resizeMode: "contain",
  },
  homeTitle: {
    fontSize: 30,
    textAlign: "center",
    marginBottom: 10,
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 5,
    borderRadius: 10,
    width: "60%",
    height: "60%",
    flexDirection: "column", // Change to column
  },
  modalImage: {
    width: "100%", // Take up the full width
    height: "70%", // Adjusted to take up 50% of the modal height
    resizeMode: "contain",
    borderRadius: 10,
  },
  closeButton: {
    padding: 10,
    backgroundColor: "#396C4D",
    borderRadius: 6,
    marginTop: 10,
  },
  closeButtonText: {
    color: "white",
    textAlign: "center",
  },
  modalTextContainer: {
    marginTop: 10, // Add some space between the image and text
  },
  modalText: {
    marginBottom: 5,
  },
  enquireButton: {
    backgroundColor: "#DAF6B2",
    width: 75, // Set width to 50% of the original
    height: 30, // Set height to a fixed value
    borderColor: "black",
    borderWidth: 0.5,
    borderRadius: 6,
    alignItems: "center", // Center horizontally
    justifyContent: "center", // Center vertically
  },
});
