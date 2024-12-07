import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Easing, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useCustomFonts } from "../components/font";

const SplashScreen = ({ navigation }) => {
  const bounce = useRef(new Animated.Value(0)).current;
  const text = useRef(new Animated.Value(0)).current;
  const isscale = useRef(new Animated.Value(1)).current;
  const [isVisible, setisVIsible] = useState(true);
  const fontsLoaded = useCustomFonts();

  useEffect(() => {
    if (!fontsLoaded) return;

    Animated.sequence([
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounce, {
            toValue: -50,
            duration: 200,
            easing: Easing.bounce,
            useNativeDriver: true,
          }),
          Animated.timing(bounce, {
            toValue: 0,
            duration: 200,
            easing: Easing.bounce,
            useNativeDriver: true,
          }),
        ]),
        { iterations: 3 }
      ),
    ]).start();

    setTimeout(() => {
      Animated.timing(text, {
        toValue: 1,
        duration: 400,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    }, 1200);

    setTimeout(() => {
      Animated.timing(isscale, {
        toValue: 10,
        duration: 500,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();

      setTimeout(() => setisVIsible(false), 100);
    }, 1500);

    setTimeout(() => {
      navigation.replace("SigninandCreate");
    }, 2800);
  }, [fontsLoaded, navigation]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.box,
          {
            transform: [{ translateY: bounce }, { scale: isscale }],
          },
        ]}
      >
        <LinearGradient
          colors={["#FF6F00", "#FF3E00", "#FF1744"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 5, y: 5 }}
          style={styles.box}
        />
      </Animated.View>

      {isVisible && fontsLoaded && (
        <Animated.Text style={[styles.text, { opacity: text }]}>
          Trai-Film
        </Animated.Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000",
  },

  box: {
    width: 100,
    height: 100,
    borderRadius: 30,
  },

  text: {
    fontSize: 50,
    fontFamily: "Raleway-ExtraBold",
    color: "rgba(255, 149, 0, 1)",
    marginTop: 20,
  },
});

export default SplashScreen;
