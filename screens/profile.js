import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { getAuth } from 'firebase/auth';
import { saveUserProfile, getUserProfile } from '../firebase/firebaseconfig';

const ProfileScreen = ({ navigation }) => {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [userId, setUserId] = useState(null);

  const auth = getAuth();

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserId(currentUser.uid);
      loadUserProfile(currentUser.uid);
    }
  }, []);

  const loadUserProfile = async (userId) => {
    try {
      const profileData = await getUserProfile(userId);
      setName(profileData.name || 'John Doe');
      setEmail(profileData.email || 'johndoe@example.com');
      setBio(profileData.bio || 'Hello! This is my bio.');
      setAvatar(profileData.avatar || 'https://via.placeholder.com/150');
    } catch (error) {
      console.log('Error loading profile:', error.message);
    }
  };

  const handleSave = async () => {
    try {
      await saveUserProfile(userId, name, email, bio, avatar);
      Alert.alert('Profile Updated', 'Your changes have been saved.');
      setEditing(false);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleChoosePhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access media library is required!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setAvatar(result.uri); // Update avatar with the selected image
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={() => setEditing(!editing)}>
          <Ionicons name={editing ? 'checkmark' : 'pencil'} size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={handleChoosePhoto}>
          <Image source={{ uri: avatar }} style={styles.avatar} />
        </TouchableOpacity>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.email}>{email}</Text>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={[styles.input, !editing && styles.disabledInput]}
          editable={editing}
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, !editing && styles.disabledInput]}
          editable={editing}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={[styles.textArea, !editing && styles.disabledInput]}
          editable={editing}
          multiline
          value={bio}
          onChangeText={setBio}
        />

        {editing && (
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b1b1b',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#121212',
  },
  headerTitle: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  profileContainer: {
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#FF9500',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  email: {
    fontSize: 16,
    color: '#bbb',
    marginTop: 5,
  },
  detailsContainer: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    color: '#bbb',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#2c2c2c',
    color: 'white',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  textArea: {
    backgroundColor: '#2c2c2c',
    color: 'white',
    padding: 10,
    borderRadius: 5,
    height: 100,
    textAlignVertical: 'top',
  },
  disabledInput: {
    backgroundColor: '#3a3a3a',
  },
  saveButton: {
    backgroundColor: '#FF9500',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;