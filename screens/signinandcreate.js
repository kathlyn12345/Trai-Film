import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useCustomFonts } from "../components/font";

const SigninandCreate = () => {
  const fontsLoaded = useCustomFonts();
  const navigation = useNavigation();

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.Tagline}>Where Every Story Finds a Home.</Text>

      <View style={styles.ButtonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("signin")}
        >
          <Text style={styles.signin}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.bButton]}
          onPress={() => navigation.navigate("signup")}
        >
          <Text style={styles.Text}>Create an Account</Text>
        </TouchableOpacity>
      </View>
      <Image source={require("../assets/icons/logo.png")} style={styles.logo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#000000",
    padding: 20,
  },

  logo: {
    width: 580,
    height: 580,
    resizeMode: "contain",
    bottom: 60,
    marginRight: 70,
    transform: [{ rotate: "-40deg" }],
    zIndex: 1,
  },

  Tagline: {
    fontFamily: "Roboto-Bold",
    fontSize: 50,
    lineHeight: 70,
    color: "#ffffff",
    textAlign: "left",
    marginRight: 65,
    marginTop: 100,
    zIndex: 10,
  },

  ButtonContainer: {
    position: "absolute",
    bottom: 135,
    width: "100%",
    alignItems: "center",
    zIndex: 10,
  },

  button: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 40,
    marginBottom: 15,
    borderRadius: 30,
    width: "80%",
    alignItems: "center",
  },

  bButton: {
    backgroundColor: "transparent",
    borderColor: "#000000",
  },

  Text: {
    fontFamily: "Roboto-Bold",
    fontSize: 20,
    color: "#FFFFFF",
    textAlign: "center",
  },

  signin: {
    fontFamily: "Roboto-Bold",
    fontSize: 20,
    color: "#000000",
    textAlign: "center",
  },
});

export default SigninandCreate;
