import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  Text,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/firebaseconfig";
import { Video } from "expo-av";
import SlideShow from "../components/slide/slide";
import Recommendation from "../components/genre/recommendation";
import Action from "../components/genre/action";
import Drama from "../components/genre/drama";
import Sidebar from "../components/sidebar";

const HomeScreen = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [slides, setSlides] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");

  const fetchSlides = async () => {
    try {
      const q = query(collection(db, "slides"), orderBy("order"));
      const querySnapshot = await getDocs(q);
      const fetchedSlides = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSlides(fetchedSlides);
    } catch (error) {
      console.error("Error fetching slides:", error);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const toggleSidebar = () => {
    setSidebarVisible((prev) => !prev);
  };

  const handleSlidePress = (videoUrl) => {
    if (videoUrl) {
      setCurrentVideoUrl(videoUrl);
      setModalVisible(true);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setCurrentVideoUrl("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 0 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={toggleSidebar}>
            {sidebarVisible ? (
              <Ionicons name="close" size={30} color="#FFFFFF" />
            ) : (
              <Ionicons name="menu" size={30} color="#FFFFFF" />
            )}
          </TouchableOpacity>

          <TouchableOpacity>
            <Ionicons name="search" size={30} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {slides.length > 0 && (
            <>
              <SlideShow slides={slides} onSlidePress={handleSlidePress} />
              <Recommendation />
              <Action />
              <Drama />
            </>
          )}
        </View>

        <Modal
          visible={modalVisible}
          onRequestClose={handleCloseModal}
          transparent={true}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Video
                source={{ uri: currentVideoUrl }}
                style={styles.videoPlayer}
                useNativeControls={true}
                resizeMode="cover"
                shouldPlay={true}
              />
            </View>
          </View>
        </Modal>
      </ScrollView>
      <Sidebar
        isVisible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#000000",
    zIndex: 2,
  },

  content: {
    flex: 1,
    backgroundColor: "#000000",
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },

  modalContent: {
    width: "90%",
    height: "80%",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  videoPlayer: {
    width: "100%",
    height: "100%",
  },
});

export default HomeScreen;
