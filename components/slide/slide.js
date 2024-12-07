import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  ImageBackground,
  StyleSheet,
  View,
  ActivityIndicator,
  Animated,
  Text,
  TouchableOpacity,
  Modal,
} from "react-native";
import { db } from "../../firebase/firebaseconfig";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import Dot from "./dot";
import { Video } from "expo-av";
import Icon from "react-native-vector-icons/FontAwesome";

const SlideShow = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");
  const [currentTitle, setCurrentTitle] = useState("");
  const [currentDescription, setCurrentDescription] = useState("");

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const q = query(collection(db, "slides"), orderBy("order"));
        const querySnapshot = await getDocs(q);
        const fetchedSlides = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSlides(fetchedSlides);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching slides:", error);
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  const handleSlidePress = (videoUrl, title, description) => {
    if (videoUrl) {
      setCurrentVideoUrl(videoUrl);
      setCurrentTitle(title);
      setCurrentDescription(description);
      setModalVisible(true);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setCurrentVideoUrl("");
    setCurrentTitle("");
    setCurrentDescription("");
  };

  const handleFullScreen = (status) => {
    console.log("Fullscreen status:", status);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);

      if (flatListRef.current && slides.length > 0) {
        const nextIndex = (currentIndex + 1) % slides.length;
        if (!isNaN(nextIndex) && nextIndex >= 0 && nextIndex < slides.length) {
          flatListRef.current.scrollToIndex({
            index: nextIndex,
            animated: true,
          });
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex, slides.length]);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const renderSlide = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        handleSlidePress(item.videoUrl, item.title, item.description)
      }
    >
      <View style={styles.slideContainer}>
        <ImageBackground
          source={{ uri: item.imageUrl }}
          style={styles.slide}
          resizeMode="cover"
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#FF9500" style={styles.loader} />
      ) : (
        <FlatList
          data={slides}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={renderSlide}
          ref={flatListRef}
          onScroll={handleScroll}
        />
      )}

      <Dot slides={slides} currentIndex={currentIndex} />

      <Modal
        visible={modalVisible}
        onRequestClose={handleCloseModal}
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalBackdrop} />
          <View style={styles.modalContent}>
            <TouchableOpacity
              onPress={handleCloseModal}
              style={styles.arrowButton}
            >
              <Icon name="arrow-left" size={19} color="#FFFFFF" />
            </TouchableOpacity>
            <Video
              source={{ uri: currentVideoUrl }}
              style={styles.videoPlayer}
              useNativeControls={true}
              resizeMode="cover"
              shouldPlay={true}
              onFullscreenUpdate={handleFullScreen}
            />
            <Text style={styles.modalTitle}>{currentTitle}</Text>
            <Text style={styles.modalDescription}>{currentDescription}</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },

  slideContainer: {
    position: "relative",
    width: 360,
    height: 210,
  },

  slide: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  loader: {
    marginTop: 20,
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.80)",
    position: "relative",
  },

  modalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.80)",
    zIndex: -1,
  },

  modalContent: {
    width: "100%",
    height: "50%",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  videoPlayer: {
    width: "105%",
    height: "60%",
    marginBottom: 90,
  },

  modalTitle: {
    fontSize: 30,
    fontWeight: "bold",
    bottom: 75,
    color: "#FFFFFF",
    textAlign: "left",
    width: "100%",
  },

  modalDescription: {
    fontSize: 15,
    marginTop: -70,
    color: "#CCCCCC",
    textAlign: "left",
    width: "105%",
    paddingHorizontal: 10,
  },

  arrowButton: {
    position: "absolute",
    top: 0,
    left: 10,
    zIndex: 1,
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 50,
  },
});

export default SlideShow;
