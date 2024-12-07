import Reaact from "react";
import { View, StyleSheet } from "react-native";

const Dot = ({ slides, currentIndex }) => {
  return (
    <View style={styles.container}>
      {slides.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === currentIndex ? styles.activeDot : null,
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute", 
    bottom: 10, 
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#555",
    marginHorizontal: 4,
  },

  activeDot: {
    backgroundColor: "#FF9500",
  },
})
export default Dot; 