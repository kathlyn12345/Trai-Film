import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  Text,
  ScrollView,
  TextInput,
  ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SlideShow from "../components/slide/slide";
import Recommendation from "../components/genre/recommendation";
import Action from "../components/genre/action";
import Horror from "../components/genre/horror";
import Fantasy from "../components/genre/fantasy";
import Thriller from "../components/genre/thriller";
import Drama from "../components/genre/drama";
import Sidebar from "../components/sidebar";
import { searchMovies } from "../components/searchService"; 
import { Video } from "expo-av"; 
import { query, collection, orderBy, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseconfig";

const HomeScreen = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [slides, setSlides] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");
  const [currentTitle, setCurrentTitle] = useState("");
  const [currentDescription, setCurrentDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); 
  const [searchResults, setSearchResults] = useState([]); 
  const [isSearchVisible, setIsSearchVisible] = useState(false); 
  const [loading, setLoading] = useState(false); 
  const [videoLoading, setVideoLoading] = useState(true); 

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

  const handleSearch = async () => {
    setLoading(true); 
    if (searchTerm.length > 0) {
      const results = await searchMovies(searchTerm); 
      setSearchResults(results);
    } else {
      setSearchResults([]); 
    }
    setLoading(false);
  };

  const handleSlidePress = (videoUrl, title, description) => {
    setCurrentVideoUrl(videoUrl);
    setCurrentTitle(title);
    setCurrentDescription(description);
    setModalVisible(true);

    setSearchTerm("");
    setSearchResults([]);
    setIsSearchVisible(false); 
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setCurrentVideoUrl("");
    setCurrentTitle("");
    setCurrentDescription("");
    setVideoLoading(true); 
  };

  const handleVideoLoad = () => {
    setVideoLoading(false); 
  };

  const toggleSidebar = () => {
    setSidebarVisible((prev) => !prev);
  };

  const toggleSearch = () => {
    if (isSearchVisible) {
      setSearchTerm("");
      setSearchResults([]);
    }
    setIsSearchVisible((prev) => !prev);
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

          <TouchableOpacity onPress={toggleSearch}>
            <Ionicons name="search" size={30} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {isSearchVisible && (
          <View style={styles.searchBar}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search Movies..."
              placeholderTextColor="#ccc"
              value={searchTerm}
              onChangeText={setSearchTerm}
              onSubmitEditing={handleSearch}
            />
          </View>
        )}

        <View style={styles.content}>
          {loading ? (
            <ActivityIndicator size="large" color="#FFFFFF" /> 
          ) : searchResults.length > 0 ? (
            <ScrollView>
              {searchResults.map((movie) => (
                <TouchableOpacity
                  key={movie.id}
                  onPress={
                    () =>
                      handleSlidePress(
                        movie.videoUrl,
                        movie.title,
                        movie.description
                      ) 
                  }
                >
                  <View style={styles.movieCard}>
                    <Text style={styles.movieTitle}>{movie.title}</Text>
                    <Text>{movie.genre}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <>
              {slides.length > 0 && (
                <>
                  <SlideShow slides={slides} onSlidePress={handleSlidePress} />
                  <Recommendation />
                  <Action />
                  <Horror />
                  <Fantasy />
                  <Thriller />
                  <Drama />
                </>
              )}
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
              <TouchableOpacity
                onPress={handleCloseModal}
                style={styles.arrowButton}
              >
                <Ionicons name="arrow-back" size={19} color="#FFFFFF" />
              </TouchableOpacity>
              {videoLoading && (
                <ActivityIndicator
                  size="large"
                  color="#FFFFFF"
                  style={styles.loader}
                />
              )}
              <Video
                source={{ uri: currentVideoUrl }}
                style={styles.videoPlayer}
                useNativeControls={true}
                resizeMode="cover"
                shouldPlay={true}
                onLoad={handleVideoLoad} // When the video is ready, hide the loading spinner
              />
              {!videoLoading && (
                <>
                  <Text style={styles.modalTitle}>{currentTitle}</Text>
                  <Text style={styles.modalDescription}>
                    {currentDescription}
                  </Text>
                </>
              )}
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

  searchBar: {
    padding: 10,
    backgroundColor: "#1C1C1C",
  },
  searchInput: {
    backgroundColor: "#333",
    color: "#fff",
    padding: 10,
    borderRadius: 5,
  },

  content: {
    flex: 1,
    backgroundColor: "#000000",
  },

  movieCard: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#333",
    borderRadius: 5,
  },

  movieTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#fff",
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.95)",
  },

  modalContent: {
    width: "90%",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  videoPlayer: {
    width: "105%",
    height: 200,
    borderRadius: 10,
  },

  modalTitle: {
    fontSize: 22,
    fontFamily: "Roboto-Bold",
    color: "#FFFFFF",
    textAlign: "left",
    marginVertical: 10,
    width: "94%",
  },

  modalDescription: {
    fontFamily: "Roboto-Medium",
    fontSize: 16,
    color: "#CCCCCC",
    textAlign: "left",
    marginVertical: 10,
    width: "94%",
  },

  loader: {
    position: "absolute", 
    top: "50%", 
    left: "50%", 
    transform: [{ translateX: -25 }, { translateY: -25 }], 
    zIndex: 1, 
  },

  arrowButton: {
    position: "absolute",
    left: 0,
    top: 0,
    padding: 10,
    zIndex: 1,
  },
});

export default HomeScreen;