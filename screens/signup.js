import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  ScrollView,
} from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { signUpWithEmailPassword } from "../firebase/firebaseconfig";
import CheckBox from "expo-checkbox";
import { useCustomFonts } from "../components/font";

const SignUp = () => {
  const navigation = useNavigation();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // Added this line
  const fontsLoaded = useCustomFonts();

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }
    try {
      setErrorMessage("");
      await signUpWithEmailPassword(email, password);
      alert("Account created successfully!");
      navigation.navigate("signin");
    } catch (error) {
      setErrorMessage("Error creating account: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MovieNest</Text>
      <Text style={styles.subtitle}>Create an account</Text>

      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      <View style={styles.Slashcontainer}>
        <View style={[styles.slash, styles.two]} />
        <TouchableOpacity
          style={[styles.socialButton]}
          onPress={() => Linking.openURL("https://www.google.com")}
        >
          <Image
            source={require("../assets/icons/Google.png")}
            style={styles.socialIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.socialButton]}
          onPress={() => Linking.openURL("https://www.facebook.com")}
        >
          <Image
            source={require("../assets/icons/Facebook.png")}
            style={styles.socialIcon}
          />
        </TouchableOpacity>
        <View style={[styles.slash, styles.two]} />
      </View>

      <View style={styles.inputContainer}>
        <FontAwesome
          name="envelope"
          size={20}
          color="rgba(255, 255, 255, 0.7)"
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="rgba(255, 255, 255, 0.7)"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons
          name="lock-closed"
          size={20}
          color="rgba(255, 255, 255, 0.7)"
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="rgba(255, 255, 255, 0.7)"
          secureTextEntry={!passwordVisible}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          onPress={togglePasswordVisibility}
          style={styles.eyeIcon}
        >
          <Ionicons
            name={passwordVisible ? "eye-off" : "eye"}
            size={20}
            color="rgba(255, 255, 255, 0.7)"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <Ionicons
          name="lock-closed"
          size={20}
          color="rgba(255, 255, 255, 0.7)"
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="rgba(255, 255, 255, 0.7)"
          secureTextEntry={!confirmPasswordVisible}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity
          onPress={toggleConfirmPasswordVisibility}
          style={styles.eyeIcon}
        >
          <Ionicons
            name={confirmPasswordVisible ? "eye-off" : "eye"}
            size={20}
            color="rgba(255, 255, 255, 0.7)"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.checkboxContainer}>
        <CheckBox
          value={isChecked}
          onValueChange={setIsChecked}
          style={styles.checkbox}
        />
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={styles.termsText}>
            I agree to the Terms and Conditions
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={handleSignUp}
        style={[
          styles.signUpButton,
          { backgroundColor: isChecked ? "#FFFFFF" : "#D3D3D3" },
        ]}
        disabled={!isChecked}
      >
        <Text
          style={[
            styles.signUpText,
            { color: isChecked ? "#000000" : "#A9A9A9" },
          ]}
        >
          {" "}
          Sign Up{" "}
        </Text>
      </TouchableOpacity>

      <View style={styles.signIn}>
        <Text style={styles.signInText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("signin")}>
          <Text style={styles.signInLink}>Sign In</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>Terms and Conditions</Text>
              <Text style={styles.modalText}>
                Terms and Conditions By signing up for an account, you agree to
                the following terms and conditions: 1. Account Registration: You
                are required to provide accurate and complete information during
                the registration process. You are responsible for maintaining
                the confidentiality of your account information and password.
                Use of Service: You agree to use the service only for lawful
                purposes and in accordance with the guidelines set forth by the
                platform. You may not use the service for any illegal activities
                or actions that violate the rights of others. Privacy Policy: We
                are committed to protecting your privacy. Please refer to our
                Privacy Policy for details on how we collect, use, and protect
                your personal information. Intellectual Property: All content,
                trademarks, logos, and other intellectual property related to
                the service are the property of the company or its licensors and
                are protected by copyright laws. 5.Termination of Account: We
                reserve the right to suspend or terminate your account if we
                believe you have violated these terms and conditions. Upon
                termination, you will lose access to your account and all
                associated content. 6.Agreement to Terms: By ticking the
                checkbox and proceeding with the sign-up, you confirm that you
                have read, understood, and agree to abide by these Terms and
                Conditions.
              </Text>
            </ScrollView>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000",
    padding: 20,
  },

  title: {
    fontFamily: "Raleway-ExtraBold",
    fontSize: 50,
    color: "#FF9500",
    marginBottom: 5,
  },

  subtitle: {
    fontFamily: "Roboto-Medium",
    fontSize: 20,
    color: "#FFFFFF",
    marginBottom: 30,
  },

  Slashcontainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },

  slash: {
    height: 1,
    backgroundColor: "#FFFFFF",
  },

  one: {
    width: 100,
  },

  two: {
    width: 100,
  },

  socialIcon: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },

  socialButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    width: 318,
    height: 45,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
  },

  input: {
    flex: 1,
    paddingVertical: 10,
    paddingLeft: 20,
    fontSize: 16,
    color: "#000000",
    height: 45,
    borderRadius: 8,
  },

  inputIcon: {
    marginLeft: 15,
  },

  eyeIcon: {
    position: "absolute",
    right: 10,
  },

  signUpButton: {
    backgroundColor: "#FFFFFF",
    width: 318,
    height: 45,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },

  signUpText: {
    color: "#000000",
    fontSize: 20,
    fontFamily: "Roboto-Bold",
  },

  signIn: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },

  signInText: {
    fontFamily: "Roboto-Regular",
    fontSize: 15,
    color: "#FFFFFF",
  },

  signInLink: {
    fontFamily: "Roboto-Regular",
    fontSize: 15,
    color: "#E38400",
    fontWeight: "bold",
  },

  errorText: {
    color: "red",
    fontSize: 16,
    marginBottom: 10,
  },

  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  checkbox: {
    marginRight: 10,
  },
  termsText: {
    color: "#E38400",
    textDecorationLine: "underline",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: "#333",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#E38400",
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default SignUp;
