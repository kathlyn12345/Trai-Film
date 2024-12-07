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
  ToastAndroid, // For showing toast messages
} from "react-native";
import { db } from "../../firebase/firebaseconfig";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import Dot from "./dot";
import { Video } from "expo-av";
import Icon from "react-native-vector-icons/FontAwesome";
import { getDatabase, ref, onValue, off } from "firebase/database";

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
  const [isLoading, setIsLoading] = useState(false);
  const [playPauseState, setPlayPauseState] = useState(true); // Default: Playing
  const videoRef = useRef(null); // Video reference

  // Firebase Realtime Database Listener for Play/Pause
  useEffect(() => {
    const database = getDatabase();
    const playPauseRef = ref(database, "/test/");

    const listener = onValue(playPauseRef, (snapshot) => {
      const playPauseState = snapshot.val();

      if (playPauseState === 1) {
        setPlayPauseState(true);
        if (videoRef.current) {
          videoRef.current.playAsync();
          ToastAndroid.show("Video is resumed", ToastAndroid.SHORT);
        }
      } else if (playPauseState === 0) {
        setPlayPauseState(false);
        if (videoRef.current) {
          videoRef.current.pauseAsync();
          ToastAndroid.show("Video is paused", ToastAndroid.SHORT);
        }
      }
    });

    return () => {
      off(playPauseRef, "value", listener); // Correct cleanup
    };
  }, []);

  // Fetch slides from Firestore
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
      setIsLoading(true);

      // Start the video when modal opens
      if (videoRef.current) {
        videoRef.current.playAsync();
      }
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setCurrentVideoUrl("");
    setCurrentTitle("");
    setCurrentDescription("");
    if (videoRef.current) {
      videoRef.current.pauseAsync(); // Pause when modal closes
    }
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

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#FF9500" style={styles.loader} />
    );
  }

  return (
    <View style={styles.container}>
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
              ref={videoRef}
              source={{ uri: currentVideoUrl }}
              style={styles.videoPlayer}
              useNativeControls={true}
              resizeMode="cover"
              onError={(error) => console.error("Video error:", error)}
              onLoadStart={() => setIsLoading(true)}
              onLoad={() => setIsLoading(false)}
            />
            {isLoading && (
              <ActivityIndicator
                size="large"
                color="#FFFFFF"
                style={styles.videoLoader}
              />
            )}
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
    flex: 1,
    padding: 10,
  },

  slideContainer: {
    width: 370,
    height: 230,
    borderRadius: 10,
    overflow: "hidden",
    marginRight: 5,
  },

  slide: {
    width: "100%",
    height: "100%",
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.95)",
  },

  modalBackdrop: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },

  modalContent: {
    width: "90%",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },

  videoPlayer: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },

  videoLoader: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -15 }, { translateY: -15 }],
  },

  modalTitle: {
    fontSize: 22,
    color: "#FFFFFF",
    marginTop: 10,
  },

  modalDescription: {
    color: "#CCCCCC",
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
  },

  arrowButton: {
    position: "absolute",
    top: 10,
    left: 10,
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 50,
  },
});

export default SlideShow;
