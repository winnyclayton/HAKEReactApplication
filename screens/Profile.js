import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from "react-native";
import { useContext, useState, useEffect } from "react";
import { signOut, deleteUser } from "firebase/auth";

import { AuthContext } from "../contexts/AuthContext";

export function Profile(props) {
  const [user, setUser] = useState();
  const Auth = useContext(AuthContext);

  const [isSignOutModalVisible, setSignOutModalVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

  useEffect(() => {
    if (Auth.currentUser) {
      setUser(Auth.currentUser);
    }
  }, [Auth]);

  const showWarningModalSignOut = () => {
    setSignOutModalVisible(true);
  };

  const showWarningModalDlt = () => {
    setDeleteModalVisible(true);
  };

  const closeModal = () => {
    setSignOutModalVisible(false);
    setDeleteModalVisible(false);
  };

  const handleDeleteAccount = async () => {
    try {
      //delete the user account
      await deleteUser(Auth.currentUser);
      //nav to sign up
      navigation.navigate('Sign up')
    } catch (error) {
      console.error("Error deleting account:", error.message);
    } finally {
      closeModal();
    }
  };

  const handleSignOutAccount = async () => {
    try {
      //sign out the user
      await signOut(Auth);
      navigation.navigate('Sign in')
    } catch (error) {
      console.error("Error signing out:", error.message);
    } finally {
      closeModal();
    }
  };

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: "#FDF9EE" }]}>
        <Text>Getting user data...</Text>
      </View>
    );
  } else {
    return (
      <View style={[styles.container, { backgroundColor: "#FDF9EE" }]}>
        <View>
          
          {/*ALL OF THE INFO*/}
          <Text style={styles.greetingText}>Welcome, {user.email}!</Text>
          <Text style={styles.greetingQuestion}>How can we help?</Text>
          <Text style={styles.contactTitle}>
            <Text style={styles.icon}>📞 </Text>Contact us
          </Text>
          <Text style={styles.contactInfo}>Phone: 0426 883 880</Text>
          <Text style={styles.contactInfo}>Email: hello@hake.house</Text>
          <Text style={styles.contactInfo}>
            Address: 23 Pittwater Road, Brookvale 2100 NSW
          </Text>
          
        </View>

        {/*SIGNOUT BUTTON*/}
        <View style={styles.buttonContainer}>
          <Pressable
            style={styles.signoutButton}
            onPress={showWarningModalSignOut}
          >
            <Text style={styles.buttonText}>Sign out</Text>
          </Pressable>
          {/*DELETE BUTTON*/}
          <Pressable
            style={styles.deleteaccButton}
            onPress={showWarningModalDlt}
          >
            <Text style={styles.buttonText}>Delete account</Text>
          </Pressable>
        </View>

        {/*SIGNOUT MODAL*/}
        <Modal
          visible={isSignOutModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={closeModal}
        >
          {/*SIGNOUT QUESTION*/}
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>
              Are you sure you want to sign out?
            </Text>
            <View style={styles.modalButtonContainer}>

              {/*YES SIGNOUT*/}
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "black" }]}
                onPress={async () => {
                  await handleSignOutAccount();
                  closeModal();
                }}
              >
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableOpacity>

              {/*NO SIGNOUT*/}
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#396C4D" }]}
                onPress={closeModal}
              >
                <Text style={styles.buttonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/*DELETE ACCOUNT MODAL*/}
        <Modal
          visible={isDeleteModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={closeModal}
        >
            {/*DELETE QUESTION*/}
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>
              Are you sure you want to delete your account?
            </Text>
            <View style={styles.modalButtonContainer}>

                {/*YES DELETE*/}
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "black" }]}
                onPress={async () => {
                  await handleDeleteAccount();
                  closeModal();
                }}
              >
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableOpacity>

                {/*NO DELETE*/}
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#396C4D" }]}
                onPress={closeModal}
              >
                <Text style={styles.buttonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  buttonContainer: {
    justifyContent: "flex-end",
    flex: 1,
  },
  signoutButton: {
    marginVertical: 5,
    padding: 8,
    backgroundColor: "grey",
    borderRadius: 6,
  },
  deleteaccButton: {
    marginVertical: 5,
    padding: 8,
    backgroundColor: "#396C4D",
    borderRadius: 6,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
  greetingText: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 20,
  },
  greetingQuestion: {
    textAlign: "center",
    marginVertical: 5,
  },
  contactTitle: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  icon: {
    fontSize: 20,
  },
  contactInfo: {
    marginVertical: 5,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    color: 'white',
  },
  modalButtonContainer: {
    flexDirection: 'row',
  },
  modalButton: {
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 6,
  },
});
