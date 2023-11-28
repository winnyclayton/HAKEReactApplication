import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Image,
} from "react-native";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";

export function Signin(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [validEmail, setValidEmail] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const [signinError, setSigninError] = useState(null);

  const Auth = useContext(AuthContext);
  const navigation = useNavigation();

  useEffect(() => {
    if (email.indexOf("@") > 0) {
      setValidEmail(true);
    } else {
      setValidEmail(false);
    }
  }, [email]);

  useEffect(() => {
    if (password.length >= 8) {
      setValidPassword(true);
    } else {
      setValidPassword(false);
    }
  }, [password]);

  useEffect(() => {
    if (Auth.currentUser) {
      navigation.reset({ index: 0, routes: [{ name: "Home" }] });
    }
  }, [Auth.currentUser, navigation]);

  const submitHandler = () => {
    props
      .handler(email, password)
      .then((user) => {
        // Sign in successful
        setSigninError(null); // Clear any previous error message
      })
      .catch((error) => {
        console.log(error); // Log the error to the console
        // Handle the specific errors
        if (error.code === "auth/user-not-found") {
          setSigninError(
            "Account does not exist. Please go to the sign-up page."
          );
        } else if (error.code === "auth/wrong-password") {
          setSigninError("Please enter the correct password.");
        } else {
          setSigninError(
            "Account does not exist. Please go to the sign-up page."
          );
        }
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Sign in to your account</Text>

        <Image
          source={{ require: "assets/HakeLogoBlackSmall.png" }}
          style={styles.logo}
        />

        <Text style={styles.emailText}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="you@example.com"
          value={email}
          onChangeText={(val) => setEmail(val)}
        />
        <Text style={styles.passwordText}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="minimum 8 characters"
          secureTextEntry={true}
          value={password}
          onChangeText={(val) => setPassword(val)}
        />
        <Pressable
          style={
            validEmail && validPassword ? styles.button : styles.disabledButton
          }
          onPress={() => submitHandler()}
          disabled={!(validEmail && validPassword)}
        >
          <Text style={styles.button.text}>Sign in</Text>
        </Pressable>
        <Pressable
          style={styles.authlink}
          onPress={() => navigation.navigate("Sign up")}
        >
          <Text style={styles.authlink.text}>
            Don't have an account? Sign up
          </Text>
        </Pressable>
        {signinError && <Text style={styles.errorMessage}>{signinError}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#396C4D", // background colour of the screen
    alignItems: "center",
    justifyContent: "center", // Ccenter the content vertically
  },
  title: {
    fontSize: 20,
    marginVertical: 10,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  emailText: {
    color: "white",
    paddingBottom: 5,
  },
  passwordText: {
    color: "white",
    paddingBottom: 5,
  },
  form: {
    backgroundColor: "#396C4D", //background colour of the form
    padding: 30,
    borderRadius: 10,
  },
  input: {
    backgroundColor: "#eeeeee",
    minWidth: 250,
    padding: 5,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#779E41",
    padding: 5,
    text: {
      color: "#ffffff",
      textAlign: "center",
    },
  },
  disabledButton: {
    backgroundColor: "#E5EDD5",
    padding: 5,
    text: {
      color: "black",
      textAlign: "center",
    },
  },
  authlink: {
    marginTop: 10,
    text: {
      textAlign: "center",
      color: "white",
      textDecorationLine: "underline",
    },
  },
  logo: {
    width: 100, //adjust the width as needed
    alignContent: "center",
  },
  errorMessage: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
});
